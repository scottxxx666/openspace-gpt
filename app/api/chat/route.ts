import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { jsonSchema, streamText } from "ai";
import { xai } from "@ai-sdk/xai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const {messages, system, tools, model: modelText} = await req.json();

  const model = modelText == "gemini-2.5" ? google("gemini-2.5-flash-preview-04-17") : xai("grok-3-mini-beta");
  const result = streamText({
    model: model,
    messages,
    // forward system prompt and tools from the frontend
    system,
    tools: Object.fromEntries(
      Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
        name,
        {
          parameters: jsonSchema(tool.parameters!),
        },
      ]),
    ),
  });

  return result.toDataStreamResponse();
}
