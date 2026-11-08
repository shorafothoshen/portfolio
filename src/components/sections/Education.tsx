"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import type { Variants } from "motion/react";
import { CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { education } from "@/data/education";
import type { Education as EducationItem } from "@/data/education";

const EASE = [0.22, 1, 0.36, 1] as const;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

const cardContent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const cardChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

function TimelineItem({
  entry,
  index,
  desktop,
  reduce,
}: {
  entry: EducationItem;
  index: number;
  desktop: boolean;
  reduce: boolean;
}) {
  const right = index % 2 === 1; // desktop e card kon pashe
  const ongoing = entry.status === "ongoing";

  // card ভেতরের দিক থেকে (timeline এর দিক থেকে) স্লাইড করে ঢোকে
  const cardVariants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 28, x: desktop ? (right ? 48 : -48) : 0 },
        show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: EASE } },
      };

  const dotVariants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { scale: 0, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 380, damping: 18 } },
      };

  return (
    <motion.li
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
    >
      {/* Dot: timeline e (mobile e left, desktop e majhkhane) */}
      <span className="absolute left-4 top-7 -translate-x-1/2 md:left-1/2" aria-hidden>
        <motion.span variants={dotVariants} className="relative flex h-4 w-4 items-center justify-center">
          {ongoing && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400/60 motion-safe:animate-ping" />
          )}
          <span className="relative h-4 w-4 rounded-full border-2 border-violet-400 bg-[#0a0a14]" />
        </motion.span>
      </span>

      {/* Card */}
      <motion.div
        variants={cardVariants}
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className={`rounded-xl border border-white/10 bg-white/3 p-5 transition-colors hover:border-violet-400/50 hover:bg-white/5 sm:p-6 ${
          right ? "md:col-start-2" : "md:col-start-1"
        }`}
      >
        <motion.div variants={cardContent} className="flex items-start gap-4">
          <motion.span
            variants={cardChild}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400"
          >
            <GraduationCap className="h-5 w-5" aria-hidden />
          </motion.span>

          <div className="min-w-0">
            <motion.div variants={cardChild} className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  ongoing ? "bg-violet-500/15 text-violet-300" : "bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {ongoing ? "Currently studying" : "Completed"}
              </span>
            </motion.div>

            <motion.h3 variants={cardChild} className="mt-2 text-lg font-bold leading-snug text-white">
              {entry.degree}
            </motion.h3>
            <motion.p variants={cardChild} className="mt-1 text-sm text-violet-400">
              {entry.institution}
            </motion.p>

            <motion.div
              variants={cardChild}
              className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {entry.period}
              </span>
              {entry.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {entry.location}
                </span>
              )}
              {entry.grade && <span>{entry.grade}</span>}
            </motion.div>

            {entry.description && (
              <motion.p variants={cardChild} className="mt-3 text-sm leading-7 text-gray-300">
                {entry.description}
              </motion.p>
            )}

            {entry.highlights && entry.highlights.length > 0 && (
              <motion.ul variants={cardChild} className="mt-3 flex flex-wrap gap-2">
                {entry.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200"
                  >
                    {h}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.li>
  );
}

export default function Education() {
  const reduce = !!useReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px)");
  const listRef = useRef<HTMLOListElement>(null);

  // Scroll korle timeline er line upor theke niche "ankhe"
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    // reducedMotion="user": OS e "reduce motion" on thakle transform animation bondho
    <MotionConfig reducedMotion="user">
      <section
        id="education"
        className="scroll-mt-[64px] overflow-hidden bg-[#0c0c18] py-14 sm:scroll-mt-[72px] sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          {/* Heading: baki section er moto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
              Education
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">My Academic Journey</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300">
              The education that built my foundation in computer science and software
              development.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative mt-12">
            {/* Line: track + scroll-linked fill */}
            <div
              className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-white/10 md:left-1/2"
              aria-hidden
            >
              <motion.div
                className="h-full w-full origin-top bg-violet-500"
                style={{ scaleY: reduce ? 1 : progress }}
              />
            </div>

            <ol ref={listRef} className="space-y-10 md:space-y-14">
              {education.map((entry, i) => (
                <TimelineItem
                  key={`${entry.degree}-${entry.period}`}
                  entry={entry}
                  index={i}
                  desktop={desktop}
                  reduce={reduce}
                />
              ))}
            </ol>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
