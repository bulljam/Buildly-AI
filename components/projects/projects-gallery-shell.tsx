"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Folder,
  House,
  Layers3,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react"

import { UserSidebarMenu } from "@/components/auth/user-sidebar-menu"
import { ProjectList } from "@/components/projects/project-list"
import { filterProjectsByQuery } from "@/lib/home/home-projects"
import type { ProjectRecord } from "@/types/project"

type ProjectsGalleryShellProps = {
  loadError: string | null
  projects: ProjectRecord[]
  userName: string
}

export function ProjectsGalleryShell({
  loadError,
  projects,
  userName,
}: ProjectsGalleryShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = useMemo(
    () => filterProjectsByQuery(projects, searchQuery),
    [projects, searchQuery]
  )

  return (
    <div className="relative flex min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_52%,_#f7f5ef_100%)] text-[#0F172A]">
      <aside
        className={`absolute inset-y-0 left-0 z-20 w-[440px] p-4 transition-all duration-300 ease-out ${
          isSidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none"
        } lg:z-10`}
      >
        <div className="flex h-full flex-col rounded-[1.75rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-4 shadow-[0_20px_60px_rgba(37,99,235,0.12)] backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-lg">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
                Buildly AI
              </p>
              <p className="text-sm text-[#475569]">Workspace</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3 text-left text-sm font-medium text-[#0F172A] transition hover:border-[#93C5FD] hover:bg-[#F8FBFF]"
            >
              <House className="h-4 w-4" />
              Home
            </Link>
            <div className="rounded-2xl border border-[#D7E3F4] bg-white px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#2563EB]">
                <Search className="h-3.5 w-3.5" />
                Search projects
              </div>
              <input
                className="w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#64748B]"
                placeholder="Search by project name"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Link
              href="/projects"
              className="flex w-full items-center justify-between rounded-2xl bg-[#E8F0FF] px-4 py-3 text-left text-sm font-medium text-[#0F172A]"
            >
              <span className="flex items-center gap-3">
                <Folder className="h-4 w-4" />
                All projects
              </span>
              <span className="rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs text-[#1D4ED8]">
                {projects.length}
              </span>
            </Link>
          </nav>

          {userName ? (
            <div className="mt-auto">
              <UserSidebarMenu userName={userName} />
            </div>
          ) : null}
        </div>
      </aside>

      <main
        className={`flex min-w-0 flex-1 flex-col transition-[padding-left] duration-300 ease-out ${
          isSidebarOpen ? "lg:pl-[400px]" : "lg:pl-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E3F4] bg-white text-[#0F172A] transition hover:bg-[#F8FBFF]"
            onClick={() => setIsSidebarOpen((current) => !current)}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-6 shadow-[0_24px_80px_rgba(37,99,235,0.1)] sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#2563EB]">
              Library
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              All projects
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#475569] sm:text-base">
              Explore every website you have generated so far and jump back into any project when you want to keep refining it.
            </p>
          </section>

          {loadError ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              {loadError}
            </div>
          ) : (
            <ProjectList projects={filteredProjects} />
          )}
        </div>
      </main>
    </div>
  )
}
