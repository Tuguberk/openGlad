function getNgrams(text: string, n = 2): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const ngrams = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  return intersection / (a.size + b.size - intersection);
}

export function deduplicateByTitle<T extends { title: string }>(
  items: T[],
  threshold = 0.7,
): T[] {
  const kept: T[] = [];
  const keptNgrams: Set<string>[] = [];

  for (const item of items) {
    const ngrams = getNgrams(item.title);
    const isDuplicate = keptNgrams.some(
      (existing) => jaccardSimilarity(existing, ngrams) >= threshold,
    );
    if (!isDuplicate) {
      kept.push(item);
      keptNgrams.push(ngrams);
    }
  }
  return kept;
}

export function capByAuthor<T extends { author: string }>(
  items: T[],
  maxPerAuthor = 3,
): T[] {
  const counts = new Map<string, number>();
  return items.filter((item) => {
    const count = counts.get(item.author) ?? 0;
    if (count >= maxPerAuthor) return false;
    counts.set(item.author, count + 1);
    return true;
  });
}

export function engagementScore(
  score: number,
  numComments: number,
  createdUtc: number,
  maxScore: number,
  maxComments: number,
): number {
  const now = Date.now() / 1000;
  const ageDays = (now - createdUtc) / 86400;
  const freshness = Math.exp(-ageDays / 30);
  const engagement = maxScore > 0 ? Math.log(score + 1) / Math.log(maxScore + 1) : 0;
  const activity = maxComments > 0 ? Math.log(numComments + 1) / Math.log(maxComments + 1) : 0;
  return 0.6 * engagement + 0.3 * freshness + 0.1 * activity;
}
