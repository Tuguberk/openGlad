import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env, TARGET_SUBREDDITS } from "./config/constants";
import { registerFrictionEngineTools } from "./tools/friction";
import { registerDiagnosticTools } from "./tools/diagnostics";

function createServer(env: Env) {
    const server = new McpServer({
        name: "openGlad Friction Engine",
        version: "4.0.0",
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // MCP PROMPTS
    // ═══════════════════════════════════════════════════════════════════════════

    server.prompt(
        "run-the-bet",
        "Initiate a friction engine pipeline for a new idea: Pattern Scan + Loss Simulation + Revenue Gate.",
        {
            idea: z.string().describe("Description of the idea."),
        },
        async ({ idea }) => ({
            messages: [
                {
                    role: "user" as const,
                    content: {
                        type: "text" as const,
                        text: `Run the friction pipeline on my idea using the run_the_bet tool:\n\nIdea: ${idea}`,
                    },
                },
            ],
        })
    );

    server.prompt(
        "analyze-startup",
        "Run a health diagnostic on startup metrics.",
        {
            context: z.string().optional().describe("Metrics or context."),
        },
        async ({ context }) => ({
            messages: [
                {
                    role: "user" as const,
                    content: {
                        type: "text" as const,
                        text: `Run a diagnostic analysis on my startup data using the analyze_startup tool:\n\n${context || "Check my general metrics."}`,
                    },
                },
            ],
        })
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // REGISTER TOOLS
    // ═══════════════════════════════════════════════════════════════════════════

    registerFrictionEngineTools(server, env);
    registerDiagnosticTools(server, env);

    return server;
}

// ─── Worker Entry Point ───────────────────────────────────────────────────────

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        if (url.pathname === "/mcp") {
            const server = createServer(env);
            return createMcpHandler(server)(request, env, ctx);
        }

        if (url.pathname === "/") {
            return new Response(
                JSON.stringify({
                    name: "openGlad Friction Engine",
                    version: "4.0.0",
                    mcp_endpoint: "/mcp",
                    description: "Loss-prevention friction engine for founders. Stops you from building things nobody wants.",
                    tools: [
                        "run_the_bet — Mega-pipeline: Pattern Scan + Loss Sim + Revenue Gate (Mistral)",
                        "pattern_scan — Behavioral risk detection",
                        "loss_simulation — 3-scenario failure prediction (Mistral)",
                        "revenue_gate — Locks building until monetization confirmed",
                        "analyze_market_trends — Overcrowding & entry risk filter (Mistral)",
                        "scan_reddit_trends — General warnings and trends (Mistral)",
                        "analyze_startup — Triage router (runs Friction Engine for ideas, Diagnostics for metrics)",
                        "analyze_execution_stability — Engineering risk",
                        "analyze_revenue_health — Financial risk",
                        "analyze_burnout_risk — Burnout risk",
                        "analyze_distribution_discipline — Marketing risk",
                        "generate_full_diagnosis — Comprehensive system scan",
                    ],
                    prompts: ["run-the-bet", "analyze-startup"],
                    data_sources: TARGET_SUBREDDITS,
                    powered_by: "Mistral AI (Agents API + Web Search)",
                }),
                { headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response("Not found", { status: 404 });
    },
} satisfies ExportedHandler<Env>;
