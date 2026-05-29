import { BoardHeader } from "@/components/board/BoardHeader";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { ProjectSwitcher } from "@/components/board/ProjectSwitcher";
import { EmptyState } from "@/components/ui/EmptyState";
import { serverGet } from "@/lib/server-api";
import { Paginated, Project, Task, User } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BoardPage({ searchParams }: { searchParams: { project?: string } }) {
  const [me, projectsPage, users] = await Promise.all([
    serverGet<User>("/api/auth/me/"),
    serverGet<Paginated<Project>>("/api/projects/"),
    serverGet<User[]>("/api/auth/users/"),
  ]);
  const projects = projectsPage.results;
  const selectedId = searchParams.project ? Number(searchParams.project) : projects[0]?.id;
  const selected = projects.find((p) => p.id === selectedId);
  const tasks = selected
    ? (await serverGet<Paginated<Task>>(`/api/tasks/?project=${selected.id}`)).results
    : [];

  return (
    <div className="min-h-screen">
      <BoardHeader />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ProjectSwitcher projects={projects} selectedId={selected?.id} />
        {selected ? (
          <KanbanBoard project={selected} tasks={tasks} users={users} canManage={selected.owner === me.id} />
        ) : (
          <EmptyState title="No projects yet" hint="Create your first project to start adding tasks." />
        )}
      </main>
    </div>
  );
}
