const PM_CACHE_TTL = 3600;

export interface PolymarketMarket {
  question: string;
  slug: string;
  outcomePrices: string;
  volume: string;
  endDate: string;
  active: boolean;
}

interface GammaMarket {
  question?: string;
  slug?: string;
  outcomePrices?: string | string[];
  volume?: string | number;
  endDate?: string;
  active?: boolean;
}

function pmCacheKey(query: string): string {
  return `https://openglad-cache.internal/polymarket?q=${encodeURIComponent(query.trim().toLowerCase())}`;
}

export async function searchPolymarket(
  query: string,
  limit = 5,
): Promise<PolymarketMarket[]> {
  const url = `https://gamma-api.polymarket.com/markets?search=${encodeURIComponent(query)}&limit=${limit}&active=true&order=volume&ascending=false`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "openGlad/1.0 (MCP Friction Engine)" },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as GammaMarket[];
    if (!Array.isArray(json)) return [];

    return json.slice(0, limit).map((m) => ({
      question: m.question ?? "(no question)",
      slug: m.slug ?? "",
      outcomePrices: Array.isArray(m.outcomePrices)
        ? m.outcomePrices.join(", ")
        : String(m.outcomePrices ?? "N/A"),
      volume: String(m.volume ?? "0"),
      endDate: m.endDate ?? "N/A",
      active: m.active ?? false,
    }));
  } catch {
    return [];
  }
}

export function formatPolymarketResults(markets: PolymarketMarket[]): string {
  if (markets.length === 0) return "";

  const lines = [`**Polymarket Prediction Markets** (${markets.length} markets)\n`];
  for (const m of markets) {
    lines.push(`### ${m.question}`);
    lines.push(`Outcome Prices: ${m.outcomePrices} | Volume: $${Number(m.volume).toLocaleString()} | Ends: ${m.endDate}`);
    lines.push(`https://polymarket.com/market/${m.slug}`);
    lines.push("");
  }
  return lines.join("\n");
}

export async function fetchPolymarketContext(query: string): Promise<string> {
  const cache = caches.default;
  const key = pmCacheKey(query);

  const cached = await cache.match(key);
  if (cached) return cached.text();

  const markets = await searchPolymarket(query);
  const result = formatPolymarketResults(markets);
  if (result) {
    await cache.put(
      key,
      new Response(result, {
        headers: { "Cache-Control": `s-maxage=${PM_CACHE_TTL}` },
      }),
    );
  }
  return result;
}
