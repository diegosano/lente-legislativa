import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, Calendar, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { client } from "@/lib/rpc";

type PropositionVotingsOutput = Awaited<
  ReturnType<typeof client.GET_PROPOSITION_VOTINGS>
>;
type Voting = PropositionVotingsOutput["votings"][number];

interface PropositionVotingsProps {
  votings: Voting[];
}

export function PropositionVotings({ votings }: PropositionVotingsProps) {
  if (votings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Votações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma votação registrada ainda.</p>
        </CardContent>
      </Card>
    )
  }

  // Sort votings by date (most recent first)
  const sortedVotings = [...votings].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const getApprovalBadge = (aprovacao: number | null) => {
    if (aprovacao === null) {
      return (
        <Badge variant="outline">Não se aplica</Badge>
      )
    }
    switch (aprovacao) {
      case 1:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aprovada</Badge>
      case 0:
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejeitada</Badge>
      default:
        return <Badge variant="outline">Indefinida</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Votações ({votings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedVotings.map((voting, index) => (
          <div key={voting.id} className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDate(voting.data)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{voting.siglaOrgao}</p>
              </div>
              {getApprovalBadge(voting.aprovacao)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">{voting.placarSim}</div>
                <div className="text-xs text-muted-foreground">Sim</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">{voting.placarNao}</div>
                <div className="text-xs text-muted-foreground">Não</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                  {voting.placarAbstencao}
                </div>
                <div className="text-xs text-muted-foreground">Abstenção</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  {voting.presentes}
                </div>
                <div className="text-xs text-muted-foreground">Presentes</div>
              </div>
            </div>

            {index < sortedVotings.length - 1 && <div className="border-b border-border/50" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
