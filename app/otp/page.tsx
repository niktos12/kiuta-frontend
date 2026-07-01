"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";
import { Crystal3D, CrystalIcon } from "../components/Crystal3D";
import { useLanguage } from "../store/languageStore";

function OTPContent() {
  const { t } = useLanguage();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { setUser } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const purpose = searchParams.get("purpose") || "verify"; // verify | reset

  // Restore registration data saved by /register
  const [regData, setRegData] = useState<{
    password: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("otp_register");
      if (stored) setRegData(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // auto-submit when all 6 filled
    if (newDigits.every((d) => d !== "")) {
      submitCode(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    pasted.split("").forEach((ch, i) => {
      newDigits[i] = ch;
    });
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

    if (newDigits.every((d) => d !== "")) {
      submitCode(newDigits);
    }
  };

  const submitCode = async (code?: string[]) => {
    const otp = (code || digits).join("");
    if (otp.length !== 6) return;

    setLoading(true);
    setError("");

    try {
      const endpoint =
        purpose === "reset"
          ? "/api/auth/reset/verify"
          : `${API_URL}auth/verify-otp`;

      const body: Record<string, string> = { email, code: otp };

      // For registration, backend needs password & name to create the user
      if (purpose === "verify" && regData) {
        body.password = regData.password;
        body.name = regData.name;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("otp.invalidCode"));
      }

      const data = await res.json();

      // Clean up stored registration data
      sessionStorage.removeItem("otp_register");

      // Auto-login: backend returns { token, user } after verify
      if (data.token) {
        localStorage.setItem("kiuta-token", data.token);
      }
      if (data.user) {
        setUser(data.user);
      }

      // Redirect straight to main page — user is already logged in
      router.push("/");
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("otp.somethingWrong"));
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    try {
      const endpoint =
        purpose === "reset"
          ? "/api/auth/reset/send"
          : `${API_URL}auth/send-otp`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setResendTimer(60);
    } catch {
      setError(t("otp.resendFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-28 pb-20 flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.015] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm mx-auto text-center relative z-10 px-4">
        {/* Crystal */}
        <div className="flex justify-center mb-8">
          <Crystal3D size={100} interactive={false} speed={25} />
        </div>

        <CrystalIcon size={28} className="text-white/10 mx-auto mb-5" />

        <h1 className="text-xl font-semibold mb-2">
          {purpose === "reset" ? t("otp.resetTitle") : t("otp.title")}
        </h1>

        <p className="text-[0.8rem] text-white/30 mb-8">
          {email ? (
            <>
              {t("otp.sentTo")}{" "}
              <span className="text-white/50 font-mono">{email}</span>
            </>
          ) : (
            t("otp.enterCode")
          )}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-[0.8rem] text-red-400/80">
            {error}
          </div>
        )}

        {/* 6-digit inputs */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCode();
          }}
        >
          <div
            className="flex items-center justify-center gap-2.5 mb-8"
            onPaste={handlePaste}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center text-lg font-semibold text-white outline-none transition-all duration-200 focus:border-white/25 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
                disabled={loading}
                autoComplete={i === 0 ? "one-time-code" : "off"}
              />
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-4 h-4 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
              <span className="text-[0.75rem] text-white/30">{t("otp.verifying")}</span>
            </div>
          )}

          {!loading && (
            <button
              type="submit"
              disabled={digits.some((d) => !d)}
              className="w-full py-3 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {t("otp.verify")}
            </button>
          )}
        </form>

        {/* Resend */}
        <div className="mt-6">
          {resendTimer > 0 ? (
            <span className="text-[0.75rem] text-white/25 font-mono">
              {t("otp.resendIn")} {resendTimer}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-[0.8rem] text-white/30 hover:text-white transition-colors underline underline-offset-4 disabled:opacity-30"
            >
              {t("otp.resend")}
            </button>
          )}
        </div>

        <a
          href="/login"
          className="inline-block mt-4 text-[0.75rem] text-white/20 hover:text-white/40 transition-colors"
        >
          {t("otp.backToSignIn")}
        </a>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return <Suspense><OTPContent /></Suspense>;
}
