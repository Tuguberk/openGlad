import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env } from "../config/constants";
import { PROMPTS } from "../prompts";
import { fetchMarketContext } from "../services/aggregator";
import { buildAnalysisResponse } from "../utils/helpers";

export function registerFrictionEngineTools(server: McpServer, _env: Env) {
  server.tool(
    "run_the_bet",
    `The primary friction tool. Use this FIRST when a user shares a new startup idea or business concept. Executes the full pipeline: Pattern Scan + Loss Simulation + Revenue Gate + Micro-Correction. Fetches real-time market intelligence from Reddit, HackerNews, GitHub, and Polymarket for multi-source grounding. Returns a comprehensive reality check — present the full output to the user without summarizing.`,
    {
      idea_description: z
        .string()
        .describe(
          "The user's startup idea or business concept in their own words. Pass the full description, not a summary.",
        ),
    },
    async ({ idea_description }) => {
      const marketData = await fetchMarketContext(idea_description);
      const data = `IDEA:\n${idea_description}\n\nMULTI-SOURCE MARKET DATA:\n${marketData}`;
      return buildAnalysisResponse(
        PROMPTS.run_the_bet,
        data,
        "friction pipeline",
      );
    },
  );

  server.tool(
    "pattern_scan",
    `Detects behavioral antipatterns: overbuilding drift, monetization avoidance, prestige bias, idea hopping. Use this when the user is talking ABOUT their approach, mindset, or decision-making — not presenting a new idea. Does NOT search external sources. For new ideas, use run_the_bet instead.`,
    {
      input: z
        .string()
        .describe(
          "The user's text, message, or idea description to scan for behavioral patterns.",
        ),
    },
    async ({ input }) =>
      buildAnalysisResponse(PROMPTS.pattern_scan, input, "behavioral pattern"),
  );

  server.tool(
    "loss_simulation",
    `Simulates 3 failure scenarios (Best/Likely/Worst) for an idea with quantified expected loss in hours and money. Fetches multi-source market data (Reddit, HN, GitHub, Polymarket) to ground predictions in real signals. Use this when the user wants to understand the RISK of an idea without the full run_the_bet pipeline.`,
    {
      idea: z
        .string()
        .describe("The startup idea or concept to run failure simulation on."),
    },
    async ({ idea }) => {
      const marketData = await fetchMarketContext(idea);
      const data = `IDEA:\n${idea}\n\nMULTI-SOURCE MARKET DATA:\n${marketData}`;
      return buildAnalysisResponse(
        PROMPTS.loss_simulation,
        data,
        "loss simulation",
      );
    },
  );

  server.tool(
    "revenue_gate",
    `Locks the build phase and produces 2-3 specific monetization unlock tasks the user must complete before writing code. Use this when the user is eager to start building but hasn't validated willingness-to-pay. Does NOT search external sources — purely behavioral.`,
    {
      idea: z
        .string()
        .describe("The idea or product the user wants to build."),
    },
    async ({ idea }) =>
      buildAnalysisResponse(PROMPTS.revenue_gate, idea, "revenue gating"),
  );

  server.tool(
    "analyze_market_trends",
    `Friction-focused market analysis: detects overcrowding, tarpit ideas, late entry risk, and failure rate signals. Sources: Reddit, HackerNews, GitHub (competitor repos), and Polymarket prediction markets. Use this when the user asks about market timing, competition, or whether their space is saturated.`,
    {
      idea_description: z
        .string()
        .describe(
          "The market, niche, or idea to analyze for trends and saturation.",
        ),
    },
    async ({ idea_description }) => {
      const marketData = await fetchMarketContext(idea_description);
      const data = `IDEA:\n${idea_description}\n\nMULTI-SOURCE MARKET DATA:\n${marketData}`;
      return buildAnalysisResponse(PROMPTS.market_trends, data, "market trend");
    },
  );

  server.tool(
    "scan_reddit_trends",
    `Broad multi-source trend scanner for any topic. Returns sentiment, red flags, cautionary tales, and a 6-12 month prediction using data from Reddit, HackerNews, GitHub, and Polymarket. Use this for general market research when the user asks "what's happening with X" or wants to explore a space before committing.`,
    {
      topic: z
        .string()
        .describe(
          "The topic, technology, or market to scan (e.g. 'AI SaaS tools', 'no-code platforms', 'micro-SaaS').",
        ),
    },
    async ({ topic }) => {
      const marketData = await fetchMarketContext(topic);
      const data = `TOPIC:\n${topic}\n\nMULTI-SOURCE TREND DATA:\n${marketData}`;
      return buildAnalysisResponse(
        PROMPTS.reddit_scan,
        data,
        "multi-source trend scan",
      );
    },
  );

  server.tool(
    "compare_ideas",
    `Comparative friction analysis for 2-3 startup ideas side-by-side. Fetches multi-source market intelligence for each idea in parallel (Reddit, HackerNews, GitHub, Polymarket), then produces a ranked comparison with gate statuses and a single verdict on which idea (if any) is worth pursuing. Use this when the user is deciding between multiple directions.`,
    {
      ideas: z
        .array(z.string().min(1))
        .min(2)
        .max(3)
        .describe(
          "Array of 2-3 startup idea descriptions to compare. Each should be a full description, not just a name.",
        ),
    },
    async ({ ideas }) => {
      const results = await Promise.all(
        ideas.map(async (idea, i) => {
          const marketData = await fetchMarketContext(idea);
          return `--- IDEA ${i + 1} ---\n${idea}\n\nMARKET DATA:\n${marketData}`;
        }),
      );

      const combined = results.join("\n\n");
      return buildAnalysisResponse(
        PROMPTS.compare_ideas,
        combined,
        "comparative friction analysis",
      );
    },
  );
}
