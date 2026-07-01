"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../types/Product";
import { useCart } from "../store/cartStore";
import { useWishlist } from "../store/wishlistStore";
import { CrystalIcon } from "./Crystal3D";
import { useLanguage } from "../store/languageStore";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const addItem = useCart((s) => s.addItem);
  const isInWishlist = useWishlist((s) =>
    s.items.some((i) => i.id === product.id),
  );
  const toggleWishlist = useWishlist((s) => s.toggleItem);

  return (
    <div className="glass-card group overflow-hidden flex flex-col">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-white/[0.02]"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CrystalIcon size={48} className="text-white/[0.06]" />
          </div>
        )}
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              title: product.title,
              slug: product.slug,
              image: product.image,
              price: product.price,
            });
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all"
          aria-label="Toggle wishlist"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* Stock badge */}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/[0.08] text-[0.65rem] text-white/60 font-mono">
            {product.stock} {t("product.left")}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[0.65rem] font-mono text-white/25 uppercase tracking-wider mb-1.5">
          {product.category_name || product.category?.name || "Electronics"}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[0.9rem] font-medium text-white/80 group-hover:text-white transition-colors mb-4 line-clamp-2">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[0.95rem] font-semibold">
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                title: product.title,
                slug: product.slug,
                image: product.image,
                price: product.price,
                quantity: 1,
              })
            }
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[0.75rem] font-medium text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-200"
          >
            {t("product.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
