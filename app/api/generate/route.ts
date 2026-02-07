import { NextResponse } from "next/server"

import { extractHtmlDocument } from "@/lib/ai/extract-html"
import { generateHtmlWithGroq } from "@/lib/ai/groq"
import {
  createProjectMessage,
  getProjectById,
  saveGeneratedProjectResult,
} from "@/lib/db/projects"
import { generateRequestSchema } from "@/lib/schemas/generate"

const ASSISTANT_SUCCESS_MESSAGE = "Website updated successfully."
const GENERIC_GENERATE_ERROR = "Unable to generate HTML right now."

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const result = generateRequestSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message ?? "Invalid generate payload.",
        },
        { status: 400 }
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

    const assistantContent = await generateHtmlWithGroq({
      currentHtml: project.currentHtml,
      prompt: result.data.prompt,
    })
    const currentHtml = extractHtmlDocument(assistantContent)
    const savedResult = await saveGeneratedProjectResult({
      projectId: project.id,
      assistantMessageContent: ASSISTANT_SUCCESS_MESSAGE,
      currentHtml,
    })

    return NextResponse.json(savedResult)
  } catch (error) {
    console.error("Failed to generate project HTML", error)

    const message =
      error instanceof Error ? error.message : "Generation failed."
    const isDevelopment = process.env.NODE_ENV !== "production"
    const status =
      message === "AI returned malformed HTML."
        ? 502
        : message === "Missing GROQ_API_KEY."
          ? 500
          : 502

    return NextResponse.json(
      {
        error:
          message === "AI returned malformed HTML."
            ? "The AI response did not contain a valid HTML document."
            : message === "Missing GROQ_API_KEY."
              ? "Groq is not configured on the server."
              : isDevelopment
                ? message
                : GENERIC_GENERATE_ERROR,
      },
      { status }
    )
  }
}
