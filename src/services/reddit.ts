import { TARGET_SUBREDDITS, getTopicSubreddits } from "../config/constants";
import { deduplicateByTitle, capByAuthor, engagementScore } from "../utils/dedupe";

const CACHE_TTL = 3600;

export interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
  created_utc: number;
  author: string;
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

async function fetchMultiSubreddit(
  subreddits: string[],
  query: string,
  limit: number,
): Promise<RedditPost[]> {
  const multi = subreddits.map((s) => s.replace("r/", "")).join("+");
  const encoded = encodeURIComponent(query);
  // Reddit multi-subreddit search: r/sub1+sub2+.../search.json — one request for all subs
  const url = `https://www.reddit.com/r/${multi}/search.json?q=${encoded}&sort=relevance&limit=${limit}&restrict_sr=on&t=year`;

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
}

export async function searchReddit(
  query: string,
  limit = 5,
): Promise<RedditPost[]> {
  const subreddits = [
    ...TARGET_SUBREDDITS,
    ...getTopicSubreddits(query),
  ];

  // Batch all subreddits into one request to avoid hitting CF's 50-subrequest cap
  let posts = await fetchMultiSubreddit(subreddits, query, limit * 3);

  // Thin-source retry: if too few results, retry with shortened core query (1 extra request)
  if (posts.length < 3) {
    const coreQuery = query.split(" ").slice(0, 3).join(" ");
    if (coreQuery !== query) {
      posts = await fetchMultiSubreddit(subreddits, coreQuery, limit * 3);
    }
  }

  // Per-author cap: max 3 posts per author
  const capped = capByAuthor(posts, 3);

  // Deduplication across subreddits
  const deduped = deduplicateByTitle(capped, 0.7);

  // Engagement-based ranking
  const maxScore = Math.max(...deduped.map((p) => p.score), 1);
  const maxComments = Math.max(...deduped.map((p) => p.num_comments), 1);
  deduped.sort(
    (a, b) =>
      engagementScore(b.score, b.num_comments, b.created_utc, maxScore, maxComments) -
      engagementScore(a.score, a.num_comments, a.created_utc, maxScore, maxComments),
  );

  return deduped.slice(0, limit * 3);
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

  const cached = await cache.match(key);
  if (cached) {
    return cached.text();
  }

  const posts = await searchReddit(query);
  const result = formatRedditResults(posts);

  await cache.put(
    key,
    new Response(result, {
      headers: { "Cache-Control": `s-maxage=${CACHE_TTL}` },
    }),
  );

  return result;
}
