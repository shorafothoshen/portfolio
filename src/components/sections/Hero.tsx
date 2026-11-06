"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Code2,
  LayoutGrid,
  Users,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaMedium, FaTwitter } from "react-icons/fa";

type Stat = { icon: ReactNode; value: string; label: string; tone: string };

const stats: Stat[] = [
  {
    icon: <Code2 className="h-5 w-5" />,
    value: "5+",
    label: "Years Experience",
    tone: "bg-violet-500/15 text-violet-400",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    value: "50+",
    label: "Projects Completed",
    tone: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: <Users className="h-5 w-5" />,
    value: "30+",
    label: "Happy Clients",
    tone: "bg-orange-500/15 text-orange-400",
  },
  {
    icon: <Award className="h-5 w-5" />,
    value: "10+",
    label: "Technologies",
    tone: "bg-pink-500/15 text-pink-400",
  },
];

const socials = [
  { icon: FaGithub, href: "https://github.com/", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0a0a14] pt-[72px]"
    >
      <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 pt-12 md:grid-cols-2">
        {/* Left */}
        <div className="pb-12">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-200">
            <span>👋</span> Hello, I&apos;m
          </span>

          <h1 className="mt-4 whitespace-nowrap text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Shorafot <span className="text-violet-400">Hoshen</span>
          </h1>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Full Stack Developer
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-7 text-gray-300">
            I build exceptional digital experiences that are fast, accessible,
            visually appealing and responsive. Let&apos;s build something
            amazing together!
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-3 rounded-md bg-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-600"
            >
              Hire Me <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-3 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              View Projects <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 flex items-center gap-5 text-white">
            <span className="text-sm">Follow me on</span>
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition hover:text-violet-400"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="relative mx-auto h-[420px] w-full max-w-md overflow-hidden md:h-[500px]">
          {/* dotted grid */}
          <div
            className="absolute left-10 top-8 h-24 w-24 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(#9ca3af 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* circle: niche theke clip hobe (-bottom), photo er bottom-er sathe flat cut */}
          <div className="absolute -bottom-20 right-2 h-[345px] w-[340px] rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 md:h-[420px] md:w-[420px]" />
          {/* photo: bottom-0 tai container er niche line e boshe */}
          <Image
            src="/hero-image.png"
            alt="shorafot"
            width={420}
            height={465}
            priority
            className="absolute bottom-0 right-8 h-[92%] w-auto object-contain"
          />
        </div>
      </div>

    </section>
  );
}
