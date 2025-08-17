import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface Theme {
  codTema: number;
  tema: string;
}

interface PropositionThemesProps {
  themes: Theme[];
}

export function PropositionThemes({ themes }: PropositionThemesProps) {
  if (!themes || themes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Temas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhum tema associado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Temas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Badge key={theme.codTema} variant="secondary">
              {theme.tema}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
