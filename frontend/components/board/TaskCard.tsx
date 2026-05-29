import { Avatar } from "@/components/ui/Avatar";
import { PriorityTag } from "@/components/ui/PriorityTag";
import { Task } from "@/lib/types";

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <p className="text-sm font-medium text-ink">{task.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <PriorityTag priority={task.priority} />
        <div className="flex items-center gap-2">
          {task.due_date ? <span className="text-xs text-muted">{task.due_date}</span> : null}
          <Avatar name={task.assigned_to_detail?.username ?? null} />
        </div>
      </div>
    </button>
  );
}
