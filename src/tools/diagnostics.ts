import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env, TARGET_SUBREDDITS } from "../config/constants";
import { PROMPTS } from "../prompts";
import { callMistralWithWebSearch } from "../services/mistral";
import { buildAnalysisResponse, errorResponse } from "../utils/helpers";

export function registerDiagnosticTools(server: McpServer, env: Env) {
    server.tool(
        "analyze_startup",
        "Triage router: Interprets raw user input and routes to 'Run the Bet' (for ideas) or diagnostic tools (for metrics).",
        {
            input: z.string().describe("Raw user input (idea, complaint, metrics)."),
            type: z.enum(["auto", "run_the_bet", "execution", "revenue", "burnout", "distribution", "full"]).default("auto"),
        },
        async ({ input, type }) => {
            // Auto-triage: if it doesn't look like JSON/metrics, it's likely an idea -> friction engine pipeline
            const isIdea = !input.trim().startsWith("{") && !input.includes("MRR") && !input.includes("churn");

            if (type === "run_the_bet" || (type === "auto" && isIdea)) {
                if (!env.MISTRAL_API_KEY) return errorResponse("MISTRAL_API_KEY required for Friction Engine.");
                const query = `Analyze this idea and perform a web search on subreddits (${TARGET_SUBREDDITS.join(", ")}) to find failure signals.\n\nIdea:\n${input}`;
                try {
                    const response = await callMistralWithWebSearch(env.MISTRAL_API_KEY, PROMPTS.run_the_bet, query);
                    const instruction = `I have completed the analysis. Please present the EXACT following text to the user, preserving all markdown formatting, emojis, and styling. DO NOT summarize or alter it:\n\n${response}`;
                    return { content: [{ type: "text" as const, text: instruction }] };
                } catch (e) {
                    return errorResponse(`Run The Bet failed: ${e instanceof Error ? e.message : String(e)}`);
                }
            }

            function getPromptForType(t: string): string {
                switch (t) {
                    case "execution": return PROMPTS.execution_stability;
                    case "revenue": return PROMPTS.revenue_health;
                    case "burnout": return PROMPTS.burnout_risk;
                    case "distribution": return PROMPTS.distribution_discipline;
                    default: return PROMPTS.full_diagnosis;
                }
            }

            const p = getPromptForType(type);
            return buildAnalysisResponse(p, input, "diagnostic data");
        }
    );

    server.tool(
        "analyze_execution_stability",
        "Analyze engineering metrics for stability risk.",
        { metrics_json: z.string() },
        async ({ metrics_json }) => buildAnalysisResponse(PROMPTS.execution_stability, metrics_json, "execution stability")
    );

    server.tool(
        "analyze_revenue_health",
        "Analyze financial metrics for survival risk.",
        { metrics_json: z.string() },
        async ({ metrics_json }) => buildAnalysisResponse(PROMPTS.revenue_health, metrics_json, "revenue health")
    );

    server.tool(
        "analyze_burnout_risk",
        "Analyze team activity for burnout risk.",
        { metrics_json: z.string() },
        async ({ metrics_json }) => buildAnalysisResponse(PROMPTS.burnout_risk, metrics_json, "burnout risk")
    );

    server.tool(
        "analyze_distribution_discipline",
        "Analyze marketing execution.",
        { metrics_json: z.string() },
        async ({ metrics_json }) => buildAnalysisResponse(PROMPTS.distribution_discipline, metrics_json, "distribution discipline")
    );

    server.tool(
        "generate_full_diagnosis",
        "Full body scan of all dimensions.",
        { telemetry_json: z.string() },
        async ({ telemetry_json }) => buildAnalysisResponse(PROMPTS.full_diagnosis, telemetry_json, "startup telemetry")
    );
}
