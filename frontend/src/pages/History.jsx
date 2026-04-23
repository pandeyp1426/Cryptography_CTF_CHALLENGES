import { Clock3, Flag, RefreshCw } from "lucide-react";

import { useHistory } from "../hooks/useHistory.js";

export default function History() {
  const { data, isLoading, isError, refetch, isFetching } = useHistory(100);
  const items = data?.items ?? [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Solve History</h2>
          <p className="text-sm text-zinc-400">Saved challenges, flags, and generated writeups</p>
        </div>
        <button
          type="button"
          title="Refresh history"
          onClick={() => refetch()}
          className="flex h-10 items-center gap-2 rounded-md border border-zinc-700 px-3 text-sm font-semibold text-zinc-200 hover:border-teal-400 hover:text-teal-100"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">Loading history.</div>
      ) : null}
      {isError ? (
        <div className="rounded-md border border-rose-500/50 bg-rose-950/30 p-5 text-sm text-rose-100">
          Could not load history.
        </div>
      ) : null}
      {!isLoading && !items.length ? (
        <div className="rounded-md border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">
          No saved solves yet.
        </div>
      ) : null}

      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-md border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal-300">
                  <span>{item.category}</span>
                  <span className="text-zinc-600">#{item.id}</span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock3 size={15} />
                {item.createdAt}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded border border-zinc-700 px-2 py-1 text-zinc-300">
                {item.result?.status ?? "unknown"}
              </span>
              <span className="flex items-center gap-2 font-mono text-teal-200">
                <Flag size={15} />
                {item.flag ?? "no flag"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

