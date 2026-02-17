import { describe, expect, it } from "vitest"

import {
  deriveProjectNameFromPrompt,
  filterProjectsByQuery,
} from "@/lib/home/home-projects"
import type { ProjectRecord } from "@/types/project"

const projects: ProjectRecord[] = [
  {
    id: "project-1",
    name: "Coffee shop website",
    currentHtml: "",
    createdAt: new Date("2026-03-27T10:00:00.000Z"),
    updatedAt: new Date("2026-03-27T10:00:00.000Z"),
  },
  {
    id: "project-2",
    name: "Travel landing page",
    currentHtml: "",
    createdAt: new Date("2026-03-27T10:00:00.000Z"),
    updatedAt: new Date("2026-03-27T10:00:00.000Z"),
  },
]

describe("deriveProjectNameFromPrompt", () => {
  it("trims and normalizes the prompt for use as a project name", () => {
    expect(
      deriveProjectNameFromPrompt("  Build    a modern coffee shop website  ")
    ).toBe("Build a modern coffee shop website")
  })

  it("falls back to the default project name for a blank prompt", () => {
    expect(deriveProjectNameFromPrompt("   ")).toBe("Untitled Project")
  })
})

describe("filterProjectsByQuery", () => {
  it("returns all projects when the query is blank", () => {
    expect(filterProjectsByQuery(projects, "   ")).toEqual(projects)
  })

  it("filters projects case-insensitively by name", () => {
    expect(filterProjectsByQuery(projects, "coffee")).toEqual([projects[0]])
  })
})
