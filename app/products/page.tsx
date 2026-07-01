"use client";

import { useEffect, useState, useMemo } from "react";
import { ProductService, CategoryService } from "../services/product.service";
import type { Category, Product } from "../types/Product";
import { ProductCard } from "../components/ProductCard";
import { useLanguage } from "../store/languageStore";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { AnimatedSection } from "../components/AnimatedSection";

type SortKey = "featured" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    Promise.all([
      ProductService.getAll(),
      CategoryService.getAll().catch(() => [] as Category[]),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Локализация названия категории по slug, фолбэк на имя из БД
  const getCategoryLabel = (cat: Category): string => {
    const key = `catalog.cat.${cat.slug}`;
    const translated = t(key);
    return translated !== key ? translated : cat.name;
  };

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q),
      );
    }

    // Category filter — по category_id
    if (activeCategoryId !== "all") {
      result = result.filter((p) => p.category_id === activeCategoryId);
    }

    // In-stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sort
    switch (sort) {
      case "priceAsc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "priceDesc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "nameAsc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "nameDesc":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      default:
        break;
    }

    return result;
  }, [products, search, activeCategoryId, inStockOnly, sort]);

  const clearAll = () => {
    setSearch("");
    setActiveCategoryId("all");
    setInStockOnly(false);
    setSort("featured");
  };

  const activeFiltersCount =
    (search.trim() ? 1 : 0) +
    (activeCategoryId !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (sort !== "featured" ? 1 : 0);

  // Ключ для перемонтирования сетки при смене фильтров —
  // решает баг с invisible карточками из-за whileInView + once:true
  const gridKey = `${activeCategoryId}-${inStockOnly}-${sort}-${search}`;

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: t("nav.products") }]} />
      <div className="container">
        <AnimatedSection className="mb-8" direction="up">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
                {t("products.allBadge")}
              </span>
              <h1
                className="gradient-text mt-1.5 font-bold tracking-tight"
                style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}
              >
                {t("nav.products")}
              </h1>
            </div>
            <span className="font-mono text-[0.7rem] text-white/30">
              {filtered.length} {t("filters.results")}
            </span>
          </div>
        </AnimatedSection>

        {/* Search bar */}
        <AnimatedSection className="mb-4" direction="up" delay={0.05}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("filters.searchPlaceholder")}
              className="input !pl-12 pr-4"
              aria-label={t("filters.search")}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </AnimatedSection>

        {/* Filter toolbar */}
        <AnimatedSection className="mb-6" direction="up" delay={0.1}>
          <div className="glass-card p-4 flex items-center gap-2 flex-wrap">
            {/* Category chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveCategoryId("all")}
                className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-medium border transition-all ${
                  activeCategoryId === "all"
                    ? "bg-white text-black border-transparent"
                    : "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                {t("filters.allCategories")}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[0.75rem] font-medium border transition-all ${
                    activeCategoryId === cat.id
                      ? "bg-white text-black border-transparent"
                      : "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/[0.08] mx-1 hidden sm:block" />

            {/* Sort dropdown */}
            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bg-white/[0.03] border border-white/[0.08] text-white/70 text-[0.78rem] rounded-lg pl-4 pr-9 py-2.5 cursor-pointer hover:border-white/20 transition-colors focus:border-white/30 focus:outline-none"
                aria-label={t("filters.sortBy")}
              >
                <option value="featured" className="bg-black">
                  {t("filters.sort.featured")}
                </option>
                <option value="priceAsc" className="bg-black">
                  {t("filters.sort.priceAsc")}
                </option>
                <option value="priceDesc" className="bg-black">
                  {t("filters.sort.priceDesc")}
                </option>
                <option value="nameAsc" className="bg-black">
                  {t("filters.sort.nameAsc")}
                </option>
                <option value="nameDesc" className="bg-black">
                  {t("filters.sort.nameDesc")}
                </option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {/* In-stock toggle */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-4 py-2.5 rounded-lg text-[0.78rem] font-medium border transition-all flex items-center gap-1.5 ${
                inStockOnly
                  ? "bg-white text-black border-transparent"
                  : "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t("filters.inStockOnly")}
            </button>

            {/* Clear all */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAll}
                className="px-3 py-2.5 rounded-lg text-[0.78rem] text-white/40 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                {t("filters.clear")}
              </button>
            )}
          </div>
        </AnimatedSection>

        {/* Results grid — key={gridKey} перемонтирует сетку при смене фильтров */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-[340px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/15">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-[0.95rem] text-white/40 mb-2">
              {t("filters.noResults")}
            </p>
            <p className="text-[0.8rem] text-white/25 mb-6">
              {t("filters.noResultsDesc")}
            </p>
            <button
              onClick={clearAll}
              className="px-5 py-2.5 rounded-lg bg-white text-black text-[0.8rem] font-medium hover:bg-white/90 transition-colors"
            >
              {t("filters.clear")}
            </button>
          </div>
        ) : (
          <div
            key={gridKey}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
