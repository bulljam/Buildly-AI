import { DATABASE_URL_MISSING_ERROR } from "@/lib/db/prisma"

export const DATABASE_SETUP_MESSAGE =
  "DATABASE_URL is missing. Add it to your local .env file and run Prisma setup before creating projects."

export const DATABASE_NOT_READY_MESSAGE =
  "The database is not ready yet. Once Prisma is set up locally, your projects will appear here."

export function getDatabaseSetupErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === DATABASE_URL_MISSING_ERROR) {
    return DATABASE_SETUP_MESSAGE
  }

  return DATABASE_NOT_READY_MESSAGE
}
