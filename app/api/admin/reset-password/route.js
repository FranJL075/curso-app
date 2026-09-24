import { NextResponse } from "next/server";
import { hashPassword, hashResetToken } from "@/lib/auth";
import { consumePasswordResetToken, getValidPasswordResetToken, updateUserPassword } from "@/lib/db";

export async function POST(request) {
  const { token, newPassword, confirmPassword } = await request.json().catch(() => ({}));
  if (!token || typeof newPassword !== "string" || newPassword.length < 8 || newPassword !== confirmPassword) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres y coincidir." }, { status: 400 });
  }
  const resetToken = await getValidPasswordResetToken(hashResetToken(token));
  if (!resetToken) return NextResponse.json({ error: "El enlace no es válido o ya expiró." }, { status: 400 });
  const consumed = await consumePasswordResetToken(resetToken.id);
  if (!consumed) return NextResponse.json({ error: "El enlace no es válido o ya fue utilizado." }, { status: 400 });
  await updateUserPassword(consumed.user_id, await hashPassword(newPassword));
  return NextResponse.json({ ok: true });
}
