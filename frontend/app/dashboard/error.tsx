"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-center">
      <p className="text-sm text-ink">Could not load the dashboard.</p>
      <button onClick={reset} className="mt-3 text-sm font-medium text-ink underline">
        Try again
      </button>
    </div>
  );
}
