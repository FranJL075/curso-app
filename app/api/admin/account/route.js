import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/requireAdmin";
import { hashPassword } from "@/lib/auth";
import { updateUserPassword } from "@/lib/db";
import bcrypt from "bcryptjs";

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PUT(request) {
  const user = await isAdminRequest();
  if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { currentPassword, newPassword, confirmPassword } = await request.json().catch(() => ({}));
  if (!currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Revisa las contraseñas. La nueva debe tener al menos 8 caracteres." }, { status: 400 });
  }
  const { getUserByEmail } = await import("@/lib/db");
  const fullUser = await getUserByEmail(clean(user.email));
  if (!fullUser || !(await bcrypt.compare(currentPassword, fullUser.password_hash))) {
    return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 400 });
  }
  await updateUserPassword(user.id, await hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
