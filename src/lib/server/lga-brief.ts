import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export type LgaRow = { lga: string; collected: number; tipped: number };

export function validateRows(input: unknown): LgaRow[] {
  const rows = (input as { rows?: unknown })?.rows;
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 40) throw new Error("rows required");
  return rows.map((r) => {
    const { lga, collected, tipped } = r as Record<string, unknown>;
    if (typeof lga !== "string" || lga.length > 60 || typeof collected !== "number" || typeof tipped !== "number" || !isFinite(collected) || !isFinite(tipped)) throw new Error("bad row");
    return { lga, collected: Math.round(collected), tipped: Math.round(tipped) };
  });
}

const INSTRUCTIONS = `You write a weekly brief for LAWMA management in Lagos.
Write 3 to 4 short plain-English sentences, no headings, no bullets, no markdown.
Use only the figures given. Never invent numbers, causes or names.
Say total tonnes collected and tipped, name the LGAs with the largest gap between collected and tipped, and say which LGA tipped the most.
Use "tonnes", "tipped" (weighed in at a dumpsite or TLS) and "collected" (reported by PSP operators).
End by noting the figures are unconfirmed until an official confirms them.`;

export async function writeBrief(rows: LgaRow[], signal: AbortSignal) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw Object.assign(new Error("AI is not configured"), { status: 401 });
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const table = rows.map((r) => `${r.lga}: collected ${r.collected} t, tipped ${r.tipped} t`).join("\n");
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    prompt: `Figures for the last 7 days by LGA:\n${table}`,
    abortSignal: signal,
    maxRetries: 0,
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  return (await result.text).trim();
}
