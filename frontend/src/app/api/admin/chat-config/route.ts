import { NextRequest, NextResponse } from "next/server";
import { getAll, create, update } from "@/lib/persistentStore";
import {
  CLEAR_KEY,
  isChatProvider,
  maskKey,
  type StoredChatConfig,
} from "@/lib/chatConfig";

export const dynamic = "force-dynamic";

const RECORD_ID = "chat-config";
const COLLECTION = "settings";

function pickString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * GET — current Live Chat configuration for the admin panel.
 * API keys are NEVER returned in full: only a set-flag and a masked preview.
 * Env fallback status is included so admins can see what the server uses.
 */
export async function GET() {
  try {
    const store = await import("@/lib/persistentStore");
    const items = await store.getAll(COLLECTION);
    const cfg = (items.find((r: any) => r.id === RECORD_ID) || {}) as StoredChatConfig;

    return NextResponse.json({
      provider: isChatProvider(cfg.provider) ? cfg.provider : "auto",
      openaiBaseUrl: pickString(cfg.openaiBaseUrl),
      openaiModel: pickString(cfg.openaiModel),
      anthropicModel: pickString(cfg.anthropicModel),
      ollamaBaseUrl: pickString(cfg.ollamaBaseUrl),
      ollamaModel: pickString(cfg.ollamaModel),
      openaiApiKeySet: !!cfg.openaiApiKey,
      openaiApiKeyPreview: maskKey(cfg.openaiApiKey),
      anthropicApiKeySet: !!cfg.anthropicApiKey,
      anthropicApiKeyPreview: maskKey(cfg.anthropicApiKey),
      env: {
        openaiBaseUrl: process.env.OPENAI_BASE_URL || "",
        openaiModel: process.env.OPENAI_MODEL || "",
        anthropicModel: process.env.ANTHROPIC_MODEL || "",
        ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "",
        ollamaModel: process.env.OLLAMA_MODEL || "",
        openaiApiKeySet: !!process.env.OPENAI_API_KEY,
        anthropicApiKeySet: !!process.env.ANTHROPIC_API_KEY,
      },
    });
  } catch (err) {
    console.error("[chat-config] GET failed:", (err as Error).message);
    return NextResponse.json({ message: "Failed to load chat configuration" }, { status: 500 });
  }
}

/**
 * PUT — save Live Chat configuration.
 * API key semantics: "" / missing = keep existing; CLEAR_KEY = remove; otherwise replace.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const store = await import("@/lib/persistentStore");
    const items = await store.getAll(COLLECTION);
    const existing = (items.find((r: any) => r.id === RECORD_ID) || {}) as StoredChatConfig;

    const nextKey = (field: "openaiApiKey" | "anthropicApiKey", val: unknown): string | undefined => {
      if (val === CLEAR_KEY) return undefined;
      const s = pickString(val);
      if (!s) return typeof existing[field] === "string" ? existing[field] : undefined;
      return s;
    };

    const record: StoredChatConfig = {
      id: RECORD_ID,
      provider: isChatProvider(body.provider) ? body.provider : "auto",
      openaiApiKey: nextKey("openaiApiKey", body.openaiApiKey),
      openaiBaseUrl: pickString(body.openaiBaseUrl),
      openaiModel: pickString(body.openaiModel),
      anthropicApiKey: nextKey("anthropicApiKey", body.anthropicApiKey),
      anthropicModel: pickString(body.anthropicModel),
      ollamaBaseUrl: pickString(body.ollamaBaseUrl),
      ollamaModel: pickString(body.ollamaModel),
    };

    if (existing.id) {
      await store.update(COLLECTION, existing.id, record);
    } else {
      await store.create(COLLECTION, record);
    }

    return NextResponse.json({
      success: true,
      provider: record.provider,
      openaiApiKeySet: !!record.openaiApiKey,
      anthropicApiKeySet: !!record.anthropicApiKey,
    });
  } catch (err) {
    console.error("[chat-config] PUT failed:", (err as Error).message);
    return NextResponse.json({ message: "Failed to save chat configuration" }, { status: 500 });
  }
}
