"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { buildWeeks, formatDay, monthLabels } from "@/lib/github/calendar";
import type { ContributionDay } from "@/lib/github/types";

// Site er violet theme er sathe mil kora heatmap palette (Less -> More)
const LEVEL_COLORS = ["#1c1c30", "#3d3585", "#5b4fd1", "#7c6cf6", "#b6acff"] as const;

const GAP = 3; // px
const LABEL_COL = 34; // weekday label column + gap (px)
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

type Tip = { day: ContributionDay; x: number; y: number };

export default function ContributionGraph({
  days,
  total,
}: {
  days: ContributionDay[];
  total: number;
}) {
  const weeks = useMemo(() => buildWeeks(days), [days]);
  const months = useMemo(() => monthLabels(weeks), [weeks]);
  const n = weeks.length;

  const outerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const reduce = useReducedMotion();

  // Choto screen e latest dik (dan) theke dekhabe
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [n]);

  const onOver = (e: PointerEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-w]");
    const outer = outerRef.current;
    if (!target || !outer) return;
    const day = weeks[Number(target.dataset.w)]?.[Number(target.dataset.d)];
    if (!day) return;
    const r = target.getBoundingClientRect();
    const o = outer.getBoundingClientRect();
    const half = 90; // tooltip er ordhek width (approx), edge e katbe na
    const x = Math.min(Math.max(r.left - o.left + r.width / 2, half), o.width - half);
    setTip((prev) => (prev?.day.date === day.date ? prev : { day, x, y: r.top - o.top }));
  };

  const cellSize = `max(11px, calc((100cqw - ${LABEL_COL}px - ${(n - 1) * GAP}px) / ${n}))`;

  return (
    <div>
      <p className="sr-only">
        {total} contributions in the last year.
      </p>

      <div
        ref={outerRef}
        className="relative [container-type:inline-size]"
        style={{ ["--cell" as string]: cellSize }}
        onPointerLeave={() => setTip(null)}
      >
        <div className="flex" role="img" aria-label={`Contribution graph, ${total} contributions in the last year`}>
          {/* Weekday labels */}
          <div className="shrink-0 pt-5" style={{ width: LABEL_COL, paddingRight: 6 }} aria-hidden>
            <div className="grid" style={{ gridTemplateRows: "repeat(7, var(--cell))", rowGap: GAP }}>
              {WEEKDAY_LABELS.map((l, i) => (
                <span key={i} className="flex items-center text-[10px] leading-none text-gray-400">
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Scrollable graph */}
          <div
            ref={scrollRef}
            onScroll={() => setTip(null)}
            className="min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:thin]"
          >
            <div className="w-max">
              {/* Month labels */}
              <div
                className="mb-1 grid h-4"
                style={{ gridTemplateColumns: `repeat(${n}, var(--cell))`, columnGap: GAP }}
                aria-hidden
              >
                {months.map((m) => (
                  <span
                    key={`${m.label}-${m.col}`}
                    className="whitespace-nowrap text-[10px] leading-4 text-gray-400"
                    style={{ gridColumnStart: m.col + 1 }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Cells */}
              <div
                className="grid grid-flow-col"
                style={{
                  gridTemplateRows: "repeat(7, var(--cell))",
                  gridAutoColumns: "var(--cell)",
                  gap: GAP,
                }}
                onPointerOver={onOver}
              >
                {weeks.map((week, w) =>
                  week.map((day, d) =>
                    day ? (
                      <div
                        key={day.date}
                        data-w={w}
                        data-d={d}
                        className="rounded-[3px] transition-[outline-color] duration-150 hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-white/60"
                        style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                      />
                    ) : (
                      <div key={`pad-${w}-${d}`} aria-hidden />
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip: scroll container er baire, tai kete jay na */}
        <AnimatePresence>
          {tip && (
            <motion.div
              key="tip"
              role="status"
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/10 bg-[#12121f] px-3 py-1.5 text-xs text-gray-200 shadow-lg"
              initial={{ opacity: 0, left: tip.x, top: tip.y - 4 }}
              animate={{ opacity: 1, left: tip.x, top: tip.y - 8 }}
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 36 }}
            >
              <strong className="font-semibold text-white">
                {tip.day.count === 0
                  ? "No contributions"
                  : `${tip.day.count} contribution${tip.day.count === 1 ? "" : "s"}`}
              </strong>{" "}
              on {formatDay(tip.day.date)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-gray-400" aria-hidden>
        <span>Less</span>
        {LEVEL_COLORS.map((c) => (
          <span key={c} className="h-[11px] w-[11px] rounded-[3px]" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
