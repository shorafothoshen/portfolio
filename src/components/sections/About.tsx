import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { aboutParagraphs, currentlyLearning, profile } from "@/data/portfolio";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-4">
        {aboutParagraphs.map((text) => (
          <p key={text} className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {text}
          </p>
        ))}
      </div>

      {/* University ar Location */}
      <dl className="mt-8 grid max-w-md grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-500">University</dt>
          <dd className="font-semibold">{profile.university}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Location</dt>
          <dd className="font-semibold">{profile.location}</dd>
        </div>
      </dl>

      {/* Ekhon ki shikhcho */}
      <h3 className="mb-3 mt-10 text-lg font-bold">Currently learning</h3>
      <div className="flex flex-wrap gap-2">
        {currentlyLearning.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
    </Section>
  );
}
