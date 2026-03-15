# Buildly AI

Buildly AI is a focused MVP for generating and refining a website through chat.

The app keeps one full HTML document per project, shows a live preview in a sandboxed iframe, stores project chat history, and lets you inspect the generated HTML in a built-in code view.

## Model Quality

Buildly AI is a BYOK (bring your own key) application. Generation quality, accuracy, and design sophistication depend heavily on the model you configure.

The app will work with lower-cost or free models, but those options often produce more limited, generic, or inconsistent results. For stronger output quality and more reliable edits, a premium model is recommended.

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

- Create, rename, and delete projects
- Browse projects from a dedicated projects page
- Persist project chat history
- Persist the latest generated HTML per project
- Generate updated HTML through `/api/generate`
- Preview/code toggle
- Email/password authentication
- Editable profile settings for name, email, password, and avatar

## Environment Variables

Create a local `.env` file with:

```env
GROQ_API_KEY=
GROQ_URL="https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL=
GROQ_MAX_COMPLETION_TOKENS="8192"
AUTH_SESSION_SECRET="replace-with-a-long-random-secret"
DATABASE_URL="file:./dev.db"
```

Set `GROQ_MODEL` to the Groq model you want to use. Because this is a BYOK app, the model you choose has a direct impact on output quality.

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

If your local database is behind the current schema and `db push` refuses to apply required changes, you can reset the local SQLite database with:

```bash
pnpm exec prisma db push --force-reset
```

This is appropriate for local development only and will delete existing local data.

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

The app uses three core models:

- `User`
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
- auth and profile validation
- database helper behavior
- project API routes
- generate API behavior
- HTML extraction
- chat UX helpers
- preview helpers
