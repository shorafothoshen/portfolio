// Choto label / chip (skill, tech, tag er jonno reuse hoy)
type Props = { children: string };

export default function Badge({ children }: Props) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
      {children}
    </span>
  );
}
