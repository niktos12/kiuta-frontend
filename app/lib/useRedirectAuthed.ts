"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

/**
 * Redirects authenticated users away from auth pages (login/register/verify/otp).
 * Waits for AuthProvider to finish loading before deciding.
 *
 * @param redirectTo Where to send the logged-in user. Defaults to "/".
 */
export function useRedirectAuthed(redirectTo: string = "/") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}
