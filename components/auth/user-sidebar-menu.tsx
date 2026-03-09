"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { EllipsisVertical, LogOut, UserRound } from "lucide-react"

import { getUserInitials } from "@/lib/auth/user-display"

type UserSidebarMenuProps = {
  userName: string
}

export function UserSidebarMenu({ userName }: UserSidebarMenuProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("mousedown", handlePointerDown)

    return () => {
      window.removeEventListener("mousedown", handlePointerDown)
    }
  }, [])

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
      setIsMenuOpen(false)
      router.push("/login")
      router.refresh()
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-3 rounded-[1.5rem] border border-[#D7E3F4] bg-white/90 p-3 shadow-[0_10px_30px_rgba(37,99,235,0.08)]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold tracking-[0.18em] text-white">
        {getUserInitials(userName) || "U"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#0F172A]">{userName}</p>
      </div>

      <button
        type="button"
        aria-expanded={isMenuOpen}
        aria-label="Open user menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E3F4] bg-[#F8FBFF] text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#EFF6FF]"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>

      {isMenuOpen ? (
        <div className="absolute bottom-[calc(100%+0.75rem)] right-0 z-20 w-48 rounded-2xl border border-[#D7E3F4] bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] transition hover:bg-[#F8FBFF]"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserRound className="h-4 w-4 text-[#2563EB]" />
            Profile
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#0F172A] transition hover:bg-[#F8FBFF] disabled:opacity-60"
            disabled={isSubmitting}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 text-[#2563EB]" />
            {isSubmitting ? "Signing out..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  )
}
