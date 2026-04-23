import { Copy, Flag } from "lucide-react";

const flagPattern = /((?:flag|ctf|picoCTF|crypto|ictf|uiuctf|csawctf)\{[^}\r\n]{1,200}\})/i;

export default function FlagOutput({ result }) {
  const flag = result?.flag ?? extractFlag(result?.artifacts?.plaintextPreview ?? "");

  async function copyFlag() {
    if (!flag) return;
    await navigator.clipboard.writeText(flag);
  }

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <Flag size={17} className="text-rose-300" />
          Flag
        </div>
        <button
          type="button"
          title="Copy flag"
          onClick={copyFlag}
          disabled={!flag}
          className="flex size-9 items-center justify-center rounded border border-zinc-700 text-zinc-300 hover:border-teal-400 hover:text-teal-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Copy size={15} />
        </button>
      </div>
      {flag ? (
        <div className="rounded-md border border-teal-500/40 bg-teal-950/40 p-3 font-mono text-sm text-teal-100">
          {highlightFlag(flag)}
        </div>
      ) : (
        <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-400">
          Not found yet.
        </div>
      )}
    </section>
  );
}

function extractFlag(text) {
  const match = text.match(flagPattern);
  return match?.[1] ?? null;
}

function highlightFlag(flag) {
  const match = flag.match(/^([^{}]+)(\{.*\})$/);
  if (!match) return flag;
  return (
    <>
      <span className="text-amber-200">{match[1]}</span>
      <span className="text-teal-100">{match[2]}</span>
    </>
  );
}

