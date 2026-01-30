"use client"

import { useEffect, useRef } from "react"

import type { MessageRecord } from "@/lib/schemas/message"

import { ChatMessageList } from "@/components/chat/chat-message-list"
import { Button } from "@/components/ui/button"
import { shouldSubmitPromptOnKeyDown } from "@/lib/builder/chat-ux"
import { canSubmitPrompt } from "@/lib/builder/generate-state"

const starterPrompts = [
  "Create a clean landing page for a SaaS product.",
  "Design a portfolio site for a freelance designer.",
  "Build a coffee shop homepage with menu highlights.",
]

const placeholderTimestamp = new Date("2026-03-26T09:00:00.000Z")

const placeholderMessages: Array<
  Pick<MessageRecord, "id" | "role" | "content" | "createdAt">
> = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "Tell me what kind of website you want. I’ll generate a full HTML document and keep updating it as you refine the prompt.",
    createdAt: placeholderTimestamp,
  },
  {
    id: "assistant-tip",
    role: "assistant",
    content:
      "For the MVP, we’ll keep the flow simple: prompt on the left, live preview on the right, and one current HTML snapshot per project.",
    createdAt: placeholderTimestamp,
  },
]

type ChatPanelProps = {
  error?: string | null
  inputValue?: string
  isLoading?: boolean
  messages?: MessageRecord[]
  onInputChange?: (value: string) => void
  onStarterPrompt?: (prompt: string) => void
  onSubmit?: (prompt: string) => void
  projectName?: string
}

export function ChatPanel({
  error,
  inputValue = "",
  isLoading = false,
  messages = [],
  onInputChange,
  onStarterPrompt,
  onSubmit,
  projectName,
}: ChatPanelProps) {
  const hasMessages = messages.length > 0
  const items = hasMessages ? messages : placeholderMessages
  const submitEnabled = canSubmitPrompt(inputValue, isLoading)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const latestMessageCount = items.length

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [latestMessageCount])

  return (
    <section className="flex min-h-[420px] flex-col rounded-3xl border border-border/70 bg-card/80 shadow-sm">
      <div className="border-b border-border/70 px-5 py-4">
        <p className="text-sm font-medium">Chat</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {projectName
            ? `Messages for ${projectName}.`
            : "Prompt history will be saved per project."}
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-5 py-5"
      >
        <ChatMessageList messages={items} />
      </div>

      <div className="space-y-4 border-t border-border/70 px-5 py-5">
        <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4">
          <p className="text-sm font-medium">Starter prompts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isLoading}
                onClick={() => onStarterPrompt?.(prompt)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-left text-xs text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="rounded-2xl border border-border bg-background shadow-xs">
          <form
            onSubmit={(event) => {
              event.preventDefault()

              if (!submitEnabled) {
                return
              }

              onSubmit?.(inputValue)
            }}
          >
            <textarea
              className="min-h-32 w-full resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Describe the website you want to build..."
              disabled={isLoading}
              value={inputValue}
              onChange={(event) => onInputChange?.(event.target.value)}
              onKeyDown={(event) => {
                if (
                  shouldSubmitPromptOnKeyDown({
                    enterKey: event.key === "Enter",
                    shiftKey: event.shiftKey,
                    isComposing: event.nativeEvent.isComposing,
                  }) &&
                  submitEnabled
                ) {
                  event.preventDefault()
                  onSubmit?.(inputValue)
                }
              }}
            />
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "Generating and saving the new HTML snapshot..."
                  : hasMessages
                    ? "Saved history loaded successfully."
                    : "Start with a prompt or use one of the examples above."}
              </p>
              <Button disabled={!submitEnabled}>
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
