import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { ProfileSettingsForm } from "@/components/auth/profile-settings-form"
import { getCurrentUser } from "@/lib/auth/users"
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
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D7E3F4] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back home
        </Link>

        <ProfileSettingsForm
          initialAvatarDataUrl={user.avatarDataUrl}
          initialEmail={user.email}
          initialName={user.name}
        />

      </div>
    </main>
  )
}
