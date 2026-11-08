export interface Education {
  degree: string;
  institution: string;
  period?: string;
  status: "ongoing" | "completed";
  location?: string;
  grade?: string;
  description?: string;
  highlights?: string[];
};

export const education: Education[] = [
  {
    degree: "B.Sc. in Computer Science and Engineering",
    institution: "Your University Name",
    period: "2023 – Present",
    status: "ongoing",
    location: "Mirpur-2,Dhaka"
  },
  {
    degree: "Higher Secondary Certificate",
    institution: "Jamalpur Residential Model College",
    period: "2019 – 2021",
    status: "completed",
    location: "Jamalpur"
  },
  {
    degree: "Secondary School Certificate",
    institution: "Jharkata ML High School",
    status: "completed",
    location: "Madergonj,Jamalpur"
  },
];
