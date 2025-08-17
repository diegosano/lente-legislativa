import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPropositionType, getPropositionTypeColor } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { client } from "@/lib/rpc";

type ListPropositionsOutput = Awaited<
  ReturnType<typeof client.LIST_PROPOSITIONS>
>;
type Proposition = ListPropositionsOutput["propositions"][number];

interface PropositionCardProps {
  proposition: Proposition;
}

export function PropositionCard({ proposition }: PropositionCardProps) {
  return (
    <Link to="/proposition/$id" params={{ id: proposition.id.toString() }}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {proposition.siglaTipo} {proposition.numero}/{proposition.ano}
            </CardTitle>
            <Badge className={getPropositionTypeColor(proposition.siglaTipo)}>
              {proposition.siglaTipo}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatPropositionType(proposition.siglaTipo)}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm line-clamp-3">{proposition.ementa}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
