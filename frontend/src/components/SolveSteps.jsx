import { ChevronDown, CircleAlert, CircleCheck, Terminal } from "lucide-react";

function StepIcon({ kind }) {
  if (kind === "success" || kind === "flag") {
    return <CircleCheck size={17} className="text-teal-300" />;
  }
  if (kind === "warning") {
    return <CircleAlert size={17} className="text-amber-300" />;
  }
  return <Terminal size={17} className="text-zinc-400" />;
}

export default function SolveSteps({ steps }) {
  if (!steps.length) {
    return (
      <section className="rounded-md border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">
        No solve steps yet.
      </section>
    );
  }

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-100">
        Solve Steps
      </div>
      <div className="divide-y divide-zinc-800">
        {steps.map((step, index) => (
          <details key={`${step.title}-${index}`} className="group" open>
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
              <StepIcon kind={step.kind} />
              <span className="flex-1 text-sm font-semibold text-zinc-100">{step.title}</span>
              <ChevronDown
                size={16}
                className="text-zinc-500 transition group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="space-y-3 px-4 pb-4 text-sm text-zinc-300">
              <p>{step.body}</p>
              {step.code ? (
                <pre className="max-h-64 overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs leading-6 text-zinc-200">
                  {step.code}
                </pre>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

