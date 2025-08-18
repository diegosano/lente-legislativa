import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/rpc";

export type GetPropositionPollsOutput = Awaited<ReturnType<typeof client.GET_PROPOSITION_POLLS>>["polls"]

/**
 * Hook for fetching polls (votações) for a specific proposition
 */
export const useGetPropositionPolls = (propositionId: number) => {
  return useQuery({
    queryKey: ["propositionPolls", propositionId],
    queryFn: () => client.GET_PROPOSITION_POLLS({ id: propositionId }),
    enabled: !!propositionId,
    staleTime: 5 * 60 * 1000,
  });
};
