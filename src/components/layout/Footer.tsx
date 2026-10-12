import { profile } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      © {new Date().getFullYear()} {profile.name}. All rights reserved.
    </footer>
  );
}
