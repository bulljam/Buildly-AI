"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Layers3 } from "lucide-react"

import { Button } from "@/components/ui/button"

type AuthFormProps = {
  mode: "login" | "signup"
}

const AUTH_COPY = {
  login: {
    alternateHref: "/signup",
    alternateLabel: "Create an account",
    cta: "Sign in",
    description: "Sign in to keep your websites, prompts, and previews private.",
    title: "Welcome back",
  },
  signup: {
    alternateHref: "/login",
    alternateLabel: "Sign in instead",
    cta: "Create account",
    description: "Create a Buildly AI account to save and refine projects privately.",
    title: "Create your account",
  },
} as const

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const copy = AUTH_COPY[mode]

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | { user?: { id: string; email: string } }
        | null

      if (!response.ok) {
        throw new Error(body && "error" in body ? body.error : "Authentication failed.")
      }

      router.push("/")
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_54%,_#f7f5ef_100%)] px-4 py-12 text-[#0F172A]">
      <div className="w-full max-w-md rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-7 shadow-[0_24px_80px_rgba(37,99,235,0.1)] sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg">
            <Layers3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
              Buildly AI
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0F172A]">
              {copy.title}
            </h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-[#475569]">
          {copy.description}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#0F172A]">Email</span>
            <input
              autoComplete="email"
              className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
              disabled={isSubmitting}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#0F172A]">Password</span>
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
              disabled={isSubmitting}
              placeholder="At least 8 characters"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button
            className="h-11 w-full rounded-2xl bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
            disabled={isSubmitting}
            type="submit"
          >
            <span>{isSubmitting ? "Please wait..." : copy.cta}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 text-sm text-[#475569]">
          <Link
            href={copy.alternateHref}
            className="font-medium text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            {copy.alternateLabel}
          </Link>
        </div>
      </div>
    </main>
  )
}
