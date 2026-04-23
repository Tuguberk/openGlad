import { fetchRedditContext } from "./reddit";
import { fetchHNContext } from "./hackernews";
import { fetchPolymarketContext } from "./polymarket";
import { fetchGithubContext } from "./github";

const AGG_CACHE_TTL = 3600;

function aggCacheKey(query: string): string {
  return `https://openglad-cache.internal/agg?q=${encodeURIComponent(query.trim().toLowerCase())}`;
}

function wrapEvidence(label: string, content: string): string {
  if (!content.trim()) return "";
  return `<!-- EVIDENCE FOR SYNTHESIS: ${label} -->\n${content}\n<!-- END EVIDENCE: ${label} -->`;
}

export async function fetchMarketContext(query: string): Promise<string> {
  const cache = caches.default;
  const key = aggCacheKey(query);

  const cached = await cache.match(key);
  if (cached) return cached.text();

  // Fetch all sources in parallel
  const [redditRaw, hnRaw, polymarketRaw, githubRaw] = await Promise.all([
    fetchRedditContext(query),
    fetchHNContext(query),
    fetchPolymarketContext(query),
    fetchGithubContext(query),
  ]);

  const sections: string[] = [];

  if (redditRaw) sections.push(wrapEvidence("Reddit", redditRaw));
  if (hnRaw) sections.push(wrapEvidence("HackerNews", hnRaw));
  if (githubRaw) sections.push(wrapEvidence("GitHub", githubRaw));
  if (polymarketRaw) sections.push(wrapEvidence("Polymarket", polymarketRaw));

  const result = sections.length > 0
    ? sections.join("\n\n")
    : "No market data found across Reddit, HackerNews, GitHub, or Polymarket.";

  await cache.put(
    key,
    new Response(result, {
      headers: { "Cache-Control": `s-maxage=${AGG_CACHE_TTL}` },
    }),
  );

  return result;
}
