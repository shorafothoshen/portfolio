import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { skillGroups } from "@/data/portfolio";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-6">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 font-bold">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
