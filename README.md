<p align="center">
  <h1 align="center">🧠 openGlad</h1>
  <p align="center"><strong>The Nervous System for Your Startup</strong></p>
  <p align="center">
    An AI-powered MCP server that diagnoses your startup's health using clinical analytics and real-time Reddit market intelligence.
  </p>
  <p align="center">
    <a href="#tools">Tools</a> •
    <a href="#quickstart">Quickstart</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#deployment">Deployment</a>
  </p>
</p>

---

## What is openGlad?

openGlad is a **Model Context Protocol (MCP) server** that acts as the diagnostic nervous system for startups. It provides AI agents (Claude, Gemini, ChatGPT, etc.) with specialized tools to:

- 🔍 **Scan Reddit trends** across 11 entrepreneurship subreddits using Mistral AI's web search
- 📊 **Analyze startup metrics** — execution stability, revenue health, burnout risk, distribution discipline
- 🩺 **Generate clinical diagnoses** — objective, data-driven assessments with no fluff or motivational language
- 🆚 **Compare ideas against market trends** — popularity, uniqueness, competitive landscape, timing

> Think of it as a **full-body health scan for your startup** — powered by AI, fed by real market data.

## Architecture

```
┌──────────────┐         ┌───────────────────────┐         ┌──────────────┐
│   AI Client  │  MCP    │   openGlad Worker     │  API    │  Mistral AI  │
│  (Claude,    │◄──────►│   (Cloudflare Edge)   │◄──────►│  (Agents +   │
│   Gemini)    │         │                       │         │  Web Search) │
└──────────────┘         └───────────────────────┘         └──────┬───────┘
                                                                  │
                                                           ┌──────▼───────┐
                                                           │    Reddit    │
                                                           │  11 Subs    │
                                                           └──────────────┘
```

**Tech Stack:**
- **Runtime**: Cloudflare Workers (edge-deployed, globally distributed)
- **Protocol**: MCP (Model Context Protocol) via Streamable HTTP
- **AI Engine**: Mistral AI Agents API with built-in web search
- **Language**: TypeScript

## Tools

### 🔍 Market Intelligence (Mistral-powered)

| Tool | Description |
|------|-------------|
| `analyze_market_trends` | Compares your startup idea against live Reddit trends. Returns: trend popularity score, timing assessment, uniqueness rating, competitive landscape, strengths/weaknesses, and strategic recommendations. |
| `scan_reddit_trends` | Scans Reddit communities for current trends on any topic. Returns: trend overview, market sentiment, emerging opportunities, red flags, and key players. |

**Data Sources** — 11 subreddits scanned in real-time:

`r/Startup_Ideas` · `r/Business_Ideas` · `r/SaaS` · `r/SideProject` · `r/EntrepreneurRideAlong` · `r/IndieHackers` · `r/Futurology` · `r/Technology` · `r/AINewsAndTrends` · `r/Startups` · `r/Entrepreneur`

### 🩺 Startup Diagnostics

| Tool | Description |
|------|-------------|
| `analyze_startup` | General-purpose startup/idea analyzer. Accepts free-form text or structured JSON. Routes to the appropriate diagnostic tool automatically. |
| `analyze_execution_stability` | Assesses development velocity, commit cadence, deployment reliability, and technical debt. |
| `analyze_revenue_health` | Evaluates MRR/ARR trajectory, churn dynamics, unit economics (CAC/LTV), and runway. |
| `analyze_burnout_risk` | Detects burnout signals from work patterns, cognitive load, focus entropy, and recovery adequacy. |
| `analyze_distribution_discipline` | Measures marketing output consistency, channel diversification, funnel efficiency, and growth trajectory. |
| `generate_full_diagnosis` | Comprehensive full-body scan across all four diagnostic dimensions with overall health score. |

### 💬 MCP Prompts

| Prompt | Description |
|--------|-------------|
| `analyze-startup` | Guided startup analysis flow — helps the AI client determine which tools to use. |
| `trend-check` | Quick Reddit trend comparison — provide your idea and get an instant market analysis. |

## Quickstart

### Connect to the hosted server

The MCP server is deployed and ready to use:

```
https://openglad-mcp.testworker12361.workers.dev/mcp
```

#### Claude Desktop / Cursor / Windsurf

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "openGlad": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://openglad-mcp.testworker12361.workers.dev/mcp"]
    }
  }
}
```

#### MCP Inspector (for testing)

```bash
npx @modelcontextprotocol/inspector@latest
# Enter URL: https://openglad-mcp.testworker12361.workers.dev/mcp
```

### Example Prompts

Once connected, try these with your AI client:

```
"Analyze my startup idea: an AI-powered tool that generates investor pitch decks from a one-page brief"
```

```
"What's trending in the SaaS space on Reddit right now?"
```

```
"Run a full health diagnostic on my startup with these metrics: MRR $12k, churn 8%, 3 developers, shipping weekly"
```

## Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare account](https://dash.cloudflare.com/)
- [Mistral AI API key](https://console.mistral.ai/)

### Deploy your own

```bash
# Clone and install
cd worker-openglad
npm install

# Local development
npm run dev

# Deploy to Cloudflare
npx wrangler deploy

# Set your Mistral API key
npx wrangler secret put MISTRAL_API_KEY
```

### Project Structure

```
openGlad/
└── worker-openglad/          # Cloudflare Worker project
    ├── src/
    │   └── index.ts           # MCP server — all tools, prompts, and Mistral integration
    ├── wrangler.jsonc          # Cloudflare Worker configuration
    ├── package.json
    └── tsconfig.json
```

## How It Works

### Trend Analysis Flow

1. **User asks** → *"Analyze my idea for an AI resume builder"*
2. **AI client** → Calls `analyze_market_trends` with the idea description
3. **openGlad Worker** → Sends request to Mistral Agents API with `web_search` enabled
4. **Mistral Agent** → Searches Reddit subreddits for related discussions, trends, and competitors
5. **Mistral Agent** → Analyzes findings and produces a detailed narrative report
6. **User receives** → Comprehensive trend analysis with scores, competitive landscape, and actionable recommendations

### Diagnostic Analysis Flow

1. **User provides** → Startup metrics (revenue, team activity, engineering data, marketing stats)
2. **AI client** → Calls the appropriate diagnostic tool(s)
3. **openGlad Worker** → Returns a clinical diagnostic prompt with the user's data embedded
4. **AI client** → Uses the diagnostic framework to produce a detailed, analytically rigorous assessment
5. **User receives** → Clinical report with scores, findings, and specific recommendations

## Built With

- **[Cloudflare Workers](https://workers.cloudflare.com/)** — Serverless edge computing
- **[Model Context Protocol](https://modelcontextprotocol.io/)** — Standard protocol for AI tool integration
- **[Mistral AI](https://mistral.ai/)** — Agents API with built-in web search
- **[Cloudflare Agents SDK](https://developers.cloudflare.com/agents/)** — MCP server framework

## License

MIT
