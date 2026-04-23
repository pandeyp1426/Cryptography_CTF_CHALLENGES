import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";

import cipherPanel from "../assets/rsa-cipher-panel.svg";
import CategorySelector from "../components/CategorySelector.jsx";
import ChallengeInput from "../components/ChallengeInput.jsx";
import FlagOutput from "../components/FlagOutput.jsx";
import HintPanel from "../components/HintPanel.jsx";
import SolveSteps from "../components/SolveSteps.jsx";
import { useSolver } from "../hooks/useSolver.js";

export default function Solve() {
  const [category, setCategory] = useState("rsa");
  const [challenge, setChallenge] = useState("");
  const [file, setFile] = useState(null);
  const solver = useSolver();

  function runSolve() {
    solver.solve({ challenge, category, file });
  }

  function resetWorkspace() {
    setChallenge("");
    setFile(null);
    solver.reset();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="grid gap-5 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 p-4 shadow-panel md:grid-cols-[1fr_260px]">
          <div className="flex flex-col justify-center gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Crypto challenge workspace</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Solve, annotate, and save CTF challenges
              </h2>
            </div>
            <CategorySelector value={category} onChange={setCategory} />
          </div>
          <img
            src={cipherPanel}
            alt=""
            className="hidden h-full min-h-48 w-full rounded-md object-cover md:block"
          />
        </div>

        <ChallengeInput
          challenge={challenge}
          onChallengeChange={setChallenge}
          file={file}
          onFileChange={setFile}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runSolve}
            disabled={solver.isSolving || (!challenge.trim() && !file)}
            className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-md bg-teal-400 px-4 text-sm font-bold text-zinc-950 hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            <Play size={16} fill="currentColor" />
            {solver.isSolving ? "Solving" : "Solve"}
          </button>
          <button
            type="button"
            onClick={resetWorkspace}
            className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 text-sm font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <div className="text-sm text-zinc-400">
            Status: <span className="font-mono text-zinc-200">{solver.status}</span>
          </div>
        </div>

        {solver.error ? (
          <div className="rounded-md border border-rose-500/50 bg-rose-950/30 p-3 text-sm text-rose-100">
            {solver.error}
          </div>
        ) : null}

        <SolveSteps steps={solver.steps} />
      </section>

      <aside className="space-y-5">
        <FlagOutput result={solver.result} />
        <HintPanel hints={solver.result?.hints} />
        <section className="rounded-md border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 text-sm font-semibold text-zinc-100">Artifacts</div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-zinc-500">History ID</dt>
              <dd className="font-mono text-zinc-200">{solver.historyId ?? "none"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Upload</dt>
              <dd className="break-all text-zinc-200">{solver.fileInfo?.filename ?? file?.name ?? "none"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Plaintext preview</dt>
              <dd className="max-h-44 overflow-auto rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-xs text-zinc-300">
                {solver.result?.artifacts?.plaintextPreview ?? "none"}
              </dd>
            </div>
          </dl>
        </section>
      </aside>
    </div>
  );
}
