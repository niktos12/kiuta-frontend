"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crystal3D, CrystalIcon } from "../components/Crystal3D";
import { useLanguage } from "../store/languageStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function VerifyContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(!!token);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  // Auto-verify if token present
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}auth/verify?token=${token}`)
      .then((r) => {
        if (r.ok) setVerified(true);
        else throw new Error();
      })
      .catch(() => setError(t("verify.linkExpired")))
      .finally(() => setVerifying(false));
  }, [token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}auth/verify/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError(t("verify.sendFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Crystal */}
        <div className="flex justify-center mb-8">
          <Crystal3D size={120} interactive={false} speed={25} />
        </div>

        {verifying ? (
          <div>
            <h1 className="text-xl font-semibold mb-2">{t("verify.verifying")}</h1>
            <p className="text-[0.8rem] text-white/30">{t("verify.pleaseWait")}</p>
          </div>
        ) : verified ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(52 211 153)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">{t("verify.verified")}</h1>
            <p className="text-[0.8rem] text-white/30 mb-8">
              {t("verify.verifiedDesc")}
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all"
            >
              {t("verify.continueToSignIn")}
            </Link>
          </div>
        ) : sent ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/60"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">{t("verify.checkEmail")}</h1>
            <p className="text-[0.8rem] text-white/30 mb-2">
              {t("verify.sentTo")}
            </p>
            <p className="text-[0.8rem] text-white/60 font-mono mb-8">
              {email}
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all"
            >
              {t("verify.backToSignIn")}
            </Link>
          </div>
        ) : (
          <div>
            <CrystalIcon size={32} className="text-white/10 mx-auto mb-6" />
            <h1 className="text-xl font-semibold mb-2">{t("verify.title")}</h1>
            <p className="text-[0.8rem] text-white/30 mb-8">
              {t("verify.enterEmail")}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-[0.8rem] text-red-400/80">
                {error}
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-3">
              <input
                type="email"
                placeholder={t("verify.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {loading ? t("verify.sending") : t("verify.sendLink")}
              </button>
            </form>

            <Link
              href="/login"
              className="inline-block mt-6 text-[0.8rem] text-white/30 hover:text-white transition-colors underline underline-offset-4"
            >
              {t("verify.backToSignIn")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return <Suspense><VerifyContent /></Suspense>;
}
