// Server-only: client component থেকে এটা import করো না।
import type {
  ContributionDay,
  ContributionLevel,
  ContributionSource,
  ContributionSummary,
  GithubData,
  RepoInfo,
} from "./types";

export const GITHUB_USERNAME = "shorafothoshen";

/** Portfolio র Projects section এ আগে থেকেই দেখানো repo গুলোর নাম এখানে দিলে এখানে আর আসবে না। */
const EXCLUDE_REPOS: string[] = [];

const REPO_LIMIT = 6;
const TTL_MS = 60 * 60 * 1000; // 1 ঘণ্টা
const TIMEOUT_MS = 10_000;

export class UpstreamError extends Error {}

/* ---------- pure helpers (test করা যায়) ---------- */

export function computeStreaks(days: ContributionDay[]): { current: number; longest: number } {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  // Current streak: আজকের দিনে এখনো contribution না থাকলে গতকাল থেকে গোনা শুরু (GitHub এর মতো)
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i -= 1;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current += 1;
    i -= 1;
  }
  return { current, longest };
}

function clampLevel(n: unknown): ContributionLevel {
  const v = typeof n === "number" ? Math.round(n) : 0;
  return (v < 0 ? 0 : v > 4 ? 4 : v) as ContributionLevel;
}

/** timezone এর কারণে "আগামীকাল" এর ফাঁকা দিন বাদ দিতে */
function dropFuture(days: ContributionDay[]): ContributionDay[] {
  const limit = new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return days.filter((d) => d.date <= limit);
}

function finalizeDays(days: ContributionDay[]): ContributionDay[] {
  const sorted = [...days].sort((a, b) => (a.date < b.date ? -1 : 1));
  return dropFuture(sorted).slice(-371); // সর্বোচ্চ ~53 সপ্তাহ
}

/** github-contributions-api.jogruber.de/v4/<user>?y=last এর response */
export function normalizePublicApi(json: unknown): ContributionDay[] {
  const list = (json as { contributions?: unknown } | null)?.contributions;
  if (!Array.isArray(list) || list.length === 0) {
    throw new UpstreamError("Unexpected contribution data format");
  }
  const days: ContributionDay[] = [];
  for (const item of list) {
    const r = item as { date?: unknown; count?: unknown; level?: unknown };
    if (typeof r.date !== "string" || typeof r.count !== "number") {
      throw new UpstreamError("Unexpected contribution data format");
    }
    days.push({ date: r.date, count: r.count, level: clampLevel(r.level) });
  }
  return finalizeDays(days);
}

const GQL_LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/** GitHub GraphQL contributionCalendar এর response */
export function normalizeGraphql(json: unknown): ContributionDay[] {
  const weeks = (
    json as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              weeks?: { contributionDays?: { date: string; contributionCount: number; contributionLevel: string }[] }[];
            };
          };
        };
      };
    } | null
  )?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

  if (!Array.isArray(weeks) || weeks.length === 0) {
    throw new UpstreamError("Unexpected GraphQL contribution format");
  }
  const days: ContributionDay[] = [];
  for (const w of weeks) {
    for (const d of w.contributionDays ?? []) {
      days.push({
        date: d.date,
        count: d.contributionCount,
        level: GQL_LEVELS[d.contributionLevel] ?? 0,
      });
    }
  }
  return finalizeDays(days);
}

/**
 * github.com/users/<user>/contributions এর HTML (GitHub নিজের profile graph এ যা দেখায় সেটাই)।
 * প্রতিটা দিনের <td data-date data-level id> আর তার <tool-tip for=id>"N contributions on ..."</tool-tip> থেকে count নেয়।
 */
export function normalizeProfileHtml(html: string): ContributionDay[] {
  const counts = new Map<string, number>();
  const tipRe = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g;
  for (const m of html.matchAll(tipRe)) {
    const t = m[2].trim().match(/^(No|\d[\d,]*)\s+contributions?/i);
    if (t) counts.set(m[1], /^no$/i.test(t[1]) ? 0 : Number(t[1].replace(/,/g, "")));
  }

  const days: ContributionDay[] = [];
  const cellRe = /<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g;
  for (const m of html.matchAll(cellRe)) {
    const tag = m[0];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const level = tag.match(/\bdata-level="(\d)"/)?.[1];
    const count = id ? counts.get(id) : undefined;
    if (count === undefined) throw new UpstreamError("Unexpected profile contribution format");
    days.push({ date: m[1], count, level: clampLevel(level === undefined ? 0 : Number(level)) });
  }
  if (days.length === 0) throw new UpstreamError("Unexpected profile contribution format");
  return finalizeDays(days);
}

export function summarize(days: ContributionDay[], source: ContributionSource): ContributionSummary {
  const { current, longest } = computeStreaks(days);
  return {
    source,
    total: days.reduce((sum, d) => sum + d.count, 0),
    currentStreak: current,
    longestStreak: longest,
    days,
  };
}

/* ---------- network ---------- */

async function request(url: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.GITHUB_TOKEN; // optional, শুধু server এ থাকে
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-site",
      ...(token && url.startsWith("https://api.github.com") ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (res.status === 403 || res.status === 429) {
    throw new UpstreamError("Rate limit reached. Please try again later.");
  }
  if (!res.ok) throw new UpstreamError(`Request failed (${res.status})`);
  return res;
}

async function fetchContributionsGraphql(): Promise<ContributionDay[]> {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
  const res = await request("https://api.github.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
  });
  return normalizeGraphql(await res.json());
}

async function fetchContributionsProfile(): Promise<ContributionDay[]> {
  const res = await request(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
    headers: { Accept: "text/html" },
  });
  return normalizeProfileHtml(await res.text());
}

async function fetchContributionsPublic(): Promise<ContributionDay[]> {
  const res = await request(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
    { headers: { Accept: "application/json" } }
  );
  return normalizePublicApi(await res.json());
}

async function fetchContributions(): Promise<ContributionSummary> {
  // 1) Token থাকলে official GraphQL (owner এর token হলে সবচেয়ে নির্ভুল)
  if (process.env.GITHUB_TOKEN) {
    try {
      return summarize(await fetchContributionsGraphql(), "github-graphql");
    } catch {
      /* পরের source এ যাই */
    }
  }
  // 2) GitHub এর নিজের profile graph (logged-out visitor যা দেখে)
  try {
    return summarize(await fetchContributionsProfile(), "github-profile");
  } catch {
    /* পরের source এ যাই */
  }
  // 3) Third-party public API
  return summarize(await fetchContributionsPublic(), "public-api");
}

async function fetchRepos(): Promise<RepoInfo[]> {
  const res = await request(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=pushed&direction=desc&per_page=30`
  );
  const json = (await res.json()) as {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    pushed_at: string | null;
    updated_at: string;
    fork: boolean;
  }[];
  if (!Array.isArray(json)) throw new UpstreamError("Unexpected repository format");

  return json
    .filter(
      (r) =>
        !r.fork &&
        r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() && // profile README repo
        !EXCLUDE_REPOS.includes(r.name)
    )
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at ?? r.updated_at,
    }))
    .sort((a, b) => (a.pushedAt < b.pushedAt ? 1 : -1))
    .slice(0, REPO_LIMIT);
}

async function fetchPublicRepoCount(): Promise<number> {
  const res = await request(`https://api.github.com/users/${GITHUB_USERNAME}`);
  const json = (await res.json()) as { public_repos?: unknown };
  if (typeof json.public_repos !== "number") throw new UpstreamError("Unexpected profile format");
  return json.public_repos;
}

/* ---------- cache + aggregate ---------- */

let cache: { data: GithubData; at: number } | null = null;

const message = (e: unknown, fallback: string) =>
  e instanceof UpstreamError ? e.message : fallback;

export async function getGithubData(): Promise<GithubData> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  const [c, r, p] = await Promise.allSettled([
    fetchContributions(),
    fetchRepos(),
    fetchPublicRepoCount(),
  ]);

  const stale = cache?.data;
  const errors: GithubData["errors"] = {};

  // কোনো section fail করলে আগের (stale) data থাকলে সেটা দেখাই, না থাকলে null + error
  let contributions: GithubData["contributions"];
  if (c.status === "fulfilled") contributions = c.value;
  else {
    contributions = stale?.contributions ?? null;
    if (!contributions) errors.contributions = message(c.reason, "Couldn't load contribution data.");
  }

  let repos: GithubData["repos"];
  if (r.status === "fulfilled") repos = r.value;
  else {
    repos = stale?.repos ?? null;
    if (!repos) errors.repos = message(r.reason, "Couldn't load repositories.");
  }

  let publicRepos: GithubData["publicRepos"];
  if (p.status === "fulfilled") publicRepos = p.value;
  else {
    publicRepos = stale?.publicRepos ?? null;
    if (publicRepos === null) errors.profile = message(p.reason, "Couldn't load profile data.");
  }

  const data: GithubData = {
    username: GITHUB_USERNAME,
    profileUrl: `https://github.com/${GITHUB_USERNAME}`,
    contributions,
    repos,
    publicRepos,
    errors,
    fetchedAt: new Date().toISOString(),
  };

  // সব সফল হলেই cache করি; ভুল data যেন ১ ঘণ্টা আটকে না থাকে
  if (c.status === "fulfilled" && r.status === "fulfilled" && p.status === "fulfilled") {
    cache = { data, at: Date.now() };
  }
  return data;
}