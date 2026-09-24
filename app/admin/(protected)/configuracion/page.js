import SiteSettingsForm from "@/components/SiteSettingsForm";
import { getSiteSetting } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const bannerUrl = await getSiteSetting("courses_banner_url");
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl">Configuración</h1>
      <p className="mb-8 text-sm text-ink-soft/70">Ajustes generales del sitio.</p>
      <h2 className="mb-4 font-display text-xl">Banner de cursos</h2>
      <SiteSettingsForm initialBannerUrl={bannerUrl || ""} />
    </div>
  );
}
