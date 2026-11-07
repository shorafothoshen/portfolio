import Image from "next/image";
import { ArrowRight, LayoutGrid } from "lucide-react";

// নিজের তথ্য দিয়ে replace করো
const details = [
  { label: "Name", value: "Shorafot Hoshen" },
  { label: "Email", value: "you@example.com" },
  { label: "Location", value: "Dhaka, Bangladesh" },
  { label: "Availability", value: "Open for freelance" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-[64px] bg-[#0c0c18] py-14 sm:scroll-mt-[72px] sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
        {/* Left: image */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          {/* dotted accent */}
          <div
            className="absolute -left-3 -top-3 h-24 w-24 opacity-40 sm:-left-5 sm:-top-5"
            style={{
              backgroundImage: "radial-gradient(#9ca3af 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* offset gradient frame */}
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 sm:-bottom-4 sm:-right-4" />

          {/* public/about-image.png এ তোমার ছবি রাখো */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#12121f]">
            <Image
              src="/about-image.png"
              alt="Shorafot Hoshen"
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Right: content */}
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
            About Me
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Passionate Full Stack Developer
          </h2>

          <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
            I&apos;m a passionate Full Stack Developer with a strong focus on building
            scalable web applications and delivering exceptional user experiences.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
            I enjoy turning ideas into fast, accessible and well-designed products,
            from clean interfaces on the front end to reliable APIs and databases on
            the back end.
          </p>

          {/* Details */}
          <dl className="mt-7 grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs text-violet-400">{d.label}</dt>
                <dd className="mt-1 break-words text-sm text-white">{d.value}</dd>
              </div>
            ))}
          </dl>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-md bg-violet-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-600 sm:px-6"
            >
              Contact Me <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-3 rounded-md border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 sm:px-6"
            >
              View Projects <LayoutGrid className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}