import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-cambiar-en-produccion";

function sign(value) {
  const hmac = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed) {
  if (!signed) return false;
  const [value, hmac] = signed.split(".");
  if (!value || !hmac) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  try {
    return (
      value === "admin" &&
      crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))
    );
  } catch {
    return false;
  }
}

export function checkPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || "changeme";
  return password === expected;
}

export function createSessionCookieValue() {
  return sign("admin");
}

export function isValidSessionCookieValue(value) {
  return verify(value);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
