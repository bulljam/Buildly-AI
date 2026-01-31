"use client"

import { useState } from "react"
import { nanoid } from "nanoid"

import { ChatPanel } from "@/components/chat/chat-panel"
import { PreviewPanel } from "@/components/preview/preview-panel"
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/60 p-6 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            Saved project
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {projectName}
          </h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            Prompt the model to refine this site. The chat history stays
            attached to this project, and the preview only updates when a new
            valid HTML document is returned.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <ChatPanel
          error={error}
          inputValue={inputValue}
          isLoading={isLoading}
          messages={messages}
          onInputChange={setInputValue}
          onStarterPrompt={submitPrompt}
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
