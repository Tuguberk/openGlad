import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env, TARGET_SUBREDDITS } from "../config/constants";
import { PROMPTS } from "../prompts";
import { callMistralWithWebSearch } from "../services/mistral";
import { buildAnalysisResponse, errorResponse } from "../utils/helpers";

export function registerFrictionEngineTools(server: McpServer, env: Env) {
    server.tool(
        "run_the_bet",
        "Executes the full Friction Engine mega-pipeline: Behavioral Pattern Scan + Failure Simulation + Revenue Gate + Micro-Correction. Requires Mistral API web search.",
        {
            idea_description: z.string().describe("The user's idea or business concept."),
        },
        async ({ idea_description }) => {
            if (!env.MISTRAL_API_KEY) return errorResponse("MISTRAL_API_KEY required.");
            const query = `Analyze this idea and perform a web search on subreddits (${TARGET_SUBREDDITS.join(", ")}) to find similar ideas, failure signals, and competitors.\n\nIdea:\n${idea_description}`;
            try {
                const response = await callMistralWithWebSearch(env.MISTRAL_API_KEY, PROMPTS.run_the_bet, query);
                const instruction = `I have completed the analysis. Please present the EXACT following text to the user, preserving all markdown formatting, emojis, and styling. DO NOT summarize or alter it:\n\n${response}`;
                return { content: [{ type: "text" as const, text: instruction }] };
            } catch (e) {
                return errorResponse(`Run The Bet failed: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    );

    server.tool(
        "pattern_scan",
        "Detects behavioral risks like overbuilding drift, monetization avoidance, and prestige bias from the user's input.",
        { input: z.string().describe("User's text/idea.") },
        async ({ input }) => buildAnalysisResponse(PROMPTS.pattern_scan, input, "behavioral pattern")
    );

    server.tool(
        "loss_simulation",
        "Simulates 3 failure outcomes (Best/Likely/Worst) for an idea using Reddit market data, calculating expected loss in hours and money.",
        { idea: z.string().describe("The idea to simulate.") },
        async ({ idea }) => {
            if (!env.MISTRAL_API_KEY) return errorResponse("MISTRAL_API_KEY required.");
            const query = `Find comparable ideas on subreddits (${TARGET_SUBREDDITS.join(", ")}) and predict failure modes for this idea:\n${idea}`;
            try {
                const response = await callMistralWithWebSearch(env.MISTRAL_API_KEY, PROMPTS.loss_simulation, query);
                const instruction = `I have completed the analysis. Please present the EXACT following text to the user, preserving all markdown formatting, emojis, and styling. DO NOT summarize or alter it:\n\n${response}`;
                return { content: [{ type: "text" as const, text: instruction }] };
            } catch (e) {
                return errorResponse(`Loss Simulation failed: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    );

    server.tool(
        "revenue_gate",
        "Generate a harsh revenue gate that blocks product building until 2-3 specific monetization unlock tasks are completed.",
        { idea: z.string().describe("The idea being gated.") },
        async ({ idea }) => buildAnalysisResponse(PROMPTS.revenue_gate, idea, "revenue gating")
    );

    server.tool(
        "analyze_market_trends",
        "Analyzes Reddit trends as a friction filter, looking for overcrowding, late entry risks, and high failure rates.",
        { idea_description: z.string() },
        async ({ idea_description }) => {
            if (!env.MISTRAL_API_KEY) return errorResponse("MISTRAL_API_KEY required.");
            const query = `Search Reddit (${TARGET_SUBREDDITS.join(", ")}) for: ${idea_description}`;
            try {
                const response = await callMistralWithWebSearch(env.MISTRAL_API_KEY, PROMPTS.market_trends, query);
                const instruction = `I have completed the analysis. Please present the EXACT following text to the user, preserving all markdown formatting, emojis, and styling. DO NOT summarize or alter it:\n\n${response}`;
                return { content: [{ type: "text" as const, text: instruction }] };
            } catch (e) {
                return errorResponse(`Market Trends failed: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    );

    server.tool(
        "scan_reddit_trends",
        "Scans Reddit for broad topic trends, prioritizing cautionary tales and red flags.",
        { topic: z.string() },
        async ({ topic }) => {
            if (!env.MISTRAL_API_KEY) return errorResponse("MISTRAL_API_KEY required.");
            const query = `Search Reddit (${TARGET_SUBREDDITS.join(", ")}) for trends, sentiment, and warnings about: ${topic}`;
            try {
                const response = await callMistralWithWebSearch(env.MISTRAL_API_KEY, PROMPTS.reddit_scan, query);
                const instruction = `I have completed the analysis. Please present the EXACT following text to the user, preserving all markdown formatting, emojis, and styling. DO NOT summarize or alter it:\n\n${response}`;
                return { content: [{ type: "text" as const, text: instruction }] };
            } catch (e) {
                return errorResponse(`Reddit Scan failed: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    );
}
