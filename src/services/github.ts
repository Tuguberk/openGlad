const GH_CACHE_TTL = 3600;

export interface GithubRepo {
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  open_issues: number;
  pushed_at: string;
  url: string;
  language: string | null;
}

interface GithubApiRepo {
  name: string;
  full_name: string;
  description?: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  html_url: string;
  language?: string | null;
}

interface GithubSearchResponse {
  items: GithubApiRepo[];
}

function ghCacheKey(query: string): string {
  return `https://openglad-cache.internal/github?q=${encodeURIComponent(query.trim().toLowerCase())}`;
}

export async function searchGithub(
  query: string,
  limit = 5,
): Promise<GithubRepo[]> {
  const oneYearAgo = new Date(Date.now() - 365 * 86400 * 1000)
    .toISOString()
    .slice(0, 10);
  const q = encodeURIComponent(`${query} pushed:>${oneYearAgo}`);
  const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "openGlad/1.0 (MCP Friction Engine)",
        Accept: "application/vnd.github+json",
      },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as GithubSearchResponse;
    if (!json.items) return [];

    return json.items.slice(0, limit).map((r) => ({
      name: r.name,
      full_name: r.full_name,
      description: r.description ?? "(no description)",
      stars: r.stargazers_count,
      forks: r.forks_count,
      open_issues: r.open_issues_count,
      pushed_at: r.pushed_at,
      url: r.html_url,
      language: r.language ?? null,
    }));
  } catch {
    return [];
  }
}

export function formatGithubResults(repos: GithubRepo[]): string {
  if (repos.length === 0) return "";

  const lines = [`**GitHub Repositories** (${repos.length} active projects)\n`];
  for (const r of repos) {
    const date = r.pushed_at.slice(0, 10);
    const lang = r.language ? ` | ${r.language}` : "";
    lines.push(
      `### ${r.full_name} | ⭐ ${r.stars.toLocaleString()} | Forks: ${r.forks}${lang} | Last push: ${date}`,
    );
    lines.push(r.description);
    lines.push(r.url);
    lines.push("");
  }
  return lines.join("\n");
}

export async function fetchGithubContext(query: string): Promise<string> {
  const cache = caches.default;
  const key = ghCacheKey(query);

  const cached = await cache.match(key);
  if (cached) return cached.text();

  const repos = await searchGithub(query);
  const result = formatGithubResults(repos);
  if (result) {
    await cache.put(
      key,
      new Response(result, {
        headers: { "Cache-Control": `s-maxage=${GH_CACHE_TTL}` },
      }),
    );
  }
  return result;
}
