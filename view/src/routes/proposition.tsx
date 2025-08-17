import { createRoute, type RootRoute, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import {
  useGetPropositionDetails,
} from "@/lib/hooks";
import { PropositionHeader } from "@/components/proposition-header";
import { PropositionContent } from "@/components/proposition-content";
import { PropositionAuthors } from "@/components/proposition-authors";
import { AIExplanation } from "@/components/ai-explanation";
import { BackButton } from "@/components/back-button";
import { PropositionTimeline } from "@/components/proposition-timeline";

function PropositionPage() {
  const { id } = useParams({ from: "/proposition/$id" });
  const { data, isPending: isLoading, error } = useGetPropositionDetails(
    parseInt(id, 10),
  );

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

  if (!data) {
    return <div>Proposição não encontrada.</div>;
  }

  const { proposition, authors, procedures, explanation } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <BackButton />

        <div className="space-y-8">
          <PropositionHeader proposition={proposition} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AIExplanation
                explanation={explanation?.explanation}
                isLoading={isLoading}
                error={error}
              />
              <PropositionContent proposition={proposition} />
            </div>

            <div className="space-y-6">
              <PropositionAuthors authors={authors} />
              <PropositionTimeline procedures={procedures} />
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
