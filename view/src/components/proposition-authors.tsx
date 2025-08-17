import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { client } from "@/lib/rpc";

type PropositionDetailsOutput = Awaited<
  ReturnType<typeof client.GET_PROPOSITION_DETAILS>
>;
type Authors = PropositionDetailsOutput["authors"];

interface PropositionAuthorsProps {
  authors: Authors;
}

export function PropositionAuthors({ authors }: PropositionAuthorsProps) {
  if (authors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Autores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Informações sobre autores não disponíveis.</p>
        </CardContent>
      </Card>
    )
  }

  // Sort authors by signature order
  const sortedAuthors = [...authors].sort((a, b) => a.ordemAssinatura - b.ordemAssinatura)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Autores ({authors.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAuthors.map((author, index) => (
          <div key={author.uri} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{author.nome}</h4>
                <p className="text-xs text-muted-foreground">{author.tipo}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {author.proponente === 1 && (
                  <Badge variant="default" className="text-xs">
                    Proponente
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">#{author.ordemAssinatura}</span>
              </div>
            </div>
            {index < sortedAuthors.length - 1 && <div className="border-b border-border/50" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
