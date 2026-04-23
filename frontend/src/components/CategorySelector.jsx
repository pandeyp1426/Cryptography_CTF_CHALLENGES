import { Archive, BarChart3, Hash, KeyRound, Lock, Shuffle } from "lucide-react";

const categories = [
  { id: "rsa", label: "RSA", icon: KeyRound, accent: "border-teal-400 text-teal-200" },
  { id: "classical", label: "Classical", icon: Shuffle, accent: "border-amber-400 text-amber-200" },
  { id: "analysis", label: "Analysis", icon: BarChart3, accent: "border-sky-400 text-sky-200" },
  { id: "symmetric", label: "OTP/DES", icon: Lock, accent: "border-rose-400 text-rose-200" },
  { id: "hashes", label: "Hashes", icon: Hash, accent: "border-violet-400 text-violet-200" },
  { id: "files", label: "Files", icon: Archive, accent: "border-lime-400 text-lime-200" },
];

export default function CategorySelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
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
