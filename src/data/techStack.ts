import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa";
import { LuCpu, LuRadioTower } from "react-icons/lu";
import {
  SiC,
  SiCplusplus,
  SiDjango,
  SiExpress,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export const CATEGORIES = [
  "All",
  "Frontend",
  "Backend & Real-Time",
  "Database",
  "Programming Languages",
  "Mobile & IoT",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type TechCategory = Exclude<Category, "All">;

export type Tech = {
  name: string;
  categories: TechCategory[];
  color: string;
  status: "using" | "learning";
  icon?: IconType;
  monogram?: string;
};

export const TECHS: Tech[] = [
  // Frontend
  { name: "JavaScript", categories: ["Frontend", "Programming Languages"], color: "#f7df1e", status: "using", icon: SiJavascript },
  { name: "TypeScript", categories: ["Frontend", "Programming Languages"], color: "#3178c6", status: "using", icon: SiTypescript },
  { name: "React", categories: ["Frontend"], color: "#61dafb", status: "using", icon: SiReact },
  { name: "Next.js", categories: ["Frontend"], color: "#ffffff", status: "using", icon: SiNextdotjs },
  { name: "Tailwind CSS", categories: ["Frontend"], color: "#38bdf8", status: "using", icon: SiTailwindcss },

  // Backend & Real-Time
  { name: "Python", categories: ["Backend & Real-Time", "Programming Languages"], color: "#4b8bbe", status: "using", icon: SiPython },
  { name: "Django", categories: ["Backend & Real-Time"], color: "#44b78b", status: "using", icon: SiDjango },
  { name: "Django REST Framework", categories: ["Backend & Real-Time"], color: "#44b78b", status: "using", monogram: "DRF" },
  { name: "Node.js", categories: ["Backend & Real-Time"], color: "#68a063", status: "using", icon: SiNodedotjs },
  { name: "Express.js", categories: ["Backend & Real-Time"], color: "#ffffff", status: "using", icon: SiExpress },
  { name: "Django Channels", categories: ["Backend & Real-Time"], color: "#44b78b", status: "learning", icon: LuRadioTower },

  // Database
  { name: "MySQL", categories: ["Database"], color: "#4f8fc0", status: "using", icon: SiMysql },
  { name: "MongoDB", categories: ["Database"], color: "#47a248", status: "using", icon: SiMongodb },

  // Programming Languages
  { name: "C", categories: ["Programming Languages"], color: "#a8b9cc", status: "using", icon: SiC },
  { name: "C++", categories: ["Programming Languages"], color: "#3d8fd1", status: "using", icon: SiCplusplus },
  { name: "Java", categories: ["Programming Languages"], color: "#e76f00", status: "using", icon: FaJava },

  // Mobile & IoT
  { name: "React Native", categories: ["Mobile & IoT"], color: "#61dafb", status: "learning", icon: SiReact },
  { name: "IoT Development", categories: ["Mobile & IoT"], color: "#a78bfa", status: "using", icon: LuCpu },
];