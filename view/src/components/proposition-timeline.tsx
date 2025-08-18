import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Building2, FileText, Sparkles, Loader2 } from "lucide-react"
import type { client } from "@/lib/rpc"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAnalyzePropositionProcedures } from "@/hooks/useAnalyzePropositionProcedures"
import { ProceduresAnalysisResult } from "./procedures-analysis-result"

type Procedures = Awaited<
  ReturnType<typeof client.GET_PROPOSITION_DETAILS>
>["procedures"];

interface PropositionTimelineProps {
  procedures: Procedures
  propositionId: number
}

export function PropositionTimeline({ procedures, propositionId }: PropositionTimelineProps) {
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false)
  const analyzeProcedures = useAnalyzePropositionProcedures()

  if (!procedures || procedures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tramitações
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

  const handleAnalyzeProcedures = () => {
    setIsAnalysisDialogOpen(true)
    analyzeProcedures.mutate({ propositionId })
  }

  const handleCloseAnalysisDialog = () => {
    setIsAnalysisDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tramitações

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={handleAnalyzeProcedures}
                  disabled={analyzeProcedures.isPending}
                >
                  {analyzeProcedures.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Analisar tramitações com IA</p>
              </TooltipContent>
            </Tooltip>
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

      <ProceduresAnalysisResult
        analysis={analyzeProcedures.data as any}
        isLoading={analyzeProcedures.isPending}
        error={analyzeProcedures.error}
        isOpen={isAnalysisDialogOpen}
        onClose={handleCloseAnalysisDialog}
      />
    </>
  )
}
