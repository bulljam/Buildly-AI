"use client"

import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

type ProjectNameDialogProps = {
  confirmLabel: string
  defaultValue: string
  description: string
  error?: string | null
  isOpen: boolean
  isSubmitting?: boolean
  title: string
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (name: string) => Promise<void> | void
}

export function ProjectNameDialog({
  confirmLabel,
  defaultValue,
  description,
  error = null,
  isOpen,
  isSubmitting = false,
  title,
  onOpenChange,
  onSubmit,
}: ProjectNameDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
      return
    }

    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/45"
      onClose={() => {
        if (isOpen) {
          onOpenChange(false)
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        onOpenChange(false)
      }}
    >
      <form
        className="space-y-5 p-6"
        onSubmit={async (event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          const name = formData.get("projectName")

          await onSubmit(typeof name === "string" ? name : "")
        }}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="project-name-input"
            className="text-sm font-medium text-foreground"
          >
            Project name
          </label>
          <input
            key={`${title}-${defaultValue}-${isOpen ? "open" : "closed"}`}
            id="project-name-input"
            autoFocus
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/30"
            defaultValue={defaultValue}
            disabled={isSubmitting}
            maxLength={80}
            name="projectName"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
