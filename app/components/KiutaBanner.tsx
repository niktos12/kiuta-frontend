"use client";
import { CrystalIcon } from "./Crystal3D";
import Link from "next/link";
import { useLanguage } from "../store/languageStore";

export default function KiutaBanner() {
  const { t } = useLanguage();

  const footerLinks: Record<string, { label: string; href: string }[]> = {
    [t("footer.shop")]: [
      { label: t("footer.catalog"), href: "/catalog" },
      { label: t("footer.products"), href: "/products" },
      { label: t("footer.kiutaCard"), href: "/kiuta-card" },
    ],
    [t("footer.account")]: [
      { label: t("footer.profile"), href: "/profile" },
      { label: t("footer.wishlist"), href: "/wishlist" },
      { label: t("footer.signIn"), href: "/login" },
    ],
  };

  return (
    <footer className="relative border-t border-white/[0.05] mt-auto overflow-hidden pt-16">
      {/* Subtle aurora glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full bg-white/[0.015] blur-[100px] pointer-events-none" />

      <div className="container py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 no-underline text-inherit mb-3.5"
            >
              <CrystalIcon size={18} className="text-white/55" />
              <span className="text-[0.85rem] font-semibold tracking-[0.06em]">
                KIUTA
              </span>
            </Link>
            <p className="text-[0.75rem] text-white/22 leading-relaxed max-w-[220px]">
              {t("footer.desc")}
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2 mt-5">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                aria-label="Telegram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                aria-label="Instagram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all"
                aria-label="GitHub"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.21 0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-mono text-[0.65rem] text-white/28 uppercase tracking-[0.12em] mb-4">
                {title}
              </h4>
              <ul className="list-none flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={`${title}-${l.href}`}>
                    <Link
                      href={l.href}
                      className="text-[0.8rem] text-white/32 hover:text-white/75 no-underline transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-5">
        <div className="container py-5 flex items-center justify-between flex-wrap gap-3">
          <span className="font-mono text-[0.68rem] text-white/18">
            &copy; {new Date().getFullYear()} KIUTA. {t("footer.rights")}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[0.62rem] text-white/14">
              {t("footer.crystalPowered")}
            </span>
            <CrystalIcon size={11} className="text-white/[0.14]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
