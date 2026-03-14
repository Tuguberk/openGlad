import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env, TARGET_SUBREDDITS } from "../config/constants";
import { PROMPTS } from "../prompts";
import { fetchRedditContext } from "../services/reddit";
import { buildAnalysisResponse } from "../utils/helpers";

export function registerFrictionEngineTools(server: McpServer, env: Env) {
  server.tool(
    "run_the_bet",
    `The primary friction tool. Use this FIRST when a user shares a new startup idea or business concept. Executes the full pipeline: Pattern Scan + Loss Simulation + Revenue Gate + Micro-Correction. Automatically fetches real Reddit discussions for market validation. Returns a comprehensive reality check — present the full output to the user without summarizing.`,
    {
      idea_description: z
        .string()
        .describe(
          "The user's startup idea or business concept in their own words. Pass the full description, not a summary.",
        ),
    },
    async ({ idea_description }) => {
      const redditData = await fetchRedditContext(idea_description);
      const data = `IDEA:\n${idea_description}\n\nMARKET DATA FROM REDDIT:\n${redditData}`;
      return buildAnalysisResponse(
        PROMPTS.run_the_bet,
        data,
        "friction pipeline",
      );
    },
  );

  server.tool(
    "pattern_scan",
    `Detects behavioral antipatterns: overbuilding drift, monetization avoidance, prestige bias, idea hopping. Use this when the user is talking ABOUT their approach, mindset, or decision-making — not presenting a new idea. Does NOT search Reddit. For new ideas, use run_the_bet instead.`,
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
    `Simulates 3 failure scenarios (Best/Likely/Worst) for an idea with quantified expected loss in hours and money. Fetches Reddit data to ground predictions in real market signals. Use this when the user wants to understand the RISK of an idea without the full run_the_bet pipeline.`,
    {
      idea: z
        .string()
        .describe("The startup idea or concept to run failure simulation on."),
    },
    async ({ idea }) => {
      const redditData = await fetchRedditContext(idea);
      const data = `IDEA:\n${idea}\n\nMARKET DATA FROM REDDIT:\n${redditData}`;
      return buildAnalysisResponse(
        PROMPTS.loss_simulation,
        data,
        "loss simulation",
      );
    },
  );

  server.tool(
    "revenue_gate",
    `Locks the build phase and produces 2-3 specific monetization unlock tasks the user must complete before writing code. Use this when the user is eager to start building but hasn't validated willingness-to-pay. Does NOT search Reddit — purely behavioral.`,
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
    `Friction-focused market analysis: detects overcrowding, tarpit ideas, late entry risk, and failure rate signals from Reddit discussions. Use this when the user asks about market timing, competition, or whether their space is saturated.`,
    {
      idea_description: z
        .string()
        .describe(
          "The market, niche, or idea to analyze for trends and saturation.",
        ),
    },
    async ({ idea_description }) => {
      const redditData = await fetchRedditContext(idea_description);
      const data = `IDEA:\n${idea_description}\n\nMARKET DATA FROM REDDIT:\n${redditData}`;
      return buildAnalysisResponse(PROMPTS.market_trends, data, "market trend");
    },
  );

  server.tool(
    "scan_reddit_trends",
    `Broad Reddit trend scanner for any topic. Returns sentiment, red flags, cautionary tales, and a 6-12 month prediction. Use this for general market research when the user asks "what's happening with X" or wants to explore a space before committing.`,
    {
      topic: z
        .string()
        .describe(
          "The topic, technology, or market to scan (e.g. 'AI SaaS tools', 'no-code platforms', 'micro-SaaS').",
        ),
    },
    async ({ topic }) => {
      const redditData = await fetchRedditContext(topic);
      const data = `TOPIC:\n${topic}\n\nREDDIT TREND DATA:\n${redditData}`;
      return buildAnalysisResponse(
        PROMPTS.reddit_scan,
        data,
        "Reddit trend scan",
      );
    },
  );
}
