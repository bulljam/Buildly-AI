"use client"

import Link from "next/link"
import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import { nanoid } from "nanoid"

import { ChatPanel } from "@/components/chat/chat-panel"
import { PreviewPanel } from "@/components/preview/preview-panel"
import { ProjectNameDialog } from "@/components/projects/project-name-dialog"
import { Button } from "@/components/ui/button"
import {
  appendAssistantMessage,
  canSubmitPrompt,
  createOptimisticUserMessage,
  normalizePrompt,
} from "@/lib/builder/generate-state"
import type { MessageRecord } from "@/lib/schemas/message"

type ProjectBuilderProps = {
  initialHtml: string
  initialMessages: MessageRecord[]
  initialPrompt?: string
  projectId: string
  projectName: string
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
  projectId,
  projectName,
}: ProjectBuilderProps) {
  const router = useRouter()
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
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col bg-[radial-gradient(circle_at_top,_rgba(166,77,121,0.18),_transparent_28%),linear-gradient(180deg,_#232225_0%,_#1A1A1D_52%,_#151518_100%)] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full border-white/8 bg-white/6 px-4 text-white hover:bg-white/10"
        >
          <Link href="/">Back to projects</Link>
        </Button>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <div className="max-w-[240px] truncate sm:max-w-[320px]">
            {currentProjectName}
          </div>
          <button
            type="button"
            aria-label="Rename project"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/6 text-white/70 transition hover:border-[#A64D79]/35 hover:text-white"
            onClick={() => {
              setRenameError(null)
              setIsRenameDialogOpen(true)
            }}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        <ChatPanel
          error={error}
          inputValue={inputValue}
          isLoading={isLoading}
          messages={messages}
          onInputChange={setInputValue}
          onSubmit={submitPrompt}
          projectName={currentProjectName}
        />
        <PreviewPanel
          html={html}
          isLoading={isLoading}
          projectName={currentProjectName}
        />
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
