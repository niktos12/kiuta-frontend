"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crystal3D } from "./Crystal3D";
import { useLanguage } from "../store/languageStore";

const content = {
  en: {
    badge: "Premium Electronics",
    title1: "Technology",
    title2: "reimagined.",
    desc1: "Curated selection of premium electronics.",
    desc2: "Minimal design. Maximum performance.",
    cta1: "Explore Catalog",
    cta2: "View Products",
  },
  ru: {
    badge: "Премиум электроника",
    title1: "Технологии",
    title2: "переосмыслены.",
    desc1: "Отборная коллекция премиальной электроники.",
    desc2: "Минималистичный дизайн. Максимальная производительность.",
    cta1: "Каталог",
    cta2: "Товары",
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { lang } = useLanguage();
  const t = content[lang];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Gradient orbs — animated with framer-motion */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.015] blur-[100px] pointer-events-none"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text — always first on mobile, left on desktop */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
              <span className="text-[0.7rem] font-mono text-white/50 tracking-wider uppercase">
                {t.badge}
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              <span className="gradient-text">{t.title1}</span>
              <br />
              <span className="text-white/40">{t.title2}</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-white/40 max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.3 }}
            >
              {t.desc1}
              <br className="hidden sm:block" />
              {t.desc2}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 }}
            >
              <Link
                href="/catalog"
                className="group px-6 py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all flex items-center gap-2"
              >
                {t.cta1}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 border border-white/[0.1] text-white/60 rounded-xl text-[0.85rem] font-medium hover:border-white/20 hover:text-white transition-all"
              >
                {t.cta2}
              </Link>
            </motion.div>
          </div>

          {/* Crystal — below text on mobile, right on desktop */}
          <motion.div
            className="flex-shrink-0 flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.4 }}
          >
            <div className="absolute w-[300px] h-[500px] lg:w-[450px] lg:h-[600px] rounded-full bg-white/[0.02] blur-[80px]" />
            <Crystal3D size={280} className="relative z-10 lg:hidden" />
            <Crystal3D size={400} className="relative z-10 hidden lg:block" />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[0.6rem] font-mono text-white/30 uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
