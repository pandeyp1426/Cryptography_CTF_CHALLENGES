import { BookOpen, Compass, TerminalSquare } from "lucide-react";
import { useState } from "react";

import Explore from "./pages/Explore.jsx";
import History from "./pages/History.jsx";
import Solve from "./pages/Solve.jsx";

const tabs = [
  { id: "solve", label: "Solve", icon: TerminalSquare, component: Solve },
  { id: "history", label: "History", icon: BookOpen, component: History },
  { id: "explore", label: "Explore", icon: Compass, component: Explore },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("solve");
  const ActivePage = tabs.find((tab) => tab.id === activeTab)?.component ?? Solve;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(39,39,42,.35)_1px,transparent_1px),linear-gradient(0deg,rgba(39,39,42,.35)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-teal-400 text-zinc-950">
              <TerminalSquare size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal text-white">CTF Challenge Solver</h1>
              <p className="text-sm text-zinc-400">Crypto-first workflow for challenge triage and writeups</p>
            </div>
          </div>
          <nav className="flex rounded-md border border-zinc-800 bg-zinc-900 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-10 min-w-24 items-center justify-center gap-2 rounded px-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-zinc-950"
                      : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 py-6">
          <ActivePage />
        </main>
      </div>
    </div>
  );
}

