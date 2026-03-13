"use client"

import Link from "next/link"
import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Folder, House, Layers3, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { nanoid } from "nanoid"

import { UserSidebarMenu } from "@/components/auth/user-sidebar-menu"
import { ChatPanel } from "@/components/chat/chat-panel"
import { PreviewPanel } from "@/components/preview/preview-panel"
import { ProjectNameDialog } from "@/components/projects/project-name-dialog"
import {
  appendAssistantMessage,
  canSubmitPrompt,
  createOptimisticUserMessage,
  normalizePrompt,
} from "@/lib/builder/generate-state"
import type { MessageRecord } from "@/lib/schemas/message"
import type { ProjectRecord } from "@/types/project"

type ProjectBuilderProps = {
  initialHtml: string
  initialMessages: MessageRecord[]
  initialPrompt?: string
  projects: ProjectRecord[]
  projectId: string
  projectName: string
  userAvatarDataUrl?: string | null
  userName: string
}

type GenerateResponse = {
  project: {
    id: string
    name: string
    currentHtml: string
    updatedAt: string
  }
  assistantMessage: {
    id: string
    role: "assistant"
    content: string
    createdAt: string
  }
}

export function ProjectBuilder({
  initialHtml,
  initialMessages,
  initialPrompt = "",
  projects,
  projectId,
  projectName,
  userAvatarDataUrl,
  userName,
}: ProjectBuilderProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [messages, setMessages] = useState(initialMessages)
  const [html, setHtml] = useState(initialHtml)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentProjectName, setCurrentProjectName] = useState(projectName)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const hasAutoSubmittedRef = useRef(false)

  async function submitPrompt(rawPrompt: string) {
    if (!canSubmitPrompt(rawPrompt, isLoading)) {
      return
    }

    const prompt = normalizePrompt(rawPrompt)
    const optimisticUserMessage = createOptimisticUserMessage({
      id: `temp-${nanoid()}`,
      projectId,
      prompt,
    })

    setMessages((currentMessages) => [
      ...currentMessages,
      optimisticUserMessage,
    ])
    setInputValue("")
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          prompt,
        }),
      })
      const body = (await response.json().catch(() => null)) as
        | GenerateResponse
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(
          body && "error" in body ? body.error : "Generation failed."
        )
      }

      if (!body || !("project" in body) || !("assistantMessage" in body)) {
        throw new Error("Generation failed.")
      }

      setMessages((currentMessages) =>
        appendAssistantMessage(currentMessages, {
          ...body.assistantMessage,
          projectId,
          createdAt: new Date(body.assistantMessage.createdAt),
        })
      )
      setHtml(body.project.currentHtml)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to generate HTML right now."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const submitInitialPrompt = useEffectEvent(async (prompt: string) => {
    await submitPrompt(prompt)
    router.replace(`/projects/${projectId}`)
  })

  useEffect(() => {
    if (hasAutoSubmittedRef.current || !canSubmitPrompt(initialPrompt, false)) {
      return
    }

    hasAutoSubmittedRef.current = true
    void submitInitialPrompt(initialPrompt)
  }, [initialPrompt])

  return (
    <main className="relative flex min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.1),_transparent_22%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_56%,_#f7f5ef_100%)] text-[#0F172A]">
      <aside
        className={`absolute inset-y-0 left-0 z-20 w-[440px] p-4 transition-all duration-300 ease-out ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none"
        } lg:z-10`}
      >
        <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-4 shadow-[0_20px_60px_rgba(37,99,235,0.12)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
                Buildly AI
              </p>
              <p className="text-sm text-[#475569]">Workspace</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-2xl bg-[#E8F0FF] px-4 py-3 text-left text-sm font-medium text-[#0F172A]"
            >
              <House className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/projects"
              className="block rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 transition hover:border-[#93C5FD] hover:bg-[#F8FBFF]"
            >
              <div className="flex items-center justify-between text-sm font-medium text-[#0F172A]">
                <span className="flex items-center gap-3">
                  <Folder className="h-4 w-4" />
                  All projects
                </span>
                <span className="rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs text-[#1D4ED8]">
                  {projects.length}
                </span>
              </div>
            </Link>
          </nav>

          <div className="min-h-0 flex-1">
            <ChatPanel
              error={error}
              inputValue={inputValue}
              isLoading={isLoading}
              messages={messages}
              onInputChange={setInputValue}
              onSubmit={submitPrompt}
              compact
            />
          </div>

          {userName ? (
            <UserSidebarMenu
              userAvatarDataUrl={userAvatarDataUrl}
              userName={userName}
            />
          ) : null}
        </div>
      </aside>

      <section
        className={`flex min-w-0 flex-1 flex-col transition-[padding-left] duration-300 ease-out ${
          isSidebarOpen ? "lg:pl-[400px]" : "lg:pl-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E3F4] bg-white text-[#0F172A] transition hover:bg-[#F8FBFF]"
            onClick={() => setIsSidebarOpen((current) => !current)}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
          <div />
        </div>

        <div className="flex min-h-0 flex-1 px-4 pb-4 sm:px-6 lg:px-8">
          <PreviewPanel
            html={html}
            isLoading={isLoading}
            onRename={() => {
              setRenameError(null)
              setIsRenameDialogOpen(true)
            }}
            projectName={currentProjectName}
          />
        </div>
      </section>

      <ProjectNameDialog
        confirmLabel="Save name"
        defaultValue={currentProjectName}
        description="Update the project name shown across the workspace."
        error={renameError}
        isOpen={isRenameDialogOpen}
        isSubmitting={isRenaming}
        title="Rename project"
        onOpenChange={(nextOpen) => {
          setIsRenameDialogOpen(nextOpen)
          if (!nextOpen) {
            setRenameError(null)
          }
        }}
        onSubmit={async (name) => {
          setIsRenaming(true)
          setRenameError(null)

          try {
            const response = await fetch(`/api/projects/${projectId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
              }),
            })
            const body = (await response.json().catch(() => null)) as
              | { project?: { name: string }; error?: string }
              | null

            if (!response.ok || !body?.project?.name) {
              throw new Error(
                body?.error ?? "Unable to update this project right now."
              )
            }

            setCurrentProjectName(body.project.name)
            setIsRenameDialogOpen(false)
          } catch (submitError) {
            setRenameError(
              submitError instanceof Error
                ? submitError.message
                : "Unable to update this project right now."
            )
          } finally {
            setIsRenaming(false)
          }
        }}
      />
    </main>
  )
}
