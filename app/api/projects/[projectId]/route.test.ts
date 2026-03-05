import { describe, expect, it, vi } from "vitest"

const { authMock, projectsDbMock } = vi.hoisted(() => ({
  authMock: {
    getCurrentUser: vi.fn(),
  },
  projectsDbMock: {
    deleteProject: vi.fn(),
    getProjectById: vi.fn(),
    updateProjectName: vi.fn(),
  },
}))

vi.mock("@/lib/auth/users", () => authMock)
vi.mock("@/lib/db/projects", () => projectsDbMock)

import { DELETE, GET, PATCH } from "@/app/api/projects/[projectId]/route"

describe("GET /api/projects/[projectId]", () => {
  it("returns the project when it exists", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
    projectsDbMock.getProjectById.mockResolvedValueOnce({
      id: "project-1",
      name: "Landing Page",
    })

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-1" }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(projectsDbMock.getProjectById).toHaveBeenCalledWith(
      "user-1",
      "project-1"
    )
    expect(body).toEqual({
      project: {
        id: "project-1",
        name: "Landing Page",
      },
    })
  })

  it("returns 401 when project loading is unauthenticated", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce(null)

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-1" }),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Authentication required.",
    })
  })

  it("returns 404 when the project does not exist", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
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

describe("PATCH /api/projects/[projectId]", () => {
  it("updates the project name for a valid payload", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
    projectsDbMock.updateProjectName.mockResolvedValueOnce({
      id: "project-1",
      name: "Coffee Brand",
    })

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Coffee Brand",
        }),
        headers: {
          "content-type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      }
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(projectsDbMock.updateProjectName).toHaveBeenCalledWith(
      "user-1",
      "project-1",
      {
        name: "Coffee Brand",
      }
    )
    expect(body).toEqual({
      project: {
        id: "project-1",
        name: "Coffee Brand",
      },
    })
  })

  it("rejects an invalid rename payload", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({
          name: "   ",
        }),
        headers: {
          "content-type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      }
    )
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      error: "Project name is required.",
    })
  })

  it("returns 401 when rename is unauthenticated", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce(null)

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Coffee Brand",
        }),
        headers: {
          "content-type": "application/json",
        },
      }),
      {
        params: Promise.resolve({ projectId: "project-1" }),
      }
    )
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Authentication required.",
    })
  })
})

describe("DELETE /api/projects/[projectId]", () => {
  it("deletes the project when it exists", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
    projectsDbMock.deleteProject.mockResolvedValueOnce({
      id: "project-1",
      name: "Coffee Brand",
    })

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-1" }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(projectsDbMock.deleteProject).toHaveBeenCalledWith(
      "user-1",
      "project-1"
    )
    expect(body).toEqual({
      project: {
        id: "project-1",
        name: "Coffee Brand",
      },
    })
  })

  it("returns 401 when deletion is unauthenticated", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce(null)

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-1" }),
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Authentication required.",
    })
  })

  it("returns 500 when deleting fails unexpectedly", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
    })
    projectsDbMock.deleteProject.mockRejectedValueOnce(new Error("db failed"))

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ projectId: "project-2" }),
    })
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      error: "Unable to delete this project right now.",
    })
  })
})
