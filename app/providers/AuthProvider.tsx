"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateAvatar: (file: File) => Promise<string>;
  updateProfile: (name: string) => Promise<User>;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function compressToDataUrl(
  file: File,
  maxSize: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize);
          width = maxSize;
        } else {
          width = Math.round((width / height) * maxSize);
          height = maxSize;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/webp", quality);
      if (!dataUrl || dataUrl === "data:,")
        return reject(new Error("Compression failed"));
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUser: () => {},
  updateAvatar: async () => "",
  updateProfile: async () => null as unknown as User,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kiuta-token");
    if (!token) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const controller = new AbortController();

    fetch(`${API_URL}auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (controller.signal.aborted) return;
        if (u) {
          setUser(u);
        } else {
          localStorage.removeItem("kiuta-token");
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        localStorage.removeItem("kiuta-token");
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Login failed");
    }
    const data = await res.json();
    if (data.token) localStorage.setItem("kiuta-token", data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await fetch(`${API_URL}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Registration failed");
    }
  };

  const logout = () => {
    fetch(`${API_URL}auth/logout`, { method: "POST" }).catch(() => {});
    localStorage.removeItem("kiuta-token");
    setUser(null);
  };

  const updateAvatar = async (file: File) => {
    const token = localStorage.getItem("kiuta-token");
    if (!token || !user) throw new Error("Not authenticated");

    // Compress & convert to base64 data URL entirely on client
    const dataUrl = await compressToDataUrl(file, 256, 0.75);

    // Send directly to backend — one request, no intermediate API
    const res = await fetch(`${API_URL}users/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: dataUrl }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to save avatar");
    }

    const updatedUser = await res.json();
    setUser(updatedUser);
    return dataUrl;
  };

  const updateProfile = async (name: string): Promise<User> => {
    const token = localStorage.getItem("kiuta-token");
    if (!token || !user) throw new Error("Not authenticated");

    const res = await fetch(`${API_URL}users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update profile");
    }

    const updatedUser = (await res.json()) as User;
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser, updateAvatar, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
