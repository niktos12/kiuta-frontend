"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";
import { CrystalIcon } from "../components/Crystal3D";
import { useLanguage } from "../store/languageStore";
import { Breadcrumbs } from "../components/Breadcrumbs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusConfig(status: Order["status"], t: (key: string) => string) {
  const configs: Record<
    Order["status"],
    { label: string; color: string; bg: string; border: string; dot: string }
  > = {
    pending: {
      label: t("status.pending"),
      color: "text-amber-300/80",
      bg: "bg-amber-400/[0.06]",
      border: "border-amber-400/[0.12]",
      dot: "bg-amber-400/80",
    },
    processing: {
      label: t("status.processing"),
      color: "text-blue-300/80",
      bg: "bg-blue-400/[0.06]",
      border: "border-blue-400/[0.12]",
      dot: "bg-blue-400/80",
    },
    shipped: {
      label: t("status.shipped"),
      color: "text-violet-300/80",
      bg: "bg-violet-400/[0.06]",
      border: "border-violet-400/[0.12]",
      dot: "bg-violet-400/80",
    },
    delivered: {
      label: t("status.delivered"),
      color: "text-emerald-300/80",
      bg: "bg-emerald-400/[0.06]",
      border: "border-emerald-400/[0.12]",
      dot: "bg-emerald-400/80",
    },
    cancelled: {
      label: t("status.cancelled"),
      color: "text-red-300/80",
      bg: "bg-red-400/[0.06]",
      border: "border-red-400/[0.12]",
      dot: "bg-red-400/80",
    },
  };
  return configs[status];
}

export default function OrdersPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch {
        setError(t("orders.failedToLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="pb-20">
        <Breadcrumbs items={[{ label: t("nav.orders") }]} />
        <div className="container">
          <div className="max-w-[680px]">
            <div className="skeleton w-24 h-3.5 rounded mb-2" />
            <div className="skeleton w-48 h-9 rounded-lg mb-10" />
            <div className="skeleton h-52 rounded-xl mb-3" />
            <div className="skeleton h-52 rounded-xl mb-3" />
            <div className="skeleton h-52 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="pt-28 pb-20 text-center">
        <div className="container">
          <p className="text-white/35 mb-4">
            {t("orders.notSignedInDesc")}
          </p>
          <Link
            href="/login"
            className="text-[0.85rem] text-white underline"
          >
            {t("nav.signIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Breadcrumbs items={[{ label: t("nav.orders") }]} />
      <div className="container">
        <div className="max-w-[680px]">
          <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
            {t("orders.badge")}
          </span>
          <h1
            className="gradient-text mt-1.5 mb-10 font-bold tracking-tight"
            style={{ fontSize: "clamp(2rem,5vw,3rem)" }}
          >
            {t("orders.title")}
          </h1>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/[0.08] border border-red-500/[0.15] text-[0.8rem] text-red-300 mb-6">
              {error}
            </div>
          )}

          {/* Empty state */}
          {orders.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="glass-card inline-flex flex-col items-center gap-4 p-12">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-white/12"
                  aria-hidden="true"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <p className="text-[0.875rem] text-white/30">
                  {t("orders.empty")}
                </p>
                <Link
                  href="/catalog"
                  className="mt-2 px-5 py-2 rounded-lg bg-white text-black text-[0.82rem] font-medium no-underline"
                >
                  {t("orders.browseProducts")}
                </Link>
              </div>
            </div>
          )}

          {/* Orders list */}
          <div className="space-y-3">
            {orders.map((order) => {
              const status = getStatusConfig(order.status, t);
              return (
                <div key={order.id} className="glass-card p-6">
                  {/* Order header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[0.7rem] font-mono text-white/30">
                        {order.id}
                      </span>
                      <span className="w-px h-3 bg-white/[0.06]" />
                      <span className="text-[0.7rem] text-white/20">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-[0.65rem] font-mono font-medium rounded-md ${status.color} ${status.bg} border ${status.border} flex items-center gap-1.5`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.02]"
                      >
                        <div className="relative w-10 h-10 rounded-lg bg-white/[0.03] overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="40px"
                              className="object-cover opacity-80"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CrystalIcon
                                size={14}
                                className="text-white/[0.08]"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.8rem] text-white/70 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[0.65rem] text-white/30 font-mono mt-0.5">
                            {t("orders.qty")}: {item.quantity}
                          </p>
                        </div>
                        <span className="text-[0.8rem] font-medium text-white/80 flex-shrink-0">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-[0.75rem] text-white/30 font-mono uppercase tracking-wider">{t("orders.total")}</span>
                    <span className="text-lg font-semibold">
                      ${order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
