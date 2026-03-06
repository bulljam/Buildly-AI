"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogout() {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } finally {
      router.push("/login")
      router.refresh()
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-sm font-medium text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#F8FBFF] disabled:opacity-60 ${className}`.trim()}
      disabled={isSubmitting}
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      {isSubmitting ? "Signing out..." : "Sign out"}
    </button>
  )
}
