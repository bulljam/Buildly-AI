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
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-amber-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(255,247,237,0.98)_100%)] p-0 text-stone-900 shadow-[0_30px_80px_rgba(120,53,15,0.16)] backdrop:bg-stone-950/20"
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
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            {title}
          </h2>
          <p className="text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="project-name-input"
            className="text-sm font-medium text-stone-900"
          >
            Project name
          </label>
          <input
            key={`${title}-${defaultValue}-${isOpen ? "open" : "closed"}`}
            id="project-name-input"
            autoFocus
            className="w-full rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400"
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
