"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { project } from "@/data/projects";
import type { ProjectType } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- helpers ---------- */

const hasLink = (url?: string): url is string => !!url && url !== "#";

const parseTech = (tech: ProjectType["tech"]): string[] =>
  (Array.isArray(tech) ? tech : tech.split(","))
    .map((t) => t.trim())
    .filter(Boolean);

/** Parallax / tilt shudhu desktop e (mobile e halka rakhte) */
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

/* ---------- variants ---------- */

const frameVariants = (dir: 1 | -1, reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: {
          clipPath:
            dir === 1
              ? "inset(0% 100% 0% 0% round 16px)"
              : "inset(0% 0% 0% 100% round 16px)",
        },
        show: {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          transition: { duration: 1, ease: EASE },
        },
      };

const imageScaleVariants = (reduce: boolean): Variants =>
  reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { scale: 1.2 },
        show: { scale: 1, transition: { duration: 1.4, ease: EASE } },
      };

const backdropVariants = (reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.92 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 0.15, ease: EASE } },
      };

const sweepVariants: Variants = {
  hidden: { x: "-130%" },
  show: { x: "130%", transition: { duration: 1.2, delay: 0.8, ease: "easeInOut" } },
};

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

const textItem = (dir: 1 | -1, reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, x: dir * 28 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
      };

/* ---------- image frame (glassmorphism) ---------- */

function ProjectImage({
  project,
  index,
  dir,
  reduce,
  desktop,
}: {
  project: ProjectType;
  index: number;
  dir: 1 | -1;
  reduce: boolean;
  desktop: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOn = desktop && !reduce; // parallax + 3D tilt

  // Scroll parallax (image only)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  // Mouse-following tilt + glass shine
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [4, -4]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 140, damping: 18 });
  const px = useTransform(mx, (v) => `${v * 100}%`);
  const py = useTransform(my, (v) => `${v * 100}%`);
  const shine = useMotionTemplate`radial-gradient(380px circle at ${px} ${py}, rgba(255,255,255,0.16), transparent 50%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const isDemo = hasLink(project.demo);
  const href = isDemo ? project.demo : hasLink(project.github) ? project.github : undefined;
  const label = isDemo ? `Open ${project.title} live demo` : `Open ${project.title} repository`;
  const num = String(index + 1).padStart(2, "0");

  const screen = (
    <div className="relative p-3 sm:p-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#12121f]/60 ring-1 ring-white/20 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]">
        <motion.div
          className="absolute inset-x-0 -inset-y-[6%] will-change-transform"
          style={motionOn ? { y } : undefined}
        >
          <motion.div className="relative h-full w-full" variants={imageScaleVariants(reduce)}>
            {project.image ? (
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/40 via-indigo-500/20 to-fuchsia-500/20 transition-transform duration-700 ease-out group-hover:scale-105">
                <span className="px-6 text-center text-3xl font-bold text-white/30">
                  {project.title}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* soft top-left glass reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/15 via-transparent to-transparent"
          aria-hidden
        />

        {/* one-time light sweep */}
        {!reduce && (
          <motion.div
            variants={sweepVariants}
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.2) 50%, transparent 62%)",
            }}
            aria-hidden
          />
        )}
      </div>

      {/* floating glass pill: number + title (bottom-left, overlaps image) */}
      <div
        className="pointer-events-none absolute bottom-6 left-6 z-20 flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2 pr-4 shadow-lg backdrop-blur-xl sm:bottom-8 sm:left-8"
        aria-hidden
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-gray-900">
          {num}
        </span>
        <span className="max-w-[10rem] truncate text-xs font-medium text-white">{project.title}</span>
      </div>

      {/* floating glass arrow (bottom-right) */}
      {href && (
        <span
          className="pointer-events-none absolute bottom-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-gray-900 sm:bottom-8 sm:right-8"
          aria-hidden
        >
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </span>
      )}

      {/* mouse-following shine over the glass */}
      {motionOn && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: shine }}
          aria-hidden
        />
      )}
    </div>
  );

  return (
    <motion.div ref={ref} className="relative" style={{ perspective: 1200 }}>
      {/* Colored orbs behind the glass: this is what makes the frosted blur visible */}
      <motion.div variants={backdropVariants(reduce)} className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className={`absolute -top-10 h-44 w-44 rounded-full bg-violet-500/50 blur-3xl ${
            dir === 1 ? "-left-10" : "-right-10"
          }`}
        />
        <div
          className={`absolute -bottom-12 h-52 w-52 rounded-full bg-indigo-500/40 blur-3xl ${
            dir === 1 ? "-right-8" : "-left-8"
          }`}
        />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/30 blur-3xl" />
      </motion.div>

      {/* 3D tilt wrapper */}
      <motion.div
        onPointerMove={motionOn ? onMove : undefined}
        onPointerLeave={motionOn ? onLeave : undefined}
        style={motionOn ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative"
      >
        <motion.div variants={frameVariants(dir, reduce)}>
          {/* the frosted glass card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.07] shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-500 hover:border-white/35 hover:bg-white/[0.1] hover:shadow-[0_8px_60px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400"
              >
                {screen}
              </a>
            ) : (
              screen
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- one project ---------- */

function ProjectItem({ project, index }: { project: ProjectType; index: number }) {
  const reduce = !!useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");

  const flip = index % 2 === 1;
  const dir: 1 | -1 = flip ? -1 : 1;
  const item = textItem(flip ? 1 : -1, reduce);

  const tech = parseTech(project.tech);
  const demo = hasLink(project.demo) ? project.demo : undefined;
  const github = hasLink(project.github) ? project.github : undefined;

  return (
    <motion.li
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      {/* Image */}
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <ProjectImage project={project} index={index} dir={dir} reduce={reduce} desktop={desktop} />
      </div>

      {/* Text */}
      <motion.div variants={textContainer} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        {project.category && (
          <motion.span
            variants={item}
            className="inline-block rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300"
          >
            {project.category}
          </motion.span>
        )}

        <motion.h3 variants={item} className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          {project.title}
        </motion.h3>

        <motion.p variants={item} className="mt-4 text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
          {project.description}
        </motion.p>

        {tech.length > 0 && (
          <motion.ul variants={item} className="mt-5 flex flex-wrap gap-2" aria-label="Technologies used">
            {tech.map((t) => (
              <li
                key={t}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200 transition-colors hover:border-violet-400/40 hover:text-white"
              >
                {t}
              </li>
            ))}
          </motion.ul>
        )}

        {(demo || github) && (
          <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-md bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                Live Demo
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-violet-400/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                <FaGithub className="h-4 w-4" aria-hidden />
                Source Code
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
              </a>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.li>
  );
}

/* ---------- category filter ---------- */

const ALL = "All";

function CategoryFilter({
  categories,
  active,
  counts,
  onChange,
}: {
  categories: string[];
  active: string;
  counts: Record<string, number>;
  onChange: (c: string) => void;
}) {
  return (
    <div role="group" aria-label="Filter projects by category" className="mt-6 flex flex-wrap gap-2">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-pressed={isActive}
            className={`relative inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:text-sm ${
              isActive
                ? "border-transparent text-white"
                : "border-white/15 text-gray-300 hover:border-violet-400/50 hover:text-white"
            }`}
          >
            {/* Active pill: ek filter theke onno filter e smooth bhabe soriye jay */}
            {isActive && (
              <motion.span
                layoutId="project-filter-pill"
                className="absolute inset-0 rounded-full bg-violet-500 shadow-lg shadow-violet-500/30"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                aria-hidden
              />
            )}
            <span className="relative">{c}</span>
            <span
              className={`relative rounded-full px-1.5 text-[10px] leading-4 ${
                isActive ? "bg-white/25 text-white" : "bg-white/10 text-gray-400"
              }`}
            >
              {counts[c]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- section ---------- */

export default function Projects() {
  const [active, setActive] = useState(ALL);

  // Data theke unique category gulo ber kora ("All" shobar age)
  const { categories, counts } = useMemo(() => {
    const counts: Record<string, number> = { [ALL]: project.length };
    for (const p of project) {
      if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return { categories: [ALL, ...Object.keys(counts).filter((c) => c !== ALL)], counts };
  }, []);

  const visible = active === ALL ? project : project.filter((p) => p.category === active);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="projects"
        className="scroll-mt-16 overflow-hidden bg-[#0c0c18] py-14 sm:scroll-mt-18 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
              Projects
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Featured Projects</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300">
              A selection of things I&apos;ve built, with source code and live demos where
              available.
            </p>

            {/* Filter: 2 ta er kom category thakle dekhabe na */}
            {categories.length > 2 && (
              <CategoryFilter
                categories={categories}
                active={active}
                counts={counts}
                onChange={setActive}
              />
            )}
          </motion.div>

          {/* key={active}: filter bodlale list notun kore mount hoy, tai reveal animation abar chole */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-12 space-y-20 sm:mt-14 sm:space-y-28"
            >
              {visible.map((p, i) => (
                <ProjectItem key={p.title} project={p} index={i} />
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </section>
    </MotionConfig>
  );
}