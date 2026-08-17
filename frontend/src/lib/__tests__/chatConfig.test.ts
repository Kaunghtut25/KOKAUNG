import { describe, it, expect } from "vitest";
import {
  CLEAR_KEY,
  CHAT_PROVIDERS,
  effectiveSettings,
  isChatProvider,
  maskKey,
  resolveProvider,
} from "../chatConfig";

const env = {
  OPENAI_API_KEY: "env-openai",
  OPENAI_BASE_URL: "https://env.example.com/v1",
  OPENAI_MODEL: "env-model",
  ANTHROPIC_API_KEY: "env-anthropic",
  ANTHROPIC_MODEL: "env-claude",
  OLLAMA_BASE_URL: "http://env-ollama:11434/v1",
  OLLAMA_MODEL: "env-llama",
};

describe("maskKey", () => {
  it("returns empty for missing/empty key", () => {
    expect(maskKey()).toBe("");
    expect(maskKey("")).toBe("");
    expect(maskKey("   ")).toBe("");
  });
  it("masks short keys fully", () => {
    expect(maskKey("abc")).toBe("••••••••");
  });
  it("keeps first 4 and last 4 chars", () => {
    expect(maskKey("sk-abcdefghijklmnop")).toBe("sk-a…mnop");
  });
  it("never returns the full key", () => {
    const long = "sk-1234567890abcdefghijklmnop";
    expect(maskKey(long)).not.toContain("1234567890");
  });
});

describe("resolveProvider", () => {
  it("auto: OpenAI wins when present", () => {
    expect(resolveProvider({}, env)).toBe("openai");
  });
  it("auto: falls to Anthropic when no OpenAI key", () => {
    expect(resolveProvider({}, { ANTHROPIC_API_KEY: "k" })).toBe("anthropic");
  });
  it("auto: falls to Ollama when only base URL set", () => {
    expect(resolveProvider({}, { OLLAMA_BASE_URL: "http://localhost:11434/v1" })).toBe("ollama");
  });
  it("auto: none when nothing configured", () => {
    expect(resolveProvider({}, {})).toBe("none");
  });
  it("stored openai key wins over env for auto", () => {
    expect(resolveProvider({ openaiApiKey: "stored" }, env)).toBe("openai");
  });
  it("explicit openai uses openai key", () => {
    expect(resolveProvider({ provider: "openai", openaiApiKey: "k" }, {})).toBe("openai");
  });
  it("explicit anthropic uses anthropic even when openai env exists", () => {
    expect(resolveProvider({ provider: "anthropic", anthropicApiKey: "k" }, env)).toBe("anthropic");
  });
  it("explicit ollama uses stored base url", () => {
    expect(resolveProvider({ provider: "ollama", ollamaBaseUrl: "http://x:11434/v1" }, {})).toBe("ollama");
  });
  it("explicit provider with missing key resolves to none", () => {
    expect(resolveProvider({ provider: "openai" }, {})).toBe("none");
  });
});

describe("effectiveSettings", () => {
  it("stored values win over env", () => {
    const s = effectiveSettings({ openaiApiKey: "stored", openaiModel: "stored-model", openaiBaseUrl: "https://stored/v1" }, env);
    expect(s.openaiApiKey).toBe("stored");
    expect(s.openaiModel).toBe("stored-model");
    expect(s.openaiBaseUrl).toBe("https://stored/v1");
  });
  it("env falls back when nothing stored", () => {
    const s = effectiveSettings({}, env);
    expect(s.openaiApiKey).toBe("env-openai");
    expect(s.openaiModel).toBe("env-model");
    expect(s.openaiBaseUrl).toBe("https://env.example.com/v1");
    expect(s.anthropicModel).toBe("env-claude");
    expect(s.ollamaModel).toBe("env-llama");
  });
  it("applies defaults when nothing configured", () => {
    const s = effectiveSettings({}, {});
    expect(s.openaiModel).toBe("gpt-4o-mini");
    expect(s.anthropicModel).toBe("claude-3-5-sonnet-latest");
    expect(s.ollamaModel).toBe("qwen2.5-coder:3b");
    expect(s.openaiBaseUrl).toBe("https://api.openai.com/v1/chat/completions");
    expect(s.openaiApiKey).toBe("");
  });
});

describe("isChatProvider / CHAT_PROVIDERS", () => {
  it("accepts the four providers and rejects others", () => {
    expect(CHAT_PROVIDERS).toEqual(["auto", "openai", "anthropic", "ollama"]);
    expect(isChatProvider("openai")).toBe(true);
    expect(isChatProvider("auto")).toBe(true);
    expect(isChatProvider("gemini")).toBe(false);
    expect(isChatProvider(undefined)).toBe(false);
    expect(isChatProvider(123)).toBe(false);
  });
  it("CLEAR_KEY sentinel is stable", () => {
    expect(CLEAR_KEY).toBe("__CLEAR__");
  });
});
