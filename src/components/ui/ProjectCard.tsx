import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/types";

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
  return (
    <article className="flex flex-col rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* Tag gulo (FULL-STACK ityadi) */}
      <div className="mb-3 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="text-xl font-bold">{project.title}</h3>
      <p className="mt-2 flex-1 text-gray-600 dark:text-gray-400">{project.description}</p>

      {/* Technology */}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      {/* Link (thakle dekhabe) */}
      {project.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              {link.label} ↗
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
