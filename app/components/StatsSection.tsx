"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../store/languageStore";
import { AnimatedStagger, AnimatedItem } from "./AnimatedSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Stat {
  value: number;
  suffix: string;
  labelKey: string;
  decimals?: number;
}

export default function StatsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: Stat[] = [
    { value: 10000, suffix: "+", labelKey: "stats.products", decimals: 0 },
    { value: 50, suffix: "K+", labelKey: "stats.customers", decimals: 0 },
    { value: 99.8, suffix: "%", labelKey: "stats.satisfaction", decimals: 1 },
    { value: 24, suffix: "/7", labelKey: "stats.support", decimals: 0 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll<HTMLElement>(
        "[data-counter]",
      );
      items?.forEach((item) => {
        const target = parseFloat(item.dataset.target || "0");
        const decimals = parseInt(item.dataset.decimals || "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            once: true,
          },
          onUpdate: () => {
            const formatted =
              decimals > 0
                ? obj.val.toFixed(decimals)
                : Math.floor(obj.val).toLocaleString("en-US");
            item.textContent = formatted + (item.dataset.suffix || "");
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 aurora-bg opacity-50 pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-[0.04] pointer-events-none" />

      <div className="container relative z-10">
        <AnimatedStagger
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          stagger={0.12}
        >
          {stats.map((s, i) => (
            <AnimatedItem key={i} direction="scale">
              <div className="glass-card p-6 md:p-8 text-center relative overflow-hidden group">
                {/* Glow */}
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white/[0.04] blur-2xl animate-glow-pulse pointer-events-none" />

                <div
                  className="relative text-3xl md:text-4xl font-bold gradient-text mb-2 font-mono tabular-nums"
                  data-counter
                  data-target={s.value}
                  data-decimals={s.decimals}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </div>
                <div className="relative text-[0.68rem] font-mono text-white/30 uppercase tracking-wider">
                  {t(s.labelKey)}
                </div>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
