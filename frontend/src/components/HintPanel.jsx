import { Lightbulb, Plus } from "lucide-react";
import { useMemo, useState } from "react";

const defaultHints = [
  "Normalize every integer format before attacking the challenge.",
  "Check for leaked p, q, phi, or d before trying heavier factoring.",
  "Inspect decoded bytes as text, hex, and base64.",
];

export default function HintPanel({ hints }) {
  const mergedHints = useMemo(() => (hints?.length ? hints : defaultHints), [hints]);
  const [visibleCount, setVisibleCount] = useState(1);
  const visibleHints = mergedHints.slice(0, visibleCount);

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <Lightbulb size={17} className="text-amber-300" />
          Hints
        </div>
        <button
          type="button"
          title="Reveal next hint"
          onClick={() => setVisibleCount((count) => Math.min(count + 1, mergedHints.length))}
          disabled={visibleCount >= mergedHints.length}
          className="flex size-9 items-center justify-center rounded border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={15} />
        </button>
      </div>
      <ol className="space-y-2">
        {visibleHints.map((hint, index) => (
          <li
            key={`${hint}-${index}`}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300"
          >
            {hint}
          </li>
        ))}
      </ol>
    </section>
  );
}

