<p align="center">
  <img src="github/opengladlogo.png" alt="openGlad Logo" width="250" />
  <p align="center"><strong>The Loss-Prevention Friction Engine for Founders</strong></p>
  <p align="center">
    An AI-powered MCP server that stops you from building things nobody wants using clinical analytics, behavioral pattern scanning, and real-time market intelligence.
  </p>
  <p align="center">
    <a href="#tools">Tools</a> •
    <a href="#quickstart">Quickstart</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#deployment">Deployment</a>
  </p>
</p>

<p align="center">
  <img src="github/openGladDemo.gif" alt="openGlad Demo" style="max-width: 100%;" />
</p>

---

## What is openGlad?

openGlad is a **Model Context Protocol (MCP) server** that acts as the ultimate friction engine for startups. It provides AI agents (Claude, Gemini, ChatGPT, etc.) with specialized tools to enforce loss-prevention *before* you write a single line of code:

- 🛑 **Loss-Prevention Pipeline** — Runs behavioral pattern scans, 3-scenario failure predictions, and locks building until monetization is confirmed.
- 🔍 **Market Reality Check** — Analyzes real-time Reddit trends across 11 entrepreneurship subreddits to detect overcrowding and entry risks.
- 📊 **Startup Diagnostics** — Evaluates execution stability, revenue health, burnout risk, and distribution discipline.
- 🩺 **Clinical Triage** — Objective, data-driven assessments with zero motivational fluff.

> Think of it as an **anti-delusion engine for your startup** — designed to tell you 'no' before you waste months building the wrong thing.

## Architecture

```
┌──────────────┐         ┌───────────────────────┐         ┌──────────────┐
│   AI Client  │  MCP    │   openGlad Worker     │  API    │  Mistral AI  │
│  (Claude,    │◄──────►│   (Cloudflare Edge)   │◄──────►│  (Agents +   │
│   Gemini)    │         │      Version 4.0      │         │  Web Search) │
└──────────────┘         └───────────────────────┘         └──────┬───────┘
                                                                  │
                                                           ┌──────▼───────┐
                                                           │    Reddit    │
                                                           │  11 Subs     │
                                                           └──────────────┘
```

**Tech Stack:**
- **Runtime**: Cloudflare Workers (edge-deployed, globally distributed)
- **Protocol**: MCP (Model Context Protocol) via Streamable HTTP
- **AI Engine**: Mistral AI Agents API with built-in web search
- **Language**: TypeScript (Modular Architecture)

## Tools

### 🚧 Friction Engine (Loss Prevention)

| Tool | Description |
|------|-------------|
| `run_the_bet` | Mega-pipeline combining Pattern Scan, Loss Simulation, and the Revenue Gate using Mistral AI. |
| `pattern_scan` | Detects behavioral risk patterns (e.g., building-in-isolation, feature-creep). |
| `loss_simulation` | Generates 3-scenario failure predictions (best, base, worst cases) via Mistral. |
| `revenue_gate` | Locks building and asserts absolute friction until clear monetization strategy/evidence is confirmed. |

### 🔍 Market Intelligence (Mistral-powered)

| Tool | Description |
|------|-------------|
| `analyze_market_trends` | Overcrowding & entry risk filter. Compares your startup idea against live Reddit trends using Mistral AI web search. |
| `scan_reddit_trends` | Scans Reddit communities to provide general warnings, market sentiment, and emerging opportunities. |

**Data Sources** — 11 subreddits scanned in real-time:

`r/Startup_Ideas` · `r/Business_Ideas` · `r/SaaS` · `r/SideProject` · `r/EntrepreneurRideAlong` · `r/IndieHackers` · `r/Futurology` · `r/Technology` · `r/AINewsAndTrends` · `r/Startups` · `r/Entrepreneur`

### 🩺 Startup Diagnostics

| Tool | Description |
|------|-------------|
| `analyze_startup` | Triage router. Runs Friction Engine for ideas, and Diagnostics for metrics. |
| `analyze_execution_stability` | Assesses development velocity, engineering risks, and technical debt. |
| `analyze_revenue_health` | Evaluates MRR/ARR trajectory, financial risks, churn, and unit economics. |
| `analyze_burnout_risk` | Detects burnout signals from work patterns, cognitive load, and focus entropy. |
| `analyze_distribution_discipline` | Measures marketing risks, output consistency, and funnel efficiency. |
| `generate_full_diagnosis` | Comprehensive system scan across all diagnostic dimensions. |

### 💬 MCP Prompts

| Prompt | Description |
|--------|-------------|
| `run-the-bet` | Executes the complete loss-prevention pipeline for a new idea. |
| `analyze-startup` | Guided startup analysis flow — triage and routing for incoming startup ideas or metrics. |

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
"Run the bet on my startup idea: an AI-powered tool that generates investor pitch decks from a one-page brief"
```

```
"Can you check if my idea for a daily planner app is going to fail?"
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

### Project Structure (v4.0.0 Modular)

```
openGlad/
└── worker-openglad/          # Cloudflare Worker project
    ├── src/
    │   ├── config/            # Environment & constants
    │   ├── prompts/           # LLM system prompts & templates
    │   ├── services/          # Mistral & external APIs
    │   ├── tools/             # MCP Tool definitions & handlers
    │   ├── utils/             # Helper functions
    │   └── index.ts           # Server entry point & tool registration
    ├── wrangler.jsonc          # Cloudflare Worker configuration
    ├── package.json
    └── tsconfig.json
```

## How It Works

### Friction Engine Flow (Loss-Prevention)

1. **User asks** → *"I want to build an AI resume builder"*
2. **AI client** → Calls `run_the_bet` or `analyze_startup`
3. **openGlad Worker** → Runs `pattern_scan` to identify behavioral risks and queries Mistral AI for `loss_simulation`.
4. **Mistral Agent** → Maps out why the idea will likely fail and searches Reddit to assess true market conditions.
5. **Revenue Gate** → Blocks positive validation until a sustainable monetization path is proven.
6. **User receives** → A brutal truth check: what their blind spots are, what their failure modes look like, and whether they are allowed to proceed to building.

## Built With

- **[Cloudflare Workers](https://workers.cloudflare.com/)** — Serverless edge computing
- **[Model Context Protocol](https://modelcontextprotocol.io/)** — Standard protocol for AI tool integration
- **[Mistral AI](https://mistral.ai/)** — Agents API with built-in web search
- **[Cloudflare Agents SDK](https://developers.cloudflare.com/agents/)** — MCP server framework

## License

MIT
