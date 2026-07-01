"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useLanguage } from "../store/languageStore";
import { AnimatedSection } from "./AnimatedSection";

/* ─── 3D Tilt card — follows mouse with perspective ─── */
function TiltCard({
  children,
  className = "",
  intensity = 12,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function ShowcaseSection() {
  const { t, lang } = useLanguage();

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      titleKey: "showcase.fast.title",
      descKey: "showcase.fast.desc",
      accent: "from-white/[0.06] to-transparent",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      titleKey: "showcase.secure.title",
      descKey: "showcase.secure.desc",
      accent: "from-white/[0.06] to-transparent",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
      titleKey: "showcase.global.title",
      descKey: "showcase.global.desc",
      accent: "from-white/[0.06] to-transparent",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-white/[0.01] blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <AnimatedSection className="text-center mb-14" direction="up">
          <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
            {t("showcase.badge")}
          </span>
          <h2
            className="gradient-text mt-2 font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
          >
            {t("showcase.title")}
          </h2>
          <p className="text-[0.85rem] text-white/40 mt-3 max-w-md mx-auto">
            {t("showcase.subtitle")}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <AnimatedSection
              key={i}
              direction="up"
              delay={i * 0.1}
              className="[perspective:1000px]"
            >
              <TiltCard
                className={`glass-card p-8 h-full bg-gradient-to-br ${f.accent}`}
                intensity={8}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/60 mb-6">
                  {f.icon}
                </div>
                <h3 className="text-[1.05rem] font-semibold mb-3 tracking-tight">
                  {t(f.titleKey)}
                </h3>
                <p className="text-[0.82rem] text-white/40 leading-relaxed">
                  {t(f.descKey)}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/[0.02] blur-2xl pointer-events-none" />
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom CTA row */}
        <AnimatedSection
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          direction="up"
          delay={0.3}
        >
          <Link
            href="/catalog"
            className="group px-7 py-3.5 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all flex items-center gap-2 magnetic-btn"
          >
            {t("showcase.cta1")}
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
            href="/store"
            className="px-7 py-3.5 border border-white/[0.1] text-white/60 rounded-xl text-[0.85rem] font-medium hover:border-white/20 hover:text-white transition-all"
          >
            {t("showcase.cta2")}
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
