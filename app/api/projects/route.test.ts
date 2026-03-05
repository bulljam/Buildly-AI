import { describe, expect, it, vi } from "vitest"

const { authMock, projectsDbMock } = vi.hoisted(() => ({
  authMock: {
    getCurrentUser: vi.fn(),
  },
  projectsDbMock: {
    createProject: vi.fn(),
    listProjects: vi.fn(),
  },
}))

vi.mock("@/lib/auth/users", () => authMock)
vi.mock("@/lib/db/projects", () => projectsDbMock)

import { GET, POST } from "@/app/api/projects/route"

describe("GET /api/projects", () => {
  it("returns projects when loading succeeds", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
    projectsDbMock.listProjects.mockResolvedValueOnce([
      {
        id: "project-1",
        name: "Landing Page",
      },
    ])

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(projectsDbMock.listProjects).toHaveBeenCalledWith("user-1")
    expect(body).toEqual({
      projects: [
        {
          id: "project-1",
          name: "Landing Page",
        },
      ],
    })
  })

  it("returns 401 when the request is unauthenticated", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce(null)

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Authentication required.",
    })
  })

  it("returns a 500 response when loading fails", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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
    expect(projectsDbMock.createProject).toHaveBeenCalledWith("user-1", {
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
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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

  it("returns 401 when creation is unauthenticated", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce(null)

    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: "{}",
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Authentication required.",
    })
  })

  it("accepts an empty body and lets the default project name be applied", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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
    expect(projectsDbMock.createProject).toHaveBeenCalledWith("user-1", {})
    expect(body).toEqual({
      project: {
        id: "project-3",
        name: "Untitled Project",
      },
    })
  })

  it("returns a 500 response when project creation fails", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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
