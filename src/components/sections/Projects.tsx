"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue, Variants } from "motion/react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
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

/** Card e choto description: data te `shortDescription` thakle seta, nahole description (line-clamp e kete jabe) */
const getShortDescription = (p: ProjectType): string =>
  (p as ProjectType & { shortDescription?: string }).shortDescription ?? p.description;

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

// Floating glass pill / arrow: reveal er pore pop kore ashe
const popVariants = (reduce: boolean, delay: number): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 18, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay, ease: EASE } },
      };

// Title er niche accent line: baam theke dan e boro hoy
const lineVariants = (reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } };

/* ---------- image frame (glassmorphism) ---------- */

function ProjectImage({
  project,
  index,
  dir,
  reduce,
  motionOn,
  mx,
  my,
  onOpen,
}: {
  project: ProjectType;
  index: number;
  dir: 1 | -1;
  reduce: boolean;
  motionOn: boolean; // desktop && !reduce
  mx: MotionValue<number>; // mouse position (0..1) puro project item er moddhe
  my: MotionValue<number>;
  onOpen: () => void;
}) {
  // Mouse jekhane jay card sekhane tilt hobe
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 120, damping: 18 });

  // Image nijeo mouse er sathe ghurbe (parallax): shamner image mouse er dike, pichoner blur ulta dike
  const imgX = useSpring(useTransform(mx, [0, 1], [-30, 30]), { stiffness: 110, damping: 20 });
  const imgY = useSpring(useTransform(my, [0, 1], [-20, 20]), { stiffness: 110, damping: 20 });
  const bgX = useSpring(useTransform(mx, [0, 1], [18, -18]), { stiffness: 90, damping: 20 });
  const bgY = useSpring(useTransform(my, [0, 1], [12, -12]), { stiffness: 90, damping: 20 });

  // Floating pill / icon o mouse er ulta dike bhashe: ekta depth er feel dey
  const pillX = useSpring(useTransform(mx, [0, 1], [10, -10]), { stiffness: 90, damping: 16 });
  const pillY = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 90, damping: 16 });

  // Glass shine mouse er pichone pichone
  const px = useTransform(mx, (v) => `${v * 100}%`);
  const py = useTransform(my, (v) => `${v * 100}%`);
  const shine = useMotionTemplate`radial-gradient(380px circle at ${px} ${py}, rgba(255,255,255,0.16), transparent 50%)`;

  // Hover e card er chardike ghurte thaka gradient border
  const angle = useMotionValue(0);
  useEffect(() => {
    if (!motionOn) return;
    const controls = animate(angle, 360, { duration: 6, ease: "linear", repeat: Infinity });
    return () => controls.stop();
  }, [motionOn, angle]);
  const ring = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0deg, transparent 200deg, rgba(167,139,250,0.95) 290deg, rgba(129,140,248,0.95) 340deg, transparent 360deg)`;

  // Pichoner glow orb gulo dhire dhire bhashe
  const drift = (dx: number, dy: number, duration: number) =>
    reduce
      ? {}
      : {
          animate: { x: [0, dx, -dx / 2, 0], y: [0, dy, -dy / 2, 0] },
          transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
        };

  const num = String(index + 1).padStart(2, "0");

  const screen = (
    <div className="relative p-2.5 sm:p-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#12121f]/60 ring-1 ring-white/20 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]">
        <motion.div className="absolute inset-0" variants={imageScaleVariants(reduce)}>
          {project.image ? (
            <>
              {/* Pichone ek-i image blur kore: contain er fanka jayga gulo sundor vabe bhore jay */}
              <motion.div
                className="absolute inset-0"
                style={motionOn ? { x: bgX, y: bgY } : undefined}
                aria-hidden
              >
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="scale-125 object-cover opacity-60 blur-2xl"
                  aria-hidden
                />
              </motion.div>
              {/* Shamner image: puro ta dekha jabe, mouse er sathe halka ghurbe */}
              <motion.div
                className="absolute inset-0"
                style={motionOn ? { x: imgX, y: imgY } : undefined}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </motion.div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/40 via-indigo-500/20 to-fuchsia-500/20 transition-transform duration-700 ease-out group-hover:scale-105">
              <span className="px-6 text-center text-3xl font-bold text-white/30">
                {project.title}
              </span>
            </div>
          )}
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
      <motion.div
        style={motionOn ? { x: pillX, y: pillY } : undefined}
        className="pointer-events-none absolute bottom-5 left-5 z-20 sm:bottom-6 sm:left-6"
        aria-hidden
      >
      <motion.div
        variants={popVariants(reduce, 0.9)}
        className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2 pr-4 shadow-lg backdrop-blur-xl"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-gray-900">
          {num}
        </span>
        <span className="max-w-[10rem] truncate text-xs font-medium text-white">{project.title}</span>
      </motion.div>
      </motion.div>

      {/* floating glass icon (bottom-right): click korle details modal khule */}
      <motion.div
        style={motionOn ? { x: pillX, y: pillY } : undefined}
        className="pointer-events-none absolute bottom-5 right-5 z-20 sm:bottom-6 sm:right-6"
        aria-hidden
      >
        <motion.span
          variants={popVariants(reduce, 1.05)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-gray-900"
        >
          <Maximize2 className="h-4 w-4" />
        </motion.span>
      </motion.div>

      {/* mouse-following shine over the glass */}
      {motionOn && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
          style={{ background: shine }}
          aria-hidden
        />
      )}
    </div>
  );

  return (
    <motion.div className="relative" style={{ perspective: 1200 }}>
      {/* Colored orbs behind the glass: this is what makes the frosted blur visible */}
      <motion.div variants={backdropVariants(reduce)} className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          {...drift(24, 18, 13)}
          className={`absolute -top-10 h-44 w-44 rounded-full bg-violet-500/50 blur-3xl ${
            dir === 1 ? "-left-10" : "-right-10"
          }`}
        />
        <motion.div
          {...drift(-20, -22, 16)}
          className={`absolute -bottom-12 h-52 w-52 rounded-full bg-indigo-500/40 blur-3xl ${
            dir === 1 ? "-right-8" : "-left-8"
          }`}
        />
        <motion.div
          {...drift(30, -14, 19)}
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/30 blur-3xl"
        />
      </motion.div>

      {/* 3D tilt wrapper (mouse position ashe parent <li> theke) */}
      <motion.div
        style={motionOn ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative"
      >
        <motion.div variants={frameVariants(dir, reduce)}>
          {/* the frosted glass card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/[0.07] shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl transition-all duration-500 hover:border-white/35 hover:bg-white/[0.1] hover:shadow-[0_8px_60px_rgba(139,92,246,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]">
            {motionOn && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-40 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/item:opacity-100"
                style={{
                  background: ring,
                  padding: 1.5,
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
                aria-hidden
              />
            )}

            {/* Image e click korleo details modal khulbe */}
            <button
              type="button"
              onClick={onOpen}
              aria-haspopup="dialog"
              aria-label={`View details of ${project.title}`}
              className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400"
            >
              {screen}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- details modal ---------- */

/** SSR e false, client e true: portal shudhu client e render korar jonno */
const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

/** Slim, violet scrollbar (Firefox + Chrome/Safari) */
const SCROLL =
  "overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(139,92,246,0.55)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500/50";

function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400">{title}</h4>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-sm leading-6 text-gray-300">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function ProjectModal({
  project,
  reduce,
  onClose,
}: {
  project: ProjectType;
  reduce: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const tech = parseTech(project.tech);
  const demo = hasLink(project.demo) ? project.demo : undefined;
  const github = hasLink(project.github) ? project.github : undefined;

  // Scroll lock + Esc diye bondho + prothome Close button e focus
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`; // scrollbar sorle layout lafay na

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Tab key modal er bhitore-i ghurbe (focus trap)
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 40, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.97 },
      };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        // backdrop e click korle bondho
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        {...panelMotion}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#0e0e1c]/95 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:max-w-lg md:max-w-4xl md:rounded-3xl"
      >
        {/* soft glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-violet-600/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-white hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        {/* Mobile: puro ta ek sathe scroll kore. Tablet/desktop: baam e boro image, dan e shob text (nijer scrollbar shoho) */}
        <div className={`relative flex max-h-[88dvh] flex-col overflow-y-auto md:max-h-none md:flex-row md:overflow-visible ${SCROLL}`}>
          {/* Left: shudhu image, jate boro ar porishkar dekha jay */}
          <div className="p-2.5 sm:p-3 md:flex md:w-[58%] md:shrink-0 md:items-center md:p-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#12121f] ring-1 ring-white/15 md:aspect-[16/9]">
              {project.image ? (
                <>
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 520px, 90vw"
                    className="scale-125 object-cover opacity-50 blur-2xl"
                    aria-hidden
                  />
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(min-width: 768px) 520px, 90vw"
                    className="object-contain"
                  />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/40 via-indigo-500/20 to-fuchsia-500/20">
                  <span className="px-6 text-center text-2xl font-bold text-white/30">{project.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: category, title, overview, tech, links, challenges, improvements */}
          <div className={`relative px-4 pb-5 pt-1 sm:px-5 md:max-h-[84dvh] md:flex-1 md:overflow-y-auto md:border-l md:border-white/10 md:px-5 md:pt-5 ${SCROLL}`}>
            <div className="md:pr-10">
              {project.category && (
                <span className="inline-block rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-300">
                  {project.category}
                </span>
              )}
              <h3 id={titleId} className="mt-2.5 text-xl font-bold leading-tight text-white sm:text-2xl">
                {project.title}
              </h3>
            </div>

            <ModalSection title="Overview">
              <p className="text-sm leading-6 text-gray-300">{project.description}</p>
            </ModalSection>

            {tech.length > 0 && (
              <ModalSection title="Technology Stack">
                <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
                  {tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-200"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </ModalSection>
            )}

            {project.challenges && project.challenges.length > 0 && (
              <ModalSection title="Challenges Faced">
                <BulletList items={project.challenges} />
              </ModalSection>
            )}

            {project.improvements && project.improvements.length > 0 && (
              <ModalSection title="Future Improvements">
                <BulletList items={project.improvements} />
              </ModalSection>
            )}

            {(demo || github) && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 rounded-md bg-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
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
                    className="group/link inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-violet-400/60 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                  >
                    <FaGithub className="h-4 w-4" aria-hidden />
                    Source Code
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- one project ---------- */

function ProjectItem({ project, index }: { project: ProjectType; index: number }) {
  const reduce = !!useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const motionOn = desktop && !reduce;

  const flip = index % 2 === 1;
  const dir: 1 | -1 = flip ? -1 : 1;
  const item = textItem(flip ? 1 : -1, reduce);

  // Mouse position (0..1) puro project item er bhitore: image tilt + parallax eta theke chole
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const onMove = (e: PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  // Details modal
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus(); // bondho hole focus abar button e fire ashe
  }, [setOpen]);

  return (
    <motion.li
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      onPointerMove={motionOn ? onMove : undefined}
      onPointerLeave={motionOn ? onLeave : undefined}
      className="group/item grid items-center gap-6 lg:grid-cols-12 lg:gap-10"
    >
      {/* Image */}
      <div className={`mx-auto w-full max-w-md lg:col-span-6 lg:max-w-none ${flip ? "lg:order-2" : ""}`}>
        <ProjectImage
          project={project}
          index={index}
          dir={dir}
          reduce={reduce}
          motionOn={motionOn}
          mx={mx}
          my={my}
          onOpen={openModal}
        />
      </div>

      {/* Text: shudhu title + choto description + View Details */}
      <motion.div variants={textContainer} className={`lg:col-span-6 ${flip ? "lg:order-1" : ""}`}>
        <motion.h3 variants={item} className="text-xl font-bold text-white sm:text-2xl">
          {project.title}
        </motion.h3>

        <motion.span
          variants={lineVariants(reduce)}
          className="mt-3 block h-0.5 w-14 origin-left rounded-full bg-gradient-to-r from-violet-400 to-indigo-400"
          aria-hidden
        />

        <motion.p
          variants={item}
          className="mt-3 line-clamp-3 text-sm leading-7 text-gray-300"
        >
          {getShortDescription(project)}
        </motion.p>

        <motion.div variants={item} className="mt-7">
          <motion.button
            ref={triggerRef}
            type="button"
            onClick={openModal}
            aria-haspopup="dialog"
            aria-label={`View details of ${project.title}`}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="group/link inline-flex items-center gap-2 rounded-md bg-violet-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            View Details
            <Maximize2 className="h-4 w-4 transition-transform duration-300 group-hover/link:scale-110" aria-hidden />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal: body te portal kora, tai transform/clip er bhitore atke na */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && <ProjectModal project={project} reduce={reduce} onClose={closeModal} />}
          </AnimatePresence>,
          document.body
        )}
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
        <div className="mx-auto max-w-5xl px-4 sm:px-5">
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
          <AnimatePresence mode="wait">
            <motion.ol
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-10 space-y-12 sm:mt-12 sm:space-y-16"
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