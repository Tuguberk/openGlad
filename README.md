<p align="center">
  <img src="github/opengladlogo.png" alt="openGlad Logo" width="250" />
  <p align="center"><strong>The Loss-Prevention Friction Engine for Founders</strong></p>
  <p align="center">
    An AI-powered MCP server that stops you from building things nobody wants using clinical analytics, behavioral pattern scanning, and real-time market intelligence from Reddit, Hacker News, GitHub, and Polymarket.
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

openGlad is a **Model Context Protocol (MCP) server** that acts as the ultimate friction engine for startups. It provides AI agents (Claude, Cursor, Windsurf, Le Chat, etc.) with specialized tools to enforce loss-prevention *before* you write a single line of code:

- 🛑 **Loss-Prevention Pipeline** — Runs behavioral pattern scans, 3-scenario failure predictions, and locks building until monetization is confirmed.
- 🔍 **Multi-Source Market Intelligence** — Aggregates real-time data from Reddit (11+ subreddits), Hacker News, GitHub, and Polymarket prediction markets to detect overcrowding and entry risks.
- ⚔️ **Comparative Friction Analysis** — Runs parallel market intelligence on 2-3 ideas simultaneously and returns a ranked verdict on which one (if any) is worth pursuing.
- 📊 **Startup Diagnostics** — Evaluates execution stability, revenue health, burnout risk, and distribution discipline.
- 🩺 **Clinical Triage** — Objective, data-driven assessments with zero motivational fluff.

> Think of it as an **anti-delusion engine for your startup** — designed to tell you 'no' before you waste months building the wrong thing.

## Architecture

```
┌──────────────┐         ┌───────────────────────────────┐
│   AI Client  │  MCP    │   openGlad Worker             │
│  (Claude,    │◄──────►│   (Cloudflare Edge)           │
│   Cursor,    │         │      Version 5.0              │
│   Windsurf)  │         └─────────────┬─────────────────┘
└──────────────┘                       │ Parallel fetch (cached 1hr)
                          ┌────────────┼────────────┐
                   ┌──────▼──────┐ ┌──▼────┐ ┌─────▼──────┐ ┌──────▼──────┐
                   │   Reddit    │ │  HN   │ │   GitHub   │ │ Polymarket  │
                   │ 11+ subs    │ │Algolia│ │ Public API │ │  Gamma API  │
                   │ + topic exp.│ │ free  │ │  no key    │ │   free      │
                   └─────────────┘ └───────┘ └────────────┘ └─────────────┘
```

**Tech Stack:**
- **Runtime**: Cloudflare Workers (edge-deployed, globally distributed)
- **Protocol**: MCP (Model Context Protocol) via Streamable HTTP
- **Market Data**: Reddit + Hacker News (Algolia) + GitHub + Polymarket (all free, no API keys)
- **Language**: TypeScript (Modular Architecture)

## Tools

### 🚧 Friction Engine (Loss Prevention)

| Tool | Description | Market Data |
|------|-------------|:-----------:|
| `run_the_bet` | Mega-pipeline combining Pattern Scan, Loss Simulation, and Revenue Gate. **Start here for new ideas.** | Reddit + HN + GitHub + Polymarket |
| `pattern_scan` | Detects behavioral risk patterns (overbuilding drift, monetization avoidance, prestige bias). | None |
| `loss_simulation` | Generates 3-scenario failure predictions (best, likely, worst) with quantified expected loss. | Reddit + HN + GitHub + Polymarket |
| `revenue_gate` | Locks building until clear monetization strategy is confirmed. Produces unlock tasks. | None |
| `compare_ideas` | Parallel multi-source analysis of 2-3 ideas with ranked comparison and single verdict. | Reddit + HN + GitHub + Polymarket |

### 🔍 Market Intelligence (Multi-Source)

| Tool | Description | Market Data |
|------|-------------|:-----------:|
| `analyze_market_trends` | Overcrowding & entry risk filter. Detects tarpit ideas and late entry risks. | Reddit + HN + GitHub + Polymarket |
| `scan_reddit_trends` | Broad trend scanner: sentiment, red flags, cautionary tales, and 6-12 month predictions. | Reddit + HN + GitHub + Polymarket |

**Data Sources:**

| Source | API | What it adds |
|--------|-----|-------------|
| Reddit | Public JSON (free, no key) | Community sentiment, 11 base subreddits + dynamic topic expansion |
| Hacker News | Algolia API (free, no key) | Technical founder signal — developer adoption, HN discussions |
| GitHub | Public Search API (free, no key) | Competitor repo activity, star velocity, open source adoption |
| Polymarket | Gamma API (free, no key) | Prediction market odds — real money bets on outcome probabilities |

Reddit subreddits (base): `r/Startup_Ideas` · `r/Business_Ideas` · `r/SaaS` · `r/SideProject` · `r/EntrepreneurRideAlong` · `r/IndieHackers` · `r/Futurology` · `r/Technology` · `r/AINewsAndTrends` · `r/Startups` · `r/Entrepreneur`

Dynamic expansion adds topic-specific subreddits (e.g. `r/MachineLearning` for AI queries, `r/CryptoCurrency` for crypto, `r/fintech` for finance).

### 🩺 Startup Diagnostics

| Tool | Description |
|------|-------------|
| `analyze_startup` | Smart triage router. Auto-detects ideas vs metrics and routes accordingly. |
| `analyze_execution_stability` | Assesses development velocity, engineering risks, and technical debt. |
| `analyze_revenue_health` | Evaluates MRR/ARR trajectory, financial risks, churn, and unit economics. |
| `analyze_burnout_risk` | Detects burnout signals from work patterns, cognitive load, and focus entropy. |
| `analyze_distribution_discipline` | Measures marketing risks, output consistency, and funnel efficiency. |
| `generate_full_diagnosis` | Comprehensive system scan across all diagnostic dimensions. |

### 💬 MCP Prompts

| Prompt | Description |
|--------|-------------|
| `run-the-bet` | Full loss-prevention pipeline for a new idea. |
| `market-check` | Market saturation and trend analysis combining broad scan + focused analysis. |
| `should-i-build` | Quick friction check: pattern scan + revenue gate to determine if building is allowed. |
| `analyze-startup` | Guided startup analysis — triage and routing for ideas or metrics. |

### 📖 MCP Resources

| Resource | URI | Description |
|----------|-----|-------------|
| Usage Guide | `openglad://guide` | Agent-readable guide with tool selection logic, recommended workflows, and usage tips. |

## Quickstart

### Connect to the hosted server

The MCP server is deployed and ready to use:

```
https://openglad.tuguberk.dev/mcp
```

#### Claude Desktop / Cursor / Windsurf / Any MCP Client

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "openGlad": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://openglad.tuguberk.dev/mcp"]
    }
  }
}
```

#### MCP Inspector (for testing)

```bash
npx @modelcontextprotocol/inspector@latest
# Enter URL: https://openglad.tuguberk.dev/mcp
```

### Example Prompts

Once connected, try these with your AI client:

```
"Run the bet on my startup idea: an AI-powered tool that generates investor pitch decks from a one-page brief"
```

```
"Compare these two ideas for me: (1) AI accounting SaaS for freelancers, (2) no-code internal tools builder"
```

```
"Run a full health diagnostic on my startup with these metrics: MRR $12k, churn 8%, 3 developers, shipping weekly"
```

```
"Is the micro-SaaS market oversaturated? Check trends across Reddit, HN, and GitHub."
```

## Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare account](https://dash.cloudflare.com/)

### Deploy your own

```bash
# Clone and install
git clone https://github.com/tugberkakbulut/openGlad.git
cd openGlad
npm install

# Local development
npm run dev

# Deploy to Cloudflare
npx wrangler deploy
```

No API keys required — openGlad fetches all market data via free public APIs. Results are cached at the edge for 1 hour per query.

### Project Structure

```
openGlad/
├── src/
│   ├── config/
│   │   └── constants.ts       # Subreddits + dynamic topic expansion map
│   ├── prompts/
│   │   └── index.ts           # LLM system prompts for all tools
│   ├── services/
│   │   ├── aggregator.ts      # Multi-source fetcher + evidence envelope wrapper
│   │   ├── reddit.ts          # Reddit search + engagement ranking + dedup + retry
│   │   ├── hackernews.ts      # HN Algolia API integration
│   │   ├── polymarket.ts      # Polymarket Gamma API integration
│   │   └── github.ts          # GitHub public search API integration
│   ├── tools/
│   │   ├── friction.ts        # Friction engine tools (run_the_bet, compare_ideas, etc.)
│   │   └── diagnostics.ts     # Diagnostic tools (execution, revenue, burnout, distribution)
│   ├── utils/
│   │   ├── dedupe.ts          # Jaccard N-gram deduplication + per-author caps + engagement scoring
│   │   └── helpers.ts         # Evidence envelope response builder
│   └── index.ts               # Server entry point, prompts, resources & tool registration
├── wrangler.jsonc              # Cloudflare Worker configuration
├── package.json
└── tsconfig.json
```

## How It Works

### Friction Engine Flow (Loss-Prevention)

1. **User asks** → *"I want to build an AI resume builder"*
2. **AI client** → Calls `run_the_bet` or `analyze_startup`
3. **openGlad Worker** → Fetches from 4 sources in parallel: Reddit (11+ subreddits), HackerNews, GitHub, Polymarket (all cached 1hr at edge)
4. **Deduplication & Ranking** → Jaccard similarity removes cross-source duplicates; per-author cap (max 3) prevents single-voice dominance; engagement scoring weights freshness + score + activity
5. **Pattern Scan** → Identifies behavioral risks (overbuilding, monetization avoidance)
6. **Loss Simulation** → Maps out 3 failure scenarios with quantified expected loss grounded in real market signals
7. **Revenue Gate** → Locks building until monetization is proven
8. **User receives** → A brutal reality check: blind spots, failure modes, and whether they're allowed to build

### compare_ideas Flow

1. **User provides** → 2-3 startup idea descriptions
2. **Parallel fetch** → Market context fetched for all ideas simultaneously
3. **Comparative analysis** → Each idea gets a compressed friction block (pattern risk, market signal, expected loss, gate status)
4. **Ranked verdict** → Single recommendation on which idea (if any) to pursue

## Built With

- **[Cloudflare Workers](https://workers.cloudflare.com/)** — Serverless edge computing
- **[Model Context Protocol](https://modelcontextprotocol.io/)** — Standard protocol for AI tool integration
- **[Cloudflare Agents SDK](https://developers.cloudflare.com/agents/)** — MCP server framework
- **[Reddit Public JSON API](https://www.reddit.com/dev/api/)** — Community market intelligence
- **[Hacker News Algolia API](https://hn.algolia.com/api)** — Developer community signals
- **[GitHub REST API](https://docs.github.com/en/rest)** — Open source adoption & competitor activity
- **[Polymarket Gamma API](https://docs.polymarket.com/)** — Prediction market odds

## Inspiration

Multi-source aggregation, Jaccard deduplication, engagement-based ranking, thin-source retry, and evidence envelope patterns are inspired by [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) (MIT).

## License

MIT
