import type { ProjectRecord } from "@/types/project"

import { ProjectItem } from "@/components/projects/project-item"

type ProjectListProps = {
  projects: ProjectRecord[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
        No projects yet. Create your first one to start generating and refining a website.
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
