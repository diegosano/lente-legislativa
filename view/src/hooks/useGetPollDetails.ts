import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/rpc";

export type GetPollDetailsOutput = Awaited<ReturnType<typeof client.GET_POLL_DETAILS>>

/**
 * Hook for fetching detailed information about a specific poll including individual votes
 */
export const useGetPollDetails = (pollId: number) => {
  return useQuery({
    queryKey: ["pollDetails", pollId],
    queryFn: () => client.GET_POLL_DETAILS({ pollId }),
    enabled: !!pollId,
    staleTime: 5 * 60 * 1000,
  });
};
