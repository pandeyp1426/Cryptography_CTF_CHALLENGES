import Editor from "@monaco-editor/react";
import { FileCode2, UploadCloud, X } from "lucide-react";

export default function ChallengeInput({ challenge, onChallengeChange, file, onFileChange }) {
  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-900 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <FileCode2 size={17} className="text-teal-300" />
          Challenge Input
        </div>
        <div className="flex items-center gap-2">
          {file ? (
            <div className="flex h-9 items-center gap-2 rounded border border-zinc-700 bg-zinc-950 px-3 text-xs text-zinc-300">
              <span className="max-w-48 truncate">{file.name}</span>
              <button
                type="button"
                title="Remove file"
                onClick={() => onFileChange(null)}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : null}
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded border border-zinc-700 bg-zinc-950 px-3 text-xs font-semibold text-zinc-200 hover:border-teal-400 hover:text-teal-100">
            <UploadCloud size={15} />
            Upload
            <input
              type="file"
              accept=".txt,.md,.json,.csv,.py,.pdf,.bin,.dat"
              className="sr-only"
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </div>
      <div className="h-[320px] p-3">
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          value={challenge}
          theme="vs-dark"
          onChange={(value) => onChallengeChange(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 14, bottom: 14 },
            automaticLayout: true,
          }}
        />
      </div>
    </section>
  );
}

