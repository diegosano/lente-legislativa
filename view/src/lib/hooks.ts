import { client } from "./rpc-logged";
import {
  useMutation,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

export const useListPropositions = (
  filters: { siglaTipo: string[]; ano?: number; palavrasChave?: string },
) => {
  return useInfiniteQuery({
    queryKey: ["propositions", filters],
    queryFn: ({ pageParam = 1 }) =>
      client.LIST_PROPOSITIONS({ ...filters, pagina: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.propositions.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetPropositionDetails = (id: number) => {
  return useQuery({
    queryKey: ["propositionDetails", id],
    queryFn: () => client.GET_PROPOSITION_DETAILS({ id }),
    enabled: !!id,
  });
};

export const useExplainPropositionAI = () => {
  return useMutation({
    mutationFn: (props: { ementa: string }) =>
      client.EXPLAIN_PROPOSITION_AI(props),
  });
};
