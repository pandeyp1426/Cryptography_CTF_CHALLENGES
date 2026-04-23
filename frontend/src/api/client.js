const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function streamSolve({ challenge, category, file, onEvent }) {
  const form = new FormData();
  form.set("challenge", challenge ?? "");
  form.set("category", category ?? "crypto");
  form.set("save", "true");
  if (file) {
    form.set("file", file);
  }

  const response = await fetch(`${API_BASE_URL}/solve`, {
    method: "POST",
    body: form,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text();
    throw new Error(detail || `Solve failed with status ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      onEvent(JSON.parse(line));
    }
  }

  if (buffer.trim()) {
    onEvent(JSON.parse(buffer));
  }
}

export async function fetchHistory(limit = 50) {
  const response = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`History request failed with status ${response.status}`);
  }
  return response.json();
}

export { API_BASE_URL };

