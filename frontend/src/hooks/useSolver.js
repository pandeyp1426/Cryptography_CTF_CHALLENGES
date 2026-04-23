import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { streamSolve } from "../api/client.js";

const initialState = {
  isSolving: false,
  status: "idle",
  fileInfo: null,
  steps: [],
  result: null,
  historyId: null,
  error: null,
};

function reduceEvent(state, event) {
  switch (event.event) {
    case "status":
      return { ...state, status: event.message ?? "running" };
    case "file":
      return { ...state, fileInfo: event };
    case "step":
      return { ...state, steps: [...state.steps, event] };
    case "history":
      return { ...state, historyId: event.id };
    case "complete":
      return {
        ...state,
        result: event.result,
        status: event.result?.status ?? "complete",
        historyId: event.history?.id ?? state.historyId,
      };
    default:
      return state;
  }
}

export function useSolver() {
  const queryClient = useQueryClient();
  const [state, setState] = useState(initialState);

  const solve = useCallback(
    async ({ challenge, category, file }) => {
      setState({ ...initialState, isSolving: true, status: "running" });
      try {
        await streamSolve({
          challenge,
          category,
          file,
          onEvent: (event) => setState((current) => reduceEvent(current, event)),
        });
        setState((current) => ({ ...current, isSolving: false }));
        queryClient.invalidateQueries({ queryKey: ["history"] });
      } catch (error) {
        setState((current) => ({
          ...current,
          isSolving: false,
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        }));
      }
    },
    [queryClient],
  );

  const reset = useCallback(() => setState(initialState), []);

  return useMemo(
    () => ({
      ...state,
      solve,
      reset,
    }),
    [state, solve, reset],
  );
}

