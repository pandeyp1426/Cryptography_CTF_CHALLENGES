import { useQuery } from "@tanstack/react-query";

import { fetchHistory } from "../api/client.js";

export function useHistory(limit = 50) {
  return useQuery({
    queryKey: ["history", limit],
    queryFn: () => fetchHistory(limit),
    staleTime: 15_000,
  });
}

