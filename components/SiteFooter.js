import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="font-brand bg-[#393d36] text-paper">
      <div className="mx-auto flex min-h-48 w-full max-w-6xl flex-col justify-center px-6 py-14 text-sm">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <nav className="flex flex-col gap-3 text-lg font-semibold uppercase tracking-wide">
            <Link href="/#catalogo" className="transition-colors hover:text-brass hover:underline underline-offset-4">Prácticas</Link>
            <Link href="/#beneficios" className="transition-colors hover:text-brass hover:underline underline-offset-4">Beneficios</Link>
            <Link href="/#garantia" className="transition-colors hover:text-brass hover:underline underline-offset-4">Garantía</Link>
          </nav>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <span className="relative block h-24 w-64 -translate-x-[30px] overflow-hidden md:translate-x-[35px]" aria-label="WeMaster">
              <Image
                src="/Logo_We_Master_Stand-2.jpg"
                alt="WeMaster"
                fill
                sizes="256px"
                className="object-cover object-left"
              />
            </span>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between gap-6 border-t border-paper/20 pt-5">
          <p className="text-lg tracking-normal text-paper/60">© 2026 WeMaster. All rights reserved.</p>
          <Link href="/admin/login" className="text-lg font-semibold uppercase tracking-wide text-paper transition-colors hover:text-brass hover:underline underline-offset-4">
            Ingreso administradores
          </Link>
        </div>
      </div>
    </footer>
  );
}
