"use client";

import {
  Crystal3D,
  CrystalIcon,
} from "../components/Crystal3D";
import { useLanguage } from "../store/languageStore";
import { Breadcrumbs } from "../components/Breadcrumbs";

export default function StorePage() {
  const { t } = useLanguage();

  const stats = [
    { value: "10K+", label: t("store.products") },
    { value: "50K+", label: t("store.customers") },
    { value: "99.8%", label: t("store.satisfaction") },
    { value: "24/7", label: t("store.support") },
  ];

  const values = [
    {
      title: t("store.values.curated.title"),
      desc: t("store.values.curated.desc"),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: t("store.values.pricing.title"),
      desc: t("store.values.pricing.desc"),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: t("store.values.compromise.title"),
      desc: t("store.values.compromise.desc"),
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: t("store.title") }]} />
      {/* Hero */}
      <section className="pt-8 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-[0.7rem] font-mono text-white/30 tracking-widest uppercase">
              {t("store.badge")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 leading-[0.95]">
              <span className="gradient-text">{t("store.title")}</span>
              <br />
              <span className="text-white/40">{t("store.subtitle")}</span>
            </h1>
            <p className="text-[0.9rem] text-white/35 mt-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              {t("store.desc")}
            </p>
          </div>

          {/* Crystal */}
          <div className="flex-shrink-0 relative">
            <div className="absolute w-[250px] h-[250px] rounded-full bg-white/[0.02] blur-[80px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="hidden sm:block">
              <Crystal3D size={280} interactive={true} speed={18} />
            </div>
            <div className="sm:hidden">
              <Crystal3D size={200} interactive={true} speed={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1.5">
                  {s.value}
                </div>
                <div className="text-[0.7rem] font-mono text-white/25 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[0.7rem] font-mono text-white/30 tracking-widest uppercase">
              {t("store.ourValues")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 gradient-text">
              {t("store.whatDrivesUs")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <div key={i} className="glass-card p-6 group">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/15 transition-all duration-300 mb-5">
                  {v.icon}
                </div>
                <h3 className="text-[0.95rem] font-semibold mb-2 text-white/80 group-hover:text-white transition-colors">
                  {v.title}
                </h3>
                <p className="text-[0.8rem] text-white/30 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Location */}
      <section className="pt-16 pb-20">
        <div className="container">
          <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto text-center">
            <CrystalIcon size={28} className="text-white/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3 gradient-text">
              {t("store.getInTouch")}
            </h2>
            <p className="text-[0.85rem] text-white/35 mb-8 max-w-md mx-auto">
              {t("store.touchDesc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[0.6rem] font-mono text-white/25 uppercase tracking-wider mb-1.5">
                  {t("store.emailLabel")}
                </div>
                <div className="text-[0.8rem] text-white/60">
                  hello@kiuta.com
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[0.6rem] font-mono text-white/25 uppercase tracking-wider mb-1.5">
                  {t("store.hoursLabel")}
                </div>
                <div className="text-[0.8rem] text-white/60">
                  Mon–Fri, 9–6 CET
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-[0.6rem] font-mono text-white/25 uppercase tracking-wider mb-1.5">
                  {t("store.locationLabel")}
                </div>
                <div className="text-[0.8rem] text-white/60">
                  Berlin, Germany
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}