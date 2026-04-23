import {
  Archive,
  BarChart3,
  CircleCheck,
  CircleDashed,
  Hash,
  KeyRound,
  Lock,
  Shuffle,
} from "lucide-react";

const challengeTracks = [
  {
    name: "RSA Attacks",
    icon: KeyRound,
    accent: "text-teal-200 border-teal-500/40",
    challenges: [
      {
        title: "RSA Shared Prime Attack",
        difficulty: "Medium",
        status: "Implemented",
        detail: "Finds gcd(n1, n2), factors n1, recovers d, and decrypts c.",
      },
      {
        title: "RSA Cracking",
        difficulty: "Medium",
        status: "Partial",
        detail: "Works for provided p/q, provided d, small factors, and exact low-exponent roots.",
      },
      {
        title: "Wiener's Attack On RSA",
        difficulty: "Hard",
        status: "Planned",
        detail: "Small private exponent attack using continued fractions.",
      },
    ],
  },
  {
    name: "Classical Ciphers",
    icon: Shuffle,
    accent: "text-amber-200 border-amber-500/40",
    challenges: [
      {
        title: "Affine Cipher",
        difficulty: "Medium",
        status: "Planned",
        detail: "Brute force valid a,b keys and rank readable plaintext.",
      },
      {
        title: "Permutation Cipher",
        difficulty: "Easy",
        status: "Planned",
        detail: "Recover block permutation order and undo transposition.",
      },
      {
        title: "Vigenere Cipher",
        difficulty: "Easy",
        status: "Planned",
        detail: "Estimate key length, derive key shifts, and decrypt.",
      },
      {
        title: "Custom Vigenere",
        difficulty: "Easy",
        status: "Planned",
        detail: "Support custom alphabets or modified shift rules.",
      },
      {
        title: "Hill Cipher",
        difficulty: "Medium",
        status: "Planned",
        detail: "Recover or apply matrix keys modulo alphabet size.",
      },
    ],
  },
  {
    name: "Analysis And Mutation",
    icon: BarChart3,
    accent: "text-sky-200 border-sky-500/40",
    challenges: [
      {
        title: "Frequency Analysis",
        difficulty: "Medium",
        status: "Planned",
        detail: "Rank monoalphabetic substitutions using letter and n-gram scoring.",
      },
      {
        title: "4 Layer Mutation Cypher",
        difficulty: "Medium",
        status: "Planned",
        detail: "Try layered decode pipelines and preserve every intermediate step.",
      },
    ],
  },
  {
    name: "Symmetric Crypto",
    icon: Lock,
    accent: "text-rose-200 border-rose-500/40",
    challenges: [
      {
        title: "One Time Pad Key Reuse",
        difficulty: "Medium",
        status: "Planned",
        detail: "XOR ciphertexts, crib drag likely phrases, and recover reused keystream bytes.",
      },
      {
        title: "DES Cracking",
        difficulty: "Hard",
        status: "Planned",
        detail: "Support reduced keyspaces and known plaintext checks.",
      },
      {
        title: "Meet In The Middle On Double Encryption",
        difficulty: "Hard",
        status: "Planned",
        detail: "Build forward and reverse lookup tables for double-encryption key recovery.",
      },
      {
        title: "DES Meet In The Middle",
        difficulty: "Hard",
        status: "Planned",
        detail: "Specialized meet-in-the-middle workflow for double DES.",
      },
    ],
  },
  {
    name: "Hashes And Signatures",
    icon: Hash,
    accent: "text-violet-200 border-violet-500/40",
    challenges: [
      {
        title: "Break The Hash",
        difficulty: "Easy",
        status: "Planned",
        detail: "Identify hash formats and test wordlists or rule-based candidates.",
      },
      {
        title: "ECDSA And Blockchain",
        difficulty: "Hard",
        status: "Planned",
        detail: "Look for nonce reuse, bad signatures, and transaction-derived clues.",
      },
    ],
  },
  {
    name: "Files And Containers",
    icon: Archive,
    accent: "text-lime-200 border-lime-500/40",
    challenges: [
      {
        title: "Password Protected ZIP File",
        difficulty: "Medium",
        status: "Planned",
        detail: "Inspect ZIP metadata and run dictionary-based password recovery.",
      },
      {
        title: "LUKS Encryption",
        difficulty: "Hard",
        status: "Planned",
        detail: "Parse LUKS headers and document safe external cracking steps.",
      },
      {
        title: "Binary Data",
        difficulty: "Utility",
        status: "Partial",
        detail: "Current backend shows a hex preview for unknown binary uploads.",
      },
    ],
  },
];

function StatusBadge({ status }) {
  const Icon = status === "Implemented" ? CircleCheck : CircleDashed;
  const styles =
    status === "Implemented"
      ? "border-teal-500/40 bg-teal-950/40 text-teal-100"
      : status === "Partial"
        ? "border-amber-500/40 bg-amber-950/40 text-amber-100"
        : "border-zinc-700 bg-zinc-950 text-zinc-300";

  return (
    <span className={`inline-flex h-7 items-center gap-1 rounded border px-2 text-xs font-semibold ${styles}`}>
      <Icon size={13} />
      {status}
    </span>
  );
}

export default function Explore() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Challenge Focus</h2>
        <p className="text-sm text-zinc-400">Crypto targets and current solver coverage</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {challengeTracks.map((track) => {
          const Icon = track.icon;
          return (
            <article key={track.name} className={`rounded-md border bg-zinc-900 p-4 ${track.accent}`}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded border border-current bg-zinc-950">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{track.name}</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {track.challenges.map((challenge) => (
                  <li key={challenge.title} className="rounded border border-zinc-800 bg-zinc-950 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-zinc-100">{challenge.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">
                          {challenge.difficulty}
                        </div>
                      </div>
                      <StatusBadge status={challenge.status} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{challenge.detail}</p>
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
