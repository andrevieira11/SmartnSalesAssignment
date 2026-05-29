"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Project } from "@/lib/types";

import { ProjectForm } from "./ProjectForm";

export function ProjectSwitcher({ projects, selectedId }: { projects: Project[]; selectedId?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-1">
      <div className="flex gap-2">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/board?project=${p.id}`}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${
              p.id === selectedId
                ? "bg-ink text-white"
                : "border border-slate-200 bg-white text-muted hover:text-ink"
            }`}
          >
            {p.name} <span className="ml-1 text-xs opacity-70">{p.task_count}</span>
          </Link>
        ))}
      </div>
      <Button variant="secondary" onClick={() => setOpen(true)} className="ml-auto whitespace-nowrap">
        + New project
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="New project">
        <ProjectForm onDone={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
