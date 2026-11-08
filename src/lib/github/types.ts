export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  /** YYYY-MM-DD */
  date: string;
  count: number;
  level: ContributionLevel;
};

export type RepoInfo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  /** ISO date, last push */
  pushedAt: string;
};

/** Contribution data কোন source থেকে এসেছে (debug এর জন্য /api/github এ দেখা যায়) */
export type ContributionSource = "github-graphql" | "github-profile" | "public-api";

export type ContributionSummary = {
  source: ContributionSource;
  total: number;
  currentStreak: number;
  longestStreak: number;
  days: ContributionDay[];
};

/** /api/github এর response. কোনো section fail করলে সেটা null থাকে, বাকিগুলো তবুও আসে। */
export type GithubData = {
  username: string;
  profileUrl: string;
  contributions: ContributionSummary | null;
  repos: RepoInfo[] | null;
  publicRepos: number | null;
  errors: { contributions?: string; repos?: string; profile?: string };
  fetchedAt: string;
};