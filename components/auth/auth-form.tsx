"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowRight,
  Handshake,
  Layers3,
  MessageSquareText,
  PanelsTopLeft,
} from "lucide-react"

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
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
          ...(mode === "signup"
            ? {
                fullName,
                confirmPassword,
              }
            : {}),
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
    <main className="flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_54%,_#f6f1ff_100%)] px-4 py-10 text-[#0F172A]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.25rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(246,249,255,0.98)_100%)] shadow-[0_30px_120px_rgba(37,99,235,0.14)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden border-b border-[#D7E3F4] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_32%),linear-gradient(180deg,_#0F172A_0%,_#15233A_100%)] p-7 text-white sm:p-10 lg:border-b-0 lg:border-r">
          <div className="absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_center,_rgba(103,232,249,0.18),_transparent_62%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-white backdrop-blur">
                <Layers3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#93C5FD]">
                  Buildly AI
                </p>
                <p className="text-sm text-white/72">Design websites through dialogue</p>
              </div>
            </div>

            <div className="mt-12 max-w-xl">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {mode === "login"
                  ? "Pick up exactly where your last website left off."
                  : "Open a private studio for every website you want to shape."}
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/72 sm:text-base">
                {mode === "login"
                  ? "Your prompts, previews, and generated websites stay connected to your account so you can keep iterating without losing context."
                  : "Start with a concept, generate a first version instantly, and keep each project saved behind your own account."}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <PanelsTopLeft className="h-4 w-4 text-[#67E8F9]" />
                <p className="mt-3 text-sm font-medium text-white">
                  Live preview
                </p>
                <p className="mt-1 text-xs leading-5 text-white/68">
                  Refine the page and keep the latest HTML snapshot in sync.
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <MessageSquareText className="h-4 w-4 text-[#67E8F9]" />
                <p className="mt-3 text-sm font-medium text-white">Chat memory</p>
                <p className="mt-1 text-xs leading-5 text-white/68">
                  Reopen a project and continue from the conversation history.
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                <Handshake className="h-4 w-4 text-[#67E8F9]" />
                <p className="mt-3 text-sm font-medium text-white">
                  Fast iterations
                </p>
                <p className="mt-1 text-xs leading-5 text-white/68">
                  Ship a first concept quickly, then keep polishing from there.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-7 sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
              {mode === "login" ? "Sign in" : "Create account"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0F172A]">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#475569]">
              {copy.description}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[#0F172A]">
                  Full name
                </span>
                <input
                  autoComplete="name"
                  className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#64748B] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
                  disabled={isSubmitting}
                  placeholder="Jane Doe"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </label>
            ) : null}

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
                className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
                disabled={isSubmitting}
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {mode === "signup" ? (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[#0F172A]">
                  Confirm password
                </span>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#93C5FD] focus:ring-2 focus:ring-[#DBEAFE]"
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
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
        </section>
      </div>
    </main>
  )
}
