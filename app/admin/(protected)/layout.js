import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminRequest } from "@/lib/requireAdmin";
import LogoutButton from "@/components/LogoutButton";

export default async function ProtectedAdminLayout({ children }) {
  const authed = await isAdminRequest();
  if (!authed) redirect("/admin/login");

  return (
    <div className="flex-1 flex flex-col bg-paper">
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <a href="/admin" className="font-display text-lg">
            Panel de administración
          </a>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-paper/70 hover:text-paper">
              Ver sitio público
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="flex-1 mx-auto max-w-5xl w-full px-6 py-10">{children}</div>
    </div>
  );
}
