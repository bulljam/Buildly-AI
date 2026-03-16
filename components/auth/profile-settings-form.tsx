"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, X } from "lucide-react"

import { getUserInitials } from "@/lib/auth/user-display"

type ProfileSettingsFormProps = {
  initialAvatarDataUrl?: string | null
  initialEmail: string
  initialName: string
}

type UpdateProfileResponse = {
  user?: {
    avatarDataUrl?: string | null
    email: string
    id: string
    name: string
  }
  error?: string
}

export function ProfileSettingsForm({
  initialAvatarDataUrl = null,
  initialEmail,
  initialName,
}: ProfileSettingsFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(
    initialAvatarDataUrl
  )
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Profile picture must be an image.")
      return
    }

    const fileDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => resolve(String(reader.result ?? ""))
      reader.onerror = () => reject(new Error("Unable to read the selected image."))
      reader.readAsDataURL(file)
    })

    setAvatarDataUrl(fileDataUrl)
    setError(null)
    setSuccess(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          avatarDataUrl,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })
      const body = (await response.json().catch(() => null)) as
        | UpdateProfileResponse
        | null

      if (!response.ok || !body?.user) {
        throw new Error(body?.error ?? "Unable to update your profile right now.")
      }

      setName(body.user.name)
      setEmail(body.user.email)
      setAvatarDataUrl(body.user.avatarDataUrl ?? null)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccess("Profile updated successfully.")
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to update your profile right now."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.1)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#2563EB] text-3xl font-semibold tracking-[0.18em] text-white shadow-lg">
            {avatarDataUrl ? (
              <Image
                alt={name}
                className="h-full w-full object-cover"
                height={96}
                src={avatarDataUrl}
                unoptimized
                width={96}
              />
            ) : (
              getUserInitials(name) || "U"
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white bg-[#2563EB] text-white shadow-lg transition hover:bg-[#1D4ED8]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
            Account settings
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#475569]">
            Update how your name, login details, and picture appear across Buildly.
          </p>
          {avatarDataUrl ? (
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#FBCFE8] bg-[#FDF2F8] px-4 py-2 text-sm font-medium text-[#BE185D] transition hover:bg-[#FCE7F3]"
              onClick={() => {
                setAvatarDataUrl(null)
                setError(null)
                setSuccess(null)
              }}
            >
              <X className="h-4 w-4" />
              Remove photo
            </button>
          ) : null}
        </div>
      </div>

      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#0F172A]">Full name</span>
            <input
              className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
              disabled={isSubmitting}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#0F172A]">Email</span>
            <input
              className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
              disabled={isSubmitting}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>

        <div className="rounded-[1.5rem] border border-[#D7E3F4] bg-white/80 p-5">
          <p className="text-sm font-medium text-[#0F172A]">Change password</p>
          <p className="mt-1 text-sm leading-6 text-[#475569]">
            Leave these blank if you do not want to update your password.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#0F172A]">
                Current password
              </span>
              <input
                className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
                disabled={isSubmitting}
                placeholder="••••••••"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#0F172A]">
                New password
              </span>
              <input
                className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
                disabled={isSubmitting}
                placeholder="••••••••"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#0F172A]">
                Confirm password
              </span>
              <input
                className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
                disabled={isSubmitting}
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[#2563EB] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  )
}
