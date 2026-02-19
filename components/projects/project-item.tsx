import Link from "next/link"

import type { ProjectRecord } from "@/types/project"

type ProjectItemProps = {
  project: ProjectRecord
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,_rgba(59,28,50,0.64)_0%,_rgba(26,26,29,0.82)_100%)] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-[#A64D79]/35 hover:bg-[linear-gradient(180deg,_rgba(59,28,50,0.72)_0%,_rgba(26,26,29,0.88)_100%)]"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-1">
          <p className="truncate text-base font-medium text-white">
            {project.name}
          </p>
          <p className="text-sm text-white/55">
            Updated {project.updatedAt.toLocaleDateString()}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-white/68">
          Ready to keep refining the design, copy, and layout from where you
          left off.
        </p>
      </div>
    </Link>
  )
}
