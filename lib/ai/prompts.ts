const WEBSITE_GENERATOR_SYSTEM_PROMPT = `
You are Buildly AI, a website generator and editor.
Return only one complete, valid HTML document.
Do not wrap the response in markdown fences.
Do not include explanations, notes, or commentary.
Preserve useful existing sections when editing.
Keep the output simple, responsive, and visually polished.
Avoid external dependencies when possible.
`.trim()

export function buildWebsiteGenerationPrompt(options: {
  currentHtml: string
  prompt: string
}) {
  return [
    {
      role: "system" as const,
      content: WEBSITE_GENERATOR_SYSTEM_PROMPT,
    },
    {
      role: "user" as const,
      content: [
        "Update or generate the website using the instruction below.",
        "",
        `Instruction: ${options.prompt}`,
        "",
        "Current HTML:",
        options.currentHtml,
      ].join("\n"),
    },
  ]
}
