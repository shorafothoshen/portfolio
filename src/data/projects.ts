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
    title: "Library Management System",
    category: "Full Stack",
    description:
      "Keeping track of books, borrowers and returns by hand is slow and easy to get wrong. This system brings it all into one place: users sign in to their own accounts, browse books by category and borrow them, and every borrowing and transaction is recorded automatically.",
    tech: "Python, Django, Tailwind CSS, SQLite",
    github: "https://github.com/shorafothoshen/LibraryManagementProject",
    demo: "https://librarymanagementproject-7xbp.onrender.com/",
    image: "/library-website-image.png",
  },
  {
    title: "BazarDor",
    category: "Full Stack",
    description:
      "Prices of everyday essentials change often and differ from market to market, so it is hard to know what a fair price is. BazarDor puts the daily prices in one Bangla app: browse by category, see the biggest rises and drops of the day, and after signing in compare minimum, maximum and average prices market by market.",
    tech: "Next.js, TypeScript, Tailwind CSS, HeroUI, BetterAuth, MongoDB",
    github: "https://github.com/shorafothoshen/Bazar-Dor",
    demo: "https://bazar-dor-blond.vercel.app/",
    image: "/bazar-dor.png",
  },
  {
    title: "Fit-Log",
    category: "Web App",
    description:
      "When workouts live in notes or memory, it is hard to tell whether you are actually improving. Fit-Log gives you one simple place to log every workout and look back at your progress over time, from any device.",
    tech: "Next.js, TypeScript",
    github: "https://github.com/shorafothoshen/Fit-Log",
    demo: "https://fit-log-shorafot.vercel.app",
    image: "/FitLog.png",
  },
  {
    title: "Smart Blind Navigation System",
    category: "IoT + AI",
    description:
      "Walking in unfamiliar places is risky for visually impaired people, and a plain cane cannot identify objects or call for help. This smart walking-stick assistant warns the user about nearby obstacles and objects with a buzzer and voice alerts, detects falls, and shares live location so a caregiver can monitor remotely.",
    tech: "ESP32, ESP32-S3 CAM, Arduino C++, Django, Python, Blynk, MPU6050, GPS",
    github: "https://github.com/shorafothoshen/Smart_Blind_Navigation_System",
    demo: "https://drive.google.com/file/d/13ZLQHstsLv5ax7DYjMHhBMooee33j60B/view?usp=sharing",
    image: "/Smart Blind Navigation System.png",
  },
];