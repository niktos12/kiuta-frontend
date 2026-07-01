"use client";

import Link from "next/link";
import { JSX } from "react/jsx-runtime";
import { useLanguage } from "../store/languageStore";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";

const categorySlugs = ["smartphones", "laptops", "audio", "wearables", "accessories", "cameras"];
const categoryCounts: Record<string, number> = {
  smartphones: 24, laptops: 18, audio: 32, wearables: 15, accessories: 45, cameras: 12,
};

const icons: Record<string, JSX.Element> = {
  smartphones: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  laptops: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  audio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  wearables: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <polyline points="12 9 12 12 13.5 13.5" />
      <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83" />
      <path d="M7.49 6.65l.35-3.83A2 2 0 0 1 9.84 1h4.32a2 2 0 0 1 2 1.82l.35 3.83" />
    </svg>
  ),
  accessories: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  cameras: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
};

export default function CategoriesSection() {
  const { t } = useLanguage();

  return (
    <section className="pb-24">
      <div className="container">
        <AnimatedSection className="flex items-end justify-between mb-8" direction="up">
          <div>
            <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
              {t("categories.badge")}
            </span>
            <h2
              className="gradient-text mt-1.5 font-bold tracking-tight"
              style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
            >
              {t("categories.title")}
            </h2>
          </div>
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 text-[0.8rem] text-white/35 hover:text-white transition-colors duration-150"
          >
            {t("categories.viewAll")}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" stagger={0.08}>
          {categorySlugs.map((slug) => (
            <AnimatedItem key={slug} direction="up">
              <Link
                href={`/catalog?category=${slug}`}
                className="glass-card p-5 flex flex-col items-center text-center gap-3 no-underline text-inherit transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-white/40">
                  {icons[slug]}
                </div>
                <div>
                  <div className="text-[0.8rem] font-medium text-white/70">
                    {t(`catalog.cat.${slug}`)}
                  </div>
                  <div className="font-mono text-[0.65rem] text-white/22 mt-0.5">
                    {categoryCounts[slug]} {t("categories.items")}
                  </div>
                </div>
              </Link>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
