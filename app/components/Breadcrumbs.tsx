"use client";

import Link from "next/link";
import { useLanguage } from "../store/languageStore";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { t } = useLanguage();

  return (
    <nav
      className="container pt-20 mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1.5 list-none text-[0.72rem]">
        <li>
          <Link
            href="/"
            className="font-mono text-white/28 hover:text-white/70 transition-colors duration-150"
          >
            {t("breadcrumbs.home")}
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/15"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            {item.href ? (
              <Link
                href={item.href}
                className="font-mono text-white/28 hover:text-white/70 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-mono text-white/45">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
