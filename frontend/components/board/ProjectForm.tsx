"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, inputClass } from "@/components/ui/FormField";
import { apiMutate } from "@/lib/client-api";

export function ProjectForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await apiMutate("/projects/", "POST", { name, description });
    setPending(false);
    if (res.ok) {
      onDone();
      router.refresh();
      return;
    }
    setError("Could not create project.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Name" htmlFor="p-name">
        <input id="p-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Description" htmlFor="p-desc">
        <textarea id="p-desc" rows={3} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormField>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Create"}
        </Button>
      </div>
    </form>
  );
}
