"use client"

import { useEffect, useRef } from "react"

import type { MessageRecord } from "@/lib/schemas/message"

import { ChatMessageList } from "@/components/chat/chat-message-list"
import { Button } from "@/components/ui/button"
import { shouldSubmitPromptOnKeyDown } from "@/lib/builder/chat-ux"
import { canSubmitPrompt } from "@/lib/builder/generate-state"

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
  onSubmit?: (prompt: string) => void
  projectName?: string
}

export function ChatPanel({
  error,
  inputValue = "",
  isLoading = false,
  messages = [],
  onInputChange,
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
    <section className="flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-sm lg:h-[calc(100svh-6.5rem)]">
      <div className="border-b border-border/70 bg-background/70 px-5 py-4 backdrop-blur">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Chat
        </p>
        <p className="mt-2 truncate text-base font-semibold tracking-tight">
          {projectName || "Current project"}
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-background/20 to-transparent px-4 py-4"
      >
        <ChatMessageList messages={items} />
      </div>

      <div className="space-y-3 border-t border-border/70 bg-background/80 px-4 py-4 backdrop-blur">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-border bg-background shadow-xs">
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
              className="min-h-36 w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 outline-none placeholder:text-muted-foreground"
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
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="text-[11px] leading-5 text-muted-foreground">
                {isLoading
                  ? "Generating and saving the new HTML snapshot..."
                  : hasMessages
                    ? "Saved history loaded successfully."
                    : "Start with a prompt to generate your first website."}
              </p>
              <Button disabled={!submitEnabled} className="rounded-full px-4">
                {isLoading ? "Generating..." : "Generate"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
