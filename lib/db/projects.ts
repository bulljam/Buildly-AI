import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"
import { assertDatabaseConfigured, prisma } from "@/lib/db/prisma"
import type { CreateProjectInput } from "@/lib/schemas/project"
import type { MessageRole } from "@/lib/schemas/message"

const DEFAULT_PROJECT_NAME = "Untitled Project"

export async function listProjects() {
  assertDatabaseConfigured()

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
  assertDatabaseConfigured()

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
  assertDatabaseConfigured()

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
  assertDatabaseConfigured()

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
  assertDatabaseConfigured()

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

export async function createProjectMessage(input: {
  projectId: string
  role: MessageRole
  content: string
}) {
  assertDatabaseConfigured()

  return prisma.message.create({
    data: {
      projectId: input.projectId,
      role: input.role,
      content: input.content,
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

export async function saveGeneratedProjectResult(input: {
  projectId: string
  assistantMessageContent: string
  currentHtml: string
}) {
  assertDatabaseConfigured()

  const [assistantMessage, project] = await prisma.$transaction([
    prisma.message.create({
      data: {
        projectId: input.projectId,
        role: "assistant",
        content: input.assistantMessageContent,
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    }),
    prisma.project.update({
      where: {
        id: input.projectId,
      },
      data: {
        currentHtml: input.currentHtml,
      },
      select: {
        id: true,
        name: true,
        currentHtml: true,
        updatedAt: true,
      },
    }),
  ])

  return {
    assistantMessage,
    project,
  }
}
