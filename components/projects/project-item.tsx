import Link from "next/link"

import type { ProjectRecord } from "@/types/project"

type ProjectItemProps = {
  project: ProjectRecord
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex rounded-[1.5rem] border border-stone-200/80 bg-white/85 p-5 shadow-[0_12px_40px_rgba(120,53,15,0.06)] transition hover:-translate-y-0.5 hover:border-amber-300/80 hover:bg-white"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-1">
          <p className="truncate text-base font-medium text-stone-900">
            {project.name}
          </p>
          <p className="text-sm text-stone-500">
            Updated {project.updatedAt.toLocaleDateString()}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">
          Ready to keep refining the design, copy, and layout from where you
          left off.
        </p>
      </div>
    </Link>
  )
}
