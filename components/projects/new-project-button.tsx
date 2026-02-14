"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { ProjectNameDialog } from "@/components/projects/project-name-dialog"
import { Button } from "@/components/ui/button"

type NewProjectButtonProps = {
  disabled?: boolean
}

export function NewProjectButton({ disabled = false }: NewProjectButtonProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <Button
        type="button"
        size="lg"
        className="rounded-full px-6"
        disabled={disabled || isCreating}
        onClick={() => {
          setError(null)
          setIsDialogOpen(true)
        }}
      >
        {disabled
          ? "Configure database first"
          : isCreating
            ? "Creating..."
            : "New project"}
      </Button>

      <ProjectNameDialog
        confirmLabel="Create project"
        defaultValue="Untitled Project"
        description="Give this project a clear name so it is easy to find later."
        error={error}
        isOpen={isDialogOpen}
        isSubmitting={isCreating}
        title="Create new project"
        onOpenChange={(nextOpen) => {
          setIsDialogOpen(nextOpen)
          if (!nextOpen) {
            setError(null)
          }
        }}
        onSubmit={async (name) => {
          setIsCreating(true)
          setError(null)

          try {
            const response = await fetch("/api/projects", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
              }),
            })
            const body = (await response.json().catch(() => null)) as
              | { project?: { id: string }; error?: string }
              | null

            if (!response.ok || !body?.project?.id) {
              throw new Error(
                body?.error ?? "Unable to create a project right now."
              )
            }

            setIsDialogOpen(false)
            router.push(`/projects/${body.project.id}`)
            router.refresh()
          } catch (submitError) {
            setError(
              submitError instanceof Error
                ? submitError.message
                : "Unable to create a project right now."
            )
          } finally {
            setIsCreating(false)
          }
        }}
      />
    </>
  )
}
