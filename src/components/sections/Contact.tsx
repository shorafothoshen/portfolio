"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { Variants } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail, MapPin } from "lucide-react";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiCodeforces, SiLeetcode } from "react-icons/si";
import { contact, Social, SocialId } from "@/data/contact";


const EASE = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, margin: "-80px" } as const;

const ICONS: Record<SocialId, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  codeforces: SiCodeforces,
  leetcode: SiLeetcode,
};

/* ---------- variants ---------- */

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ---------- helpers ---------- */

/** URL এর শেষ অংশ ("…/in/my-id" -> "my-id") handle হিসেবে দেখাতে */
function handleFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? new URL(url).hostname;
  } catch {
    return url;
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

const cardBase =
  "group relative flex items-center gap-4 rounded-xl border border-white/10 bg-white/3 p-4 transition-colors duration-300 sm:p-5";
const iconCircle =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-gray-200 transition-colors duration-300 group-hover:bg-violet-500/15 group-hover:text-violet-400";

/* ---------- intro (left) ---------- */

export function ContactIntro() {
  return (
    <div className="relative">
      {/* Decorative: halka dotted grid + ring (Hero er moto) */}
      <div className="pointer-events-none absolute -left-4 -top-6 hidden h-40 w-40 opacity-30 sm:block" aria-hidden
        style={{
          backgroundImage: "radial-gradient(#9ca3af 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="pointer-events-none absolute -bottom-24 -left-16 hidden h-56 w-56 rounded-full border border-white/5 lg:block" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-8 hidden h-40 w-40 rounded-full border border-violet-400/10 lg:block" aria-hidden />

      <motion.div variants={list} initial="hidden" whileInView="show" viewport={viewport} className="relative">
        <motion.p variants={rise} className="text-sm font-medium uppercase tracking-widest text-violet-400">
          Contact
        </motion.p>

        {/* Heading reveal: niche theke mask kore uthe ashe */}
        <h2 className="mt-3 overflow-hidden pb-1 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 0.75, ease: EASE } },
            }}
          >
            Let&apos;s <span className="text-violet-400">Connect</span>
          </motion.span>
        </h2>

        <motion.p variants={rise} className="mt-5 max-w-md text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
          Have an interesting idea, want to collaborate, or just want to talk about
          technology? Feel free to reach out. I&apos;m always open to meaningful
          connections and new opportunities.
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ---------- cards (right) ---------- */

function EmailCard({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const onCopy = async () => {
    const ok = await copyText(email);
    setStatus(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  };

  return (
    <motion.li variants={rise} className={`${cardBase} hover:border-violet-400/50`}>
      <span className={iconCircle}>
        <Mail className="h-5 w-5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-violet-400">Email</p>
        <a
          href={`mailto:${email}`}
          className="mt-0.5 block break-all text-sm font-medium text-white transition-colors hover:text-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:text-base"
        >
          {email}
        </a>
      </div>

      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy email address ${email}`}
        className={`relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-md border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:px-4 ${
          status === "copied"
            ? "border-violet-400/60 bg-violet-500/15 text-violet-200"
            : "border-white/20 text-white hover:border-violet-400/60 hover:bg-white/5"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "copied" ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="h-3.5 w-3.5" aria-hidden /> Copied
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-2"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden /> {status === "failed" ? "Copy failed" : "Copy"}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Screen reader feedback */}
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied" ? "Email address copied to clipboard" : status === "failed" ? "Couldn't copy the email address" : ""}
      </span>
    </motion.li>
  );
}

function SocialCard({ social }: { social: Social }) {
  const Icon = ICONS[social.id];
  return (
    <motion.li variants={rise}>
      <motion.a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${social.label} profile (opens in a new tab)`}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 350, damping: 24 }}
        className={`${cardBase} h-full hover:border-violet-400/50 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400`}
      >
        <span className={`${iconCircle} group-hover:scale-110`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{social.label}</p>
          <p className="truncate text-xs text-gray-400">@{handleFromUrl(social.url)}</p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-400"
          aria-hidden
        />
      </motion.a>
    </motion.li>
  );
}

function LocationCard({ location }: { location: string }) {
  return (
    <motion.li variants={rise} className={cardBase}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-gray-200">
        <MapPin className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="text-xs text-violet-400">Location</p>
        <p className="mt-0.5 text-sm font-medium text-white sm:text-base">{location}</p>
      </div>
    </motion.li>
  );
}

export function ContactLinks() {
  const socials = contact.socials.filter((s) => s.url);

  return (
    <motion.ul variants={list} initial="hidden" whileInView="show" viewport={viewport} className="space-y-3">
      <EmailCard email={contact.email} />

      {socials.length > 0 && (
        <li>
          <ul className="grid gap-3 sm:grid-cols-2">
            {socials.map((s) => (
              <SocialCard key={s.id} social={s} />
            ))}
          </ul>
        </li>
      )}

      <LocationCard location={contact.location} />
    </motion.ul>
  );
}

export default function Contact({ children }: { children?: ReactNode }) {
  return (
    // reducedMotion="user": OS e "reduce motion" on thakle transform animation bondho
    <MotionConfig reducedMotion="user">
      <section
        id="contact"
        className="scroll-mt-[64px] overflow-hidden bg-[#0a0a14] py-14 sm:scroll-mt-[72px] sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <ContactIntro />
            </div>
            <div className="lg:col-span-7">
              <ContactLinks />
              {children && <div className="mt-6">{children}</div>}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}