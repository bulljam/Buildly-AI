import { describe, expect, it, vi } from "vitest"

import {
  createSessionToken,
  SESSION_SECRET_MISSING_ERROR,
  verifySessionToken,
} from "@/lib/auth/session"

describe("session helpers", () => {
  it("creates and verifies a session token", () => {
    vi.stubEnv("AUTH_SESSION_SECRET", "test-session-secret")

    const token = createSessionToken("user-1", 100)
    const session = verifySessionToken(token, 200)

    expect(session).toEqual({
      userId: "user-1",
      exp: 2592000100,
    })

    vi.unstubAllEnvs()
  })

  it("rejects expired session tokens", () => {
    vi.stubEnv("AUTH_SESSION_SECRET", "test-session-secret")

    const token = createSessionToken("user-1", 100)

    expect(verifySessionToken(token, 2592000101)).toBeNull()

    vi.unstubAllEnvs()
  })

  it("throws when the session secret is missing", () => {
    vi.unstubAllEnvs()

    expect(() => createSessionToken("user-1")).toThrow(
      SESSION_SECRET_MISSING_ERROR
    )
  })
})
