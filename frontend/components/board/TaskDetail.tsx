"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, inputClass } from "@/components/ui/FormField";
import { PriorityTag } from "@/components/ui/PriorityTag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiMutate } from "@/lib/client-api";
import { STATUSES, STATUS_LABELS, Task, User } from "@/lib/types";

import { TaskForm } from "./TaskForm";

interface Props {
  task: Task;
  users: User[];
  canManage: boolean;
  onDone: () => void;
}

export function TaskDetail({ task, users, canManage, onDone }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [busy, setBusy] = useState(false);

  async function changeStatus(next: Task["status"]) {
    setStatus(next);
    setBusy(true);
    await apiMutate(`/tasks/${task.id}/`, "PATCH", { status: next });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this task?")) return;
    const res = await apiMutate(`/tasks/${task.id}/`, "DELETE");
    if (res.ok) {
      onDone();
      router.refresh();
    }
  }

  // Project owner edits everything; an assignee can only move the card.
  if (canManage) {
    return (
      <div className="space-y-4">
        <TaskForm projectId={task.project} users={users} task={task} onDone={onDone} />
        <div className="border-t border-slate-200 pt-4">
          <Button variant="danger" onClick={remove}>
            Delete task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-ink">{task.title}</h3>
        {task.description ? <p className="mt-1 text-sm text-muted">{task.description}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <PriorityTag priority={task.priority} />
      </div>
      {task.due_date ? <p className="text-sm text-muted">Due {task.due_date}</p> : null}
      <FormField label="Move to" htmlFor="d-status">
        <select
          id="d-status"
          className={inputClass}
          value={status}
          disabled={busy}
          onChange={(e) => changeStatus(e.target.value as Task["status"])}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </FormField>
    </div>
  );
}
