import { describe, expect, it } from "vitest"

import {
  DATABASE_NOT_READY_MESSAGE,
  DATABASE_SETUP_MESSAGE,
  getDatabaseSetupErrorMessage,
} from "@/lib/db/setup-status"

describe("database setup status helpers", () => {
  it("returns the setup message for a missing DATABASE_URL error", () => {
    expect(
      getDatabaseSetupErrorMessage(new Error("Missing DATABASE_URL."))
    ).toBe(DATABASE_SETUP_MESSAGE)
  })

  it("returns the generic not-ready message for other errors", () => {
    expect(getDatabaseSetupErrorMessage(new Error("sqlite locked"))).toBe(
      DATABASE_NOT_READY_MESSAGE
    )
  })

  it("returns the generic not-ready message for unknown error shapes", () => {
    expect(getDatabaseSetupErrorMessage("oops")).toBe(
      DATABASE_NOT_READY_MESSAGE
    )
  })
})
