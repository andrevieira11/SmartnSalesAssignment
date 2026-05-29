"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import { Project, STATUSES, STATUS_LABELS, Task, User } from "@/lib/types";

import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TaskDetail } from "./TaskDetail";
import { TaskForm } from "./TaskForm";

interface Props {
  project: Project;
  tasks: Task[];
  users: User[];
  canManage: boolean;
}

export function KanbanBoard({ project, tasks, users, canManage }: Props) {
  const [creating, setCreating] = useState(false);
  const [active, setActive] = useState<Task | null>(null);

  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">{project.name}</h1>
          {project.description ? <p className="text-sm text-muted">{project.description}</p> : null}
        </div>
        {canManage ? <Button onClick={() => setCreating(true)}>+ New task</Button> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STATUSES.map((s) => {
          const colTasks = tasks.filter((t) => t.status === s);
          return (
            <Column key={s} title={STATUS_LABELS[s]} count={colTasks.length}>
              {colTasks.map((t) => (
                <TaskCard key={t.id} task={t} onClick={() => setActive(t)} />
              ))}
            </Column>
          );
        })}
      </div>

      <SlideOver open={creating} onClose={() => setCreating(false)} title="New task">
        <TaskForm projectId={project.id} users={users} onDone={() => setCreating(false)} />
      </SlideOver>

      <SlideOver open={!!active} onClose={() => setActive(null)} title="Task details">
        {active ? (
          <TaskDetail task={active} users={users} canManage={canManage} onDone={() => setActive(null)} />
        ) : null}
      </SlideOver>
    </section>
  );
}
