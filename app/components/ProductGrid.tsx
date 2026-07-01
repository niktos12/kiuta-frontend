"use client";

import { useEffect, useState } from "react";
import { ProductService } from "../services/product.service";
import { ProductCard } from "./ProductCard";
import { Product } from "../types/Product";
import Link from "next/link";
import { useLanguage } from "../store/languageStore";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";

export default function ProductGrid() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProductService.getAll()
      .then((data) => setProducts(data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="pb-32">
      <div className="container">
        <AnimatedSection className="flex items-end justify-between mb-8" direction="up">
          <div>
            <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
              {t("products.badge")}
            </span>
            <h2
              className="gradient-text mt-1.5 font-bold tracking-tight"
              style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
            >
              {t("products.title")}
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-[0.8rem] text-white/35 hover:text-white transition-colors duration-150"
          >
            {t("products.viewAll")}
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-[340px]" />
            ))}
          </div>
        ) : (
          <AnimatedStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.08}>
            {products.map((p) => (
              <AnimatedItem key={p.id} direction="up">
                <ProductCard product={p} />
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        )}
      </div>
    </section>
  );
}
