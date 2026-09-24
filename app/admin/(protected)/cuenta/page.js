import Link from "next/link";
import { redirect } from "next/navigation";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import { isAdminRequest } from "@/lib/requireAdmin";

export default async function AccountPage() {
  const user = await isAdminRequest();
  if (!user) redirect("/admin/login");
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-ink-soft/70 transition-colors hover:text-ink"
        >
          ← Volver al panel
        </Link>
      </div>
      <h1 className="mb-2 font-display text-3xl">Mi cuenta</h1>
      <p className="mb-8 text-sm text-ink-soft/70">{user.name} · {user.email}</p>
      <h2 className="mb-4 font-display text-xl">Cambiar contraseña</h2>
      <PasswordChangeForm />
    </div>
  );
}
