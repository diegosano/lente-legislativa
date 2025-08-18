import { useMutation } from "@tanstack/react-query";
import { client } from "../lib/rpc";

export interface AnalyzePropositionProceduresInput {
  propositionId: number;
}

export interface AnalyzePropositionProceduresOutput {
  explanation: string;
  procedures: Array<{
    id: string | null;
    uri: string | null;
    dataHora: string | null;
    sequencia: number | null;
    siglaOrgao: string | null;
    uriOrgao: string | null;
    regime: string | null;
    descricaoTramitacao: string | null;
    codTipoTramitacao: string | null;
    descricaoSituacao: string | null;
    codSituacao: number | null;
    despacho: string | null;
    url: string | null;
  }>;
}

/**
 * Hook for analyzing proposition procedures to get AI explanation
 */
export const useAnalyzePropositionProcedures = () => {
  return useMutation({
    mutationFn: (input: AnalyzePropositionProceduresInput) => 
      client.ANALYZE_PROPOSITION_PROCEDURES(input),
    
    // Add retry logic for failed requests
    retry: 2,
    
    // Add retry delay
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
