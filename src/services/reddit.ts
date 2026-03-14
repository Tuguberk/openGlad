import { TARGET_SUBREDDITS } from "../config/constants";

const CACHE_TTL = 3600; // 1 hour in seconds

interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
  created_utc: number;
}

interface RedditSearchResult {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

function cacheKey(query: string): string {
  const normalized = query.trim().toLowerCase();
  return `https://openglad-cache.internal/reddit?q=${encodeURIComponent(normalized)}`;
}

export async function searchReddit(
  query: string,
  limit = 5,
): Promise<RedditPost[]> {
  const posts: RedditPost[] = [];
  const encoded = encodeURIComponent(query);

  const fetches = TARGET_SUBREDDITS.map(async (sub) => {
    const subreddit = sub.replace("r/", "");
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encoded}&sort=relevance&limit=${limit}&restrict_sr=on&t=year`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "openGlad/1.0 (MCP Friction Engine)" },
      });
      if (!res.ok) return [];
      const json = (await res.json()) as RedditSearchResult;
      return json.data.children.map((c) => c.data);
    } catch {
      return [];
    }
  });

  const results = await Promise.all(fetches);
  for (const batch of results) {
    posts.push(...batch);
  }

  // Sort by score descending, take top results
  posts.sort((a, b) => b.score - a.score);
  return posts.slice(0, limit * 3);
}

export function formatRedditResults(posts: RedditPost[]): string {
  if (posts.length === 0) {
    return "No relevant Reddit discussions found for this query.";
  }

  const lines: string[] = [
    `**Reddit Market Data** (${posts.length} posts found)\n`,
  ];

  for (const post of posts) {
    const snippet = post.selftext
      ? post.selftext.slice(0, 300) + (post.selftext.length > 300 ? "..." : "")
      : "(link post)";
    const date = new Date(post.created_utc * 1000).toISOString().slice(0, 10);

    lines.push(
      `### r/${post.subreddit} | Score: ${post.score} | Comments: ${post.num_comments} | ${date}`,
    );
    lines.push(`**${post.title}**`);
    lines.push(snippet);
    lines.push("");
  }

  return lines.join("\n");
}

export async function fetchRedditContext(query: string): Promise<string> {
  const cache = caches.default;
  const key = cacheKey(query);

  // Check cache first
  const cached = await cache.match(key);
  if (cached) {
    return cached.text();
  }

  // Fetch fresh data
  const posts = await searchReddit(query);
  const result = formatRedditResults(posts);

  // Store in cache with 1-hour TTL
  await cache.put(
    key,
    new Response(result, {
      headers: { "Cache-Control": `s-maxage=${CACHE_TTL}` },
    }),
  );

  return result;
}
