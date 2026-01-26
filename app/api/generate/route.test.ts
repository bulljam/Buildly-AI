import { describe, expect, it, vi } from "vitest"

const { aiMock, dbMock, extractMock } = vi.hoisted(() => ({
  aiMock: {
    generateHtmlWithOpenRouter: vi.fn(),
  },
  dbMock: {
    createProjectMessage: vi.fn(),
    getProjectById: vi.fn(),
    saveGeneratedProjectResult: vi.fn(),
  },
  extractMock: {
    extractHtmlDocument: vi.fn(),
  },
}))

vi.mock("@/lib/ai/openrouter", () => aiMock)
vi.mock("@/lib/db/projects", () => dbMock)
vi.mock("@/lib/ai/extract-html", () => extractMock)

import { POST } from "@/app/api/generate/route"

describe("POST /api/generate", () => {
  it("generates html and saves the updated project state", async () => {
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-1",
      name: "Landing Page",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-1",
    })
    aiMock.generateHtmlWithOpenRouter.mockResolvedValueOnce(
      "<!DOCTYPE html><html><body>New</body></html>",
    )
    extractMock.extractHtmlDocument.mockReturnValueOnce(
      "<!DOCTYPE html><html><body>New</body></html>",
    )
    dbMock.saveGeneratedProjectResult.mockResolvedValueOnce({
      project: {
        id: "project-1",
        name: "Landing Page",
        currentHtml: "<!DOCTYPE html><html><body>New</body></html>",
        updatedAt: "2026-03-26T00:00:00.000Z",
      },
      assistantMessage: {
        id: "assistant-message-1",
        role: "assistant",
        content: "<!DOCTYPE html><html><body>New</body></html>",
        createdAt: "2026-03-26T00:00:00.000Z",
      },
    })

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-1",
        prompt: "Add a hero section",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(dbMock.createProjectMessage).toHaveBeenCalledWith({
      projectId: "project-1",
      role: "user",
      content: "Add a hero section",
    })
    expect(aiMock.generateHtmlWithOpenRouter).toHaveBeenCalledWith({
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
      prompt: "Add a hero section",
    })
    expect(dbMock.saveGeneratedProjectResult).toHaveBeenCalledWith({
      projectId: "project-1",
      assistantContent: "<!DOCTYPE html><html><body>New</body></html>",
      currentHtml: "<!DOCTYPE html><html><body>New</body></html>",
    })
    expect(body).toEqual({
      project: {
        id: "project-1",
        name: "Landing Page",
        currentHtml: "<!DOCTYPE html><html><body>New</body></html>",
        updatedAt: "2026-03-26T00:00:00.000Z",
      },
      assistantMessage: {
        id: "assistant-message-1",
        role: "assistant",
        content: "<!DOCTYPE html><html><body>New</body></html>",
        createdAt: "2026-03-26T00:00:00.000Z",
      },
    })
  })

  it("rejects an empty prompt", async () => {
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-1",
        prompt: "   ",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      error: "Prompt is required.",
    })
  })

  it("returns 404 when the project does not exist", async () => {
    dbMock.getProjectById.mockResolvedValueOnce(null)

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "missing-project",
        prompt: "Build a homepage",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body).toEqual({
      error: "Project not found.",
    })
  })

  it("returns 502 when the AI response cannot be parsed into a full document", async () => {
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-2",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-2",
    })
    aiMock.generateHtmlWithOpenRouter.mockResolvedValueOnce("<div>fragment</div>")
    extractMock.extractHtmlDocument.mockImplementationOnce(() => {
      throw new Error("AI returned malformed HTML.")
    })

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-2",
        prompt: "Update the footer",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(502)
    expect(body).toEqual({
      error: "The AI response did not contain a valid HTML document.",
    })
  })

  it("returns 500 when OpenRouter is not configured", async () => {
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-3",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-3",
    })
    aiMock.generateHtmlWithOpenRouter.mockRejectedValueOnce(
      new Error("Missing OPENROUTER_API_KEY."),
    )

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-3",
        prompt: "Refresh the hero copy",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body).toEqual({
      error: "OpenRouter is not configured on the server.",
    })
  })
})
