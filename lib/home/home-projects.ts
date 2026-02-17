import type { ProjectRecord } from "@/types/project"

export function deriveProjectNameFromPrompt(prompt: string) {
  const normalized = prompt.trim().replace(/\s+/g, " ")

  if (!normalized) {
    return "Untitled Project"
  }

  return normalized.slice(0, 80)
}

export function filterProjectsByQuery(
  projects: ProjectRecord[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return projects
  }

  return projects.filter((project) =>
    project.name.toLowerCase().includes(normalizedQuery)
  )
}
