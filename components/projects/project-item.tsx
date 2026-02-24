"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Trash2 } from "lucide-react"

import type { ProjectRecord } from "@/types/project"

type ProjectItemProps = {
  project: ProjectRecord
}

export function ProjectItem({ project }: ProjectItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleDelete() {
    if (isDeleting || typeof window === "undefined") {
      return
    }

    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(body?.error ?? "Unable to delete this project right now.")
      }

      router.refresh()
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete this project right now."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="group flex rounded-[1.5rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-5 shadow-[0_12px_40px_rgba(37,99,235,0.08)] transition hover:-translate-y-0.5 hover:border-[#93C5FD] hover:bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(239,246,255,1)_100%)]">
        <Link href={`/projects/${project.id}`} className="flex min-w-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="space-y-1">
              <p className="truncate text-base font-medium text-[#0F172A]">
                {project.name}
              </p>
              <p className="text-sm text-[#64748B]">
                Updated {project.updatedAt.toLocaleDateString()}
              </p>
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-[#475569]">
              Ready to keep refining the design, copy, and layout from where you
              left off.
            </p>
          </div>
        </Link>
        <button
          type="button"
          aria-label={`Delete ${project.name}`}
          className="ml-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] transition hover:bg-[#FEE2E2] disabled:opacity-60"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {deleteError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {deleteError}
        </div>
      ) : null}
    </div>
  )
}
