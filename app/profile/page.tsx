"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";
import { CrystalIcon } from "../components/Crystal3D";
import { toast } from "sonner";
import { useLanguage } from "../store/languageStore";

export default function ProfilePage() {
  const { user, loading, logout, updateAvatar, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setUploading(true);
    try {
      await updateAvatar(file);
      toast.success(t("profile.avatarUpdated"));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("profile.avatarUploadFailed");
      toast.error(message);
      setAvatarError(message);
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    const trimmed = name.trim();

    // Валидация
    if (!trimmed) {
      setProfileError(t("profile.nameRequired"));
      return;
    }
    if (trimmed.length < 2) {
      setProfileError(t("profile.nameTooShort"));
      return;
    }
    if (trimmed.length > 50) {
      setProfileError(t("profile.nameTooLong"));
      return;
    }

    // Если имя не изменилось — просто выходим из режима редактирования
    if (trimmed === (user?.name || "")) {
      setEditing(false);
      setProfileError(null);
      return;
    }

    setSaving(true);
    setProfileError(null);
    try {
      await updateProfile(trimmed);
      setEditing(false);
      setSaved(true);
      toast.success(t("profile.saved"));
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("profile.saveFailed");
      setProfileError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="container">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="animate-shimmer h-4 w-28 rounded-lg" />
            <div className="animate-shimmer h-8 w-48 rounded-xl" />
            <div className="animate-shimmer h-56 rounded-xl" />
            <div className="animate-shimmer h-40 rounded-xl" />
            <div className="animate-shimmer h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-sm mx-auto text-center py-12">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-3xl bg-white/[0.03] border border-white/[0.06]" />
              <div className="absolute -inset-4 rounded-[2rem] bg-white/[0.01] blur-2xl" />
              <div className="relative w-full h-full flex items-center justify-center rounded-3xl">
                <CrystalIcon size={40} className="text-white/15" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">
              {t("profile.notSignedIn")}
            </h1>
            <p className="text-[0.85rem] text-white/40 mb-10 leading-relaxed">
              {t("profile.notSignedInDesc")}
            </p>
            <Link
              href="/login"
              className="inline-block px-10 py-3.5 bg-white text-black rounded-xl text-[0.85rem] font-medium hover:bg-white/90 transition-all"
            >
              {t("nav.signIn")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 relative">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="mb-10">
            <span className="block text-[0.65rem] font-mono text-white/25 tracking-[0.2em] uppercase mb-3">
              {t("profile.badge")}
            </span>
            <div className="flex items-end justify-between">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">
                {t("profile.title")}
              </h1>
              <button
                onClick={logout}
                className="px-4 py-2 text-[0.75rem] text-white/30 font-mono border border-white/[0.06] rounded-lg hover:bg-white/[0.04] hover:text-white/50 transition-all"
              >
                {t("profile.signOut")}
              </button>
            </div>
            <p className="text-[0.8rem] text-white/30 mt-2">
              {t("profile.manageAccount")}
            </p>
          </div>

          {/* Avatar & Name Card */}
          <div className="glass-card p-8 mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar with glow ring */}
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 blur-xl" />
                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="relative w-22 h-22 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden hover:border-white/20 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label={t("profile.changeAvatar")}
                >
                  {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || "Avatar"}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  ) : (
                    <CrystalIcon size={36} className="text-white/20" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10 hover:scale-110 transition-transform disabled:opacity-50 cursor-pointer"
                  aria-label={t("profile.changeAvatar")}
                >
                  {uploading ? (
                    <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold truncate tracking-tight">
                  {user.name || t("profile.noNameSet")}
                </h2>
                <p className="text-[0.8rem] text-white/40 font-mono truncate mt-1">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2.5 py-1 text-[0.6rem] font-mono text-white/40 bg-white/[0.03] border border-white/[0.06] rounded-md">
                    {t("profile.idLabel")}: {user.id.slice(0, 8)}
                  </span>
                  <span className="px-2.5 py-1 text-[0.6rem] font-mono text-emerald-400/70 bg-emerald-400/[0.06] border border-emerald-400/[0.1] rounded-md">
                    {t("profile.active")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass-card p-8 mb-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="block text-[0.6rem] font-mono text-white/20 tracking-[0.2em] uppercase mb-1.5">
                  {t("profile.details")}
                </span>
                <h3 className="text-[0.95rem] font-semibold tracking-tight">
                  {t("profile.personalInfo")}
                </h3>
              </div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(user.name || "");
                      setProfileError(null);
                    }}
                    disabled={saving}
                    className="px-4 py-1.5 text-[0.7rem] font-mono text-white/40 border border-white/[0.06] rounded-lg hover:bg-white/[0.04] transition-all disabled:opacity-40"
                  >
                    {t("profile.cancel")}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-1.5 text-[0.7rem] font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {saving && (
                      <span className="w-3 h-3 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    )}
                    {saving ? t("profile.saving") : t("profile.save")}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-1.5 text-[0.7rem] font-mono text-white/30 border border-white/[0.06] rounded-lg hover:bg-white/[0.04] hover:text-white/50 transition-all"
                >
                  {t("profile.edit")}
                </button>
              )}
            </div>

            {profileError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/[0.08] border border-red-500/[0.15] text-[0.8rem] text-red-300 flex items-center gap-2.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-red-400/70 flex-shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {profileError}
              </div>
            )}

            {saved && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.1] text-[0.8rem] text-emerald-300/80 flex items-center gap-2.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-emerald-400/60 flex-shrink-0"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t("profile.saved")}
              </div>
            )}

            <div className="space-y-6">
              {/* Name field */}
              <div className="space-y-2.5">
                <label className="block text-[0.65rem] font-mono text-white/25 uppercase tracking-[0.15em]">
                  {t("profile.fullName")}
                </label>
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setProfileError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !saving) handleSave();
                      }}
                      maxLength={50}
                      autoFocus
                      className="input"
                      placeholder={t("profile.enterName")}
                    />
                    <p className="text-[0.65rem] font-mono text-white/20">
                      {name.length}/50
                    </p>
                  </>
                ) : (
                  <p className="text-[0.9rem] text-white/70 py-1">
                    {user.name || (
                      <span className="text-white/20 italic">
                        {t("profile.notSet")}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2.5">
                <label className="block text-[0.65rem] font-mono text-white/25 uppercase tracking-[0.15em]">
                  {t("profile.emailAddress")}
                </label>
                <p className="text-[0.85rem] text-white/60 font-mono py-1">
                  {user.email}
                </p>
              </div>

              {/* ID */}
              <div className="space-y-2.5">
                <label className="block text-[0.65rem] font-mono text-white/25 uppercase tracking-[0.15em]">
                  {t("profile.userId")}
                </label>
                <p className="text-[0.8rem] text-white/30 font-mono py-1">
                  {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="glass-card p-6">
            <span className="block text-[0.6rem] font-mono text-white/20 tracking-[0.2em] uppercase mb-4">
              {t("profile.navigation")}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  href: "/orders",
                  label: t("profile.orderHistory"),
                  desc: t("profile.viewPastOrders"),
                },
                {
                  href: "/wishlist",
                  label: t("nav.wishlist"),
                  desc: t("profile.savedItems"),
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.015] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group"
                >
                  <div>
                    <p className="text-[0.85rem] font-medium text-white/60 group-hover:text-white transition-colors">
                      {link.label}
                    </p>
                    <p className="text-[0.65rem] text-white/20 font-mono mt-0.5">
                      {link.desc}
                    </p>
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-white/15 group-hover:text-white/40 transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
