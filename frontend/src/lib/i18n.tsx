import React, { createContext, useContext, useEffect, useState } from "react";
import { en } from "./i18n/en";

export type Lang = "en" | "mm";

/* ─── MM (Burmese) dictionary is code-split: loaded on demand / background-warmed ─── */
let mmCache: Record<string, string> | null = null;
function loadMmDict(): Promise<Record<string, string>> {
  if (mmCache) return Promise.resolve(mmCache);
  return import("./i18n/mm").then((m) => {
    mmCache = m.mm;
    return mmCache as Record<string, string>;
  });
}

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: (k: string) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let cancelled = false;
    try {
      const saved = localStorage.getItem("a9_lang");
      if (saved === "mm") {
        loadMmDict()
          .then(() => { if (!cancelled) setLangState("mm"); })
          .catch(() => { if (!cancelled) setLangState("mm"); });
      } else if (saved === "en") {
        // Warm the MM chunk in the background so the first switch is instant.
        const ric = window.requestIdleCallback ? window.requestIdleCallback(() => { loadMmDict().catch(() => {}); }, { timeout: 4000 }) : 0;
        return () => { cancelled = true; if (ric && window.cancelIdleCallback) window.cancelIdleCallback(ric); };
      }
    } catch { /* ignore */ }
    return () => { cancelled = true; };
  }, []);

  const setLang = (l: Lang) => {
    try {
      localStorage.setItem("a9_lang", l);
      document.documentElement.lang = l;
    } catch { /* ignore */ }
    if (l === "mm" && !mmCache) {
      loadMmDict()
        .then(() => setLangState("mm"))
        .catch(() => setLangState("mm"));
    } else {
      setLangState(l);
    }
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    const dict = lang === "mm" && mmCache ? mmCache : en;
    let s = dict[key] ?? en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.split(`{${k}}`).join(String(v));
      }
    }
    return s;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
