import { User } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="scroll-mt-[72px] py-14">
      <div>
        <h2 className="text-2xl font-bold text-white">About Me</h2>
        <p className="mt-4 max-w-sm text-sm leading-7 text-gray-300">
          I&apos;m a passionate Full Stack Developer with a strong focus on building
          scalable web applications and delivering exceptional user experiences.
        </p>
        <a
          href="#contact"
          className="mt-6 inline-flex items-center gap-3 rounded-md border border-white/15 px-5 py-2.5 text-sm text-white transition hover:bg-white/5"
        >
          More About Me <User className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}