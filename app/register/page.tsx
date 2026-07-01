"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { CrystalIcon } from "../components/Crystal3D";
import { useRouter } from "next/navigation";
import { useLanguage } from "../store/languageStore";
import { useRedirectAuthed } from "../lib/useRedirectAuthed";
import { motion } from "framer-motion";
export default function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();
  const { loading: authLoading } = useRedirectAuthed("/");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("auth.passwordsMatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("auth.passwordLength"));
      return;
    }

    sessionStorage.setItem(
      "otp_register",
      JSON.stringify({ email, password, name }),
    );
    setLoading(true);
    try {
      await register(email, password, name);
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    } catch {
      setError(t("auth.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen pt-28 pb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container">
        <div className="max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-5">
              <CrystalIcon size={22} className="text-white/70" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              {t("auth.createAccount")}
            </h1>
            <p className="text-[0.8rem] text-white/40 mt-1.5">
              {t("auth.enterDetails")}
            </p>
          </div>

          {/* Card */}
          <div className="glass-card p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/[0.08] border border-red-500/[0.15] text-[0.8rem] text-red-300">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-white/50 uppercase tracking-wider">
                  {t("auth.name")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-white/50 uppercase tracking-wider">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-white/50 uppercase tracking-wider">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <p className="text-[0.7rem] text-white/25">
                  {t("auth.minChars")}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-[0.75rem] font-medium text-white/50 uppercase tracking-wider">
                  {t("auth.confirmPassword")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    {t("auth.creatingAccount")}
                  </span>
                ) : (
                  t("auth.createAccount")
                )}
              </button>
            </form>
          </div>

          {/* Login link */}
          <p className="text-center text-[0.8rem] text-white/30 mt-6">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
            >
              {t("nav.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}