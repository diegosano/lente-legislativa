import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AnalyzePropositionProceduresOutput } from "@/hooks/useAnalyzePropositionProcedures"

interface ProceduresAnalysisResultProps {
  analysis?: AnalyzePropositionProceduresOutput
  isLoading: boolean
  error: Error | null
  isOpen: boolean
  onClose: () => void
}

export function ProceduresAnalysisResult({
  analysis,
  isLoading,
  error,
  isOpen,
  onClose
}: ProceduresAnalysisResultProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <DialogTitle>Análise das Tramitações</DialogTitle>
            </div>
          </div>

          <DialogDescription>
            Explicação gerada por IA sobre o que aconteceu e o que vai acontecer
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-3" />
              <span className="text-lg">Analisando tramitações...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {analysis && (
            <div className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                  <p className="text-blue-800 leading-relaxed whitespace-pre-wrap text-base">
                    {analysis.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
