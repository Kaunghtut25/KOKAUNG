"use client";

import { useState } from "react";

// ── known duplicates & junk ──
// Each entry: { collection, label, matcher: (item) => boolean, action: "delete" }
const CLEANUP_PLAN = [
  { collection: "tours", label: "Kalaw Trekking (strict match — keeps first, deletes dupe)", match: (it: any) => (it.title || "").toLowerCase().includes("kalaw trekking") },
  { collection: "tours", label: "AUDIT-UPLOAD-TEST junk record", match: (it: any) => (it.title || "").toLowerCase().includes("audit") },
  { collection: "hotels", label: "Sule Shangri-La dupe (keeps first)", match: (it: any) => (it.name || "").toLowerCase().includes("sule shangri") },
  { collection: "cars", label: "Toyota Probox dupe (keeps first)", match: (it: any) => (it.carType || "").toLowerCase().includes("probox") },
  { collection: "cruises", label: "Dubai Marina Dhow dupe (keeps first)", match: (it: any) => (it.title || "").toLowerCase().includes("dubai") && (it.title || "").toLowerCase().includes("marina") },
  { collection: "cruises", label: "Maldives dupe (keeps first)", match: (it: any) => (it.title || "").toLowerCase().includes("maldives") },
  { collection: "visas", label: "Thailand junk record ($75/Singapore)", match: (it: any) => {
    const country = (it.country || "").toLowerCase();
    const addInfo = (it.additionalInfo || "").toLowerCase();
    const fee = it.visaFeeMMK;
    return country === "thailand" && (addInfo.includes("singapore") || (typeof fee === "number" && fee > 0 && fee <= 75));
  }},
  { collection: "insurances", label: "Premium Travel Protect dupe", match: (it: any) => (it.planName || "").toLowerCase().includes("premium travel protect") },
];

// Price fixes
const PRICE_FIXES: Record<string, Record<string, any>> = {
  cars: {
    // fill zero-price cars (pricing array[0].priceMMK)
  },
  visas: {
    // Thailand visa fee: ensure 60000 MMK / 29 USD
  },
};

export default function CleanupPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const logLine = (msg: string) => setLog((prev) => [...prev, msg]);

  const run = async () => {
    setRunning(true);
    setDone(false);
    setLog([]);
    const t = localStorage.getItem("admin_token") || "";

    logLine("🔍 Scanning catalog via admin API...");

    // Fetch all collections
    const cols = ["tours", "hotels", "cars", "cruises", "visas", "insurances"];
    const all: Record<string, any[]> = {};
    for (const c of cols) {
      try {
        const res = await fetch("/api/admin/" + c, { headers: { Authorization: "Bearer " + t } });
        const data = await res.json();
        // some routes return {data:[...]}, some return array directly
        const items = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
        all[c] = items;
        logLine(`  ${c}: ${items.length} records`);
      } catch (e) {
        logLine(`  ❌ ${c}: fetch failed`);
      }
    }

    // Phase A: deletes
    logLine("");
    logLine("🗑️  Deleting duplicates & junk...");
    const keptFirst: Record<string, boolean> = {};

    for (const plan of CLEANUP_PLAN) {
      const items = all[plan.collection] || [];
      const matches = items.filter((it) => plan.match(it));
      if (matches.length === 0) {
        logLine(`  ⏭️  ${plan.label}: not found (already cleaned?)`);
        continue;
      }
      // keep first match, delete the rest
      const keep = matches[0];
      const dupes = matches.slice(1);
      if (dupes.length === 0 && plan.label.startsWith("AUDIT")) {
        // junk with single entry — delete it
        const id = keep.id || keep._id;
        try {
          await fetch("/api/admin/" + plan.collection + "/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + t } });
          logLine(`  ✅ ${plan.label}: deleted (id=${id}, title="${(keep.title || keep.name || keep.planName || keep.carType || "")}")`);
          // remove from local list
          all[plan.collection] = all[plan.collection].filter((it) => it.id !== id);
        } catch (e) {
          logLine(`  ❌ ${plan.label}: delete failed`);
        }
        continue;
      }
      if (dupes.length === 0) {
        logLine(`  ⏭️  ${plan.label}: only 1 found, nothing to delete`);
        continue;
      }
      for (const d of dupes) {
        const id = d.id || d._id;
        try {
          await fetch("/api/admin/" + plan.collection + "/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + t } });
          logLine(`  ✅ ${plan.label}: deleted dupe (id=${id})`);
          all[plan.collection] = all[plan.collection].filter((it) => it.id !== id);
        } catch (e) {
          logLine(`  ❌ ${plan.label}: delete failed (id=${id})`);
        }
      }
    }

    // Phase B: fix zero-price cars
    logLine("");
    logLine("💰 Fixing zero-price cars...");
    const cars = all["cars"] || [];
    const carPriceMap: Record<string, number> = {
      mercedes: 250000, probox: 80000, ford: 120000, transit: 120000,
      hiace: 120000, toyota: 80000, honda: 95000,
    };
    for (const car of cars) {
      const t = (car.carType || "").toLowerCase();
      const pricingArr = Array.isArray(car.pricingWithDriver) ? car.pricingWithDriver : (Array.isArray(car.pricing) ? car.pricing : []);
      const pricingObj = car.pricing && !Array.isArray(car.pricing) ? car.pricing : null;
      const id = car.id || car._id;
      const hasPrice = (pricingArr.length > 0 && pricingArr.some((p: any) => p.priceMMK || p.priceUSD)) ||
        (pricingObj && (pricingObj.halfDay || pricingObj.fullDay || pricingObj.airportTransfer || pricingObj.priceMMK || pricingObj.priceUSD));
      if (!hasPrice) {
        let bestPrice = 120000;
        for (const [kw, p] of Object.entries(carPriceMap)) {
          if (t.includes(kw)) { bestPrice = p; break; }
        }
        try {
          await fetch("/api/admin/cars/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + t },
            body: JSON.stringify({ ...car, pricingWithDriver: [{ duration: "Full Day", priceMMK: bestPrice, priceUSD: Math.round(bestPrice / 2100) }] }),
          });
          logLine(`  ✅ ${car.carType}: price set to ${bestPrice} MMK`);
        } catch (e) {
          logLine(`  ❌ ${car.carType}: update failed`);
        }
      }
    }

    // Phase C: fix Thailand visa fee
    logLine("");
    logLine("🛂 Fixing Thailand visa fee...");
    const visas = all["visas"] || [];
    const thVisas = visas.filter((v: any) => (v.country || "").toLowerCase() === "thailand");
    for (const v of thVisas) {
      const id = v.id || v._id;
      if (v.visaFeeMMK === 60000 && v.visaFeeUSD === 29) {
        logLine(`  ⏭️  Thailand visa (id=${id}): fee already correct (60000 MMK / $29)`);
        continue;
      }
      try {
        await fetch("/api/admin/visas/" + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + t },
          body: JSON.stringify({ ...v, visaFeeMMK: 60000, visaFeeUSD: 29 }),
        });
        logLine(`  ✅ Thailand visa (id=${id}): fee set to 60000 MMK / $29`);
      } catch (e) {
        logLine(`  ❌ Thailand visa (id=${id}): update failed`);
      }
    }

    logLine("");
    logLine("🎉 Data cleanup complete!");
    setDone(true);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-light text-white mb-2">Phase 2: Data Cleanup</h1>
        <p className="text-white/40 text-sm mb-6">
          Deletes duplicates, removes junk records, fixes zero-price cars, and corrects Thailand visa fee.
          This uses your logged-in admin session — nothing leaves the browser.
        </p>

        {!running && !done && (
          <button
            onClick={run}
            className="bg-[#D4AF37] text-[#0A1628] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#C4A030] transition"
          >
            🧹 Run Cleanup
          </button>
        )}

        {running && (
          <div className="bg-[#0F1E35] border border-white/10 rounded-xl p-6 font-mono text-sm">
            {log.map((line, i) => (
              <div key={i} className="text-white/80 leading-relaxed">{line}</div>
            ))}
            <div className="text-[#D4AF37] mt-2 animate-pulse">Running...</div>
          </div>
        )}

        {done && (
          <div className="bg-[#0F1E35] border border-white/10 rounded-xl p-6 font-mono text-sm">
            {log.map((line, i) => (
              <div key={i} className="text-white/80 leading-relaxed">{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
