import { createMcpHandler } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

interface Env {
    MISTRAL_API_KEY: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TARGET_SUBREDDITS = [
    "r/Startup_Ideas",
    "r/Business_Ideas",
    "r/SaaS",
    "r/SideProject",
    "r/EntrepreneurRideAlong",
    "r/IndieHackers",
    "r/Futurology",
    "r/Technology",
    "r/AINewsAndTrends",
    "r/Startups",
    "r/Entrepreneur",
];

// ─── Diagnostic Prompt Templates ──────────────────────────────────────────────

const BASE_PERSONA = `You are the openGlad Diagnostic Engine, a clinical, precise, and highly analytical AI system functioning as the "Nervous System" for a startup.
Do not provide generic advice. Do not use motivational language. Be objective, diagnostic, and direct.`;

const PROMPTS = {
    execution_stability: `${BASE_PERSONA}

Analyze the following repository/development activity metrics and produce a detailed, narrative clinical report on the startup's EXECUTION STABILITY.

Focus on:
- Commit frequency and consistency (are there erratic bursts or steady cadence?)
- PR merge velocity and review turnaround
- Deploy frequency and failure rate
- Issue/bug resolution speed
- Technical debt indicators (stale branches, unresolved issues)

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Execution Stability Score**: State a score from 1-100 and explain what it means.
2. **Commit & Development Cadence**: Describe the health of the commit patterns in detail.
3. **Deployment & Release Risk**: Assess how reliably code moves from development to production.
4. **Technical Debt Assessment**: Analyze signs of accumulating debt.
5. **Key Findings**: List the most critical observations with clinical explanations.
6. **Clinical Recommendation**: Provide 2-3 specific, actionable interventions.

Write in a clinical, analytical tone. Be thorough and explain your reasoning. Each section should be at least 2-3 sentences.`,

    revenue_health: `${BASE_PERSONA}

Analyze the following revenue and financial metrics and produce a detailed, narrative clinical report on the startup's REVENUE HEALTH.

Focus on:
- MRR/ARR trajectory and growth rate
- Churn rate and retention patterns
- Customer acquisition cost (CAC) vs lifetime value (LTV)
- Revenue concentration risk (dependency on few customers)
- Burn rate vs revenue growth ratio

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Revenue Health Score**: State a score from 1-100 and explain the overall financial condition.
2. **Growth Trajectory Analysis**: Describe the revenue growth pattern in detail.
3. **Churn & Retention Assessment**: Analyze customer retention patterns.
4. **Unit Economics Review**: Evaluate CAC vs LTV.
5. **Runway & Burn Rate**: Assess how long the company can sustain current operations.
6. **Key Findings**: List the most critical financial observations with clinical explanations.
7. **Clinical Recommendation**: Provide 2-3 specific, actionable financial interventions.

Write in a clinical, analytical tone. Be thorough. Each section should be at least 2-3 sentences.`,

    burnout_risk: `${BASE_PERSONA}

Analyze the following team activity and workload signals and produce a detailed, narrative clinical report on the BURNOUT & FATIGUE RISK for the founding team.

Focus on:
- Work hour patterns (late-night commits, weekend activity, irregular hours)
- Signal volume and entropy (too many context switches, scattered focus)
- Ratio of reactive work (bug fixes, incidents) vs proactive work (features, planning)
- Communication patterns (response times, message volume)
- Breaks and downtime patterns

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Burnout Risk Score**: State a score from 1-100 and explain the risk level.
2. **Work Pattern Analysis**: Describe the work patterns in detail.
3. **Focus & Cognitive Load**: Assess context-switching and cognitive entropy.
4. **Recovery & Downtime Signals**: Analyze rest and recovery patterns.
5. **Reactive vs Proactive Work Balance**: Assess the work ratio.
6. **Key Findings**: List critical burnout signals with clinical explanations.
7. **Clinical Recommendation**: Provide 2-3 specific interventions to reduce burnout risk.

Write in a clinical, analytical tone. Each section should be at least 2-3 sentences.`,

    distribution_discipline: `${BASE_PERSONA}

Analyze the following marketing, distribution, and growth metrics and produce a detailed, narrative clinical report on the startup's DISTRIBUTION DISCIPLINE.

Focus on:
- Consistency of content/marketing output
- Channel diversification vs concentration
- Conversion funnel health (top-of-funnel → activation → retention)
- Organic vs paid acquisition balance
- Community/audience growth trajectory

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Distribution Discipline Score**: State a score from 1-100.
2. **Output Consistency Analysis**: Describe the marketing/content output patterns.
3. **Channel Health Assessment**: Analyze channel diversification.
4. **Funnel Efficiency Review**: Evaluate the conversion funnel.
5. **Organic vs Paid Balance**: Assess the acquisition strategy sustainability.
6. **Key Findings**: List critical distribution observations with clinical explanations.
7. **Clinical Recommendation**: Provide 2-3 specific distribution interventions.

Write in a clinical, analytical tone. Each section should be at least 2-3 sentences.`,

    full_diagnosis: `${BASE_PERSONA}

Analyze ALL of the following startup telemetry data and produce a comprehensive, detailed clinical diagnosis of the startup's overall health. This is a full-body scan.

Evaluate across these dimensions:
1. Execution Stability (dev velocity, deployment health, technical debt)
2. Revenue Health (growth, churn, runway)
3. Burnout & Fatigue Risk (work patterns, focus entropy)
4. Distribution Discipline (marketing consistency, funnel health)

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Overall Health Score**: State a composite score from 1-100 with a 2-3 sentence executive summary.
2. **Execution Stability** (Score: X/100): Detailed assessment of engineering discipline.
3. **Revenue Health** (Score: X/100): Detailed assessment of financial sustainability.
4. **Burnout & Fatigue Risk** (Score: X/100): Detailed assessment of human sustainability.
5. **Distribution Discipline** (Score: X/100): Detailed assessment of go-to-market execution.
6. **Critical Risks**: 2-3 most urgent risks with explanations.
7. **Recommended Interventions**: 3-5 specific, prioritized interventions.

Write in a clinical, analytical tone. Each section should be at least 3-4 sentences.`,

    market_trends: `${BASE_PERSONA}

You have been given a startup/business idea along with real-time data gathered from Reddit's top entrepreneurship and technology communities. Your task is to produce a comprehensive MARKET TREND ANALYSIS comparing this idea against current market sentiment and trends.

Analyze the web search results from these subreddits: ${TARGET_SUBREDDITS.join(", ")}

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Trend Popularity Score** (1-100): How popular and discussed is this topic area right now? Is the market buzzing about it, or is it niche/quiet? Explain with evidence from the Reddit discussions you found.

2. **Trend Timing Assessment**: Is the founder early to this trend (pioneering), right on time (riding the wave), or late (the market is already saturated)? Explain with specific signals from the subreddit data.

3. **Reddit Buzz Analysis**: What are people actually saying in these communities? Summarize the dominant narratives, common complaints, wishful thinking, and emerging patterns related to this idea's domain. Cite specific subreddits and discussion themes.

4. **Uniqueness & Originality Assessment**: How unique is this specific idea compared to what's already being discussed and built? Are there many similar ideas floating around, or does this stand out? Rate originality from 1-100 and explain.

5. **Competitive Landscape**: Who else is building in this space based on Reddit discussions? What are their approaches? What gaps exist that this idea could fill?

6. **Strengths — Where You Lead**: Based on the market data, what aspects of this idea position it ahead of the competition or current market offerings? Be specific.

7. **Weaknesses — Where You Lag**: What aspects of this idea are behind what the market already expects or demands? What are people already complaining about in similar products?

8. **Strategic Recommendations**: Based on all the trend data, provide 3-5 specific, actionable recommendations for positioning this idea optimally in the current market landscape.

9. **Data Sources**: List the specific subreddits and key discussion themes that informed this analysis.

Be thorough, objective, and evidence-based. Reference specific Reddit discussions and trends wherever possible. Each section should be at least 3-4 sentences.`,

    reddit_scan: `${BASE_PERSONA}

You have been given a topic along with real-time data gathered from Reddit's top entrepreneurship and technology communities. Your task is to produce a comprehensive TREND SCAN summarizing what the market is discussing.

Write your report as a detailed, well-structured narrative — NOT as JSON. Use the following structure:

1. **Trend Overview**: What is the current state of discussion around this topic? Is it heating up, cooling down, or steady?

2. **Top Discussions & Themes**: Summarize the most prominent discussions, ideas, and debates happening in these communities. Group them by theme.

3. **Market Sentiment**: Is the overall sentiment positive, skeptical, excited, or cautious? What's driving this sentiment?

4. **Emerging Opportunities**: Based on the discussions, what unmet needs or gaps are people expressing? What do they wish existed?

5. **Red Flags & Warnings**: What problems, failures, or cautionary tales are people sharing? What should builders in this space avoid?

6. **Key Players & Projects**: Who/what are people talking about the most? Any specific tools, companies, or projects getting attention?

7. **Prediction**: Based on the current trajectory of discussions, where is this trend heading in the next 6-12 months?

8. **Data Sources**: List which subreddits provided the most relevant data and key threads/discussions referenced.

Be thorough and evidence-based. Each section should be at least 2-3 sentences.`,
};

// ─── Mistral API Integration ──────────────────────────────────────────────────

const REDDIT_AGENT_ID = "ag_019ca410bae2728cb5ff2064453d145b";

interface MistralAgentMessage {
    role: "user" | "assistant" | "tool";
    content: string;
    tool_calls?: Array<{
        id: string;
        function: { name: string; arguments: string };
    }>;
    tool_call_id?: string;
    name?: string;
}

interface MistralAgentResponse {
    choices: Array<{
        finish_reason: string;
        message: MistralAgentMessage;
    }>;
}

async function callMistralWithWebSearch(
    apiKey: string,
    systemPrompt: string,
    userMessage: string
): Promise<string> {
    // Use the Agents API with a pre-created agent that has web_search built-in
    const messages: MistralAgentMessage[] = [
        { role: "user", content: `${systemPrompt}\n\n---\n\n${userMessage}` },
    ];

    // Conversation loop: the agent may make multiple web searches before giving a final answer
    const MAX_ITERATIONS = 10;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const response = await fetch("https://api.mistral.ai/v1/agents/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                agent_id: REDDIT_AGENT_ID,
                messages,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mistral Agents API error (${response.status}): ${errorText}`);
        }

        const data = (await response.json()) as MistralAgentResponse;
        const choice = data.choices[0];
        const assistantMsg = choice.message;

        // If the agent returned a final text response, we're done
        if (choice.finish_reason === "stop" && assistantMsg.content) {
            return assistantMsg.content;
        }

        // If the agent wants to call tools (web_search), add the assistant message
        // and let the next iteration continue — the Agents API handles tool execution server-side
        // We just need to add the assistant message back and continue
        if (choice.finish_reason === "tool_calls" && assistantMsg.tool_calls) {
            // Add assistant's tool_call message to conversation
            messages.push(assistantMsg);

            // For Agents API built-in tools, the server executes them.
            // We add a placeholder tool response to continue the conversation.
            for (const toolCall of assistantMsg.tool_calls) {
                messages.push({
                    role: "tool",
                    content: "Tool executed by server.",
                    tool_call_id: toolCall.id,
                    name: toolCall.function.name,
                });
            }
            continue;
        }

        // If we got content even without "stop", return it
        if (assistantMsg.content) {
            return assistantMsg.content;
        }
    }

    throw new Error("Max iterations reached without a final response from Mistral agent.");
}

async function callMistral(
    apiKey: string,
    systemPrompt: string,
    userMessage: string
): Promise<string> {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mistral API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as MistralAgentResponse;
    return data.choices[0].message.content;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildAnalysisResponse(prompt: string, metricsJson: string, domain: string) {
    let metrics: Record<string, unknown>;
    try {
        metrics = JSON.parse(metricsJson);
    } catch {
        return {
            content: [
                {
                    type: "text" as const,
                    text: `Error: Invalid JSON provided. Please provide a valid JSON string of the ${domain} metrics.`,
                },
            ],
        };
    }

    const analysisRequest = `${prompt}

Here is the telemetry data to analyze:

${JSON.stringify(metrics, null, 2)}

Provide your clinical analysis now.`;

    return {
        content: [
            {
                type: "text" as const,
                text: analysisRequest,
            },
        ],
    };
}

function errorResponse(message: string) {
    return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
    };
}

// ─── Server Factory ───────────────────────────────────────────────────────────

function createServer(env: Env) {
    const server = new McpServer({
        name: "openGlad",
        version: "3.0.0",
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // MCP PROMPTS
    // ═══════════════════════════════════════════════════════════════════════════

    server.prompt(
        "analyze-startup",
        "Start a comprehensive startup health analysis. Use this when a user wants to analyze, diagnose, or evaluate their startup, idea, business, or project.",
        {
            context: z
                .string()
                .optional()
                .describe("Any context about the startup, idea, or project."),
        },
        async ({ context }) => ({
            messages: [
                {
                    role: "user" as const,
                    content: {
                        type: "text" as const,
                        text: `I want to run a startup diagnostic analysis using the openGlad Diagnostic Engine.

${context ? `Here is the context: ${context}` : ""}

You have access to the following openGlad diagnostic tools:
1. **analyze_startup** — General-purpose startup/idea analysis
2. **analyze_market_trends** — Compare idea against Reddit market trends (powered by Mistral AI web search)
3. **scan_reddit_trends** — Scan Reddit communities for current trends on a topic
4. **analyze_execution_stability** — Development/engineering metrics analysis
5. **analyze_revenue_health** — Financial metrics analysis
6. **analyze_burnout_risk** — Team health and burnout signals
7. **analyze_distribution_discipline** — Marketing/growth metrics
8. **generate_full_diagnosis** — Comprehensive full-body scan

Please help me gather the relevant data and run the appropriate diagnostic tools.`,
                    },
                },
            ],
        })
    );

    server.prompt(
        "trend-check",
        "Check how your startup idea compares to current Reddit market trends. Provide your idea description.",
        {
            idea: z
                .string()
                .describe("Description of your startup idea, business concept, or project."),
        },
        async ({ idea }) => ({
            messages: [
                {
                    role: "user" as const,
                    content: {
                        type: "text" as const,
                        text: `Use the analyze_market_trends tool to compare my startup idea against current Reddit market trends.

My idea: ${idea}

Call the analyze_market_trends tool with this idea description to get a detailed trend analysis powered by Mistral AI's web search across 11 entrepreneur subreddits.`,
                    },
                },
            ],
        })
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // MCP TOOLS — Reddit Trend Analysis (Mistral-powered)
    // ═══════════════════════════════════════════════════════════════════════════

    // ── Tool: Market Trend Analysis ──────────────────────────────────────────
    server.tool(
        "analyze_market_trends",
        "Compares a startup idea against current market trends from Reddit entrepreneurship communities. Uses Mistral AI web search to scan r/Startup_Ideas, r/SaaS, r/IndieHackers, r/Startups, and 7 more subreddits. Returns: trend popularity, timing assessment, uniqueness score, competitive landscape, strengths/weaknesses, and strategic recommendations.",
        {
            idea_description: z
                .string()
                .describe(
                    "Description of the startup idea, business concept, or project to analyze against market trends. Be as detailed as possible for better analysis."
                ),
            focus_areas: z
                .array(z.string())
                .optional()
                .describe(
                    "Optional specific areas to focus the trend analysis on, e.g. ['pricing strategy', 'target audience', 'AI integration']"
                ),
        },
        async ({ idea_description, focus_areas }) => {
            if (!env.MISTRAL_API_KEY) {
                return errorResponse(
                    "MISTRAL_API_KEY is not configured. Please set it as a Worker secret."
                );
            }

            const subredditList = TARGET_SUBREDDITS.join(", ");
            const focusSection = focus_areas?.length
                ? `\n\nPay special attention to these focus areas: ${focus_areas.join(", ")}`
                : "";

            const searchQuery = `Search Reddit communities (${subredditList}) for current discussions, trends, and ideas related to the following startup concept. Find trending posts, common themes, competitor ideas, market sentiment, and emerging patterns.

The startup idea to analyze:
${idea_description}
${focusSection}

Search for:
1. Similar ideas or products being discussed in these subreddits
2. Current trending topics in the same domain
3. Common pain points and requests from users in this space
4. Competitor projects or tools being shared
5. Market sentiment and enthusiasm level for this type of product`;

            try {
                const analysis = await callMistralWithWebSearch(
                    env.MISTRAL_API_KEY,
                    PROMPTS.market_trends,
                    searchQuery
                );

                return {
                    content: [
                        {
                            type: "text" as const,
                            text: analysis,
                        },
                    ],
                };
            } catch (e) {
                return errorResponse(
                    `Failed to analyze market trends: ${e instanceof Error ? e.message : String(e)}`
                );
            }
        }
    );

    // ── Tool: Reddit Trend Scanner ───────────────────────────────────────────
    server.tool(
        "scan_reddit_trends",
        "Scans Reddit entrepreneurship and technology communities for current trends on a given topic. Uses Mistral AI web search to find and summarize trending discussions, market sentiment, emerging opportunities, and key players. Data sources: r/Startup_Ideas, r/SaaS, r/IndieHackers, r/Futurology, r/Technology, and more.",
        {
            topic: z
                .string()
                .describe(
                    "The topic, keyword, or domain to scan for trends. E.g. 'AI agents', 'no-code tools', 'fintech for freelancers'"
                ),
            subreddits: z
                .array(z.string())
                .optional()
                .describe(
                    "Optional custom list of subreddits to scan. If not provided, scans the default 11 entrepreneurship subreddits."
                ),
        },
        async ({ topic, subreddits }) => {
            if (!env.MISTRAL_API_KEY) {
                return errorResponse(
                    "MISTRAL_API_KEY is not configured. Please set it as a Worker secret."
                );
            }

            const targetSubs = subreddits?.length
                ? subreddits.map((s) => (s.startsWith("r/") ? s : `r/${s}`))
                : TARGET_SUBREDDITS;
            const subredditList = targetSubs.join(", ");

            const searchQuery = `Search Reddit communities (${subredditList}) for current trending discussions about: "${topic}"

Find:
1. Most popular and upvoted recent posts about this topic
2. Common themes and recurring discussions
3. Market sentiment — are people excited, skeptical, or cautious?
4. Specific tools, products, or projects people are recommending or building
5. Pain points and unmet needs people are expressing
6. Predictions and future outlook discussions`;

            try {
                const analysis = await callMistralWithWebSearch(
                    env.MISTRAL_API_KEY,
                    PROMPTS.reddit_scan,
                    searchQuery
                );

                return {
                    content: [
                        {
                            type: "text" as const,
                            text: analysis,
                        },
                    ],
                };
            } catch (e) {
                return errorResponse(
                    `Failed to scan Reddit trends: ${e instanceof Error ? e.message : String(e)}`
                );
            }
        }
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // MCP TOOLS — Startup Diagnostics
    // ═══════════════════════════════════════════════════════════════════════════

    // ── Tool: General Startup Analysis ───────────────────────────────────────
    server.tool(
        "analyze_startup",
        "Analyze a startup, business idea, project, or company. Use this for any general startup analysis, evaluation, or diagnosis request. Accepts any type of startup-related data or description.",
        {
            input: z
                .string()
                .describe(
                    "Any startup-related information: metrics, data, descriptions, ideas, pitch details, business model, or raw numbers."
                ),
            analysis_type: z
                .enum(["full", "execution", "revenue", "burnout", "distribution", "trends", "auto"])
                .default("auto")
                .describe(
                    "Type of analysis to run. Use 'trends' for Reddit market trend analysis (requires Mistral). Use 'auto' to decide based on input data."
                ),
        },
        async ({ input, analysis_type }) => {
            // Route to market trends analysis if requested
            if (analysis_type === "trends") {
                if (!env.MISTRAL_API_KEY) {
                    return errorResponse(
                        "MISTRAL_API_KEY is not configured. Trend analysis requires Mistral AI."
                    );
                }

                const subredditList = TARGET_SUBREDDITS.join(", ");
                const searchQuery = `Search Reddit communities (${subredditList}) for current discussions and trends related to: ${input}

Find similar ideas, market sentiment, competitors, trending topics, and opportunities.`;

                try {
                    const analysis = await callMistralWithWebSearch(
                        env.MISTRAL_API_KEY,
                        PROMPTS.market_trends,
                        searchQuery
                    );
                    return {
                        content: [{ type: "text" as const, text: analysis }],
                    };
                } catch (e) {
                    return errorResponse(
                        `Failed to analyze trends: ${e instanceof Error ? e.message : String(e)}`
                    );
                }
            }

            // Route to other diagnostic tools
            const promptMap: Record<string, string> = {
                full: PROMPTS.full_diagnosis,
                execution: PROMPTS.execution_stability,
                revenue: PROMPTS.revenue_health,
                burnout: PROMPTS.burnout_risk,
                distribution: PROMPTS.distribution_discipline,
            };

            const selectedPrompt = promptMap[analysis_type] || PROMPTS.full_diagnosis;
            const domainLabel = analysis_type === "auto" ? "startup" : analysis_type;

            let dataJson: string;
            try {
                JSON.parse(input);
                dataJson = input;
            } catch {
                dataJson = JSON.stringify({ raw_input: input }, null, 2);
            }

            return buildAnalysisResponse(selectedPrompt, dataJson, domainLabel);
        }
    );

    // ── Tool: Execution Stability ────────────────────────────────────────────
    server.tool(
        "analyze_execution_stability",
        "Analyzes repository activity, commit patterns, deployment frequency, and technical debt signals.",
        {
            metrics_json: z
                .string()
                .describe("JSON string containing development metrics."),
        },
        async ({ metrics_json }) =>
            buildAnalysisResponse(PROMPTS.execution_stability, metrics_json, "execution stability")
    );

    // ── Tool: Revenue Health ─────────────────────────────────────────────────
    server.tool(
        "analyze_revenue_health",
        "Analyzes revenue metrics including MRR/ARR, churn rate, CAC/LTV ratio, and burn rate.",
        {
            metrics_json: z
                .string()
                .describe("JSON string containing revenue metrics."),
        },
        async ({ metrics_json }) =>
            buildAnalysisResponse(PROMPTS.revenue_health, metrics_json, "revenue health")
    );

    // ── Tool: Burnout Risk ───────────────────────────────────────────────────
    server.tool(
        "analyze_burnout_risk",
        "Analyzes team activity patterns, work hours, and context-switching to assess burnout risk.",
        {
            metrics_json: z
                .string()
                .describe("JSON string containing activity/workload metrics."),
        },
        async ({ metrics_json }) =>
            buildAnalysisResponse(PROMPTS.burnout_risk, metrics_json, "burnout risk")
    );

    // ── Tool: Distribution Discipline ────────────────────────────────────────
    server.tool(
        "analyze_distribution_discipline",
        "Analyzes marketing output consistency, channel diversification, and funnel conversion rates.",
        {
            metrics_json: z
                .string()
                .describe("JSON string containing marketing/growth metrics."),
        },
        async ({ metrics_json }) =>
            buildAnalysisResponse(
                PROMPTS.distribution_discipline,
                metrics_json,
                "distribution discipline"
            )
    );

    // ── Tool: Full Diagnosis ─────────────────────────────────────────────────
    server.tool(
        "generate_full_diagnosis",
        "Comprehensive full-body scan across all startup health dimensions.",
        {
            telemetry_json: z
                .string()
                .describe("JSON string containing all available startup telemetry."),
        },
        async ({ telemetry_json }) =>
            buildAnalysisResponse(PROMPTS.full_diagnosis, telemetry_json, "startup telemetry")
    );

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
                    name: "openGlad Diagnostic Engine",
                    version: "3.0.0",
                    mcp_endpoint: "/mcp",
                    description:
                        "AI-powered startup diagnostic tools with Reddit trend analysis. Connect via an MCP client at /mcp.",
                    tools: [
                        "analyze_market_trends — Reddit trend analysis (Mistral AI web search)",
                        "scan_reddit_trends — Reddit community trend scanner",
                        "analyze_startup — General startup/idea analysis",
                        "analyze_execution_stability — Engineering metrics",
                        "analyze_revenue_health — Financial metrics",
                        "analyze_burnout_risk — Team health signals",
                        "analyze_distribution_discipline — Marketing/growth",
                        "generate_full_diagnosis — Comprehensive full-body scan",
                    ],
                    prompts: ["analyze-startup", "trend-check"],
                    data_sources: TARGET_SUBREDDITS,
                    powered_by: "Mistral AI (web search + large language model)",
                }),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response("Not found", { status: 404 });
    },
} satisfies ExportedHandler<Env>;
