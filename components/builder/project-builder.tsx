"use client"

import Link from "next/link"
import { useState } from "react"
import { nanoid } from "nanoid"

import { ChatPanel } from "@/components/chat/chat-panel"
import { PreviewPanel } from "@/components/preview/preview-panel"
import { Button } from "@/components/ui/button"
import {
  appendAssistantMessage,
  canSubmitPrompt,
  createOptimisticUserMessage,
  normalizePrompt,
} from "@/lib/builder/generate-state"
import type { MessageRecord } from "@/lib/schemas/message"

type ProjectBuilderProps = {
  initialHtml: string
  initialMessages: MessageRecord[]
  projectId: string
  projectName: string
}

type GenerateResponse = {
  project: {
    id: string
    name: string
    currentHtml: string
    updatedAt: string
  }
  assistantMessage: {
    id: string
    role: "assistant"
    content: string
    createdAt: string
  }
}

export function ProjectBuilder({
  initialHtml,
  initialMessages,
  projectId,
  projectName,
}: ProjectBuilderProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [html, setHtml] = useState(initialHtml)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submitPrompt(rawPrompt: string) {
    if (!canSubmitPrompt(rawPrompt, isLoading)) {
      return
    }

    const prompt = normalizePrompt(rawPrompt)
    const optimisticUserMessage = createOptimisticUserMessage({
      id: `temp-${nanoid()}`,
      projectId,
      prompt,
    })

    setMessages((currentMessages) => [
      ...currentMessages,
      optimisticUserMessage,
    ])
    setInputValue("")
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          prompt,
        }),
      })
      const body = (await response.json().catch(() => null)) as
        | GenerateResponse
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(
          body && "error" in body ? body.error : "Generation failed."
        )
      }

      if (!body || !("project" in body) || !("assistantMessage" in body)) {
        throw new Error("Generation failed.")
      }

      setMessages((currentMessages) =>
        appendAssistantMessage(currentMessages, {
          ...body.assistantMessage,
          projectId,
          createdAt: new Date(body.assistantMessage.createdAt),
        })
      )
      setHtml(body.project.currentHtml)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to generate HTML right now."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-full px-4">
          <Link href="/">Back to projects</Link>
        </Button>
        <div className="truncate text-sm text-muted-foreground">{projectName}</div>
      </div>

      <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        <ChatPanel
          error={error}
          inputValue={inputValue}
          isLoading={isLoading}
          messages={messages}
          onInputChange={setInputValue}
          onSubmit={submitPrompt}
          projectName={projectName}
        />
        <PreviewPanel
          html={html}
          isLoading={isLoading}
          projectName={projectName}
        />
      </section>
    </main>
  )
}
