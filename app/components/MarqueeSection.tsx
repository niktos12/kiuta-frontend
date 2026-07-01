"use client";

import { useLanguage } from "../store/languageStore";

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Bose",
  "Google",
  "Dyson",
  "Garmin",
  "Bang & Olufsen",
  "DJI",
  "LG",
];

export default function MarqueeSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 border-y border-white/[0.05] overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* <div className="container mb-6"> */}
        <span className="absolute top-1/6 left-1/2 transform -translate-x-1/2 font-mono text-[0.65rem] text-white/25 tracking-[0.2em] uppercase text-center block ">
          {t("marquee.title")}
        </span>
      {/* </div> */}

      <div className="relative flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="mx-8 text-2xl md:text-3xl font-bold tracking-tight text-white/20 hover:text-white/40 transition-colors duration-300 cursor-default select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
