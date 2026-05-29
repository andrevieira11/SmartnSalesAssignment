import { BoardHeader } from "@/components/board/BoardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { serverGet } from "@/lib/server-api";
import { DashboardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const d = await serverGet<DashboardData>("/api/dashboard/");

  return (
    <div className="min-h-screen">
      <BoardHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-6 text-xl font-semibold text-ink">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Projects" value={d.total_projects} />
          <StatCard label="Tasks" value={d.total_tasks} />
          <StatCard label="Overdue" value={d.overdue} tone="danger" />
          <StatCard label="Due this week" value={d.due_this_week} tone="warn" />
        </div>
        <h2 className="mb-3 mt-8 text-sm font-semibold text-muted">Tasks by status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="To Do" value={d.tasks_by_status.TODO} />
          <StatCard label="In Progress" value={d.tasks_by_status.IN_PROGRESS} />
          <StatCard label="Done" value={d.tasks_by_status.DONE} />
        </div>
      </main>
    </div>
  );
}
