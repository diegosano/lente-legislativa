import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Building2, Vote, CheckCircle, XCircle, TrendingUp, Users, Eye } from "lucide-react"
import { useGetPropositionPolls } from "@/hooks/useGetPropositionPolls"
import { useGetPollDetails } from "@/hooks/useGetPollDetails"

interface PropositionPollsProps {
  propositionId: number
}

export function PropositionPolls({ propositionId }: PropositionPollsProps) {
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null)
  const { data, isLoading, error } = useGetPropositionPolls(propositionId)

  const { data: pollDetails, isLoading: isLoadingDetails } = useGetPollDetails(selectedPollId || 0)

  console.log({
    selectedPollId
  })

  const handlePollClick = (pollId: number) => {
    setSelectedPollId(pollId)
  }

  const handleCloseDialog = () => {
    setSelectedPollId(null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Votações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando votações...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Votações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Erro ao carregar votações: {error.message}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!data?.polls || data.polls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Votações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhuma votação encontrada para esta proposição.
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedPolls = [...data.polls].sort((a, b) => {
    try {
      const dateA = new Date(a.dataHoraRegistro || "").getTime()
      const dateB = new Date(b.dataHoraRegistro || "").getTime()
      return dateB - dateA
    } catch {
      return 0
    }
  })

  const getVoteIcon = (aprovada: boolean) => {
    if (aprovada) return <CheckCircle className="h-4 w-4 text-green-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getVoteBadgeVariant = (aprovada: boolean) => {
    if (aprovada) return "default"
    return "destructive"
  }

  const getVoteText = (aprovada: boolean) => {
    if (aprovada) return "Aprovada"
    return "Rejeitada"
  }

  const totalPolls = data.polls.length
  const approvedPolls = data.polls.filter((poll: any) => poll.aprovacao === 1).length
  const rejectedPolls = data.polls.filter((poll: any) => poll.aprovacao !== 1).length

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Votações ({totalPolls})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Total</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{totalPolls}</span>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Aprovadas</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{approvedPolls}</span>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-muted-foreground">Rejeitadas</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{rejectedPolls}</span>
            </div>
          </div>

          <div className="space-y-6">
            {sortedPolls.map((poll, index) => {
              const dateString = poll.dataHoraRegistro
              const key = `${poll.id}-${index}`

              return (
                <div key={key} className="relative">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>

                    <div className="flex-1 space-y-3">
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
                      </div>

                      {poll.siglaOrgao && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{poll.siglaOrgao}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        {poll.descricao && (
                          <p className="text-sm font-medium">
                            {poll.descricao}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getVoteIcon(poll.aprovacao === 1)}
                            <Badge variant={getVoteBadgeVariant(poll.aprovacao === 1)}>
                              {getVoteText(poll.aprovacao === 1)}
                            </Badge>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePollClick(poll.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Poll Details Dialog */}
      <Dialog open={!!selectedPollId} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-blue-600" />
                <DialogTitle>Detalhes da Votação</DialogTitle>
              </div>
            </div>
            <DialogDescription>
              Informações detalhadas sobre a votação e votos individuais
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando detalhes da votação...</span>
              </div>
            ) : pollDetails ? (
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Informações da Votação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-medium">
                        {(pollDetails.poll as any).dataHoraRegistro ?
                          format(new Date((pollDetails.poll as any).dataHoraRegistro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) :
                          (pollDetails.poll as any).data ?
                            format(new Date((pollDetails.poll as any).data), "dd/MM/yyyy", { locale: ptBR }) :
                            "Não disponível"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Órgão</p>
                      <p className="font-medium">{pollDetails.poll.siglaOrgao || "Não disponível"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Descrição</p>
                      <p className="font-medium">{pollDetails.poll.descricao || "Não disponível"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Resultado</p>
                      <div className="flex items-center gap-2">
                        {getVoteIcon((pollDetails.poll as any).aprovacao === 1)}
                        <Badge variant={getVoteBadgeVariant((pollDetails.poll as any).aprovacao === 1)}>
                          {getVoteText((pollDetails.poll as any).aprovacao === 1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {(pollDetails.poll as any).proposicoesAfetadas && (pollDetails.poll as any).proposicoesAfetadas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      Proposições Afetadas ({(pollDetails.poll as any).proposicoesAfetadas.length})
                    </h3>
                    <div className="space-y-3">
                      {(pollDetails.poll as any).proposicoesAfetadas.map((proposicao: any) => (
                        <div key={proposicao.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <Badge variant="outline" className="text-xs">
                                {proposicao.siglaTipo} {proposicao.numero}/{proposicao.ano}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{proposicao.ementa}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(pollDetails.poll as any).objetosPossiveis && (pollDetails.poll as any).objetosPossiveis.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Vote className="h-5 w-5" />
                      Objetos da Votação ({(pollDetails.poll as any).objetosPossiveis.length})
                    </h3>
                    <div className="space-y-3">
                      {(pollDetails.poll as any).objetosPossiveis.map((objeto: any) => (
                        <div key={objeto.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <Badge variant="outline" className="text-xs">
                                {objeto.siglaTipo} {objeto.numero}/{objeto.ano}
                              </Badge>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{objeto.ementa}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pollDetails.votes && pollDetails.votes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Votos Individuais ({pollDetails.votes.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pollDetails.votes.map((vote) => (
                        <div key={vote.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            {vote.deputado?.urlFoto && (
                              <img
                                src={vote.deputado.urlFoto}
                                alt={vote.deputado.nome || ""}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{vote.deputado?.nome || vote.nome || "Nome não disponível"}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{vote.deputado?.siglaPartido || vote.siglaPartido}</span>
                                {vote.deputado?.siglaUf && <span>• {vote.deputado.siglaUf}</span>}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {vote.voto || "Sem voto"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!pollDetails.votes || pollDetails.votes.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum voto individual disponível para esta votação.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Não foi possível carregar os detalhes da votação.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
