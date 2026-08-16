"use client";
import { useEffect, useState } from "react";
import { decodeTokenPayload } from "@/lib/auth";

/**
 * FIX 2026-08-16: client-side role for UI gating (buttons hidden for viewer).
 * Server-side enforcement lives in middleware (rank < 1 => 403 on writes).
 * Defaults to "admin" so no flash of hidden controls for privileged users.
 */
export function useClientRole(): string {
  const [role, setRole] = useState<string>("admin");
  useEffect(() => {
    try {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const p = decodeTokenPayload(token);
        if (p && p.role) setRole(p.role);
      }
    } catch {}
  }, []);
  return role;
}
