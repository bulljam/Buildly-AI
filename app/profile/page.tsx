import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft, Layers3 } from "lucide-react"

import { getCurrentUser } from "@/lib/auth/users"
import { getUserInitials } from "@/lib/auth/user-display"
import { isDatabaseConfigured } from "@/lib/db/prisma"
import { DATABASE_SETUP_MESSAGE } from "@/lib/db/setup-status"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  if (!isDatabaseConfigured()) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {DATABASE_SETUP_MESSAGE}
        </div>
      </main>
    )
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="min-h-svh bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f7f5ef_100%)] px-4 py-10 text-[#0F172A] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D7E3F4] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#EFF6FF] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back home
        </Link>

        <section className="rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-8 shadow-[0_24px_80px_rgba(37,99,235,0.1)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] text-2xl font-semibold tracking-[0.18em] text-white shadow-lg">
              {getUserInitials(user.name) || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
                Profile
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#0F172A]">
                {user.name}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#475569]">{user.email}</p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg">
              <Layers3 className="h-5 w-5" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
