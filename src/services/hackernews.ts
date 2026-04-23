const HN_CACHE_TTL = 3600;

export interface HNStory {
  title: string;
  url: string;
  points: number;
  num_comments: number;
  author: string;
  created_at: string;
  objectID: string;
}

interface AlgoliaHit {
  title?: string;
  story_title?: string;
  url?: string;
  story_url?: string;
  points?: number;
  num_comments?: number;
  author: string;
  created_at: string;
  objectID: string;
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
}

function hnCacheKey(query: string): string {
  return `https://openglad-cache.internal/hn?q=${encodeURIComponent(query.trim().toLowerCase())}`;
}

export async function searchHackerNews(
  query: string,
  limit = 10,
): Promise<HNStory[]> {
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 86400;
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit}&numericFilters=created_at_i>${thirtyDaysAgo},points>5`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "openGlad/1.0 (MCP Friction Engine)" },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as AlgoliaResponse;
    return json.hits.map((hit) => ({
      title: hit.title ?? hit.story_title ?? "(no title)",
      url: hit.url ?? hit.story_url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
      points: hit.points ?? 0,
      num_comments: hit.num_comments ?? 0,
      author: hit.author,
      created_at: hit.created_at,
      objectID: hit.objectID,
    }));
  } catch {
    return [];
  }
}

export function formatHNResults(stories: HNStory[]): string {
  if (stories.length === 0) return "";

  const lines = [`**Hacker News** (${stories.length} discussions)\n`];
  for (const s of stories) {
    const date = s.created_at.slice(0, 10);
    lines.push(
      `### HN | Points: ${s.points} | Comments: ${s.num_comments} | ${date}`,
    );
    lines.push(`**${s.title}**`);
    lines.push(`https://news.ycombinator.com/item?id=${s.objectID}`);
    lines.push("");
  }
  return lines.join("\n");
}

export async function fetchHNContext(query: string): Promise<string> {
  const cache = caches.default;
  const key = hnCacheKey(query);

  const cached = await cache.match(key);
  if (cached) return cached.text();

  const stories = await searchHackerNews(query);
  const result = formatHNResults(stories);
  if (result) {
    await cache.put(
      key,
      new Response(result, {
        headers: { "Cache-Control": `s-maxage=${HN_CACHE_TTL}` },
      }),
    );
  }
  return result;
}
