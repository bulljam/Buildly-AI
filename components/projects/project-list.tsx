import type { ProjectRecord } from "@/types/project"

import { ProjectItem } from "@/components/projects/project-item"

type ProjectListProps = {
  projects: ProjectRecord[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#BFDBFE] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(239,246,255,0.98)_100%)] p-8 text-sm text-[#475569] shadow-[0_12px_36px_rgba(37,99,235,0.08)]">
        No projects yet. Create your first one to start generating and refining
        a website.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}
