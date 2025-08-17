import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AIExplanationProps {
  explanation?: string
  isLoading: boolean
  error: Error | null
}

export function AIExplanation({ explanation, isLoading, error }: AIExplanationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Explicação com IA
        </CardTitle>
        <CardDescription>
          Uma explicação simplificada desta proposição gerada por inteligência artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Gerando explicação...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {explanation && (
          <div className="prose prose-sm max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <p className="text-blue-800 leading-relaxed whitespace-pre-wrap">{explanation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
