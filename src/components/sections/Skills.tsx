"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useInView,
} from "motion/react";
import type { Variants } from "motion/react";
import { LuBinary } from "react-icons/lu";
import { CATEGORIES, TECHS } from "@/data/techStack";
import type { Category, Tech } from "@/data/techStack";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut", delay: Math.min(i, 12) * 0.04 },
  }),
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.18 } },
  hover: {
    y: -4,
    scale: 1.03,
    transition: { type: "spring", stiffness: 350, damping: 22 },
  },
};

const iconVariants: Variants = {
  hover: {
    scale: 1.15,
    rotate: -6,
    transition: { type: "spring", stiffness: 300, damping: 14 },
  },
};

function TechCard({ tech, index, inView }: { tech: Tech; index: number; inView: boolean }) {
  const Icon = tech.icon;

  return (
    <motion.li
      layout
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      exit="exit"
      whileHover="hover"
      className="relative flex h-28 flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-center transition-colors hover:border-violet-400/50 hover:bg-white/[0.05]"
    >
      {tech.status === "learning" && (
        <span className="absolute right-2 top-2 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-300">
          Learning
        </span>
      )}

      {/* Hero stats / old Skills er moto gol icon background */}
      <motion.span
        variants={iconVariants}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5"
      >
        {Icon ? (
          <Icon className="h-5 w-5" style={{ color: tech.color }} aria-hidden />
        ) : (
          <span
            className="font-mono text-xs font-bold"
            style={{ color: tech.color }}
            aria-hidden
          >
            {tech.monogram}
          </span>
        )}
      </motion.span>

      <span className="text-xs leading-tight text-gray-200">{tech.name}</span>
    </motion.li>
  );
}

export default function Skills() {
  const [active, setActive] = useState<Category>("All");
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "0px 0px -80px 0px" });

  const visible =
    active === "All" ? TECHS : TECHS.filter((t) => t.categories.includes(active));

  return (
    // reducedMotion="user": OS e "reduce motion" on thakle transform/layout animation bondho
    <MotionConfig reducedMotion="user">
      <section
        id="skills"
        className="scroll-mt-[64px] bg-[#0a0a14] py-14 sm:scroll-mt-[72px]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          {/* Heading: About / Projects er moto left aligned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
              My Tech Stack
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Technologies I Work With
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300">
              A collection of technologies I use to build applications and
              continuously expand my development skills.
            </p>
          </motion.div>

          {/* Filters: site er button style (rounded-md) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            className="-mx-4 mt-6 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <LayoutGroup id="tech-filters">
              <div
                role="group"
                aria-label="Filter technologies by category"
                className="flex w-max gap-3 sm:w-auto sm:flex-wrap"
              >
                {CATEGORIES.map((cat) => {
                  const selected = active === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActive(cat)}
                      className={`relative shrink-0 whitespace-nowrap rounded-md border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                        selected
                          ? "border-transparent text-white"
                          : "border-white/20 text-white hover:bg-white/5"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="tech-filter-pill"
                          className="absolute inset-0 rounded-md bg-violet-500"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </motion.div>

          {/* Count + legend */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-xs text-gray-400">
            <p aria-live="polite">
              Showing {visible.length} {visible.length === 1 ? "technology" : "technologies"}
            </p>
            <p className="flex items-center gap-2">
              <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                Learning
              </span>
              currently learning, the rest I use actively
            </p>
          </div>

          {/* Grid: Projects section er moto full width, gap */}
          <ul
            ref={gridRef}
            className="relative mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((tech, i) => (
                <TechCard key={tech.name} tech={tech} index={i} inView={inView} />
              ))}
            </AnimatePresence>
          </ul>

          {/* DSA focus: Hero stats bar er style */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-8 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400">
              <LuBinary className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs text-violet-400">Development focus</p>
              <p className="mt-1 text-sm font-semibold text-white">
                Data Structures &amp; Algorithms
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-300">
                I practice regularly to sharpen my problem-solving.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}