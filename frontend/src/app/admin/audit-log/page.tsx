"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface AuditEntry {
  id?: string;
  collection?: string;
  action?: string;
  targetId?: string;
  at?: string;
}

const actionColor: Record<string, string> = {
  create: "bg-green-500/15 text-green-400 border-green-500/30",
  update: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  delete: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AuditLogPage() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
      const res = await fetch("/api/admin/audit-log", { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 403) { setError(t("admin.audit.adminOnly")); setLoading(false); return; }
      if (!res.ok) { setError(t("admin.audit.loadError")); setLoading(false); return; }
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch {
      setError(t("admin.audit.loadError"));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-white/50 hover:text-[#D4AF37]">{t("admin.common.dashboardBack")}</Link>
            <h1 className="text-xl font-bold text-white mt-1">🔍 {t("admin.audit.title")}</h1>
            <p className="text-sm text-white/50 mt-1">{t("admin.audit.hint")}</p>
          </div>
          <button
            onClick={load}
            className="bg-white/10 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-white/20"
          >
            {t("admin.audit.refresh")}
          </button>
        </div>

        {loading ? (
          <div className="text-white/60 text-sm py-10 text-center">{t("admin.audit.loading")}</div>
        ) : error ? (
          <div className="text-red-400 text-sm py-10 text-center">{error}</div>
        ) : entries.length === 0 ? (
          <div className="text-white/60 text-sm py-10 text-center">{t("admin.audit.empty")}</div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/60">
                  <th className="px-4 py-2 font-medium">{t("admin.audit.time")}</th>
                  <th className="px-4 py-2 font-medium">{t("admin.audit.action")}</th>
                  <th className="px-4 py-2 font-medium">{t("admin.audit.section")}</th>
                  <th className="px-4 py-2 font-medium">{t("admin.audit.target")}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={(e.id || "") + (e.targetId || "") + (e.at || "")} className="border-b border-white/5 hover:bg-white/[0.04]">
                    <td className="px-4 py-2 text-white/70 whitespace-nowrap">{e.at ? new Date(e.at).toLocaleString() : "-"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded border text-xs ${actionColor[e.action || ""] || "bg-white/10 text-white/70 border-white/20"}`}>{e.action || "-"}</span>
                    </td>
                    <td className="px-4 py-2 text-white/70">{e.collection || "-"}</td>
                    <td className="px-4 py-2 text-white/50 font-mono text-xs">{e.targetId || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
