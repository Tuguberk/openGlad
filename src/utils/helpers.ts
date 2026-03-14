import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Attempts MCP sampling (server asks the client's LLM to generate the analysis).
 * If the client doesn't support sampling, falls back to returning the prompt + data
 * for the client AI to process on its own.
 */
export async function buildAnalysisResponse(
  prompt: string,
  data: string,
  domain: string,
  server?: McpServer,
) {
  if (server) {
    try {
      const result = await server.server.createMessage({
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: data,
            },
          },
        ],
        systemPrompt: prompt,
        maxTokens: 4096,
        modelPreferences: {
          intelligencePriority: 0.9,
          speedPriority: 0.3,
          costPriority: 0.2,
        },
      });

      const text =
        typeof result.content === "string"
          ? result.content
          : Array.isArray(result.content)
            ? result.content
                .filter((b: { type: string }) => b.type === "text")
                .map((b: { type: string; text?: string }) => b.text ?? "")
                .join("\n")
            : "type" in result.content && result.content.type === "text"
              ? (result.content as { type: "text"; text: string }).text
              : JSON.stringify(result.content);

      return {
        content: [{ type: "text" as const, text }],
      };
    } catch {
      // Sampling not supported or rejected — fall back to prompt mode
    }
  }

  return {
    content: [
      {
        type: "text" as const,
        text: `I have received the ${domain} data. I am passing it to the Diagnostic Engine for analysis. You MUST use the following system instruction to process the data.\n\nSYSTEM INSTRUCTION:\n${prompt}\n\nDATA TO ANALYZE:\n\`\`\`json\n${data}\n\`\`\``,
      },
    ],
  };
}
