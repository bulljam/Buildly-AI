import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const PASSWORD_HASH_KEY_LENGTH = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, PASSWORD_HASH_KEY_LENGTH).toString(
    "hex"
  )

  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(":")

  if (!salt || !expectedHash) {
    return false
  }

  const passwordHashBuffer = scryptSync(password, salt, PASSWORD_HASH_KEY_LENGTH)
  const expectedHashBuffer = Buffer.from(expectedHash, "hex")

  if (passwordHashBuffer.length !== expectedHashBuffer.length) {
    return false
  }

  return timingSafeEqual(passwordHashBuffer, expectedHashBuffer)
}
