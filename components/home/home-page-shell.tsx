"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Folder, Layers3, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { UserSidebarMenu } from "@/components/auth/user-sidebar-menu"
import { Button } from "@/components/ui/button"
import { canSubmitPrompt, normalizePrompt } from "@/lib/builder/generate-state"
import { deriveProjectNameFromPrompt } from "@/lib/home/home-projects"
import type { ProjectRecord } from "@/types/project"

type HomePageShellProps = {
  databaseConfigured: boolean
  loadError: string | null
  projects: ProjectRecord[]
  userAvatarDataUrl?: string | null
  userName: string
}

const STARTER_PROMPTS = [
  "Build a modern SaaS landing page for an AI writing assistant.",
  "Create a bold coffee shop website with a strong hero and menu section.",
  "Design a clean portfolio for a product designer with case studies.",
]

export function HomePageShell({
  databaseConfigured,
  loadError,
  projects,
  userAvatarDataUrl,
  userName,
}: HomePageShellProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [prompt, setPrompt] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function startProject() {
    if (!canSubmitPrompt(prompt, isSubmitting) || !databaseConfigured) {
      return
    }

    const normalizedPrompt = normalizePrompt(prompt)

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: deriveProjectNameFromPrompt(normalizedPrompt),
        }),
      })
      const body = (await response.json().catch(() => null)) as
        | { project?: { id: string }; error?: string }
        | null

      if (!response.ok || !body?.project?.id) {
        throw new Error(body?.error ?? "Unable to create a project right now.")
      }

      router.push(
        `/projects/${body.project.id}?prompt=${encodeURIComponent(normalizedPrompt)}`
      )
      router.refresh()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create a project right now."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f7f5ef_100%)] text-[#0F172A]">
      <aside
        className={`absolute inset-y-0 left-0 z-20 w-[400px] p-4 transition-all duration-300 ease-out ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none"
        } lg:z-10`}
      >
        <div className="flex h-full flex-col rounded-[1.75rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-4 shadow-[0_20px_60px_rgba(37,99,235,0.12)] backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
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
              href="/projects"
              className="flex w-full items-center justify-between rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-left text-sm font-medium text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#F8FBFF]"
            >
              <span className="flex items-center gap-3">
                <Folder className="h-4 w-4" />
                All projects
              </span>
              <span className="rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs text-[#1D4ED8]">
                {projects.length}
              </span>
            </Link>
          </nav>

          {userName ? (
            <div className="mt-auto">
              <UserSidebarMenu
                userAvatarDataUrl={userAvatarDataUrl}
                userName={userName}
              />
            </div>
          ) : null}
        </div>
      </aside>

      <main
        className={`flex min-w-0 flex-1 flex-col transition-[padding-left] duration-300 ease-out ${
          isSidebarOpen ? "lg:pl-[368px]" : "lg:pl-0"
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
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.1)] sm:p-8">
            <div className="max-w-4xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
                    Buildly AI
                  </p>
                  <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                    Design websites by chatting with your builder.
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-[#475569] sm:text-base">
                Start with an idea, generate a first version instantly, and
                iterate from there with a live visual workspace.
              </p>

              <div className="mt-10 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#2563EB]">
                    Starter prompts
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {STARTER_PROMPTS.map((starterPrompt) => (
                      <button
                        key={starterPrompt}
                        type="button"
                        className="rounded-full border border-[#D7E3F4] bg-white px-4 py-2.5 text-left text-sm text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#F8FBFF]"
                        onClick={() => setPrompt(starterPrompt)}
                      >
                        {starterPrompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-[#D7E3F4] bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3">
                  <textarea
                    className="min-h-24 w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 text-[#0F172A] outline-none placeholder:text-[#64748B]"
                    placeholder="Ask for a homepage, a travel brand, a coffee shop landing page, a modern SaaS site..."
                    disabled={!databaseConfigured || isSubmitting}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-3 pt-3">
                    <div className="text-xs leading-5 text-[#64748B]">
                      {databaseConfigured
                        ? "Describe the site you want and we’ll create a project and jump straight into generation."
                        : "Configure the database first to create and load projects."}
                    </div>
                    <Button
                      type="button"
                      className="rounded-full bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8]"
                      disabled={
                        !databaseConfigured || !canSubmitPrompt(prompt, isSubmitting)
                      }
                      onClick={startProject}
                    >
                      {isSubmitting ? "Starting..." : "Start building"}
                    </Button>
                  </div>
                </div>
              </div>
              </div>

              {submitError ? (
                <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </div>
              ) : null}
            </div>
          </section>

          {loadError ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              {loadError}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
