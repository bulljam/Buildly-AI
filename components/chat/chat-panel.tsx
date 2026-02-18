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
    <section className="flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-amber-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.94)_0%,_rgba(255,250,240,0.96)_100%)] shadow-[0_20px_60px_rgba(120,53,15,0.08)] lg:h-[calc(100svh-6.5rem)]">
      <div className="border-b border-amber-100 bg-white/75 px-5 py-4 backdrop-blur">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-amber-700/80">
          Chat
        </p>
        <p className="mt-2 truncate text-base font-semibold tracking-tight text-stone-900">
          {projectName || "Current project"}
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-white/50 via-amber-50/40 to-transparent px-4 py-4"
      >
        <ChatMessageList messages={items} />
      </div>

      <div className="space-y-3 border-t border-amber-100 bg-white/80 px-4 py-4 backdrop-blur">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-amber-200/80 bg-white/90 shadow-sm">
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
              className="min-h-36 w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 text-stone-900 outline-none placeholder:text-stone-400"
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
            <div className="flex items-center justify-between gap-3 border-t border-amber-100 px-4 py-3">
              <p className="text-[11px] leading-5 text-stone-500">
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
