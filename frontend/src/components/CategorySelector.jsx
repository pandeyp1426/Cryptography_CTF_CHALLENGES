import { Bug, Cpu, Globe2, KeyRound, Puzzle } from "lucide-react";

const categories = [
  { id: "crypto", label: "Crypto", icon: KeyRound, accent: "border-teal-400 text-teal-200" },
  { id: "web", label: "Web", icon: Globe2, accent: "border-amber-400 text-amber-200" },
  { id: "re", label: "RE", icon: Cpu, accent: "border-sky-400 text-sky-200" },
  { id: "pwn", label: "Pwn", icon: Bug, accent: "border-rose-400 text-rose-200" },
  { id: "misc", label: "Misc", icon: Puzzle, accent: "border-violet-400 text-violet-200" },
];

export default function CategorySelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = value === category.id;
        return (
          <button
            key={category.id}
            type="button"
            title={category.label}
            onClick={() => onChange(category.id)}
            className={`flex h-12 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
              isActive
                ? `${category.accent} bg-zinc-900`
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
            }`}
          >
            <Icon size={17} />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

