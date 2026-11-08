"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
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

/** Parallax শুধু desktop এ (mobile এ হালকা রাখতে) */
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
          transition: { duration: 0.9, ease: EASE },
        },
      };

const imageScaleVariants = (reduce: boolean): Variants =>
  reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { scale: 1.18 },
        show: { scale: 1, transition: { duration: 1.2, ease: EASE } },
      };

const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const textItem = (dir: 1 | -1, reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, x: dir * 24 },
        show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
      };

/* ---------- image frame ---------- */

function ProjectImage({
  project,
  dir,
  reduce,
  parallax,
}: {
  project: ProjectType;
  dir: 1 | -1;
  reduce: boolean;
  parallax: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const href = hasLink(project.demo) ? project.demo : hasLink(project.github) ? project.github : undefined;
  const label = hasLink(project.demo)
    ? `Open ${project.title} live demo`
    : `Open ${project.title} repository`;

  const media = (
    <div className="relative aspect-16/10 w-full overflow-hidden bg-[#12121f]">
      
      <motion.div
        className="absolute inset-x-0 inset-y-[8%] will-change-transform"
        style={parallax && !reduce ? { y } : undefined}
      >
        <motion.div className="relative h-full w-full" variants={imageScaleVariants(reduce)}>
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/30 via-indigo-500/15 to-[#12121f] transition-transform duration-700 ease-out group-hover:scale-105">
              <span className="px-6 text-center text-3xl font-bold text-white/25">
                {project.title}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <motion.div ref={ref} variants={frameVariants(dir, reduce)}>
      <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/3 transition-colors duration-300 focus-within:border-violet-400/60 hover:border-violet-400/50">
        {/* Browser-style top bar */}
        <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#12121f] px-4 py-3" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400"
          >
            {media}
          </a>
        ) : (
          media
        )}
      </div>
    </motion.div>
  );
}

/* ---------- one project ---------- */

function ProjectItem({ project, index }: { project: ProjectType; index: number }) {
  const reduce = !!useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
      className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
    >
      {/* Image */}
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <ProjectImage project={project} dir={dir} reduce={reduce} parallax={isDesktop} />
      </div>

      {/* Text */}
      <motion.div
        variants={textContainer}
        className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}
      >
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="font-mono text-sm text-violet-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-10 bg-white/15" aria-hidden />
          {project.category && (
            <span className="text-xs uppercase tracking-widest text-gray-400">
              {project.category}
            </span>
          )}
        </motion.div>

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
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200"
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

export default function Projects() {
  return (
    // reducedMotion="user": OS e "reduce motion" on thakle transform animation bondho
    <MotionConfig reducedMotion="user">
      <section
        id="projects"
        className="scroll-mt-16 overflow-hidden bg-[#0c0c18] py-14 sm:scroll-mt-18 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          {/* Heading: baki section er moto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
                Projects
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">Featured Projects</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-300">
                A selection of things I&apos;ve built, with source code and live demos where
                available.
              </p>
            </div>
            
          </motion.div>

          {/* Projects */}
          <ol className="mt-12 space-y-16 sm:mt-14 sm:space-y-24">
            {project.map((project, i) => (
              <ProjectItem key={project.title} project={project} index={i} />
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}