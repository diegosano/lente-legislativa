import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { createRoute, type RootRoute } from "@tanstack/react-router";
import { useListPropositions } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { PropositionCard } from "@/components/proposition-card";
import { PropositionFilterBar } from "@/components/proposition-filter-bar";

function HomePage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "PEC",
    "PL",
    "MPV",
  ]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [keywords, setKeywords] = useState("")

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useListPropositions({
    siglaTipo: selectedTypes,
    ano: selectedYear,
    palavrasChave: keywords,
  });

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleKeywordsChange = (keywords: string) => {
    setKeywords(keywords);
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedYear(new Date().getFullYear());
    setKeywords("");
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isFetching && !isFetchingNextPage) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando proposições...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allPropositions =
    data?.pages.flatMap((page) => page.propositions) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Lente Legislativa</h1>
              <p className="text-muted-foreground mt-2">
                Acompanhe as últimas proposições da Câmara dos Deputados
              </p>
            </div>

            <Button type="button" className="cursor-pointer" onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <PropositionFilterBar
            selectedTypes={selectedTypes}
            selectedYear={selectedYear}
            searchTerm={keywords}
            onTypeToggle={handleTypeToggle}
            onYearChange={handleYearChange}
            onSearchChange={handleKeywordsChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        <main>
          {error ? (
            <div className="text-center py-10">
              <p className="text-red-500">
                Ocorreu um erro ao buscar as proposições.
              </p>
              <Button onClick={() => refetch()} className="mt-4 cursor-pointer">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPropositions.map((prop) => (
                  <PropositionCard key={prop.id} proposition={prop} />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="cursor-pointer"
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Carregar mais"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/",
    component: HomePage,
    getParentRoute: () => parentRoute,
  });
