export interface ProjectType {
  title: string;
  description: string;
  tech: string | string[];
  github?: string;
  demo?: string;
  image?: string;
  category?: string;
};

export const project: ProjectType[] = [
  {
    title: "Dashboard Pro",
    tech: "React, TypeScript, Tailwind CSS",
    description: "A powerful admin dashboard with analytics and reports.",
  },
  {
    title: "ShopSphere",
    tech: "Next.js, Stripe, MongoDB",
    description: "Full-stack e-commerce platform with modern UI/UX.",
  },
  {
    title: "TaskFlow",
    tech: "React, Node.js, Express, MongoDB",
    description: "Task management app to boost your productivity.",
  },
  {
    title: "DevPortfolio",
    tech: "HTML, CSS, JavaScript",
    description: "A modern developer portfolio template for all devs.",
  },
];