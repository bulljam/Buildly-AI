import { NextResponse } from "next/server"

import { extractHtmlDocument } from "@/lib/ai/extract-html"
import { generateHtmlWithOpenRouter } from "@/lib/ai/openrouter"
import {
  createProjectMessage,
  getProjectById,
  saveGeneratedProjectResult,
} from "@/lib/db/projects"
import { generateRequestSchema } from "@/lib/schemas/generate"

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const result = generateRequestSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid generate payload." },
        { status: 400 },
      )
    }

    const project = await getProjectById(result.data.projectId)

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    await createProjectMessage({
      projectId: project.id,
      role: "user",
      content: result.data.prompt,
    })

    const assistantContent = await generateHtmlWithOpenRouter({
      currentHtml: project.currentHtml,
      prompt: result.data.prompt,
    })
    const currentHtml = extractHtmlDocument(assistantContent)
    const savedResult = await saveGeneratedProjectResult({
      projectId: project.id,
      assistantContent,
      currentHtml,
    })

    return NextResponse.json(savedResult)
  } catch (error) {
    console.error("Failed to generate project HTML", error)

    const message = error instanceof Error ? error.message : "Generation failed."
    const status =
      message === "AI returned malformed HTML."
        ? 502
        : message === "Missing OPENROUTER_API_KEY."
          ? 500
          : 502

    return NextResponse.json(
      {
        error:
          message === "AI returned malformed HTML."
            ? "The AI response did not contain a valid HTML document."
            : message === "Missing OPENROUTER_API_KEY."
              ? "OpenRouter is not configured on the server."
              : "Unable to generate HTML right now.",
      },
      { status },
    )
  }
}
