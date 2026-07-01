"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductService } from "../services/product.service";
import { ProductCard } from "../components/ProductCard";
import { Product, Category } from "../types/Product";
import { useLanguage } from "../store/languageStore";
import { Breadcrumbs } from "../components/Breadcrumbs";

const categorySlugs: { id: string; slug: string }[] = [
  { id: "all", slug: "all" },
  { id: "smartphones", slug: "smartphones" },
  { id: "laptops", slug: "laptops" },
  { id: "audio", slug: "audio" },
  { id: "wearables", slug: "wearables" },
  { id: "accessories", slug: "accessories" },
  { id: "cameras", slug: "cameras" },
];

function CatalogContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = categorySlugs.map((cat) => ({
    ...cat,
    name: t(`catalog.cat.${cat.id}`),
  }));

  useEffect(() => {
    setLoading(true);
    const fetcher = activeCategory === "all"
      ? ProductService.getAll()
      : ProductService.getByCategory(activeCategory);
    fetcher.then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: t("catalog.title") }]} />
      <div className="container">
        <div className="mb-10">
          <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
            {t("catalog.badge")}
          </span>
          <h1
            className="gradient-text mt-1.5 font-bold tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}
          >
            {t("catalog.title")}
          </h1>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-[0.8rem] font-medium cursor-pointer transition-all duration-150 border ${
                activeCategory === cat.slug
                  ? "bg-white text-black border-transparent"
                  : "border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton rounded-2xl h-[340px]" />
              ))
            : products.length === 0
              ? <div className="col-span-full text-center py-20 text-white/25 text-[0.875rem]">{t("catalog.noProducts")}</div>
              : products.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>;
}
