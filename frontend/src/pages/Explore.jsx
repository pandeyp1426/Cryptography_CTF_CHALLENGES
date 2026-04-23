import { Binary, Braces, Cpu, KeyRound, Network, ShieldCheck } from "lucide-react";

const categories = [
  {
    name: "Crypto",
    icon: KeyRound,
    accent: "text-teal-200 border-teal-500/40",
    tactics: ["RSA parameter parsing", "GCD and modular inverse", "Low exponent checks", "XOR and encoding triage"],
  },
  {
    name: "Web",
    icon: Network,
    accent: "text-amber-200 border-amber-500/40",
    tactics: ["Header review", "JWT inspection", "Parameter fuzzing", "Source and route notes"],
  },
  {
    name: "Reverse",
    icon: Cpu,
    accent: "text-sky-200 border-sky-500/40",
    tactics: ["String extraction", "Binary metadata", "Control-flow notes", "Patch and emulate plan"],
  },
  {
    name: "Pwn",
    icon: ShieldCheck,
    accent: "text-rose-200 border-rose-500/40",
    tactics: ["Checksec notes", "Offset tracking", "Leak handling", "Exploit script writeup"],
  },
  {
    name: "Misc",
    icon: Braces,
    accent: "text-violet-200 border-violet-500/40",
    tactics: ["File signatures", "Archive carving", "Stego checklist", "Protocol and log parsing"],
  },
  {
    name: "Binary Data",
    icon: Binary,
    accent: "text-lime-200 border-lime-500/40",
    tactics: ["Hex preview", "Magic bytes", "Entropy clues", "Structured parse notes"],
  },
];

export default function Explore() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Explore Categories</h2>
        <p className="text-sm text-zinc-400">Browse solver coverage and writeup templates by challenge type</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <article key={category.name} className={`rounded-md border bg-zinc-900 p-4 ${category.accent}`}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded border border-current bg-zinc-950">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {category.tactics.map((tactic) => (
                  <li key={tactic} className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                    {tactic}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

