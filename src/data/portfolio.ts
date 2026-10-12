import type { LinkItem, Project, SkillGroup } from "@/types";

// ===============================================================
// Tomar portfolio er shob tothyo ekhane thake.
// Ekhane bodlalei pura website e automatic bodle jabe.
// ===============================================================

// ---------- Personal info ----------
export const profile = {
  name: "Md. Shorafot Hoshen",
  initials: "SH", // navbar er logo te dekhabe
  role: "Full-Stack Web Developer",
  tagline:
    "4th year CSE student building real-world web apps with Django, React and Next.js.",
  location: "Dhaka, Bangladesh",
  university: "BUBT",
  email: "your-email@example.com", // TODO: nijer asol email diye bodlao
};

// ---------- Navbar er link ----------
// href er naam section er id er sathe mil thakte hobe
export const navLinks: LinkItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// ---------- About ----------
export const aboutParagraphs: string[] = [
  "I'm a 4th year Computer Science & Engineering student at BUBT, focused on full-stack development and building real-world applications.",
  "I enjoy building web applications, real-time systems and APIs with Django, React and Next.js. I also love exploring mobile apps, and IoT projects where I use AI.",
  "Right now I'm focused on improving my skills, solving problems and building projects that make an impact.",
];

export const currentlyLearning: string[] = [
  "Django Channels & WebSockets",
  "Advanced React",
  "Advanced Next.js",
  "React Native",
  "AI/ML Models",
];

// ---------- Projects ----------
export const projects: Project[] = [
  {
    title: "Online School",
    tags: ["FULL-STACK", "ROLE-BASED ACCESS"],
    description:
      "Full-stack learning platform with role-based access for students, teachers and administrators.",
    tech: ["Django", "DRF", "React", "JWT"],
    links: [
      {
        label: "Back-end",
        href: "https://github.com/shorafothoshen/Online_School_back-end_part",
      },
      {
        label: "Front-end",
        href: "https://github.com/shorafothoshen/Online_School_Project_front_end",
      },
    ],
  },
  {
    title: "Real-time Chat App",
    tags: ["MOBILE", "WEBSOCKETS"],
    description:
      "Real-time messaging application with WebSocket communication, online users and instant messaging.",
    tech: ["Django", "Channels", "WebSockets", "React Native"],
    links: [], // TODO: GitHub link thakle ekhane daw
  },
  {
    title: "ESP32 Smart Blind Navigation",
    tags: ["IOT", "OBJECT DETECTION"],
    description:
      "IoT-based navigation project using ESP32-S3-CAM, object detection and real-time device communication.",
    tech: ["ESP32", "IoT", "YOLO", "Django REST API"],
    links: [], // TODO: GitHub link thakle ekhane daw
  },
  {
    title: "Library Management",
    tags: ["BACKEND", "CRUD"],
    description:
      "Book inventory and management system with CRUD operations and database integration.",
    tech: ["Django", "MySQL", "Tailwind CSS"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/shorafothoshen/LibraryManagementProject",
      },
    ],
  },
  {
    title: "Fit-Log",
    tags: ["TYPESCRIPT"],
    description: "TODO: ei project er short description ekhane likho.",
    tech: ["TypeScript"],
    links: [{ label: "GitHub", href: "https://github.com/shorafothoshen/Fit-Log" }],
  },
];

// ---------- Skills ----------
export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["Python", "JavaScript", "TypeScript", "C", "C++", "Java"] },
  { title: "Frontend", items: ["HTML", "CSS", "Tailwind CSS", "React", "Next.js"] },
  { title: "Backend", items: ["Django", "Django REST Framework", "Node.js", "Express"] },
  { title: "Database", items: ["MySQL", "MongoDB"] },
  { title: "Real-time & Mobile", items: ["WebSockets", "Django Channels", "React Native"] },
  { title: "Tools", items: ["Git", "GitHub", "VS Code", "Postman"] },
];

// ---------- Contact / Social ----------
export const socialLinks: LinkItem[] = [
  { label: "GitHub", href: "https://github.com/shorafothoshen" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shorafot-hoshen-875a47308/",
  },
  { label: "LeetCode", href: "https://leetcode.com/u/shorafothoshen/" },
  {
    label: "Codeforces",
    href: "https://codeforces.com/profile/Shorafot_hoshen98",
  },
];
