import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env, TARGET_SUBREDDITS } from "./config/constants";
import { registerFrictionEngineTools } from "./tools/friction";
import { registerDiagnosticTools } from "./tools/diagnostics";

const USAGE_GUIDE = `# openGlad Friction Engine — Agent Usage Guide

## What is openGlad?
A loss-prevention friction engine for startup founders. It does NOT accelerate — it creates structural doubt to prevent building things nobody wants.

## Tool Selection Guide

### User has a NEW IDEA → use \`run_the_bet\`
This is the primary tool. It runs the full pipeline (Pattern Scan + Loss Simulation + Revenue Gate) and fetches real Reddit discussions for market grounding. Present the full output to the user — do not summarize.

### User is TALKING ABOUT their approach → use \`pattern_scan\`
Detects behavioral antipatterns (overbuilding, monetization avoidance, prestige bias). No Reddit search. Use when the user is reflecting, not pitching.

### User asks about RISK of an idea → use \`loss_simulation\`
Focused failure simulation with 3 scenarios (Best/Likely/Worst) and quantified expected loss. Uses Reddit data.

### User wants to START BUILDING → use \`revenue_gate\`
Locks the build phase and produces monetization unlock tasks. No Reddit search.

### User asks about MARKET or COMPETITION → use \`analyze_market_trends\`
Overcrowding detection, tarpit idea check, late entry risk. Uses Reddit data.

### User asks about TRENDS → use \`scan_reddit_trends\`
General trend scanner for any topic. Sentiment, red flags, predictions. Uses Reddit data.

### User provides METRICS (JSON) → use diagnostics
- Engineering data → \`analyze_execution_stability\`
- Financial data → \`analyze_revenue_health\`
- Team/workload data → \`analyze_burnout_risk\`
- Marketing data → \`analyze_distribution_discipline\`
- Everything → \`generate_full_diagnosis\`

### Not sure which tool? → use \`analyze_startup\`
Smart triage router. Pass the raw input and it auto-detects whether to run friction pipeline or diagnostics.

## Recommended Workflows

### New Idea Evaluation (most common)
1. \`run_the_bet\` — Full friction pipeline with Reddit data
2. If user pushes back: \`revenue_gate\` — Lock building until monetization proven
3. If user asks about market: \`analyze_market_trends\` — Competition check

### Ongoing Startup Health Check
1. \`generate_full_diagnosis\` — Overall health scan
2. Then drill into weak areas with specific diagnostic tools

### Market Research
1. \`scan_reddit_trends\` — Broad trend overview
2. \`analyze_market_trends\` — Focused saturation analysis for a specific idea

## Important Notes
- ALWAYS present tool output EXACTLY as returned — do not summarize, rewrite, or soften the language
- The engine is intentionally harsh — that's the point
- Reddit data is cached for 1 hour to avoid rate limiting
- Tools that search Reddit: run_the_bet, loss_simulation, analyze_market_trends, scan_reddit_trends
- Tools that DON'T search Reddit: pattern_scan, revenue_gate, all analyze_* diagnostics`;

function createServer(env: Env) {
  const server = new McpServer({
    name: "openGlad Friction Engine",
    version: "4.0.0",
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // MCP RESOURCE — USAGE GUIDE
  // ═══════════════════════════════════════════════════════════════════════════

  server.resource("usage-guide", "openglad://guide", async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/markdown",
        text: USAGE_GUIDE,
      },
    ],
  }));

  // ═══════════════════════════════════════════════════════════════════════════
  // MCP PROMPTS
  // ═══════════════════════════════════════════════════════════════════════════

  server.prompt(
    "run-the-bet",
    "Initiate the full friction engine pipeline for a new idea: Pattern Scan + Loss Simulation + Revenue Gate. This is the recommended starting point for any new idea.",
    {
      idea: z.string().describe("Description of the idea."),
    },
    async ({ idea }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Run the friction pipeline on my idea using the run_the_bet tool. Present the FULL output without summarizing:\n\nIdea: ${idea}`,
          },
        },
      ],
    }),
  );

  server.prompt(
    "market-check",
    "Check if a market or niche is saturated, a tarpit, or worth entering. Uses Reddit trend data.",
    {
      market: z
        .string()
        .describe("The market, niche, or space to investigate."),
    },
    async ({ market }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `First use scan_reddit_trends to get a broad overview of "${market}", then use analyze_market_trends to check for overcrowding and entry risk. Present both outputs fully.`,
          },
        },
      ],
    }),
  );

  server.prompt(
    "should-i-build",
    "Quick friction check: should the user build this, or are they falling into a trap? Combines pattern scan with revenue gate.",
    {
      idea: z.string().describe("What the user wants to build."),
    },
    async ({ idea }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `I want to build: ${idea}\n\nFirst use pattern_scan to detect behavioral risks in my thinking. Then use revenue_gate to determine if I should be allowed to build. Present both outputs fully without softening.`,
          },
        },
      ],
    }),
  );

  server.prompt(
    "analyze-startup",
    "Run a health diagnostic on startup metrics. Accepts JSON metrics for execution, revenue, burnout, or distribution analysis.",
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
    }),
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
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
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
          description:
            "Loss-prevention friction engine for founders. Stops you from building things nobody wants.",
          tools: [
            "run_the_bet — Mega-pipeline: Pattern Scan + Loss Sim + Revenue Gate (Reddit)",
            "pattern_scan — Behavioral risk detection",
            "loss_simulation — 3-scenario failure prediction (Reddit)",
            "revenue_gate — Locks building until monetization confirmed",
            "analyze_market_trends — Overcrowding & entry risk filter (Reddit)",
            "scan_reddit_trends — General warnings and trends (Reddit)",
            "analyze_startup — Triage router (runs Friction Engine for ideas, Diagnostics for metrics)",
            "analyze_execution_stability — Engineering risk",
            "analyze_revenue_health — Financial risk",
            "analyze_burnout_risk — Burnout risk",
            "analyze_distribution_discipline — Marketing risk",
            "generate_full_diagnosis — Comprehensive system scan",
          ],
          prompts: [
            "run-the-bet",
            "market-check",
            "should-i-build",
            "analyze-startup",
          ],
          resources: ["openglad://guide — Agent usage guide"],
          data_sources: TARGET_SUBREDDITS,
          powered_by: "Reddit Public JSON API (Direct Web Search)",
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
