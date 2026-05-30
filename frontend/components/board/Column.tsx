"use client";

import { ReactNode, useState } from "react";

interface Props {
  title: string;
  count: number;
  onTaskDrop?: (taskId: number) => void;
  children: ReactNode;
}

export function Column({ title, count, onTaskDrop, children }: Props) {
  const [over, setOver] = useState(false);

  // Drop handlers only wire up when the column accepts drops (board owner).
  const dnd = onTaskDrop
    ? {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault();
          setOver(true);
        },
        onDragLeave: () => setOver(false),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          setOver(false);
          const id = Number(e.dataTransfer.getData("text/task-id"));
          if (id) onTaskDrop(id);
        },
      }
    : {};

  return (
    <div
      {...dnd}
      className={`rounded-xl p-3 transition-colors ${over ? "bg-slate-200 ring-2 ring-ink/20" : "bg-slate-100/70"}`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-muted">{count}</span>
      </div>
      <div className="min-h-[2rem] space-y-2">
        {count === 0 ? <p className="px-1 text-xs text-muted">Drop a task here</p> : children}
      </div>
    </div>
  );
}
