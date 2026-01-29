import { afterEach, describe, expect, it, vi } from "vitest"

import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    message: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock("@/lib/db/prisma", () => ({
  assertDatabaseConfigured: vi.fn(),
  prisma: prismaMock,
}))

import {
  createProject,
  getProjectById,
  getProjectMessages,
  getProjectWithMessages,
  listProjects,
} from "@/lib/db/projects"

afterEach(() => {
  vi.clearAllMocks()
})

describe("project data helpers", () => {
  it("lists projects ordered by most recent update first", async () => {
    prismaMock.project.findMany.mockResolvedValueOnce([])

    await listProjects()

    expect(prismaMock.project.findMany).toHaveBeenCalledWith({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  it("creates a project with the default name and starter HTML when no name is provided", async () => {
    prismaMock.project.create.mockResolvedValueOnce({
      id: "project-1",
      name: "Untitled Project",
      currentHtml: DEFAULT_PROJECT_HTML,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await createProject()

    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: {
        name: "Untitled Project",
        currentHtml: DEFAULT_PROJECT_HTML,
      },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  it("creates a project with a trimmed custom name", async () => {
    prismaMock.project.create.mockResolvedValueOnce({
      id: "project-2",
      name: "Agency Site",
      currentHtml: DEFAULT_PROJECT_HTML,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await createProject({ name: "  Agency Site  " })

    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: {
        name: "Agency Site",
        currentHtml: DEFAULT_PROJECT_HTML,
      },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  it("falls back to the default project name when a blank name slips through", async () => {
    prismaMock.project.create.mockResolvedValueOnce({
      id: "project-3",
      name: "Untitled Project",
      currentHtml: DEFAULT_PROJECT_HTML,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await createProject({ name: "   " })

    expect(prismaMock.project.create).toHaveBeenCalledWith({
      data: {
        name: "Untitled Project",
        currentHtml: DEFAULT_PROJECT_HTML,
      },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  it("loads a project by id", async () => {
    prismaMock.project.findUnique.mockResolvedValueOnce(null)

    await getProjectById("project-4")

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: "project-4" },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  it("loads project messages in ascending time order", async () => {
    prismaMock.message.findMany.mockResolvedValueOnce([])

    await getProjectMessages("project-5")

    expect(prismaMock.message.findMany).toHaveBeenCalledWith({
      where: { projectId: "project-5" },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        projectId: true,
        role: true,
        content: true,
        createdAt: true,
      },
    })
  })

  it("loads a project with its messages", async () => {
    prismaMock.project.findUnique.mockResolvedValueOnce(null)

    await getProjectWithMessages("project-6")

    expect(prismaMock.project.findUnique).toHaveBeenCalledWith({
      where: { id: "project-6" },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            projectId: true,
            role: true,
            content: true,
            createdAt: true,
          },
        },
      },
    })
  })
})
