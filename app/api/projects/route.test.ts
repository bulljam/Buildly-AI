import { describe, expect, it, vi } from "vitest"

const { projectsDbMock } = vi.hoisted(() => ({
  projectsDbMock: {
    createProject: vi.fn(),
    listProjects: vi.fn(),
  },
}))

vi.mock("@/lib/db/projects", () => projectsDbMock)

import { GET, POST } from "@/app/api/projects/route"

describe("GET /api/projects", () => {
  it("returns projects when loading succeeds", async () => {
    projectsDbMock.listProjects.mockResolvedValueOnce([
      {
        id: "project-1",
        name: "Landing Page",
      },
    ])

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      projects: [
        {
          id: "project-1",
          name: "Landing Page",
        },
      ],
    })
  })

  it("returns a 500 response when loading fails", async () => {
    projectsDbMock.listProjects.mockRejectedValueOnce(new Error("db offline"))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      error: "Unable to load projects right now.",
    })
  })
})

describe("POST /api/projects", () => {
  it("creates a project for a valid payload", async () => {
    projectsDbMock.createProject.mockResolvedValueOnce({
      id: "project-2",
      name: "Portfolio",
    })

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "Portfolio",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(projectsDbMock.createProject).toHaveBeenCalledWith({
      name: "Portfolio",
    })
    expect(body).toEqual({
      project: {
        id: "project-2",
        name: "Portfolio",
      },
    })
  })

  it("rejects invalid payloads", async () => {
    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "   ",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      error: "Project name is required.",
    })
  })

  it("accepts an empty body and lets the default project name be applied", async () => {
    projectsDbMock.createProject.mockResolvedValueOnce({
      id: "project-3",
      name: "Untitled Project",
    })

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: "{}",
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(projectsDbMock.createProject).toHaveBeenCalledWith({})
    expect(body).toEqual({
      project: {
        id: "project-3",
        name: "Untitled Project",
      },
    })
  })

  it("returns a 500 response when project creation fails", async () => {
    projectsDbMock.createProject.mockRejectedValueOnce(
      new Error("insert failed")
    )

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: "{}",
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      error: "Unable to create a project right now.",
    })
  })
})
