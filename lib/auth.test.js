import test from "node:test";
import assert from "node:assert/strict";

import { verifyCredentials, createSessionCookieValue, getSessionUser } from "./auth.js";

test("single ADMIN_PASSWORD login works without a database user", async () => {
  process.env.ADMIN_PASSWORD = "admin123";
  process.env.ADMIN_SESSION_SECRET = "test-secret";

  const user = await verifyCredentials("admin123");

  assert.deepEqual(user, {
    id: "admin",
    name: "Administrador",
    email: "admin@local",
    role: "admin",
  });

  const cookieValue = createSessionCookieValue("admin");
  const sessionUser = await getSessionUser(cookieValue);

  assert.deepEqual(sessionUser, user);
});
