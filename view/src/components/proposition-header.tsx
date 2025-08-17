import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, ExternalLink } from "lucide-react";
import { formatPropositionType, formatDate, getPropositionTypeColor, getPropositionStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/rpc";

type Proposition = Awaited<
  ReturnType<typeof client.GET_PROPOSITION_DETAILS>
>["proposition"];

interface PropositionHeaderProps {
  proposition: Proposition;
}

export function PropositionHeader({ proposition }: PropositionHeaderProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">
                  {proposition.siglaTipo} {proposition.numero}/
                  {proposition.ano}
                </h1>
                <Badge
                  className={getPropositionTypeColor(proposition.siglaTipo)}
                >
                  {proposition.siglaTipo}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {formatPropositionType(proposition.siglaTipo)}
              </p>
            </div>

            {proposition.urlInteiroTeor && (
              <Button asChild variant="outline">
                <a
                  href={proposition.urlInteiroTeor}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Texto Integral
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Ementa</h2>
            <p className="text-foreground leading-relaxed">
              {proposition.ementa}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            {proposition.dataApresentacao && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Apresentada em {formatDate(proposition.dataApresentacao)}
                </span>
              </div>
            )}

            {(proposition.statusProposicao && proposition.statusProposicao.descricaoSituacao) && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className={getPropositionStatusColor(
                    proposition.statusProposicao.descricaoSituacao,
                  )}
                >
                  {proposition.statusProposicao.descricaoSituacao}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
