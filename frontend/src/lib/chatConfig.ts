/**
 * chatConfig.ts — Live Chat provider configuration helpers.
 *
 * Admin-configured settings for the Live Chat AI (provider, API keys, model,
 * base URL) are stored server-side in the persistentStore "settings" collection
 * under the fixed id "chat-config". API keys are NEVER returned to the client
 * in full — the admin API returns only a masked preview and a set/not-set flag.
 *
 * Shared by:
 *  - /api/admin/chat-config   (save + mask)
 *  - /api/chat                (runtime resolution with env fallback)
 *  - unit tests               (src/lib/__tests__/chatConfig.test.ts)
 */

export type ChatProvider = "auto" | "openai" | "anthropic" | "ollama";

export const CHAT_PROVIDERS: readonly ChatProvider[] = ["auto", "openai", "anthropic", "ollama"] as const;

/** Sentinel value: PUT with this value removes a stored API key. */
export const CLEAR_KEY = "__CLEAR__";

/** Record shape stored in persistentStore "settings" (id = "chat-config"). */
export interface StoredChatConfig {
  id?: string;
  provider?: ChatProvider;
  openaiApiKey?: string;
  openaiBaseUrl?: string;
  openaiModel?: string;
  anthropicApiKey?: string;
  anthropicModel?: string;
  ollamaBaseUrl?: string;
  ollamaModel?: string;
}

export type ResolvedProvider = "openai" | "anthropic" | "ollama" | "none";

/** Environment fallbacks mirroring the original /api/chat env contract. */
export interface ChatEnv {
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  OLLAMA_BASE_URL?: string;
  OLLAMA_MODEL?: string;
}

/** Mask a secret for admin UI display, e.g. "sk-…wxyz". Empty string when unset. */
export function maskKey(key?: string): string {
  if (!key) return "";
  const k = key.trim();
  if (!k) return "";
  if (k.length <= 8) return "••••••••";
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}

export function isChatProvider(v: unknown): v is ChatProvider {
  return typeof v === "string" && (CHAT_PROVIDERS as readonly string[]).includes(v);
}

/**
 * Decide which provider actually serves the chat.
 * Explicit stored provider wins; "auto" keeps the original priority
 * (OpenAI first, then Anthropic, then local Ollama). Missing required
 * config for an explicit provider resolves to "none" (keyword bot).
 */
export function resolveProvider(cfg: StoredChatConfig, env: Record<string, string | undefined>): ResolvedProvider {
  const provider = isChatProvider(cfg.provider) ? cfg.provider : "auto";
  const apiKey = cfg.openaiApiKey || env.OPENAI_API_KEY;
  const anthropicKey = cfg.anthropicApiKey || env.ANTHROPIC_API_KEY;
  const ollamaBase = cfg.ollamaBaseUrl || env.OLLAMA_BASE_URL;

  if (provider === "openai") return apiKey ? "openai" : "none";
  if (provider === "anthropic") return anthropicKey ? "anthropic" : "none";
  if (provider === "ollama") return ollamaBase ? "ollama" : "none";
  if (apiKey) return "openai";
  if (anthropicKey) return "anthropic";
  if (ollamaBase) return "ollama";
  return "none";
}

/** Effective runtime settings: stored value wins, env value falls back, then default. */
export function effectiveSettings(cfg: StoredChatConfig, env: Record<string, string | undefined>) {
  return {
    openaiApiKey: cfg.openaiApiKey || env.OPENAI_API_KEY || "",
    openaiBaseUrl: cfg.openaiBaseUrl || env.OPENAI_BASE_URL || "https://api.openai.com/v1/chat/completions",
    openaiModel: cfg.openaiModel || env.OPENAI_MODEL || "gpt-4o-mini",
    anthropicApiKey: cfg.anthropicApiKey || env.ANTHROPIC_API_KEY || "",
    anthropicModel: cfg.anthropicModel || env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
    ollamaBaseUrl: cfg.ollamaBaseUrl || env.OLLAMA_BASE_URL || "",
    ollamaModel: cfg.ollamaModel || env.OLLAMA_MODEL || "qwen2.5-coder:3b",
  };
}
