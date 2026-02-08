# Buildly AI

Buildly AI is a focused MVP for generating and refining a website through chat.

The app keeps one full HTML document per project, shows a live preview in a sandboxed iframe, stores project chat history, and lets you download the current HTML snapshot.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- SQLite
- Groq
- pnpm

## What Works

- Create and load projects
- Persist project chat history
- Persist the latest generated HTML per project
- Generate updated HTML through `/api/generate`
- Preview/code toggle
- Download the current HTML file

## Environment Variables

Create a local `.env` file with:

```env
GROQ_API_KEY=
GROQ_URL="https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL="openai/gpt-oss-20b"
DATABASE_URL="file:./dev.db"
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm exec prisma generate
```

Create the local SQLite database from the schema:

```bash
pnpm exec prisma db push
```

Start the dev server:

```bash
pnpm dev
```

Open Prisma Studio if you want a GUI for the database:

```bash
pnpm exec prisma studio
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
```

If Turbopack build behavior is flaky in your environment, you can verify production output with:

```bash
pnpm exec next build --webpack
```

## Database Setup

The app uses two core models:

- `Project`
- `Message`

Each project stores:

- project name
- current HTML snapshot
- timestamps

Each message stores:

- project relation
- role
- content
- timestamp

## Generation Flow

1. The user submits a prompt on a project page.
2. The app saves the user message.
3. The server sends the prompt plus current HTML to Groq.
4. The response is sanitized into one full HTML document.
5. The assistant message is saved.
6. The project `currentHtml` is updated.
7. The UI refreshes the chat and preview.

## Testing

The repo uses Vitest for slice-level tests.

Run the full suite with:

```bash
pnpm test
```

Current coverage includes:

- project schema validation
- database helper behavior
- project API routes
- generate API behavior
- HTML extraction
- chat UX helpers
- preview/download helpers

## MVP Limitations

- One HTML document per project
- No auth
- No project version history
- No streaming responses
- No multi-user collaboration
- No custom deployment flow
