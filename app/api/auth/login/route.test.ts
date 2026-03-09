import { describe, expect, it, vi } from "vitest"

const { sessionMock, usersMock } = vi.hoisted(() => ({
  sessionMock: {
    applySessionCookie: vi.fn(),
    SESSION_SECRET_MISSING_ERROR: "Missing AUTH_SESSION_SECRET.",
  },
  usersMock: {
    authenticateUser: vi.fn(),
  },
}))

vi.mock("@/lib/auth/session", () => sessionMock)
vi.mock("@/lib/auth/users", () => usersMock)

import { POST } from "@/app/api/auth/login/route"

describe("POST /api/auth/login", () => {
  it("logs in a valid user and sets a session cookie", async () => {
    usersMock.authenticateUser.mockResolvedValueOnce({
      id: "user-1",
      email: "user@example.com",
      name: "Jane Doe",
    })

    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          password: "supersecret",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(usersMock.authenticateUser).toHaveBeenCalledWith({
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

  it("returns 401 for invalid credentials", async () => {
    usersMock.authenticateUser.mockResolvedValueOnce(null)

    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
          password: "wrong-password",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Invalid email or password.",
    })
  })

  it("rejects invalid payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "user@example.com",
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
      error: "Password must be at least 8 characters.",
    })
  })
})
