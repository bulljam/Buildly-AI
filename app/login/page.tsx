import { redirect } from "next/navigation"

import { AuthForm } from "@/components/auth/auth-form"
import { getCurrentUser } from "@/lib/auth/users"
import { isDatabaseConfigured } from "@/lib/db/prisma"
import { DATABASE_SETUP_MESSAGE } from "@/lib/db/setup-status"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
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

  if (user) {
    redirect("/")
  }

  return <AuthForm mode="login" />
}
