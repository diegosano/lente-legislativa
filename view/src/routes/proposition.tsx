import { createRoute, type RootRoute, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import {
  useGetPropositionDetails,
  useGetPropositionVotings,
  useExplainPropositionAI,
} from "@/lib/hooks";
import { PropositionHeader } from "@/components/proposition-header";
import { PropositionContent } from "@/components/proposition-content";
import { PropositionAuthors } from "@/components/proposition-authors";
import { PropositionVotings } from "@/components/proposition-votings";
import { AIExplanation } from "@/components/ai-explanation";
import { BackButton } from "@/components/back-button";
import { useEffect } from "react";

function PropositionPage() {
  const { id } = useParams({ from: "/proposition/$id" });
  const { data: proposition, isLoading } = useGetPropositionDetails(
    parseInt(id, 10),
  );
  const { data: votings } = useGetPropositionVotings(parseInt(id, 10));
  const {
    mutate: generateExplanation,
    data: explanationData,
    isPending: isExplanationLoading,
    error: explanationError,
  } = useExplainPropositionAI();

  useEffect(() => {
    if (proposition) {
      generateExplanation({ ementa: proposition.ementaDetalhada || proposition.ementa });
    }
  }, [proposition, generateExplanation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando proposição...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!proposition) {
    return <div>Proposição não encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BackButton />

        <div className="space-y-8">
          <PropositionHeader proposition={proposition} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AIExplanation
                explanation={explanationData?.explanation}
                isLoading={isExplanationLoading}
                error={explanationError}
              />
              <PropositionContent proposition={proposition} />
              {votings && votings.votings.length > 0 && (
                <PropositionVotings votings={votings.votings} />
              )}
            </div>

            <div className="space-y-6">
              <PropositionAuthors authors={proposition.autores} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/proposition/$id",
    component: PropositionPage,
    getParentRoute: () => parentRoute,
  });
