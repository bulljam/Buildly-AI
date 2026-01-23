import Link from "next/link"

import type { ProjectRecord } from "@/types/project"

type ProjectItemProps = {
  project: ProjectRecord
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex rounded-2xl border border-border/70 bg-card/80 p-4 transition hover:border-foreground/15 hover:bg-card"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-1">
          <p className="truncate text-base font-medium">{project.name}</p>
          <p className="text-sm text-muted-foreground">
            Updated {project.updatedAt.toLocaleDateString()}
          </p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          Current HTML snapshot is saved and ready for the next prompt.
        </p>
      </div>
    </Link>
  )
}
