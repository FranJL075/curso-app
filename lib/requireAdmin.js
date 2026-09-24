import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, getSessionUser } from "@/lib/auth";

// Devuelve true si la request tiene una sesión de admin válida.
export async function isAdminRequest() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return getSessionUser(value);
}
