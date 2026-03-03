import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"
import { assertDatabaseConfigured, prisma } from "@/lib/db/prisma"
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/schemas/project"
import type { MessageRole } from "@/lib/schemas/message"

const DEFAULT_PROJECT_NAME = "Untitled Project"

export async function listProjects(userId: string) {
  assertDatabaseConfigured()

  return prisma.project.findMany({
    where: {
      userId,
    },
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

export async function createProject(userId: string, input?: CreateProjectInput) {
  assertDatabaseConfigured()

  const name = input?.name?.trim() || DEFAULT_PROJECT_NAME

  return prisma.project.create({
    data: {
      userId,
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

export async function getProjectById(userId: string, projectId: string) {
  assertDatabaseConfigured()

  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
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

export async function updateProjectName(
  userId: string,
  projectId: string,
  input: UpdateProjectInput
) {
  assertDatabaseConfigured()

  return prisma.project.update({
    where: {
      id_userId: {
        id: projectId,
        userId,
      },
    },
    data: {
      name: input.name,
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

export async function deleteProject(userId: string, projectId: string) {
  assertDatabaseConfigured()

  return prisma.project.delete({
    where: {
      id_userId: {
        id: projectId,
        userId,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })
}

export async function getProjectMessages(userId: string, projectId: string) {
  assertDatabaseConfigured()

  return prisma.message.findMany({
    where: {
      projectId,
      project: {
        userId,
      },
    },
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

export async function getProjectWithMessages(userId: string, projectId: string) {
  assertDatabaseConfigured()

  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
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
  userId: string
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
        id_userId: {
          id: input.projectId,
          userId: input.userId,
        },
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
