import { client } from "./rpc-logged";
import {
  useMutation,
  useSuspenseQuery,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { FailedToFetchUserError } from "@/components/logged-provider";

/**
 * This hook will throw an error if the user is not logged in.
 * You can safely use it inside routes that are protected by the `LoggedProvider`.
 */
export const useUser = () => {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () =>
      client.GET_USER({}, {
        handleResponse: (res: Response) => {
          if (res.status === 401) {
            throw new FailedToFetchUserError(
              "Failed to fetch user",
              globalThis.location.href,
            );
          }

          return res.json();
        },
      }),
    retry: false,
  });
};

/**
 * This hook will return null if the user is not logged in.
 * You can safely use it inside routes that are not protected by the `LoggedProvider`.
 * Good for pages that are public, for example.
 */
export const useOptionalUser = () => {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () =>
      client.GET_USER({}, {
        handleResponse: async (res: Response) => {
          if (res.status === 401) {
            return null;
          }
          return res.json();
        },
      }),
    retry: false,
  });
};

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

export const useGetPropositionVotings = (id: number) => {
  return useQuery({
    queryKey: ["propositionVotings", id],
    queryFn: () => client.GET_PROPOSITION_VOTINGS({ id }),
    enabled: !!id,
  });
};
