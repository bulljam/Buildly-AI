"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  FolderKanban,
  House,
  Menu,
  Search,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react"

import { ProjectList } from "@/components/projects/project-list"
import { Button } from "@/components/ui/button"
import { canSubmitPrompt, normalizePrompt } from "@/lib/builder/generate-state"
import {
  deriveProjectNameFromPrompt,
  filterProjectsByQuery,
} from "@/lib/home/home-projects"
import type { ProjectRecord } from "@/types/project"

type HomePageShellProps = {
  databaseConfigured: boolean
  loadError: string | null
  projects: ProjectRecord[]
}

export function HomePageShell({
  databaseConfigured,
  loadError,
  projects,
}: HomePageShellProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [prompt, setPrompt] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProjects = useMemo(
    () => filterProjectsByQuery(projects, searchQuery),
    [projects, searchQuery]
  )

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
    <div className="flex min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(166,77,121,0.22),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(106,30,85,0.18),_transparent_22%),linear-gradient(180deg,_#211d22_0%,_#1A1A1D_55%,_#151518_100%)] text-[#EEEEEE]">
      <aside
        className={`${
          isSidebarOpen ? "w-[280px] px-4 py-4" : "w-0 px-0 py-4"
        } overflow-hidden border-r border-white/6 bg-black/12 transition-[width,padding] duration-300 backdrop-blur`}
      >
        <div className="flex h-full flex-col rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,_rgba(59,28,50,0.86)_0%,_rgba(26,26,29,0.92)_100%)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1A1A1D] text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#A64D79]">
                Buildly AI
              </p>
              <p className="text-sm text-white/60">Workspace</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl bg-[#1A1A1D] px-4 py-3 text-left text-sm font-medium text-white"
            >
              <House className="h-4 w-4" />
              Home
            </button>
            <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#A64D79]">
                <Search className="h-3.5 w-3.5" />
                Search projects
              </div>
              <input
                className="w-full bg-transparent text-sm text-[#EEEEEE] outline-none placeholder:text-white/35"
                placeholder="Search by project name"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left text-sm font-medium text-[#EEEEEE] transition hover:border-[#A64D79]/40 hover:bg-white/8"
            >
              <span className="flex items-center gap-3">
                <FolderKanban className="h-4 w-4" />
                All projects
              </span>
              <span className="rounded-full bg-[#A64D79]/18 px-2.5 py-1 text-xs text-[#EEEEEE]">
                {projects.length}
              </span>
            </button>
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-dashed border-[#A64D79]/28 bg-[#A64D79]/10 p-4">
            <p className="text-sm font-medium text-[#EEEEEE]">
              Start from a prompt
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Create a new concept from the prompt box and keep refining it in
              the workspace.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full border-white/8 bg-white/6 text-[#EEEEEE] hover:bg-white/10"
            onClick={() => setIsSidebarOpen((current) => !current)}
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,_rgba(59,28,50,0.7)_0%,_rgba(26,26,29,0.88)_60%,_rgba(106,30,85,0.58)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8">
            <div className="max-w-4xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1A1D] text-white shadow-lg">
                  <WandSparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#A64D79]">
                    Buildly
                  </p>
                  <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                    Design websites by chatting with your builder.
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                Start with an idea, generate a first version instantly, and
                iterate from there with a live visual workspace.
              </p>

              <div className="mt-6 rounded-[1.75rem] border border-white/8 bg-black/10 p-3 shadow-sm">
                <div className="flex flex-col gap-3">
                  <textarea
                    className="min-h-32 w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 text-white outline-none placeholder:text-white/35"
                    placeholder="Ask for a homepage, a travel brand, a coffee shop landing page, a modern SaaS site..."
                    disabled={!databaseConfigured || isSubmitting}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-3 pt-3">
                    <div className="text-xs leading-5 text-white/60">
                      {databaseConfigured
                        ? "Describe the site you want and we’ll create a project and jump straight into generation."
                        : "Configure the database first to create and load projects."}
                    </div>
                    <Button
                      type="button"
                      className="rounded-full bg-[#A64D79] px-5 text-white hover:bg-[#BF6A95]"
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

              {submitError ? (
                <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Recently built projects
                </h2>
                <p className="mt-1 text-sm text-white/65">
                  Reopen a direction, search the list, or begin a fresh build.
                </p>
              </div>
            </div>

            {loadError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
                {loadError}
              </div>
            ) : (
              <ProjectList projects={filteredProjects} />
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
