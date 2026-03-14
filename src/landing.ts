export const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>openGlad — The Loss-Prevention Friction Engine for Founders</title>
  <meta name="description" content="Stop building things nobody wants. openGlad is an AI-powered MCP server that creates structured doubt before you waste months on a dead idea.">
  <meta property="og:title" content="openGlad — Friction Engine for Founders">
  <meta property="og:description" content="Stop building things nobody wants. AI-powered loss prevention for startup founders.">
  <meta property="og:image" content="https://raw.githubusercontent.com/Tuguberk/openGlad/main/github/opengladlogo.png">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --gold: #D4A830;
      --gold-light: #F0D060;
      --gold-dim: #8B7320;
      --bg: #0A0A0A;
      --bg-card: #111111;
      --bg-card-hover: #161616;
      --border: #1E1E1E;
      --border-gold: #2A2210;
      --text: #E8E8E8;
      --text-dim: #888888;
      --red: #E74C3C;
      --red-dim: #3A1515;
      --green: #2ECC71;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* ── NAV ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      background: rgba(10,10,10,0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      padding: 0 2rem;
      height: 64px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .nav-logo { height: 48px; }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-links a {
      color: var(--text-dim); text-decoration: none; font-size: 0.875rem;
      font-weight: 500; transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--gold); }
    .nav-cta {
      background: var(--gold) !important; color: #000 !important;
      padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 700 !important;
      font-size: 0.8rem !important; letter-spacing: 0.02em;
    }
    .nav-cta:hover { background: var(--gold-light) !important; }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center;
      padding: 6rem 2rem 4rem;
      position: relative;
    }
    .hero::before {
      content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 800px; height: 800px;
      background: radial-gradient(circle, rgba(212,168,48,0.06) 0%, transparent 70%);
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--border-gold); border: 1px solid var(--gold-dim);
      padding: 0.4rem 1rem; border-radius: 999px;
      font-size: 0.75rem; font-weight: 600; color: var(--gold);
      letter-spacing: 0.05em; text-transform: uppercase;
      margin-bottom: 2rem;
    }
    .hero-badge::before { content: ''; width: 6px; height: 6px; background: var(--red); border-radius: 50%; }
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 900; line-height: 1.1;
      max-width: 800px; margin-bottom: 1.5rem;
    }
    .hero h1 .gold { color: var(--gold); }
    .hero h1 .strike {
      text-decoration: line-through; text-decoration-color: var(--red);
      text-decoration-thickness: 3px; color: var(--text-dim);
    }
    .hero-sub {
      font-size: 1.15rem; color: var(--text-dim); max-width: 560px;
      line-height: 1.7; margin-bottom: 2.5rem;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .btn-primary {
      background: var(--gold); color: #000; padding: 0.85rem 2rem;
      border-radius: 10px; text-decoration: none; font-weight: 800;
      font-size: 0.95rem; letter-spacing: 0.01em; transition: all 0.2s;
      display: inline-flex; align-items: center; gap: 0.5rem;
    }
    .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
    .btn-secondary {
      background: transparent; color: var(--text); padding: 0.85rem 2rem;
      border: 1px solid var(--border); border-radius: 10px; text-decoration: none;
      font-weight: 600; font-size: 0.95rem; transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: var(--gold-dim); color: var(--gold); }
    .hero-endpoint {
      margin-top: 3rem; display: flex; align-items: center; gap: 0.75rem;
      background: var(--bg-card); border: 1px solid var(--border);
      padding: 0.75rem 1.5rem; border-radius: 10px;
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;
    }
    .hero-endpoint .label { color: var(--text-dim); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .hero-endpoint code { color: var(--gold); }

    /* ── SECTION BASE ── */
    section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }
    .section-label {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem;
    }
    .section-title {
      font-size: clamp(1.75rem, 3.5vw, 2.5rem);
      font-weight: 800; margin-bottom: 1rem;
    }
    .section-desc {
      color: var(--text-dim); font-size: 1rem; max-width: 600px; margin-bottom: 3rem;
    }

    /* ── MIRROR (tagline strip) ── */
    .mirror-strip {
      border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
      padding: 2rem 0; text-align: center; overflow: hidden;
    }
    .mirror-strip p {
      font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;
      color: var(--red); font-weight: 500; letter-spacing: 0.02em;
      white-space: nowrap;
      animation: scroll-left 30s linear infinite;
    }
    @keyframes scroll-left {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    /* ── FEATURES ── */
    .features-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }
    .feature-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 14px; padding: 2rem;
      transition: all 0.25s;
    }
    .feature-card:hover {
      border-color: var(--border-gold); background: var(--bg-card-hover);
      transform: translateY(-2px);
    }
    .feature-icon {
      font-size: 1.5rem; margin-bottom: 1rem;
      width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
      background: var(--border-gold); border-radius: 10px;
    }
    .feature-card h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; }
    .feature-card p { font-size: 0.875rem; color: var(--text-dim); line-height: 1.65; }

    /* ── DEMO ── */
    .demo-section { text-align: center; }
    .demo-container {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 16px; overflow: hidden; max-width: 900px; margin: 0 auto;
      box-shadow: 0 0 80px rgba(212,168,48,0.04);
    }
    .demo-bar {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--border);
      background: rgba(20,20,20,0.8);
    }
    .demo-dot { width: 10px; height: 10px; border-radius: 50%; }
    .demo-dot.r { background: #E74C3C; } .demo-dot.y { background: #F1C40F; } .demo-dot.g { background: #2ECC71; }
    .demo-bar span { font-size: 0.7rem; color: var(--text-dim); margin-left: auto; font-family: 'JetBrains Mono', monospace; }
    .demo-container img {
      width: 100%; display: block;
    }

    /* ── HOW IT WORKS ── */
    .steps {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 2rem; counter-reset: step;
    }
    .step {
      position: relative; padding: 1.5rem;
      border-left: 2px solid var(--border);
    }
    .step::before {
      counter-increment: step;
      content: counter(step);
      position: absolute; left: -16px; top: 1.5rem;
      width: 30px; height: 30px; border-radius: 50%;
      background: var(--gold); color: #000; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem;
    }
    .step h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.4rem; padding-left: 0.75rem; }
    .step p { font-size: 0.85rem; color: var(--text-dim); padding-left: 0.75rem; }

    /* ── TOOLS ── */
    .tools-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
    }
    .tool-card {
      display: flex; flex-direction: column; gap: 0.75rem;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; padding: 1.25rem 1.5rem;
      transition: border-color 0.2s;
    }
    .tool-card:hover { border-color: var(--gold-dim); }
    .tool-tag {
      font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;
      color: var(--gold); background: var(--border-gold);
      padding: 0.25rem 0.6rem; border-radius: 6px;
      white-space: nowrap; align-self: flex-start; font-weight: 600;
    }
    .tool-card .tool-info h4 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; }
    .tool-card .tool-info p { font-size: 0.8rem; color: var(--text-dim); }

    /* ── INSTALL ── */
    .install-section { text-align: center; }
    .install-block {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 14px; max-width: 700px; margin: 0 auto;
      overflow: hidden;
    }
    .install-tabs {
      display: flex; border-bottom: 1px solid var(--border);
    }
    .install-tab {
      flex: 1; padding: 0.75rem; font-size: 0.8rem; font-weight: 600;
      background: transparent; border: none; color: var(--text-dim);
      cursor: pointer; transition: all 0.2s;
    }
    .install-tab.active { color: var(--gold); background: var(--border-gold); }
    .install-tab:hover:not(.active) { color: var(--text); }
    .install-code {
      padding: 1.5rem 2rem; text-align: left;
      font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;
      line-height: 1.8; color: var(--text-dim); overflow-x: auto;
      display: none;
    }
    .install-code.active { display: block; }
    .install-code .key { color: var(--gold); }
    .install-code .str { color: var(--green); }
    .install-code .comment { color: #555; }

    /* ── CTA ── */
    .cta-section {
      text-align: center; padding: 6rem 2rem;
      border-top: 1px solid var(--border);
    }
    .cta-section h2 {
      font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800;
      margin-bottom: 1rem;
    }
    .cta-section p { color: var(--text-dim); margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto; }

    /* ── FOOTER ── */
    footer {
      border-top: 1px solid var(--border); padding: 2rem;
      text-align: center; font-size: 0.75rem; color: var(--text-dim);
    }
    footer a { color: var(--gold-dim); text-decoration: none; }
    footer a:hover { color: var(--gold); }

    /* ── RESPONSIVE ── */
    @media (max-width: 640px) {
      nav { padding: 0 1rem; }
      .nav-links a:not(.nav-cta) { display: none; }
      section { padding: 4rem 1.25rem; }
      .hero { padding: 5rem 1.25rem 3rem; }
      .hero-endpoint { flex-direction: column; gap: 0.25rem; }
      .features-grid, .tools-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<!-- NAV -->
<nav>
  <img src="https://raw.githubusercontent.com/Tuguberk/openGlad/main/github/opengladlogo.png" alt="openGlad" class="nav-logo">
  <div class="nav-links">
    <a href="#features">Features</a>
    <a href="#demo">Demo</a>
    <a href="#tools">Tools</a>
    <a href="#install">Install</a>
    <a href="https://github.com/Tuguberk/openGlad" target="_blank">GitHub</a>
    <a href="#install" class="nav-cta">CONNECT NOW</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-badge">Loss-Prevention Engine</div>
  <h1>
    Stop <span class="strike">Building</span><br>
    Start <span class="gold">Validating</span>
  </h1>
  <p class="hero-sub">
    An AI-powered MCP server that creates structured doubt.
    It doesn't help you build faster — it stops you from building things nobody wants.
  </p>
  <div class="hero-actions">
    <a href="#install" class="btn-primary">Connect to Claude</a>
    <a href="https://github.com/Tuguberk/openGlad" target="_blank" class="btn-secondary">View on GitHub</a>
  </div>
  <div class="hero-endpoint">
    <span class="label">MCP Endpoint</span>
    <code>https://openglad.tuguberk.dev/mcp</code>
  </div>
</section>

<!-- MIRROR STRIP -->
<div class="mirror-strip">
  <p>
    "You don't lack ideas. You lack monetization friction."&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;
    "Nobody is waiting for your MVP."&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;
    "You're optimizing for identity, not revenue."&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;
    "If the answer is unclear, the build is locked."&nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp;
    "The market does not care about your roadmap."
  </p>
</div>

<!-- FEATURES -->
<section id="features">
  <p class="section-label">What It Does</p>
  <h2 class="section-title">Six layers of structured doubt</h2>
  <p class="section-desc">openGlad is not an acceleration engine. It's a friction engine. Every tool is designed to block premature building and force revenue validation first.</p>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">&#x1F9E0;</div>
      <h3>Behavioral Pattern Scan</h3>
      <p>Detects overbuilding drift, monetization avoidance, idea hopping, and prestige bias in how you talk about your idea.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">&#x1F3B0;</div>
      <h3>Failure Simulation</h3>
      <p>Three-scenario prediction (Best / Likely / Worst) with quantified expected loss in hours, money, and missed opportunities.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">&#x1F512;</div>
      <h3>Revenue Gate</h3>
      <p>Locks the build phase until you prove willingness-to-pay. You don't get to write code until someone will wire you money.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">&#x1F4C8;</div>
      <h3>Market Intelligence</h3>
      <p>Real-time Reddit data from 11 subreddits. Overcrowding detection, tarpit alerts, and late-entry risk analysis.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">&#x1FA7A;</div>
      <h3>Startup Diagnostics</h3>
      <p>Clinical scoring across execution stability, revenue health, burnout risk, and distribution discipline.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon">&#x1FA9E;</div>
      <h3>Mirror Statements</h3>
      <p>Every analysis ends with confrontational closing sentences that reflect your behavioral flaws back at you. No sugar-coating.</p>
    </div>
  </div>
</section>

<!-- DEMO -->
<section id="demo" class="demo-section">
  <p class="section-label">See It In Action</p>
  <h2 class="section-title">Brutal honesty, served fresh</h2>
  <p class="section-desc" style="margin-left:auto;margin-right:auto;">Watch openGlad tear apart an idea in real-time inside Claude. Full pipeline: pattern scan, loss simulation, revenue gate.</p>
  <div class="demo-container">
    <div class="demo-bar">
      <span class="demo-dot r"></span>
      <span class="demo-dot y"></span>
      <span class="demo-dot g"></span>
      <span>Le Chat &mdash; openGlad MCP</span>
    </div>
    <img src="https://raw.githubusercontent.com/Tuguberk/openGlad/main/github/openGladDemo.gif" alt="openGlad Demo — Run The Bet friction pipeline" loading="lazy">
  </div>
</section>

<!-- HOW IT WORKS -->
<section>
  <p class="section-label">How It Works</p>
  <h2 class="section-title">Three steps to structured doubt</h2>
  <p class="section-desc">Connect once, get friction forever.</p>
  <div class="steps">
    <div class="step">
      <h3>Connect the MCP</h3>
      <p>Add the openGlad endpoint to Claude Desktop, Cursor, Windsurf, or any MCP-compatible client.</p>
    </div>
    <div class="step">
      <h3>Pitch your idea</h3>
      <p>Tell the AI what you want to build. openGlad intercepts and runs the friction pipeline automatically.</p>
    </div>
    <div class="step">
      <h3>Face the mirror</h3>
      <p>Get a brutal diagnostic: behavioral risks, failure simulations, and a locked build gate until you prove revenue.</p>
    </div>
  </div>
</section>

<!-- TOOLS -->
<section id="tools">
  <p class="section-label">12 Tools</p>
  <h2 class="section-title">The full arsenal</h2>
  <p class="section-desc">Six friction tools and six diagnostic tools, all designed to prevent you from wasting your time.</p>
  <div class="tools-grid">
    <div class="tool-card">
      <span class="tool-tag">run_the_bet</span>
      <div class="tool-info">
        <h4>Full Friction Pipeline</h4>
        <p>Pattern Scan + Loss Simulation + Revenue Gate with Reddit market data.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">pattern_scan</span>
      <div class="tool-info">
        <h4>Behavioral Detection</h4>
        <p>Catches overbuilding drift, prestige bias, and monetization avoidance.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">loss_simulation</span>
      <div class="tool-info">
        <h4>Failure Prediction</h4>
        <p>3-scenario simulation with quantified expected loss.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">revenue_gate</span>
      <div class="tool-info">
        <h4>Build Lock</h4>
        <p>Locks building until you prove someone will pay.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">analyze_market_trends</span>
      <div class="tool-info">
        <h4>Market Filter</h4>
        <p>Overcrowding detection, tarpit alerts, late-entry risk.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">scan_reddit_trends</span>
      <div class="tool-info">
        <h4>Trend Scanner</h4>
        <p>Broad trend analysis with sentiment and red flags.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">analyze_startup</span>
      <div class="tool-info">
        <h4>Smart Triage</h4>
        <p>Auto-routes to friction pipeline or diagnostics.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">analyze_execution_stability</span>
      <div class="tool-info">
        <h4>Engineering Risk</h4>
        <p>Commit cadence, deploy failures, tech debt scoring.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">analyze_revenue_health</span>
      <div class="tool-info">
        <h4>Financial Risk</h4>
        <p>MRR trajectory, churn, CAC/LTV, burn rate analysis.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">analyze_burnout_risk</span>
      <div class="tool-info">
        <h4>Burnout Scoring</h4>
        <p>Work patterns, cognitive load, recovery signals.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">analyze_distribution_discipline</span>
      <div class="tool-info">
        <h4>Marketing Risk</h4>
        <p>Channel health, funnel leaks, organic/paid balance.</p>
      </div>
    </div>
    <div class="tool-card">
      <span class="tool-tag">generate_full_diagnosis</span>
      <div class="tool-info">
        <h4>Full System Scan</h4>
        <p>Comprehensive diagnostic across all four dimensions.</p>
      </div>
    </div>
  </div>
</section>

<!-- INSTALL -->
<section id="install" class="install-section">
  <p class="section-label">Get Started</p>
  <h2 class="section-title">Connect in 30 seconds</h2>
  <p class="section-desc" style="margin-left:auto;margin-right:auto;">Add openGlad to your AI client of choice. Works with any MCP-compatible application.</p>
  <div class="install-block">
    <div class="install-tabs">
      <button class="install-tab active" onclick="showTab('claude')">Claude Desktop</button>
      <button class="install-tab" onclick="showTab('cursor')">Cursor</button>
      <button class="install-tab" onclick="showTab('other')">Other Clients</button>
    </div>
    <pre class="install-code active" id="tab-claude"><span class="comment">// claude_desktop_config.json</span>
{
  <span class="key">"mcpServers"</span>: {
    <span class="key">"openglad"</span>: {
      <span class="key">"type"</span>: <span class="str">"url"</span>,
      <span class="key">"url"</span>: <span class="str">"https://openglad.tuguberk.dev/mcp"</span>
    }
  }
}</pre>
    <pre class="install-code" id="tab-cursor"><span class="comment">// .cursor/mcp.json</span>
{
  <span class="key">"mcpServers"</span>: {
    <span class="key">"openglad"</span>: {
      <span class="key">"type"</span>: <span class="str">"url"</span>,
      <span class="key">"url"</span>: <span class="str">"https://openglad.tuguberk.dev/mcp"</span>
    }
  }
}</pre>
    <pre class="install-code" id="tab-other"><span class="comment">// Use the MCP endpoint URL in any compatible client:</span>

<span class="str">https://openglad.tuguberk.dev/mcp</span>

<span class="comment">// Supported transport: Streamable HTTP</span>
<span class="comment">// No API key required. Free and open-source.</span></pre>
  </div>
</section>

<!-- CTA -->
<div class="cta-section">
  <h2>Ready to face the <span style="color:var(--gold)">mirror</span>?</h2>
  <p>Stop avoiding the uncomfortable questions. Connect openGlad and find out if your idea is worth building — before you waste months finding out the hard way.</p>
  <div class="hero-actions" style="justify-content:center;">
    <a href="#install" class="btn-primary">Connect Now</a>
    <a href="https://github.com/Tuguberk/openGlad" target="_blank" class="btn-secondary">Star on GitHub</a>
  </div>
</div>

<!-- FOOTER -->
<footer>
  <p>openGlad v4.0.0 &mdash; The Loss-Prevention Friction Engine &mdash; Built by <a href="https://github.com/Tuguberk" target="_blank">Tuguberk</a> &mdash; Powered by <a href="https://modelcontextprotocol.io" target="_blank">MCP</a> + Cloudflare Workers</p>
</footer>

<script>
function showTab(id) {
  document.querySelectorAll('.install-code').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.install-tab').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  event.target.classList.add('active');
}
</script>
</body>
</html>`;
