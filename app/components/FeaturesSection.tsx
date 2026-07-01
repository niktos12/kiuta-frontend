"use client";

import { useLanguage } from "../store/languageStore";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: t("features.authentic.title"),
      desc: t("features.authentic.desc"),
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: t("features.delivery.title"),
      desc: t("features.delivery.desc"),
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: t("features.support.title"),
      desc: t("features.support.desc"),
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      title: t("features.prices.title"),
      desc: t("features.prices.desc"),
    },
  ];

  return (
    <section className="py-24">
      <div className="container">
        <AnimatedSection className="text-center mb-12" direction="up">
          <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
            {t("features.badge")}
          </span>
          <h2
            className="gradient-text mt-2 font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
          >
            {t("features.title")}
          </h2>
        </AnimatedSection>

        <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.1}>
          {features.map((f, i) => (
            <AnimatedItem key={i} direction="up">
              <div
                className="glass-card p-6 h-full transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/45 mb-4 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-[0.875rem] font-semibold mb-1.5">
                  {f.title}
                </h3>
                <p className="text-[0.78rem] text-white/32 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
