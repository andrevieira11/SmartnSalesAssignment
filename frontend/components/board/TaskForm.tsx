"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { FormField, inputClass } from "@/components/ui/FormField";
import { apiMutate } from "@/lib/client-api";
import { PRIORITIES, PRIORITY_LABELS, STATUSES, STATUS_LABELS, Task, User } from "@/lib/types";

interface Props {
  projectId: number;
  users: User[];
  task?: Task;
  onDone: () => void;
}

export function TaskForm({ projectId, users, task, onDone }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "TODO",
    priority: task?.priority ?? "MEDIUM",
    due_date: task?.due_date ?? "",
    assigned_to: task?.assigned_to ? String(task.assigned_to) : "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const payload = {
      project: projectId,
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
    };
    const res = task
      ? await apiMutate(`/tasks/${task.id}/`, "PATCH", payload)
      : await apiMutate("/tasks/", "POST", payload);
    setPending(false);
    if (res.ok) {
      onDone();
      router.refresh();
      return;
    }
    setError("Could not save task.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Title" htmlFor="t-title">
        <input id="t-title" className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} required />
      </FormField>
      <FormField label="Description" htmlFor="t-desc">
        <textarea id="t-desc" rows={3} className={inputClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Status" htmlFor="t-status">
          <select id="t-status" className={inputClass} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </FormField>
        <FormField label="Priority" htmlFor="t-priority">
          <select id="t-priority" className={inputClass} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Due date" htmlFor="t-due">
          <DatePicker id="t-due" value={form.due_date ?? ""} onChange={(v) => set("due_date", v)} />
        </FormField>
        <FormField label="Assignee" htmlFor="t-assignee">
          <select id="t-assignee" className={inputClass} value={form.assigned_to} onChange={(e) => set("assigned_to", e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
          </select>
        </FormField>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : task ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
