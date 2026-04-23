export interface Env {}

export const TARGET_SUBREDDITS = [
  "r/Startup_Ideas",
  "r/Business_Ideas",
  "r/SaaS",
  "r/SideProject",
  "r/EntrepreneurRideAlong",
  "r/IndieHackers",
  "r/Futurology",
  "r/Technology",
  "r/AINewsAndTrends",
  "r/Startups",
  "r/Entrepreneur",
];

const TOPIC_SUBREDDITS: Record<string, string[]> = {
  ai: ["r/MachineLearning", "r/artificial", "r/ChatGPT", "r/LocalLLaMA"],
  ml: ["r/MachineLearning", "r/deeplearning"],
  crypto: ["r/CryptoCurrency", "r/defi", "r/ethereum", "r/Bitcoin"],
  blockchain: ["r/CryptoCurrency", "r/defi", "r/ethereum"],
  finance: ["r/personalfinance", "r/investing", "r/financialindependence"],
  fintech: ["r/fintech", "r/personalfinance", "r/investing"],
  health: ["r/HealthIT", "r/digitalhealth", "r/mhealth"],
  healthcare: ["r/HealthIT", "r/digitalhealth"],
  education: ["r/edtech", "r/learnprogramming", "r/Teachers"],
  ecommerce: ["r/ecommerce", "r/dropship", "r/FulfillmentByAmazon"],
  hr: ["r/humanresources", "r/remotework", "r/recruiting"],
  legal: ["r/legaladvice", "r/legaltech"],
  "real estate": ["r/realestateinvesting", "r/realestate", "r/proptech"],
  gaming: ["r/gamedev", "r/indiegaming", "r/gamedesign"],
  productivity: ["r/productivity", "r/nocode", "r/Notion"],
  marketing: ["r/marketing", "r/digital_marketing", "r/socialmedia"],
  security: ["r/cybersecurity", "r/netsec", "r/netsecstudents"],
  devtools: ["r/programming", "r/devops", "r/softwaredevelopment"],
  no_code: ["r/nocode", "r/Webflow", "r/bubble"],
};

export function getTopicSubreddits(query: string): string[] {
  const q = query.toLowerCase();
  const extra = new Set<string>();

  for (const [keyword, subs] of Object.entries(TOPIC_SUBREDDITS)) {
    if (q.includes(keyword)) {
      for (const s of subs) extra.add(s);
    }
  }

  // Remove any that are already in TARGET_SUBREDDITS
  const base = new Set(TARGET_SUBREDDITS);
  return [...extra].filter((s) => !base.has(s));
}
