import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "@/lib/db";

const COOKIE_NAME = "admin_session";
const SESSION_TTL = 60 * 60 * 8;

function sign(value) {
  if (!process.env.ADMIN_SESSION_SECRET) throw new Error("ADMIN_SESSION_SECRET no está configurada.");
  return crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(value).digest("hex");
}

function getStaticAdminUser() {
  return {
    id: "admin",
    name: process.env.ADMIN_NAME || "Administrador",
    email: process.env.ADMIN_EMAIL || "admin@local",
    role: "admin",
  };
}

export async function verifyCredentials(emailOrPassword, maybePassword) {
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();
  const submittedPassword = typeof emailOrPassword === "string" && maybePassword === undefined
    ? emailOrPassword
    : typeof maybePassword === "string"
      ? maybePassword
      : "";

  if (configuredPassword && submittedPassword === configuredPassword) {
    return getStaticAdminUser();
  }

  const normalizedEmail = typeof emailOrPassword === "string" && maybePassword !== undefined
    ? emailOrPassword.trim().toLowerCase()
    : "";

  if (!normalizedEmail) return null;

  const user = await getUserByEmail(normalizedEmail);
  if (!user || user.role !== "admin") return null;
  return (await bcrypt.compare(submittedPassword, user.password_hash)) ? user : null;
}

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function createSessionCookieValue(userId) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const value = `${userId}.${expiresAt}`;
  return `${value}.${sign(value)}`;
}

export async function getSessionUser(signed) {
  if (!signed) return null;
  const [userId, expiresAt, signature] = signed.split(".");
  if (!userId || !expiresAt || !signature) return null;
  if (userId !== "admin" && !/^\d+$/.test(userId)) return null;
  if (Number(expiresAt) < Math.floor(Date.now() / 1000)) return null;
  const expected = sign(`${userId}.${expiresAt}`);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  if (userId === "admin") return getStaticAdminUser();

  const user = await getUserById(userId);
  return user?.role === "admin" ? user : null;
}

export function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return { rawToken, tokenHash: crypto.createHash("sha256").update(rawToken).digest("hex") };
}

export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
