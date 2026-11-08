export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a14] py-6 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} Shorafot Hoshen. All rights reserved.
    </footer>
  );
}