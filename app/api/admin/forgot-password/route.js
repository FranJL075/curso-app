import { NextResponse } from "next/server";
import { createResetToken } from "@/lib/auth";
import { createPasswordResetToken, getUserByEmail } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

const genericMessage = "Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña.";

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail) return NextResponse.json({ message: genericMessage });
  const user = await getUserByEmail(normalizedEmail);
  if (user) {
    const { rawToken, tokenHash } = createResetToken();
    await createPasswordResetToken(user.id, tokenHash, new Date(Date.now() + 60 * 60 * 1000));
    const baseUrl = process.env.APP_URL || new URL(request.url).origin;
    try {
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl: `${baseUrl}/admin/reset-password?token=${rawToken}` });
    } catch (error) {
      console.error(error);
    }
  }
  return NextResponse.json({ message: genericMessage });
}
