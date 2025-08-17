import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Building2, FileText } from "lucide-react"
import type { client } from "@/lib/rpc"

type Procedures = Awaited<
  ReturnType<typeof client.GET_PROPOSITION_DETAILS>
>["procedures"];

interface PropositionTimelineProps {
  procedures: Procedures
}

export function PropositionTimeline({ procedures }: PropositionTimelineProps) {
  if (!procedures || procedures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tramitação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhuma informação de tramitação disponível.</p>
        </CardContent>
      </Card>
    )
  }

  const sortedProcedures = [...procedures].sort((a, b) => {
    try {
      const dateA = new Date(a.dataHora || "").getTime()
      const dateB = new Date(b.dataHora || "").getTime()
      return dateB - dateA
    } catch {
      return 0
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Tramitações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedProcedures.map((tramitacao, index) => {
            const key = `${index}-${tramitacao.sequencia || index}`
            const dateString = tramitacao.dataHora

            return (
              <div key={key} className="relative">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {dateString ? (
                        <time dateTime={dateString}>
                          {(() => {
                            try {
                              return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                            } catch {
                              return dateString
                            }
                          })()}
                        </time>
                      ) : (
                        <span>Data não disponível</span>
                      )}
                      {tramitacao.sequencia && (
                        <Badge variant="outline" className="text-xs">
                          #{tramitacao.sequencia}
                        </Badge>
                      )}
                    </div>

                    {tramitacao.siglaOrgao && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{tramitacao.siglaOrgao}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {tramitacao.descricaoTramitacao || "Descrição não disponível"}
                      </p>

                      {tramitacao.descricaoSituacao && (
                        <Badge variant="secondary" className="text-xs">
                          {tramitacao.descricaoSituacao}
                        </Badge>
                      )}

                      {tramitacao.despacho && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>{tramitacao.despacho}</p>
                        </div>
                      )}

                      {tramitacao.regime && (
                        <p className="text-xs text-muted-foreground">
                          <strong>Regime:</strong> {tramitacao.regime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
