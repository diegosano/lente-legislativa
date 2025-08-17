import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils";
import { client } from "@/lib/rpc";

type PropositionDetails = Awaited<
  ReturnType<typeof client.GET_PROPOSITION_DETAILS>
>;

interface PropositionContentProps {
  proposition: PropositionDetails;
}

export function PropositionContent({ proposition }: PropositionContentProps) {
  return (
    <div className="space-y-6">
      {proposition.ementaDetalhada && proposition.ementaDetalhada !== proposition.ementa && (
        <Card>
          <CardHeader>
            <CardTitle>Ementa Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{proposition.ementaDetalhada}</p>
          </CardContent>
        </Card>
      )}

      {proposition.justificativa && (
        <Card>
          <CardHeader>
            <CardTitle>Justificativa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="leading-relaxed whitespace-pre-wrap">{proposition.justificativa}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {proposition.statusProposicao && (
        <Card>
          <CardHeader>
            <CardTitle>Status da Tramitação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Situação Atual</h4>
                <p className="text-sm">{proposition.statusProposicao.descricaoSituacao}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Última Atualização</h4>
                <p className="text-sm">{formatDate(proposition.statusProposicao.dataHora)}</p>
              </div>

              {proposition.statusProposicao.siglaOrgao && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Órgão</h4>
                  <p className="text-sm">{proposition.statusProposicao.siglaOrgao}</p>
                </div>
              )}

              {proposition.statusProposicao.regime && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Regime</h4>
                  <p className="text-sm">{proposition.statusProposicao.regime}</p>
                </div>
              )}
            </div>

            {proposition.statusProposicao.descricaoTramitacao && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Descrição da Tramitação</h4>
                  <p className="text-sm leading-relaxed">{proposition.statusProposicao.descricaoTramitacao}</p>
                </div>
              </>
            )}

            {proposition.statusProposicao.despacho && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Despacho</h4>
                  <p className="text-sm leading-relaxed">{proposition.statusProposicao.despacho}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {proposition.keywords && (
        <Card>
          <CardHeader>
            <CardTitle>Palavras-chave</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{proposition.keywords}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
