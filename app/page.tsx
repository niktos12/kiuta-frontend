"use client";

import { Hero } from "./components/Hero";
import { HeroSwiper } from "./components/HeroSwiper";
import FeaturesSection from "./components/FeaturesSection";
import CategoriesSection from "./components/Categories";
import ProductGrid from "./components/ProductGrid";
import StatsSection from "./components/StatsSection";
import ShowcaseSection from "./components/ShowcaseSection";
import CTASection from "./components/CTASection";
import MarqueeSection from "./components/MarqueeSection";

export default function HomePage() {
  return (
    <div>
      {/* Hero takes 100svh with its own paddingTop for header */}
      <Hero />
      {/* Brand marquee */}
      <MarqueeSection />
      {/* Promo swiper */}
      <div className="py-8 md:py-12">
        <HeroSwiper />
      </div>
      <FeaturesSection />
      <StatsSection />
      <CategoriesSection />
      <ProductGrid />
      <ShowcaseSection />
      <CTASection />
    </div>
  );
}
