import { ReactNode } from "react";

export function Column({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-100/70 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-muted">{count}</span>
      </div>
      <div className="min-h-[2rem] space-y-2">
        {count === 0 ? <p className="px-1 text-xs text-muted">No tasks</p> : children}
      </div>
    </div>
  );
}
