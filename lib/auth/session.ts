import { createHmac, timingSafeEqual } from "node:crypto"

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const AUTH_REQUIRED_ERROR = "Authentication required."
export const SESSION_SECRET_MISSING_ERROR = "Missing AUTH_SESSION_SECRET."
export const SESSION_COOKIE_NAME = "buildly_session"

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30

type SessionPayload = {
  exp: number
  userId: string
}

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET?.trim()

  if (!secret) {
    throw new Error(SESSION_SECRET_MISSING_ERROR)
  }

  return secret
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url")
}

export function createSessionToken(userId: string, now = Date.now()) {
  const payload = encodeBase64Url(
    JSON.stringify({
      userId,
      exp: now + SESSION_DURATION_SECONDS * 1000,
    } satisfies SessionPayload)
  )

  return `${payload}.${signValue(payload)}`
}

export function verifySessionToken(token: string, now = Date.now()) {
  const [payload, signature] = token.split(".")

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = signValue(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedSignatureBuffer.length) {
    return null
  }

  if (!timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return null
  }

  const parsedPayload = JSON.parse(decodeBase64Url(payload)) as Partial<SessionPayload>

  if (
    typeof parsedPayload.userId !== "string" ||
    typeof parsedPayload.exp !== "number" ||
    parsedPayload.exp <= now
  ) {
    return null
  }

  return parsedPayload as SessionPayload
}

export async function getCurrentSessionUserId() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  return verifySessionToken(sessionToken)?.userId ?? null
}

export function applySessionCookie(response: NextResponse, userId: string) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(userId),
    httpOnly: true,
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}
