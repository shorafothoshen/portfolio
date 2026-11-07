"use client";

import Image from "next/image";
import {
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";


const socials = [
  { icon: FaGithub, href: "https://github.com/shorafothoshen", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/shorafothoshen/", label: "LinkedIn" },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0a0a14] pt-16 sm:pt-18"
    >
      <div className="mx-auto grid max-w-6xl items-end gap-4 px-4 pt-8 sm:gap-10 sm:px-5 sm:pt-12 md:grid-cols-2">
        {/* Left */}
        <div className="pb-4 md:pb-12">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-200">
            <span>👋</span> Hello, I&apos;m
          </span>

          {/* Name: screen onujayi size, kokhono 2 line e vangbe na */}
          <h1 className="mt-4 whitespace-nowrap text-[2rem] font-bold leading-[1.05] tracking-tight text-white min-[400px]:text-4xl min-[480px]:text-5xl sm:text-6xl md:text-4xl lg:text-5xl xl:text-6xl">
            Shorafot <span className="text-violet-400">Hoshen</span>
          </h1>
          <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">
            Full Stack Developer
          </h2>

          <p className="mt-5 max-w-sm text-sm leading-7 text-gray-300 sm:mt-6">
            I build exceptional digital experiences that are fast, accessible,
            visually appealing and responsive. Let&apos;s build something
            amazing together!
          </p>

          <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-3 rounded-md bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-600 sm:px-6"
            >
              Hire Me <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-3 rounded-md border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 sm:px-6"
            >
              View Projects <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-7 flex items-center gap-5 text-white sm:mt-8">
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
        <div className="relative mx-auto h-85 w-full max-w-md overflow-hidden sm:h-105 md:h-100 lg:h-120 xl:h-125">
          {/* dotted grid */}
          <div
            className="absolute left-4 top-6 h-20 w-20 opacity-40 sm:left-10 sm:top-8 sm:h-24 sm:w-24"
            style={{
              backgroundImage:
                "radial-gradient(#9ca3af 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* circle: mobile e majhkhane, md+ e dan dike */}
          <div className="absolute -bottom-14 left-1/2 h-70 w-70 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 sm:-bottom-20 sm:h-[340px] sm:w-[340px] md:left-auto md:right-2 md:h-[300px] md:w-[300px] md:translate-x-0 lg:h-[400px] lg:w-[400px] xl:h-[420px] xl:w-[420px]" />
          {/* photo: bottom-0 tai container er niche line e boshe */}
          <Image
            src="/hero-image.png"
            alt="shorafot"
            width={420}
            height={465}
            priority
            className="absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2 object-contain md:left-auto md:right-8 md:translate-x-0"
          />
        </div>
      </div>

    </section>
  );
}