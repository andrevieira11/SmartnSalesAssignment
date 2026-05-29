import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Column } from "@/components/board/Column";
import { TaskCard } from "@/components/board/TaskCard";
import { Task } from "@/lib/types";

function makeTask(over: Partial<Task>): Task {
  return {
    id: 1, project: 1, title: "T", description: "", status: "TODO",
    priority: "MEDIUM", due_date: null, assigned_to: null,
    assigned_to_detail: null, created_at: "", updated_at: "", ...over,
  };
}

describe("Column", () => {
  it("renders its task cards and a count badge", () => {
    const tasks = [
      makeTask({ id: 1, title: "Audit POS" }),
      makeTask({ id: 2, title: "Train staff", priority: "HIGH" }),
    ];
    render(
      <Column title="To Do" count={tasks.length}>
        {tasks.map((t) => <TaskCard key={t.id} task={t} onClick={() => {}} />)}
      </Column>,
    );
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Audit POS")).toBeInTheDocument();
    expect(screen.getByText("Train staff")).toBeInTheDocument();
  });
});
