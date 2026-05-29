export function Avatar({ name }: { name: string | null }) {
  const initials = (name || "?").slice(0, 2).toUpperCase();
  return (
    <span
      title={name ?? "Unassigned"}
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600"
    >
      {initials}
    </span>
  );
}
