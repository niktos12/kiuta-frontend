"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useLanguage } from "../store/languageStore";
import Link from "next/link";
import { CrystalIcon } from "./Crystal3D";

import "swiper/css";
import "swiper/css/effect-fade";

const slidesData = [
  {
    en: {
      badge: "New Arrival",
      title: "iPhone 16 Pro Max",
      desc: "Experience the most advanced iPhone ever with A18 Pro chip and 48MP camera system.",
      cta: "Shop Now",
    },
    ru: {
      badge: "Новинка",
      title: "iPhone 16 Pro Max",
      desc: "Испытайте самый продвинутый iPhone с чипом A18 Pro и камерой 48 МП.",
      cta: "Купить",
    },
    gradient: "from-white/[0.015] via-purple-500/[0.03] to-blue-500/[0.02]",
    accent: "text-purple-300/80",
  },
  {
    en: {
      badge: "Limited Edition",
      title: "MacBook Air M4",
      desc: "Supercharged by M4. Incredibly thin. Unbelievably powerful. Now in midnight.",
      cta: "Discover",
    },
    ru: {
      badge: "Лимитированная серия",
      title: "MacBook Air M4",
      desc: "Ускорен чипом M4. Невероятно тонкий. Невероятно мощный. Теперь в цвете midnight.",
      cta: "Узнать больше",
    },
    gradient: "from-blue-500/[0.02] via-transparent to-emerald-500/[0.02]",
    accent: "text-emerald-300/80",
  },
  {
    en: {
      badge: "Premium Audio",
      title: "AirPods Pro 3",
      desc: "Immersive sound with adaptive noise cancellation. Designed for comfort all day.",
      cta: "Listen Now",
    },
    ru: {
      badge: "Премиум аудио",
      title: "AirPods Pro 3",
      desc: "Погружающий звук с адаптивным шумоподавлением. Комфорт на весь день.",
      cta: "Слушать",
    },
    gradient: "from-emerald-500/[0.02] via-transparent to-amber-500/[0.02]",
    accent: "text-amber-300/80",
  },
];

export function HeroSwiper() {
  const { lang } = useLanguage();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="relative py-6 md:py-10">
      <div className="container">
        <div className="relative">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={800}
            loop
            allowTouchMove={false}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            style={{ height: "280px" }}
            className="hero-swiper w-full"
          >
            {slidesData.map((slide, i) => {
              const content = lang === "ru" ? slide.ru : slide.en;
              return (
                <SwiperSlide key={i}>
                  <div
                    className={`absolute inset-0 rounded-2xl border border-white/[0.06] overflow-hidden bg-gradient-to-r ${slide.gradient}`}
                  >
                    <div className="absolute inset-0 dot-pattern opacity-[0.08] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.02] blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] rounded-full bg-white/[0.01] blur-[60px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 lg:p-16 h-full">
                      <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          <span className="text-[0.65rem] font-mono text-white/40 tracking-wider uppercase">
                            {content.badge}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
                          {content.title}
                        </h2>
                        <p className="text-[0.82rem] text-white/35 leading-relaxed max-w-lg mb-6">
                          {content.desc}
                        </p>
                        <Link
                          href="/catalog"
                          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[0.82rem] font-medium transition-all duration-300 ${slide.accent} border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white`}
                        >
                          {content.cta}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>

                      <div className="hidden md:flex items-center justify-center w-40 lg:w-52 h-40 lg:h-52 relative">
                        <div className="absolute inset-0 rounded-full bg-white/[0.02] blur-[40px]" />
                        <CrystalIcon size={48} className="text-white/[0.06]" />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {slidesData.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideTo(i)}
              className="group/dot relative w-2 h-2 rounded-full bg-white/[0.1] hover:bg-white/30 transition-colors duration-300"
              aria-label={`Slide ${i + 1}`}
            >
              <span className="absolute inset-0 rounded-full bg-white/0 group-hover/dot:bg-white/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
