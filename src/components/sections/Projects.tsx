import Section from "@/components/ui/Section";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/portfolio";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      {/* Mobile e 1 column, boro screen e 2 column */}
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  );
}
