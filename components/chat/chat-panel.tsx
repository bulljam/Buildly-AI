"use client"

import { useEffect, useRef } from "react"
import { SendHorizonal } from "lucide-react"

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

const followUpSuggestions = [
  "Refine the hero section",
  "Change the color palette",
  "Add a pricing section",
]

type ChatPanelProps = {
  compact?: boolean
  error?: string | null
  inputValue?: string
  isLoading?: boolean
  messages?: MessageRecord[]
  onInputChange?: (value: string) => void
  onSubmit?: (prompt: string) => void
}

export function ChatPanel({
  compact = false,
  error,
  inputValue = "",
  isLoading = false,
  messages = [],
  onInputChange,
  onSubmit,
}: ChatPanelProps) {
  const hasMessages = messages.length > 0
  const items = hasMessages ? messages : placeholderMessages
  const submitEnabled = canSubmitPrompt(inputValue, isLoading)
  const showSuggestions = items.length <= 4
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const latestMessageCount = items.length

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [latestMessageCount])

  return (
    <section
      className={`flex flex-col overflow-hidden rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] shadow-[0_20px_60px_rgba(37,99,235,0.1)] ${
        compact
          ? "scrollbar-none h-full min-h-0 overflow-y-auto shadow-none"
          : "min-h-[520px] lg:h-[calc(100svh-6.5rem)]"
      }`}
    >
      <div className="border-b border-[#E2E8F0] bg-[#F8FBFF] px-5 py-3 backdrop-blur">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#2563EB]">
          Chat
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="scrollbar-none flex-1 overflow-y-auto bg-gradient-to-b from-[#F8FBFF] via-transparent to-transparent px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-h-full flex-col">
          {showSuggestions ? (
            <div className="mb-4 rounded-[1.25rem] border border-[#D7E3F4] bg-white/90 p-3 shadow-[0_10px_30px_rgba(37,99,235,0.06)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#64748B]">
                Try next
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {followUpSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="rounded-full border border-[#D7E3F4] bg-[#F8FBFF] px-3 py-1.5 text-xs font-medium text-[#475569] transition hover:border-[#93C5FD] hover:bg-white hover:text-[#0F172A]"
                    disabled={isLoading}
                    onClick={() => onSubmit?.(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-auto">
            <ChatMessageList messages={items} />
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-[#E2E8F0] bg-[#F8FBFF] px-4 py-4 backdrop-blur">
        {error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="rounded-[1.35rem] border border-[#D7E3F4] bg-white shadow-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()

              if (!submitEnabled) {
                return
              }

              onSubmit?.(inputValue)
            }}
          >
            <div className="relative">
              <textarea
                className="scrollbar-none min-h-6 w-full resize-none bg-transparent px-4 py-2 pr-14 text-sm leading-5 text-[#0F172A] outline-none placeholder:text-[#64748B] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              <Button
                type="submit"
                disabled={!submitEnabled}
                size="icon"
                aria-label={isLoading ? "Generating website" : "Send prompt"}
                className="absolute right-3 bottom-2 rounded-full bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
              >
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
