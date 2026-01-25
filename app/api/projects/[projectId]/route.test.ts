import { describe, expect, it, vi } from "vitest"

const { projectsDbMock } = vi.hoisted(() => ({
  projectsDbMock: {
    getProjectById: vi.fn(),
  },
}))

vi.mock("@/lib/db/projects", () => projectsDbMock)

import { GET } from "@/app/api/projects/[projectId]/route"

describe("GET /api/projects/[projectId]", () => {
  it("returns the project when it exists", async () => {
    projectsDbMock.getProjectById.mockResolvedValueOnce({
      id: "project-1",
      name: "Landing Page",
    })

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-1" }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      project: {
        id: "project-1",
        name: "Landing Page",
      },
    })
  })

  it("returns 404 when the project does not exist", async () => {
    projectsDbMock.getProjectById.mockResolvedValueOnce(null)

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "missing-project" }),
    })
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body).toEqual({
      error: "Project not found.",
    })
  })

  it("returns 500 when project loading fails", async () => {
    projectsDbMock.getProjectById.mockRejectedValueOnce(new Error("db failed"))

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-2" }),
    })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      error: "Unable to load this project right now.",
    })
  })
})
