"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../store/cartStore";
import { useAuth } from "../providers/AuthProvider";
import { CrystalIcon } from "../components/Crystal3D";
import { useLanguage } from "../store/languageStore";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { items, clear } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clear();
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="container">
          <div className="max-w-sm mx-auto text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/[0.12] mx-auto mb-6">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-emerald-400"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight mb-2">
              {t("checkout.orderPlaced")}
            </h1>
            <p className="text-[0.85rem] text-white/40 mb-8">
              {t("checkout.orderPlacedDesc")}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/orders"
                className="px-6 py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all"
              >
                {t("checkout.viewOrders")}
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-white/[0.1] text-white/60 rounded-xl text-[0.85rem] font-medium hover:bg-white/[0.04] hover:text-white transition-all"
              >
                {t("checkout.home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="container">
          <div className="max-w-sm mx-auto text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] mx-auto mb-6">
              <CrystalIcon size={28} className="text-white/20" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight mb-2">
              {t("checkout.empty")}
            </h1>
            <p className="text-[0.85rem] text-white/40 mb-8">
              {t("checkout.emptyDesc")}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all"
            >
              {t("checkout.browseProducts")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-xl font-semibold tracking-tight">{t("checkout.title")}</h1>
            <p className="text-[0.8rem] text-white/40 mt-1">
              {t("checkout.desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact */}
                <div className="glass-card p-6">
                  <h3 className="text-[0.9rem] font-semibold mb-5">
                    {t("checkout.contact")}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] font-medium text-white/30 uppercase tracking-wider">
                        {t("checkout.email")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] font-medium text-white/30 uppercase tracking-wider">
                        {t("checkout.fullName")}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="glass-card p-6">
                  <h3 className="text-[0.9rem] font-semibold mb-5">
                    {t("checkout.shipping")}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[0.7rem] font-medium text-white/30 uppercase tracking-wider">
                        {t("checkout.address")}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="input"
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[0.7rem] font-medium text-white/30 uppercase tracking-wider">
                          {t("checkout.city")}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="input"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[0.7rem] font-medium text-white/30 uppercase tracking-wider">
                          {t("checkout.zipCode")}
                        </label>
                        <input
                          type="text"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="input"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                      {t("checkout.processing")}
                    </span>
                  ) : (
                    `${t("checkout.placeOrder")} · $${total.toLocaleString()}`
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="text-[0.9rem] font-semibold mb-5">
                  {t("checkout.title")}
                  <span className="text-[0.7rem] font-mono text-white/30 ml-2">
                    ({items.length} {items.length === 1 ? t("checkout.item") : t("checkout.items")})
                  </span>
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="relative w-12 h-12 rounded-lg bg-white/[0.03] overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CrystalIcon
                              size={16}
                              className="text-white/[0.08]"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.8rem] text-white/70 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[0.7rem] text-white/30 font-mono mt-0.5">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-[0.8rem] font-medium flex-shrink-0">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/[0.06] pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] text-white/40">
                      {t("checkout.subtotal")}
                    </span>
                    <span className="text-[0.8rem] text-white/70">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] text-white/40">
                      {t("checkout.shippingLabel")}
                    </span>
                    <span className="text-[0.8rem] text-white/70">
                      {shipping === 0 ? (
                        <span className="text-emerald-400/70">{t("checkout.free")}</span>
                      ) : (
                        `$${shipping}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[0.7rem] text-white/25">
                      {t("checkout.shippingFree")}
                    </p>
                  )}
                  <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                    <span className="text-[0.85rem] font-medium">{t("checkout.total")}</span>
                    <span className="text-lg font-semibold">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}