"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { Crystal3D } from "./Crystal3D";
import { useLanguage } from "../store/languageStore";
import { AnimatedSection } from "./AnimatedSection";

/* ─── Magnetic button — pulls toward cursor ─── */
function MagneticButton({
  children,
  href,
  className = "",
  strength = 0.3,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <AnimatedSection direction="scale" amount={0.3}>
          <div className="relative glass-card p-10 md:p-16 text-center overflow-hidden">
            {/* Aurora background */}
            <div className="absolute inset-0 aurora-bg pointer-events-none" />
            <div className="absolute inset-0 dot-pattern opacity-[0.06] pointer-events-none" />

            {/* Floating crystal — desktop only */}
            <div className="absolute -right-20 -top-20 opacity-30 pointer-events-none hidden lg:block">
              <Crystal3D size={280} interactive={false} speed={18} />
            </div>
            <div className="absolute -left-20 -bottom-20 opacity-20 pointer-events-none hidden lg:block rotate-180">
              <Crystal3D size={200} interactive={false} speed={22} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                <span className="text-[0.65rem] font-mono text-white/50 tracking-wider uppercase">
                  {t("cta.badge")}
                </span>
              </span>

              <h2
                className="gradient-text font-bold tracking-tight mb-4"
                style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)" }}
              >
                {t("cta.title")}
              </h2>
              <p className="text-[0.9rem] text-white/45 mb-8 leading-relaxed max-w-lg mx-auto">
                {t("cta.desc")}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <MagneticButton
                  href="/catalog"
                  strength={0.4}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-colors"
                >
                  {t("cta.button1")}
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
                </MagneticButton>
                <Link
                  href="/store"
                  className="px-7 py-3.5 border border-white/[0.1] text-white/60 rounded-xl text-[0.85rem] font-medium hover:border-white/20 hover:text-white transition-all"
                >
                  {t("cta.button2")}
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
