import { describe, expect, it, vi } from "vitest"

const { aiMock, dbMock, extractMock } = vi.hoisted(() => ({
  aiMock: {
    generateHtmlWithGroq: vi.fn(),
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

vi.mock("@/lib/ai/groq", () => aiMock)
vi.mock("@/lib/db/projects", () => dbMock)
vi.mock("@/lib/ai/extract-html", () => extractMock)

import { POST } from "@/app/api/generate/route"

describe("POST /api/generate", () => {
  it("surfaces the upstream provider error in development", async () => {
    vi.stubEnv("NODE_ENV", "development")
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-dev",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-dev",
    })
    aiMock.generateHtmlWithGroq.mockRejectedValueOnce(
      new Error("Provider returned error")
    )

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-dev",
        prompt: "Refresh the layout",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(502)
    expect(body).toEqual({
      error: "Provider returned error",
    })

    vi.unstubAllEnvs()
  })

  it("generates html and saves the updated project state", async () => {
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-1",
      name: "Landing Page",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-1",
    })
    aiMock.generateHtmlWithGroq.mockResolvedValueOnce(
      "<!DOCTYPE html><html><body>New</body></html>"
    )
    extractMock.extractHtmlDocument.mockReturnValueOnce(
      "<!DOCTYPE html><html><body>New</body></html>"
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
        content: "Website updated successfully.",
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
    expect(aiMock.generateHtmlWithGroq).toHaveBeenCalledWith({
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
      prompt: "Add a hero section",
    })
    expect(dbMock.saveGeneratedProjectResult).toHaveBeenCalledWith({
      projectId: "project-1",
      assistantMessageContent: "Website updated successfully.",
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
        content: "Website updated successfully.",
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
    vi.stubEnv("NODE_ENV", "production")
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-2",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-2",
    })
    aiMock.generateHtmlWithGroq.mockResolvedValueOnce(
      "<div>fragment</div>"
    )
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

    vi.unstubAllEnvs()
  })

  it("includes a raw response preview for malformed html in development", async () => {
    vi.stubEnv("NODE_ENV", "development")
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-2-dev",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-2-dev",
    })
    aiMock.generateHtmlWithGroq.mockResolvedValueOnce(
      "Sure, here is your site: section.hero { color: red; }"
    )
    extractMock.extractHtmlDocument.mockImplementationOnce(() => {
      throw new Error("AI returned malformed HTML.")
    })

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-2-dev",
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
      error:
        "The AI response did not contain a valid HTML document. Raw response preview: Sure, here is your site: section.hero { color: red; }",
    })

    vi.unstubAllEnvs()
  })

  it("returns 502 when the AI returns unchanged HTML", async () => {
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-unchanged",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-unchanged",
    })
    aiMock.generateHtmlWithGroq.mockResolvedValueOnce(
      "<!DOCTYPE html>\n<html>\n  <body>Old</body>\n</html>"
    )
    extractMock.extractHtmlDocument.mockReturnValueOnce(
      "<!DOCTYPE html>\n<html>\n  <body>Old</body>\n</html>"
    )

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-unchanged",
        prompt: "Make it a modern marketing page",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(502)
    expect(body).toEqual({
      error:
        "The model did not produce a new website. Try a more specific prompt or a different model.",
    })
    expect(dbMock.saveGeneratedProjectResult).not.toHaveBeenCalled()
  })

  it("returns 500 when Groq is not configured", async () => {
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-3",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-3",
    })
    aiMock.generateHtmlWithGroq.mockRejectedValueOnce(
      new Error("Missing GROQ_API_KEY.")
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
      error: "Groq is not configured on the server.",
    })
  })

  it("keeps the generic error message in production", async () => {
    vi.stubEnv("NODE_ENV", "production")
    dbMock.getProjectById.mockResolvedValueOnce({
      id: "project-prod",
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
    })
    dbMock.createProjectMessage.mockResolvedValueOnce({
      id: "user-message-prod",
    })
    aiMock.generateHtmlWithGroq.mockRejectedValueOnce(
      new Error("Provider returned error")
    )

    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({
        projectId: "project-prod",
        prompt: "Refresh the layout",
      }),
      headers: {
        "content-type": "application/json",
      },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(502)
    expect(body).toEqual({
      error: "Unable to generate HTML right now.",
    })

    vi.unstubAllEnvs()
  })
})
