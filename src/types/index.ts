// Shob type (data er shape) ekhane thake

export type LinkItem = { label: string; href: string };

export type Project = {
  title: string;
  tags: string[]; // upore choto label, jemon FULL-STACK
  description: string;
  tech: string[]; // technology gulo
  links: LinkItem[]; // GitHub / Live link (na thakle khali [] rakho)
};

export type SkillGroup = { title: string; items: string[] };
