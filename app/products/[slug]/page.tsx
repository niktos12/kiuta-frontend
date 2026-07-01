"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ProductService } from "../../services/product.service";
import { Product } from "../../types/Product";
import { Crystal3D, CrystalIcon } from "../../components/Crystal3D";
import { ProductCard } from "../../components/ProductCard";
import { useCart } from "../../store/cartStore";
import { useWishlist } from "../../store/wishlistStore";
import { useLanguage } from "../../store/languageStore";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "../../components/AnimatedSection";

type Tab = "description" | "specs" | "shipping";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("description");
  const [quantity, setQuantity] = useState(1);
  const [imageZoomed, setImageZoomed] = useState(false);

  const addItem = useCart((s) => s.addItem);
  const wishlist = useWishlist((s) => s.items);
  const toggleWishlist = useWishlist((s) => s.toggleItem);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProduct(null);
    setTab("description");
    setQuantity(1);
    ProductService.getBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        // Fetch related (same category, excluding current)
        ProductService.getAll()
          .then((all) => {
            if (cancelled) return;
            const rel = all
              .filter(
                (p) =>
                  p.id !== data.id &&
                  p.category_id === data.category_id,
              )
              .slice(0, 4);
            setRelated(rel.length > 0 ? rel : all.filter((p) => p.id !== data.id).slice(0, 4));
          })
          .catch(() => {});
      })
      .catch((e) => {
        if (!cancelled) console.error(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const inWishlist = product
    ? wishlist.some((i) => i.id === product.id)
    : false;

  if (loading) {
    return (
      <div className="container pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl border border-white/[0.04] bg-white/[0.02] animate-shimmer" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded-full bg-white/[0.04] animate-shimmer" />
            <div className="h-10 w-3/4 rounded-xl bg-white/[0.04] animate-shimmer" />
            <div className="h-8 w-32 rounded-lg bg-white/[0.04] animate-shimmer" />
            <div className="h-20 w-full rounded-xl bg-white/[0.04] animate-shimmer mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container pt-28 pb-20 text-center">
        <CrystalIcon size={64} className="text-white/[0.06] mx-auto mb-6" />
        <h1 className="text-xl font-medium text-white/60 mb-4">
          {t("product.notFound")}
        </h1>
        <Link
          href="/products"
          className="text-[0.85rem] text-white/40 hover:text-white transition-colors underline underline-offset-4"
        >
          {t("product.backToProducts")}
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      slug: product.slug,
      image: product.image,
      price: product.price,
      quantity,
    });
    toast.success(t("product.addedToCart"));
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      slug: product.slug,
      image: product.image,
      price: product.price,
    });
    toast.success(inWishlist ? t("product.removedFromWishlist") : t("product.addedToWishlist"));
  };

  // Fake specs derived from product
  const specs = [
    { label: t("product.specs.sku"), value: product.slug.toUpperCase().replace(/-/g, "").slice(0, 8) },
    { label: t("product.specs.brand"), value: product.title.split(" ")[0] },
    { label: t("product.category"), value: product.category_name || product.category?.name || "—" },
    { label: t("product.specs.warranty"), value: "12 months" },
    { label: t("product.specs.weight"), value: "0.5 kg" },
    { label: t("product.specs.dimensions"), value: "15 × 10 × 2 cm" },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: t("product.tabs.description") },
    { id: "specs", label: t("product.tabs.specs") },
    { id: "shipping", label: t("product.tabs.shipping") },
  ];

  return (
    <div className="pb-20">
      <Breadcrumbs
        items={[
          { label: t("nav.products"), href: "/products" },
          { label: product.category_name || product.category?.name || product.title },
        ]}
      />
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start pt-24">
          {/* Image */}
          <AnimatedSection direction="right" className="relative">
            <motion.button
              type="button"
              onClick={() => setImageZoomed(!imageZoomed)}
              className="relative aspect-square w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-zoom-in block"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500"
                  style={{ transform: imageZoomed ? "scale(1.5)" : "scale(1)" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Crystal3D size={200} interactive={true} />
                </div>
              )}
            </motion.button>
            {/* Zoom hint */}
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/[0.08] text-[0.62rem] font-mono text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              Click to zoom
            </div>
          </AnimatedSection>

          {/* Info */}
          <div className="lg:sticky lg:top-28">
            <AnimatedSection direction="left">
              <span className="text-[0.7rem] font-mono text-white/30 uppercase tracking-widest">
                {product.category_name || product.category?.name || "Electronics"}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-2xl font-semibold">
                  ${(product.price * quantity).toLocaleString()}
                </span>
                {quantity > 1 && (
                  <span className="text-[0.7rem] font-mono text-white/30">
                    ${product.price.toLocaleString()} × {quantity}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="text-[0.7rem] font-mono text-emerald-400/70 bg-emerald-400/10 px-2.5 py-0.5 rounded-md border border-emerald-400/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                    {t("product.inStock")}
                  </span>
                ) : (
                  <span className="text-[0.7rem] font-mono text-red-400/70 bg-red-400/10 px-2.5 py-0.5 rounded-md border border-red-400/10">
                    {t("product.outOfStock")}
                  </span>
                )}
              </div>

              {/* Quantity selector + Actions */}
              <div className="flex items-center gap-3 mb-6">
                {/* Quantity */}
                <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-30"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="w-12 text-center text-[0.9rem] font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-30"
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                  {t("product.addToCart")}
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                    inWishlist
                      ? "border-white/20 bg-white/[0.06] text-white"
                      : "border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={inWishlist ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t border-white/[0.06] pt-6">
                <div className="flex gap-1 mb-5 border-b border-white/[0.06]">
                  {tabs.map((tabItem) => (
                    <button
                      key={tabItem.id}
                      onClick={() => setTab(tabItem.id)}
                      className={`relative px-4 py-2.5 text-[0.8rem] font-medium transition-colors -mb-px border-b-2 ${
                        tab === tabItem.id
                          ? "text-white border-white"
                          : "text-white/40 border-transparent hover:text-white/70"
                      }`}
                    >
                      {tabItem.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab === "description" && (
                      <p className="text-[0.85rem] text-white/50 leading-relaxed">
                        {product.description || t("product.notFoundDesc")}
                      </p>
                    )}
                    {tab === "specs" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {specs.map((s) => (
                          <div
                            key={s.label}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                          >
                            <span className="text-[0.7rem] font-mono text-white/30 uppercase tracking-wider">
                              {s.label}
                            </span>
                            <span className="text-[0.8rem] text-white/70 font-medium">
                              {s.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {tab === "shipping" && (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                              <rect x="1" y="3" width="15" height="13" rx="2" />
                              <path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1" />
                              <circle cx="5.5" cy="18.5" r="2.5" />
                              <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[0.8rem] font-medium text-white/70 mb-1">
                              {t("product.shipping")}
                            </p>
                            <p className="text-[0.78rem] text-white/40 leading-relaxed">
                              {t("product.shippingDesc")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                              <polyline points="1 4 1 10 7 10" />
                              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[0.8rem] font-medium text-white/70 mb-1">
                              {t("product.returns")}
                            </p>
                            <p className="text-[0.78rem] text-white/40 leading-relaxed">
                              {t("product.returnsDesc")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <AnimatedSection className="mt-24" direction="up">
            <div className="flex items-end justify-between mb-8">
              <h2
                className="gradient-text font-bold tracking-tight"
                style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}
              >
                {t("product.related")}
              </h2>
              <Link
                href="/products"
                className="text-[0.8rem] text-white/35 hover:text-white transition-colors flex items-center gap-1.5"
              >
                {t("products.viewAll")}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <AnimatedStagger
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              stagger={0.08}
            >
              {related.map((p) => (
                <AnimatedItem key={p.id} direction="up">
                  <ProductCard product={p} />
                </AnimatedItem>
              ))}
            </AnimatedStagger>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
