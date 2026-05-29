import { Status, STATUS_LABELS } from "@/lib/types";

const tone: Record<Status, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  DONE: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tone[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
