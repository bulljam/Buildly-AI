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
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-0 text-[#0F172A] shadow-[0_30px_80px_rgba(37,99,235,0.12)] backdrop:bg-[#0F172A]/18"
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
          <h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">
            {title}
          </h2>
          <p className="text-sm leading-6 text-[#475569]">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="project-name-input"
            className="text-sm font-medium text-[#0F172A]"
          >
            Project name
          </label>
          <input
            key={`${title}-${defaultValue}-${isOpen ? "open" : "closed"}`}
            id="project-name-input"
            autoFocus
            className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#2563EB]"
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
          <Button
            type="submit"
            className="bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : confirmLabel}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
