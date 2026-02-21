import Link from "next/link"

import type { ProjectRecord } from "@/types/project"

type ProjectItemProps = {
  project: ProjectRecord
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex rounded-[1.5rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] p-5 shadow-[0_12px_40px_rgba(37,99,235,0.08)] transition hover:-translate-y-0.5 hover:border-[#93C5FD] hover:bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(239,246,255,1)_100%)]"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-1">
          <p className="truncate text-base font-medium text-[#0F172A]">
            {project.name}
          </p>
          <p className="text-sm text-[#64748B]">
            Updated {project.updatedAt.toLocaleDateString()}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-[#475569]">
          Ready to keep refining the design, copy, and layout from where you
          left off.
        </p>
      </div>
    </Link>
  )
}
