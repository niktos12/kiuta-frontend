"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { useCart } from "../store/cartStore";
import { useWishlist } from "../store/wishlistStore";
import { useLanguage } from "../store/languageStore";
import { useState, useRef, useEffect } from "react";
import { CrystalIcon } from "./Crystal3D";
import type { Language } from "../store/languageStore";

export function Header() {
  const { user, logout } = useAuth();
  const cartCount = useCart((s) => s.items.length);
  const wishCount = useWishlist((s) => s.items.length);
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const profileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const handleProfileEnter = () => {
    if (profileTimer.current) clearTimeout(profileTimer.current);
    setProfileOpen(true);
  };
  const handleProfileLeave = () => {
    profileTimer.current = setTimeout(() => setProfileOpen(false), 200);
  };

  const handleLangEnter = () => {
    if (langTimer.current) clearTimeout(langTimer.current);
    setLangOpen(true);
  };
  const handleLangLeave = () => {
    langTimer.current = setTimeout(() => setLangOpen(false), 200);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectLang = (l: Language) => {
    setLang(l);
    setLangOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <CrystalIcon
            size={18}
            className="text-white/80 group-hover:text-white transition-colors"
          />
          <span className="text-[0.9rem] font-semibold tracking-tight">
            KIUTA
          </span>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/catalog", label: t("nav.catalog") },
            { href: "/products", label: t("nav.products") },
            { href: "/store", label: t("nav.store") },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-1.5 text-[0.8rem] text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher */}
          <div
            ref={langRef}
            className="relative"
            onMouseEnter={handleLangEnter}
            onMouseLeave={handleLangLeave}
          >
            <button
              className="px-2 py-1.5 text-[0.7rem] font-mono text-white/30 hover:text-white/60 rounded-lg hover:bg-white/[0.04] transition-all duration-200 border border-white/[0.04]"
              aria-label="Language"
            >
              {lang === "en" ? "EN" : "RU"} / {lang === "en" ? "RU" : "EN"}
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-28 rounded-xl border border-white/[0.08] bg-black/95 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/40 animate-fade-in-up">
                <button
                  onClick={() => selectLang("en")}
                  className={`w-full px-4 py-2.5 text-left text-[0.8rem] transition-all duration-150 ${
                    lang === "en"
                      ? "text-white bg-white/[0.06]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => selectLang("ru")}
                  className={`w-full px-4 py-2.5 text-left text-[0.8rem] transition-all duration-150 ${
                    lang === "ru"
                      ? "text-white bg-white/[0.06]"
                      : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  Русский
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("toggle-wishlist"))
            }
            className="relative p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-white/50 hover:text-white"
            aria-label="Wishlist"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-black text-[0.6rem] font-semibold flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-cart"))}
            className="relative p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-white/50 hover:text-white"
            aria-label="Cart"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-black text-[0.6rem] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile dropdown (desktop) */}
          {user ? (
            <div
              ref={profileRef}
              className="hidden md:block relative"
              onMouseEnter={handleProfileEnter}
              onMouseLeave={handleProfileLeave}
            >
              <button className="flex items-center gap-2 ml-1 px-3 py-1.5 text-[0.8rem] text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200">
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[0.6rem] font-semibold text-white/40">
                      {(user.name || user.email)?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {user.name || user.email?.split("@")[0]}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 rounded-xl border border-white/[0.08] bg-black/95 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/40 animate-fade-in-up">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-[0.8rem] font-medium text-white/80 truncate">
                      {user.name || "—"}
                    </p>
                    <p className="text-[0.68rem] text-white/30 font-mono truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[0.78rem] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {t("nav.profile")}
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[0.78rem] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      {t("nav.orders")}
                    </Link>
                    {/* <Link
                      href="/wishlist"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[0.78rem] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {t("nav.wishlist")}
                    </Link> */}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-[0.78rem] text-white/30 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        {t("nav.adminPanel")}
                      </Link>
                    )}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-white/[0.06] py-1.5">
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[0.78rem] text-white/30 hover:text-red-300/70 hover:bg-red-500/[0.04] transition-all duration-150"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      {t("nav.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex ml-1 px-4 py-1.5 text-[0.8rem] font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-all"
            >
              {t("nav.signIn")}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-white/50 hover:text-white"
            aria-label="Menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-black/90 backdrop-blur-xl">
          <nav className="container py-4 flex flex-col gap-1">
            {[
              { href: "/catalog", label: t("nav.catalog") },
              { href: "/products", label: t("nav.products") },
              { href: "/store", label: t("nav.store") },
              { href: "/orders", label: t("nav.orders") },
              { href: "/wishlist", label: t("nav.wishlist") },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-[0.85rem] text-white/60 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all"
              >
                {l.label}
              </Link>
            ))}

            {/* Mobile language switcher */}
            <div className="flex items-center gap-2 px-4 py-2">
              <button
                onClick={() => selectLang("en")}
                className={`px-3 py-1.5 text-[0.75rem] font-mono rounded-lg border transition-all ${
                  lang === "en"
                    ? "text-white bg-white/[0.06] border-white/[0.1]"
                    : "text-white/30 border-white/[0.04] hover:text-white/50"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => selectLang("ru")}
                className={`px-3 py-1.5 text-[0.75rem] font-mono rounded-lg border transition-all ${
                  lang === "ru"
                    ? "text-white bg-white/[0.06] border-white/[0.1]"
                    : "text-white/30 border-white/[0.04] hover:text-white/50"
                }`}
              >
                RU
              </button>
            </div>

            <div className="border-t border-white/[0.06] my-2" />
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 text-[0.85rem] text-white/40 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all"
                  >
                    {t("nav.adminPanel")}
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-[0.85rem] text-white/60 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  {t("nav.profile")}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2.5 text-[0.85rem] text-white/40 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all text-left"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mx-4 mt-1 px-4 py-2.5 text-[0.85rem] font-medium bg-white text-black rounded-xl text-center hover:bg-white/90 transition-all"
              >
                {t("nav.signIn")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
