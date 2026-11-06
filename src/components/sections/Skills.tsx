import type { IconType } from "react-icons";
import {
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTypescript,
} from "react-icons/si";

type Skill = { name: string; level: number; icon: IconType; color: string };

const skills: Skill[] = [
  { name: "JavaScript", level: 90, icon: SiJavascript, color: "#f7df1e" },
  { name: "TypeScript", level: 85, icon: SiTypescript, color: "#3178c6" },
  { name: "React", level: 85, icon: SiReact, color: "#61dafb" },
  { name: "Next.js", level: 80, icon: SiNextdotjs, color: "#ffffff" },
  { name: "Node.js", level: 80, icon: SiNodedotjs, color: "#68a063" },
  { name: "MongoDB", level: 75, icon: SiMongodb, color: "#47a248" },
];

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-[72px] py-14">
      <h2 className="text-2xl font-bold text-white">My Skills</h2>

      <div className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {skills.map(({ name, level, icon: Icon, color }) => (
          <div key={name} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <Icon className="h-4 w-4" style={{ color }} />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-gray-200">
                <span>{name}</span>
                <span className="text-gray-300">{level}%</span>
              </div>
              <div className="mt-1.5 h-1 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}