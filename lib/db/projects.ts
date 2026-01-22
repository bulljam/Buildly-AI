import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"
import { prisma } from "@/lib/db/prisma"
import type { CreateProjectInput } from "@/lib/schemas/project"

const DEFAULT_PROJECT_NAME = "Untitled Project"

export async function listProjects() {
  return prisma.project.findMany({
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
}

export async function createProject(input?: CreateProjectInput) {
  const name = input?.name?.trim() || DEFAULT_PROJECT_NAME

  return prisma.project.create({
    data: {
      name,
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
}

export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      currentHtml: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function getProjectMessages(projectId: string) {
  return prisma.message.findMany({
    where: { projectId },
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
}

export async function getProjectWithMessages(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
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
}
