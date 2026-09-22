import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="font-brand bg-[#393d36] text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="relative block h-[52px] w-[208px] overflow-hidden" aria-label="WeMaster">
          <Image
            src="/Logo_We_Master_Stand%204.jpg"
            alt="WeMaster"
            fill
            sizes="208px"
            className="object-cover object-center"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-lg font-semibold uppercase tracking-wide md:flex">
          <Link href="/#catalogo" className="transition-colors hover:text-brass hover:underline underline-offset-4">Prácticas</Link>
          <Link href="/#beneficios" className="transition-colors hover:text-brass hover:underline underline-offset-4">Beneficios</Link>
          <Link href="/#garantia" className="transition-colors hover:text-brass hover:underline underline-offset-4">Garantía</Link>
        </nav>
      </div>
    </header>
  );
}
