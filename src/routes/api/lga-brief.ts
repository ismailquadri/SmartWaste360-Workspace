import { createFileRoute } from "@tanstack/react-router";
import { validateRows, writeBrief } from "@/lib/server/lga-brief";

// Drafts the weekly LGA tonnage brief for the workspace overview. Figures come from the
// workspace; the model only words them. Officials confirm the figures in the workspace.
export const Route = createFileRoute("/api/lga-brief")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let rows;
        try {
          rows = validateRows(await request.json());
        } catch {
          return Response.json({ error: "Invalid figures." }, { status: 400 });
        }
        try {
          const text = await writeBrief(rows, request.signal);
          if (!text) return Response.json({ error: "The summary could not be written." }, { status: 502 });
          return Response.json({ text });
        } catch (e) {
          const err = e as { status?: number; statusCode?: number; message?: string };
          const status = err.statusCode ?? err.status ?? 500;
          const msg = status === 402 ? "AI credits have run out. Add credits in Settings to write summaries." : status === 429 ? "Too many requests. Try again in a minute." : "The summary could not be written right now.";
          return Response.json({ error: msg }, { status: [402, 403, 429].includes(status) ? status : 502 });
        }
      },
    },
  },
});
