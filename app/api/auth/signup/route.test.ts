import { describe, expect, it, vi } from "vitest"

const { sessionMock, usersMock } = vi.hoisted(() => ({
  sessionMock: {
    applySessionCookie: vi.fn(),
    SESSION_SECRET_MISSING_ERROR: "Missing AUTH_SESSION_SECRET.",
  },
  usersMock: {
    AUTH_DUPLICATE_EMAIL_ERROR: "An account with this email already exists.",
    createUser: vi.fn(),
  },
}))

vi.mock("@/lib/auth/session", () => sessionMock)
vi.mock("@/lib/auth/users", () => usersMock)

import { POST } from "@/app/api/auth/signup/route"

describe("POST /api/auth/signup", () => {
  it("creates an account and sets a session cookie", async () => {
    usersMock.createUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
      name: "Jane Doe",
    })

    const response = await POST(
      new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Jane Doe",
          confirmPassword: "supersecret",
          email: "user@example.com",
          password: "supersecret",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(usersMock.createUser).toHaveBeenCalledWith({
      fullName: "Jane Doe",
      email: "user@example.com",
      password: "supersecret",
    })
    expect(sessionMock.applySessionCookie).toHaveBeenCalled()
    expect(body).toEqual({
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "Jane Doe",
      },
    })
  })

  it("rejects invalid payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: "J",
          confirmPassword: "short",
          email: "not-an-email",
          password: "short",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      error: "Enter a valid email address.",
    })
  })

  it("returns 409 when the email already exists", async () => {
    usersMock.createUser.mockRejectedValueOnce(
      new Error("An account with this email already exists.")
    )

    const response = await POST(
      new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Jane Doe",
          confirmPassword: "supersecret",
          email: "user@example.com",
          password: "supersecret",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body).toEqual({
      error: "An account with this email already exists.",
    })
  })

  it("rejects password confirmation mismatches", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Jane Doe",
          confirmPassword: "different-password",
          email: "user@example.com",
          password: "supersecret",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      error: "Passwords do not match.",
    })
  })
})
