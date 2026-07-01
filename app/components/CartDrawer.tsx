"use client";

import { useState, useEffect } from "react";
import { useCart } from "../store/cartStore";
import { CrystalIcon } from "./Crystal3D";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../store/languageStore";

export function CartDrawer() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    const handler = () => setOpen((o) => !o);
    window.addEventListener("toggle-cart", handler);
    return () => window.removeEventListener("toggle-cart", handler);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <CrystalIcon size={18} className="text-white/50" />
            <h2 className="text-[0.9rem] font-semibold">{t("cart.title")}</h2>
            <span className="text-[0.7rem] font-mono text-white/30">({items.length})</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white transition-all"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CrystalIcon size={48} className="text-white/[0.06] mb-4" />
              <p className="text-[0.85rem] text-white/30">{t("cart.empty")}</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-[0.8rem] text-white/40 hover:text-white transition-colors underline underline-offset-4"
              >
                {t("cart.continueShopping")}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] group"
              >
                <div className="relative w-16 h-16 rounded-xl bg-white/[0.03] overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CrystalIcon size={20} className="text-white/[0.08]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="text-[0.8rem] font-medium text-white/70 hover:text-white transition-colors line-clamp-1">
                    {item.title}
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[0.8rem] text-white/40 font-mono">x{item.quantity}</span>
                    <span className="text-[0.8rem] font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove item"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[0.8rem] text-white/40">{t("cart.total")}</span>
              <span className="text-lg font-semibold">${total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium text-center hover:bg-white/90 transition-all"
            >
              {t("cart.checkout")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
