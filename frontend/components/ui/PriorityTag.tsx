import { Priority, PRIORITY_LABELS } from "@/lib/types";

const tone: Record<Priority, string> = {
  LOW: "text-slate-500",
  MEDIUM: "text-sky-600",
  HIGH: "text-orange-600",
  URGENT: "text-red-600",
};

export function PriorityTag({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${tone[priority]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
