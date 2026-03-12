import { describe, expect, it, vi } from "vitest"

const { authMock } = vi.hoisted(() => ({
  authMock: {
    AUTH_DUPLICATE_EMAIL_ERROR: "An account with this email already exists.",
    AUTH_INVALID_PASSWORD_ERROR: "Current password is incorrect.",
    getCurrentUser: vi.fn(),
    updateUserProfile: vi.fn(),
  },
}))

vi.mock("@/lib/auth/users", () => authMock)

import { PATCH } from "@/app/api/profile/route"

describe("PATCH /api/profile", () => {
  it("updates the current user profile", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
    })
    authMock.updateUserProfile.mockResolvedValueOnce({
      id: "user-1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatarDataUrl: "data:image/png;base64,abc123",
    })

    const response = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Jane Smith",
          email: "jane.smith@example.com",
          avatarDataUrl: "data:image/png;base64,abc123",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(authMock.updateUserProfile).toHaveBeenCalledWith("user-1", {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatarDataUrl: "data:image/png;base64,abc123",
    })
    expect(body).toEqual({
      user: {
        id: "user-1",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatarDataUrl: "data:image/png;base64,abc123",
      },
    })
  })

  it("returns 401 when the request is unauthenticated", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce(null)

    const response = await PATCH(new Request("http://localhost/api/profile"))
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      error: "Authentication required.",
    })
  })

  it("returns 400 for invalid payloads", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
    })

    const response = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: "old-password",
          newPassword: "new-password",
          confirmPassword: "different-password",
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

  it("returns 400 when the current password is wrong", async () => {
    authMock.getCurrentUser.mockResolvedValueOnce({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
    })
    authMock.updateUserProfile.mockRejectedValueOnce(
      new Error("Current password is incorrect.")
    )

    const response = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: "wrong-password",
          newPassword: "new-password",
          confirmPassword: "new-password",
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    )
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual({
      error: "Current password is incorrect.",
    })
  })
})
