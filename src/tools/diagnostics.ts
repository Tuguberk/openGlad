import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Env } from "../config/constants";
import { PROMPTS } from "../prompts";
import { fetchRedditContext } from "../services/reddit";
import { buildAnalysisResponse } from "../utils/helpers";

export function registerDiagnosticTools(server: McpServer, env: Env) {
  server.tool(
    "analyze_startup",
    `Smart triage router — the best starting point when unsure which tool to use. Pass the user's raw input and it auto-detects: ideas get routed to run_the_bet (with Reddit data), metrics/JSON get routed to the appropriate diagnostic. Set type to override auto-detection.`,
    {
      input: z
        .string()
        .describe(
          "Raw user input — can be an idea description, a complaint, or JSON metrics.",
        ),
      type: z
        .enum([
          "auto",
          "run_the_bet",
          "execution",
          "revenue",
          "burnout",
          "distribution",
          "full",
        ])
        .default("auto")
        .describe(
          "Override auto-detection. Use 'auto' to let the system decide, or specify a diagnostic type directly.",
        ),
    },
    async ({ input, type }) => {
      const isIdea =
        !input.trim().startsWith("{") &&
        !input.includes("MRR") &&
        !input.includes("churn");

      if (type === "run_the_bet" || (type === "auto" && isIdea)) {
        const redditData = await fetchRedditContext(input);
        const data = `IDEA:\n${input}\n\nMARKET DATA FROM REDDIT:\n${redditData}`;
        return buildAnalysisResponse(
          PROMPTS.run_the_bet,
          data,
          "friction pipeline",
        );
      }

      function getPromptForType(t: string): string {
        switch (t) {
          case "execution":
            return PROMPTS.execution_stability;
          case "revenue":
            return PROMPTS.revenue_health;
          case "burnout":
            return PROMPTS.burnout_risk;
          case "distribution":
            return PROMPTS.distribution_discipline;
          default:
            return PROMPTS.full_diagnosis;
        }
      }

      const p = getPromptForType(type);
      return buildAnalysisResponse(p, input, "diagnostic data");
    },
  );

  server.tool(
    "analyze_execution_stability",
    `Analyzes engineering metrics (commit frequency, deploy failure rate, tech debt) and produces an Execution Stability Score (1-100). Use when the user provides development/repo activity data as JSON.`,
    {
      metrics_json: z
        .string()
        .describe(
          "JSON string with engineering metrics: commits, deploys, merge velocity, etc.",
        ),
    },
    async ({ metrics_json }) =>
      buildAnalysisResponse(
        PROMPTS.execution_stability,
        metrics_json,
        "execution stability",
      ),
  );

  server.tool(
    "analyze_revenue_health",
    `Analyzes financial metrics (MRR/ARR, churn, CAC/LTV, burn rate) and produces a Revenue Health Score (1-100). Use when the user provides financial data as JSON.`,
    {
      metrics_json: z
        .string()
        .describe(
          "JSON string with financial metrics: MRR, ARR, churn rate, CAC, LTV, burn rate, runway.",
        ),
    },
    async ({ metrics_json }) =>
      buildAnalysisResponse(
        PROMPTS.revenue_health,
        metrics_json,
        "revenue health",
      ),
  );

  server.tool(
    "analyze_burnout_risk",
    `Analyzes team activity signals (work hours, context-switching, recovery) and produces a Burnout Risk Score (1-100). Use when the user provides team workload data as JSON.`,
    {
      metrics_json: z
        .string()
        .describe(
          "JSON string with team activity data: work hours, on-call frequency, sprint velocity, etc.",
        ),
    },
    async ({ metrics_json }) =>
      buildAnalysisResponse(PROMPTS.burnout_risk, metrics_json, "burnout risk"),
  );

  server.tool(
    "analyze_distribution_discipline",
    `Analyzes marketing/growth metrics (channel health, funnel, organic vs paid) and produces a Distribution Discipline Score (1-100). Use when the user provides marketing data as JSON.`,
    {
      metrics_json: z
        .string()
        .describe(
          "JSON string with marketing metrics: channel performance, conversion rates, content output, etc.",
        ),
    },
    async ({ metrics_json }) =>
      buildAnalysisResponse(
        PROMPTS.distribution_discipline,
        metrics_json,
        "distribution discipline",
      ),
  );

  server.tool(
    "generate_full_diagnosis",
    `Comprehensive system scan across all dimensions: Execution, Revenue, Burnout, and Distribution. Produces an Overall Health Score (1-100) with failure scenario predictions. Use this when the user provides complete startup telemetry covering multiple areas, or when they want a holistic view.`,
    {
      telemetry_json: z
        .string()
        .describe(
          "JSON string with comprehensive startup metrics covering engineering, finance, team, and marketing.",
        ),
    },
    async ({ telemetry_json }) =>
      buildAnalysisResponse(
        PROMPTS.full_diagnosis,
        telemetry_json,
        "startup telemetry",
      ),
  );
}
