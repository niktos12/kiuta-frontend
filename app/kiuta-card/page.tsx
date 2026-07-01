"use client";

import { useAuth } from "../providers/AuthProvider";
import { CrystalIcon } from "../components/Crystal3D";
import Link from "next/link";
import { useLanguage } from "../store/languageStore";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedItem,
} from "../components/AnimatedSection";
import { motion } from "framer-motion";
import Accordion from "../components/Accordion";

function BenefitIcon({ type }: { type: string }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "truck":
      return (
        <svg {...props} aria-hidden="true">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "zap":
      return (
        <svg {...props} aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "tag":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "headset":
      return (
        <svg {...props} aria-hidden="true">
          <path d="M3 18v-6a9 9 0 0118 0v6" />
          <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
        </svg>
      );
    case "rotate":
      return (
        <svg {...props} aria-hidden="true">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
      );
    case "gift":
      return (
        <svg {...props} aria-hidden="true">
          <polyline points="20 12 20 22 4 22 4 12" />
          <rect x="2" y="7" width="20" height="5" />
          <line x1="12" y1="22" x2="12" y2="7" />
          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function KiutaCardPage() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const benefits = [
    {
      title: t("kiutaCard.freeShipping"),
      desc: t("kiutaCard.freeShippingDesc"),
      icon: "truck",
    },
    {
      title: t("kiutaCard.earlyAccess"),
      desc: t("kiutaCard.earlyAccessDesc"),
      icon: "zap",
    },
    {
      title: t("kiutaCard.exclusiveDeals"),
      desc: t("kiutaCard.exclusiveDealsDesc"),
      icon: "tag",
    },
    {
      title: t("kiutaCard.prioritySupport"),
      desc: t("kiutaCard.prioritySupportDesc"),
      icon: "headset",
    },
    {
      title: t("kiutaCard.extendedReturns"),
      desc: t("kiutaCard.extendedReturnsDesc"),
      icon: "rotate",
    },
    {
      title: t("kiutaCard.birthdayRewards"),
      desc: t("kiutaCard.birthdayRewardsDesc"),
      icon: "gift",
    },
  ];

  const tiers = [
    {
      name: t("kiutaCard.tier.free"),
      minPoints: 0,
      maxPoints: 5000,
      discount: "0%",
      perks: [t("kiutaCard.freeShipping"), t("kiutaCard.earlyAccess")],
      current: false,
    },
    {
      name: t("kiutaCard.tier.crystal"),
      minPoints: 5000,
      maxPoints: 25000,
      discount: "5%",
      perks: [
        t("kiutaCard.freeShipping"),
        t("kiutaCard.earlyAccess"),
        t("kiutaCard.exclusiveDeals"),
        t("kiutaCard.prioritySupport"),
      ],
      current: true,
    },
    {
      name: t("kiutaCard.tier.black"),
      minPoints: 25000,
      maxPoints: 100000,
      discount: "15%",
      perks: [
        t("kiutaCard.freeShipping"),
        t("kiutaCard.earlyAccess"),
        t("kiutaCard.exclusiveDeals"),
        t("kiutaCard.prioritySupport"),
        t("kiutaCard.extendedReturns"),
        t("kiutaCard.birthdayRewards"),
      ],
      current: false,
    },
  ];

  const transactions = [
    {
      type: "earn",
      title: t("kiutaCard.transaction.earn"),
      points: 1250,
      date: "2026-01-15",
    },
    {
      type: "bonus",
      title: t("kiutaCard.transaction.bonus"),
      points: 5000,
      date: "2025-12-01",
    },
    {
      type: "earn",
      title: t("kiutaCard.transaction.earn"),
      points: 890,
      date: "2025-11-22",
    },
    {
      type: "redeem",
      title: t("kiutaCard.transaction.redeem"),
      points: -2000,
      date: "2025-11-10",
    },
    {
      type: "earn",
      title: t("kiutaCard.transaction.earn"),
      points: 2100,
      date: "2025-10-28",
    },
  ];

  const faqItems = [
    {
      question:
        lang === "ru"
          ? "Как получить KIUTA Card?"
          : "How do I get a KIUTA Card?",
      answer:
        lang === "ru"
          ? "Карта выдаётся автоматически при регистрации на сайте. Базовый уровень Free активируется сразу, дальнейшие уровни — по мере накопления баллов."
          : "The card is issued automatically upon registration. The Free tier activates immediately, higher tiers unlock as you accumulate points.",
    },
    {
      question:
        lang === "ru" ? "Как начисляются баллы?" : "How are points earned?",
      answer:
        lang === "ru"
          ? "Баллы начисляются за каждую покупку из расчёта 1 балл за каждый потраченный доллар. Дополнительные баллы начисляются в дни рождения и по спецпредложениям."
          : "Points are earned on every purchase at a rate of 1 point per $1 spent. Bonus points are awarded on birthdays and special promotions.",
    },
    {
      question:
        lang === "ru"
          ? "Можно ли обменять баллы на скидку?"
          : "Can I redeem points for a discount?",
      answer:
        lang === "ru"
          ? "Да. 1000 баллов = $10 скидки. Обмен доступен в корзине при оформлении заказа."
          : "Yes. 1000 points = $10 discount. Redemption is available in the cart at checkout.",
    },
    {
      question: lang === "ru" ? "Сгорают ли баллы?" : "Do points expire?",
      answer:
        lang === "ru"
          ? "Баллы не сгорают, пока аккаунт активен. При отсутствии покупок более 12 месяцев карта переводится в неактивный статус."
          : "Points do not expire as long as the account is active. After 12 months without purchases, the card moves to inactive status.",
    },
  ];

  const maskedNumber = "•••• •••• •••• 4829";
  const points = 12480;
  const tier = "Crystal";
  const pointsToNext = 25000 - points;

  return (
    <div className="pb-24">
      <Breadcrumbs items={[{ label: t("kiutaCard.title") }]} />
      <div className="container">
        <AnimatedSection className="text-center mb-14" direction="up">
          <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
            {t("kiutaCard.badge")}
          </span>
          <h1
            className="gradient-text mt-1.5 font-bold tracking-tight"
            style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}
          >
            {t("kiutaCard.title")}
          </h1>
          <p className="mt-4 text-white/35 text-base max-w-md mx-auto leading-relaxed">
            {t("kiutaCard.desc")}
          </p>
        </AnimatedSection>

        {/* Card */}
        <AnimatedSection className="max-w-lg mx-auto mb-16" direction="scale">
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden opacity-60">
              <div className="absolute inset-0 animate-shimmer rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl" />
            </div>

            <div className="relative rounded-2xl bg-black backdrop-blur-xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.01]" />
              <div className="absolute inset-0 dot-pattern-dense opacity-[0.15]" />
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/[0.02] blur-[80px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-20">
                  <div className="flex items-center gap-2.5">
                    <CrystalIcon size={18} className="text-white/60" />
                    <span className="text-[0.9rem] font-bold tracking-tight">
                      KIUTA
                    </span>
                  </div>
                  <span className="text-[0.6rem] font-mono text-white/30 bg-white/[0.04] px-3 py-1.5 rounded-md border border-white/[0.06] uppercase tracking-[0.15em]">
                    {tier} {t("kiutaCard.tier")}
                  </span>
                </div>

                <div className="font-mono text-[0.95rem] text-white/40 tracking-[0.25em] mb-10 select-none">
                  {maskedNumber}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-[0.55rem] font-mono text-white/20 uppercase tracking-[0.2em] mb-1.5">
                      {t("kiutaCard.cardholder")}
                    </div>
                    <div className="text-[0.85rem] font-medium text-white/70">
                      {user?.name || user?.email || t("kiutaCard.guestMember")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.55rem] font-mono text-white/20 uppercase tracking-[0.2em] mb-1.5">
                      {t("kiutaCard.points")}
                    </div>
                    <div className="text-[1.2rem] font-bold tracking-tight tabular-nums">
                      {points.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animated progress bar */}
          <div className="mt-6 px-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.6rem] font-mono text-white/20 uppercase tracking-[0.15em]">
                {t("kiutaCard.nextTier")}
              </span>
              <span className="text-[0.6rem] font-mono text-white/40">
                {pointsToNext.toLocaleString()} {t("kiutaCard.pointsToNext")}
              </span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-white/30 to-white/60"
                initial={{ width: 0 }}
                whileInView={{ width: "50%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Tier markers */}
              <div
                className="absolute inset-y-0 left-0 w-px bg-white/20"
                style={{ left: "20%" }}
              />
              <div
                className="absolute inset-y-0 left-0 w-px bg-white/20"
                style={{ left: "50%" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[0.55rem] font-mono text-white/25 uppercase">
              <span>Free</span>
              <span>Crystal</span>
              <span>Black</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Tier comparison */}
        <AnimatedSection className="max-w-4xl mx-auto mb-16" direction="up">
          <div className="text-center mb-10">
            <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
              {t("kiutaCard.compare")}
            </span>
            <h2
              className="gradient-text mt-1.5 font-bold tracking-tight"
              style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}
            >
              {t("kiutaCard.tiers")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tierItem, i) => (
              <AnimatedItem key={i} direction="up" duration={i * 0.1}>
                <div
                  className={`glass-card p-6 h-full relative overflow-hidden ${
                    tierItem.current ? "border-white/20" : ""
                  }`}
                >
                  {tierItem.current && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white text-black text-[0.55rem] font-bold uppercase tracking-wider">
                      {t("kiutaCard.currentTier")}
                    </div>
                  )}
                  <div className="text-[0.65rem] font-mono text-white/30 uppercase tracking-wider mb-2">
                    {t("kiutaCard.tier")}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">
                    {tierItem.name}
                  </h3>
                  <div className="text-[0.85rem] text-white/50 font-mono mb-5">
                    {tierItem.minPoints.toLocaleString()} —{" "}
                    {tierItem.maxPoints.toLocaleString()} pts
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-5">
                    {tierItem.discount}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                    {tierItem.perks.map((perk, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-[0.78rem] text-white/55"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-white/70 flex-shrink-0"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {perk}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>

        {/* Benefits grid */}
        <AnimatedSection className="max-w-3xl mx-auto mb-16" direction="up">
          <div className="text-center mb-10">
            <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
              {t("kiutaCard.benefits.perks")}
            </span>
            <h2
              className="gradient-text mt-1.5 font-bold tracking-tight"
              style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}
            >
              {t("kiutaCard.benefits.title")}
            </h2>
          </div>
          <AnimatedStagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            stagger={0.08}
          >
            {benefits.map((b, i) => (
              <AnimatedItem key={i} direction="up">
                <div className="glass-card p-6 h-full">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 mb-4">
                    <BenefitIcon type={b.icon} />
                  </div>
                  <h3 className="text-[0.85rem] font-medium text-white/70 mb-2">
                    {b.title}
                  </h3>
                  <p className="text-[0.75rem] text-white/25 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        </AnimatedSection>

        {/* Transaction history */}
        {user && (
          <AnimatedSection className="max-w-2xl mx-auto mb-16" direction="up">
            <div className="text-center mb-8">
              <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
                {t("kiutaCard.transactions")}
              </span>
            </div>
            <div className="glass-card divide-y divide-white/[0.04]">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        tx.points > 0
                          ? "bg-emerald-400/[0.08] border border-emerald-400/10 text-emerald-300/70"
                          : "bg-red-400/[0.08] border border-red-400/10 text-red-300/70"
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
                        {tx.points > 0 ? (
                          <path d="M12 5v14M5 12l7-7 7 7" />
                        ) : (
                          <path d="M12 19V5M5 12l7 7 7-7" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.82rem] font-medium text-white/70">
                        {tx.title}
                      </p>
                      <p className="text-[0.65rem] font-mono text-white/25">
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[0.85rem] font-semibold font-mono tabular-nums ${
                      tx.points > 0 ? "text-emerald-300/80" : "text-red-300/80"
                    }`}
                  >
                    {tx.points > 0 ? "+" : ""}
                    {tx.points.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* FAQ */}
        <AnimatedSection className="max-w-2xl mx-auto mb-12" direction="up">
          <div className="text-center mb-8">
            <span className="font-mono text-[0.68rem] text-white/28 tracking-[0.12em] uppercase">
              FAQ
            </span>
            <h2
              className="gradient-text mt-1.5 font-bold tracking-tight"
              style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}
            >
              {t("kiutaCard.faq.title")}
            </h2>
          </div>
          <Accordion items={faqItems} />
        </AnimatedSection>

        {!user && (
          <AnimatedSection className="text-center" direction="up">
            <Link
              href="/login"
              className="inline-block px-10 py-2.5 rounded-lg bg-white text-black text-[0.85rem] font-medium no-underline hover:bg-white/90 transition-colors"
            >
              {t("kiutaCard.signInToView")}
            </Link>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
