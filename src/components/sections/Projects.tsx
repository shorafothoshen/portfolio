import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

type Project = {
  title: string;
  tech: string;
  description: string;
  demo: string;
  github: string;
  image?: string; // public/projects/xxx.png — না দিলে gradient placeholder দেখাবে
};

// এগুলো placeholder। নিজের project দিয়ে replace করো।
const projects: Project[] = [
  {
    title: "Dashboard Pro",
    tech: "React, TypeScript, Tailwind CSS",
    description: "A powerful admin dashboard with analytics and reports.",
    demo: "#",
    github: "https://github.com/",
  },
  {
    title: "ShopSphere",
    tech: "Next.js, Stripe, MongoDB",
    description: "Full-stack e-commerce platform with modern UI/UX.",
    demo: "#",
    github: "https://github.com/",
  },
  {
    title: "TaskFlow",
    tech: "React, Node.js, Express, MongoDB",
    description: "Task management app to boost your productivity.",
    demo: "#",
    github: "https://github.com/",
  },
  {
    title: "DevPortfolio",
    tech: "HTML, CSS, JavaScript",
    description: "A modern developer portfolio template for all devs.",
    demo: "#",
    github: "https://github.com/",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-[72px] bg-[#0c0c18] py-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-violet-400 transition hover:text-violet-300"
          >
            View All Projects <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p) => (
            <article
              key={p.title}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative h-36 w-full bg-gradient-to-br from-violet-500/30 via-indigo-500/20 to-[#12121f]">
                {p.image && (
                  <Image src={p.image} alt={p.title} fill className="object-cover object-top" />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-[11px] text-gray-400">{p.tech}</p>
                <p className="mt-2 min-h-[40px] text-xs leading-5 text-gray-300">{p.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-violet-400 transition hover:text-violet-300"
                  >
                    Live Demo <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.title} on GitHub`}
                    className="text-gray-300 transition hover:text-white"
                  >
                    <FaGithub className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}