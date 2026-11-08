"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  Activity,
  ArrowRight,
  Flame,
  FolderGit2,
  Info,
  RefreshCw,
  Trophy,
} from "lucide-react";
import ContributionGraph from "@/components/github/ContributionGraph";
import type { GithubData } from "@/lib/github/types";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: GithubData };

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const viewport = { once: true, margin: "-60px" } as const;

/* ---------- small pieces ---------- */

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/5 ${className}`}
      aria-hidden
    />
  );
}

function RetryBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/3 p-5 sm:flex-row sm:items-center"
    >
      <p className="text-sm text-gray-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
      >
        <RefreshCw className="h-4 w-4" aria-hidden /> Retry
      </button>
    </div>
  );
}

type StatDef = {
  label: string;
  icon: ReactNode;
  tone: string;
  value: number | null;
  suffix?: string;
};

function StatCard({ def }: { def: StatDef }) {
  return (
    <motion.li
      variants={item}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/3 p-5"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${def.tone}`}
      >
        {def.icon}
      </span>
      <div className="min-w-0">
        {def.value === null ? (
          <p
            className="text-2xl font-bold text-gray-500"
            title="Unavailable right now"
          >
            &mdash;
          </p>
        ) : (
          <p className="text-2xl font-bold text-white">
            {def.value.toLocaleString("en-US")}
            {def.suffix && (
              <span className="ml-1 text-xs font-normal text-gray-400">
                {def.suffix}
              </span>
            )}
          </p>
        )}
        <p className="text-xs text-gray-300">{def.label}</p>
      </div>
    </motion.li>
  );
}

/* ---------- main ---------- */

export default function GithubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/github", { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GithubData;
        setState({ status: "ready", data });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState({ status: "error" });
      }
    })();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((a) => a + 1);
  }, []);

  const data = state.status === "ready" ? state.data : null;
  const c = data?.contributions ?? null;

  const stats: StatDef[] = [
    {
      label: "Public Contributions",
      icon: <Activity className="h-5 w-5" />,
      tone: "bg-violet-500/15 text-violet-400",
      value: c?.total ?? null,
    },
    {
      label: "Current Streak",
      icon: <Flame className="h-5 w-5" />,
      tone: "bg-orange-500/15 text-orange-400",
      value: c?.currentStreak ?? null,
      suffix: "days",
    },
    {
      label: "Longest Streak",
      icon: <Trophy className="h-5 w-5" />,
      tone: "bg-emerald-500/15 text-emerald-400",
      value: c?.longestStreak ?? null,
      suffix: "days",
    },
    {
      label: "Public Repositories",
      icon: <FolderGit2 className="h-5 w-5" />,
      tone: "bg-pink-500/15 text-pink-400",
      value: data?.publicRepos ?? null,
    },
  ];

  return (
    // reducedMotion="user": OS e "reduce motion" on thakle transform animation bondho
    <MotionConfig reducedMotion="user">
      <section
        id="github"
        className="scroll-mt-16 border-b border-white/5 bg-[#0a0a14] py-14 sm:scroll-mt-18"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
                GitHub Contributions
              </p>
            </div>
            <a
              href={data?.profileUrl ?? "https://github.com/shorafothoshen"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-violet-400 transition hover:text-violet-300"
            >
              View Profile <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </motion.div>

          {/* Whole-page failure */}
          {state.status === "error" && (
            <div className="mt-6">
              <RetryBox
                message="Couldn't load GitHub data right now. Please check your connection and try again."
                onRetry={retry}
              />
            </div>
          )}

          {state.status !== "error" && (
            <>
              {/* Stats */}
              <motion.ul
                key={state.status}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                aria-busy={state.status === "loading"}
              >
                {state.status === "loading"
                  ? [0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-23 rounded-xl" />
                    ))
                  : stats.map((def) => <StatCard key={def.label} def={def} />)}
              </motion.ul>

              {/* Contribution graph */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mt-4 rounded-xl border border-white/10 bg-white/3 p-5 sm:p-6"
              >
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    Contribution Activity
                  </h3>
                  {c && (
                    <p className="text-xs text-gray-400">
                      {c.total.toLocaleString("en-US")} - public contributions in
                      the last year
                    </p>
                  )}
                </div>

                {state.status === "loading" ? (
                  <Skeleton className="h-50" />
                ) : c ? (
                  <ContributionGraph days={c.days} total={c.total} />
                ) : (
                  <RetryBox
                    message={
                      data?.errors.contributions ??
                      "Contribution data is unavailable right now."
                    }
                    onRetry={retry}
                  />
                )}

                {/* Note: graph er thik niche, border diye alada */}
                {c && (
                  <p className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4 text-xs leading-5 text-gray-400">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    This graph shows contributions to public repositories only.
                    Activity in private repositories is not included.
                  </p>
                )}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
