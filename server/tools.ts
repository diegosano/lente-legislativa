/**
 * This is where you define your tools.
 *
 * Tools are the functions that will be available on your
 * MCP server. They can be called from any other Deco app
 * or from your front-end code via typed RPC. This is the
 * recommended way to build your Web App.
 *
 * @see https://docs.deco.page/en/guides/creating-tools/
 */
import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "./main.ts";

/**
 * `createPrivateTool` is a wrapper around `createTool` that
 * will call `env.DECO_CHAT_REQUEST_CONTEXT.ensureAuthenticated`
 * before executing the tool.
 *
 * It automatically returns a 401 error if valid user credentials
 * are not present in the request. You can also call it manually
 * to get the user object.
 */

export const createListPropositionsTool = (env: Env) =>
  createTool({
    id: "LIST_PROPOSITIONS",
    description: "List all propositions from the Chamber of Deputies",
    inputSchema: z.object({
      siglaTipo: z.array(z.string()).optional(),
      ano: z.number().optional(),
      pagina: z.number().optional(),
      palavrasChave: z.string().optional(),
      codTema: z.string().optional(),
    }),
    outputSchema: z.object({
      propositions: z.array(
        z.object({
          id: z.number(),
          uri: z.string(),
          siglaTipo: z.string(),
          codTipo: z.number(),
          numero: z.number(),
          ano: z.number(),
          ementa: z.string(),
        }),
      ),
    }),
    execute: async ({ context }) => {
      const params = new URLSearchParams();
      if (context.siglaTipo) {
        context.siglaTipo.forEach((tipo) => params.append("siglaTipo", tipo));
      }
      if (context.ano) {
        params.append("ano", context.ano.toString());
      }
      if (context.pagina) {
        params.append("pagina", context.pagina.toString());
      }
      if (context.palavrasChave) {
        params.append("keywords", context.palavrasChave);
      }

      if (context.codTema) {
        params.append("codTema", context.codTema);
      }

      params.append("ordem", "DESC");
      params.append("ordenarPor", "id");

      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch propositions");
      }

      const data = await response.json();

      return {
        propositions: data.dados,
      };
    },
  });

export const createGetPropositionTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION",
    description: "Get the details of a proposition",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.object({
      id: z.number(),
      uri: z.string(),
      siglaTipo: z.string(),
      codTipo: z.number(),
      numero: z.number(),
      ano: z.number(),
      ementa: z.string(),
      ementaDetalhada: z.string().nullable(),
      dataApresentacao: z.string().nullable(),
      justificativa: z.string().nullable(),
      keywords: z.string().nullable(),
      urlInteiroTeor: z.string().nullable(),
      statusProposicao: z.object({
        dataHora: z.string(),
        sequencia: z.number(),
        siglaOrgao: z.string(),
        uriOrgao: z.string(),
        uriUltimoRelator: z.string().nullable(),
        regime: z.string(),
        descricaoTramitacao: z.string(),
        codTipoTramitacao: z.string(),
        descricaoSituacao: z.string().nullable(),
        codSituacao: z.number().nullable(),
        despacho: z.string(),
        url: z.string().nullable(),
        ambito: z.string(),
        apreciacao: z.string(),
      }),
    }),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch proposition details");
      }

      const data = await response.json();
      return data.dados;
    },
  });

export const createGetPropositionAuthorsTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_AUTHORS",
    description: "Get the authors of a proposition",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.array(
      z.object({
        nome: z.string(),
        tipo: z.string(),
        uri: z.string(),
        ordemAssinatura: z.number(),
        proponente: z.number(),
      }),
    ),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}/autores`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch proposition authors");
      }

      const data = await response.json();
      return data.dados;
    },
  });

export const createGetPropositionProceduresTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_PROCEDURES",
    description: "Get the procedures of a proposition",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string().nullable(),
        uri: z.string().nullable(),
        dataHora: z.string().nullable(),
        sequencia: z.number().nullable(),
        siglaOrgao: z.string().nullable(),
        uriOrgao: z.string().nullable(),
        regime: z.string().nullable(),
        descricaoTramitacao: z.string().nullable(),
        codTipoTramitacao: z.string().nullable(),
        descricaoSituacao: z.string().nullable(),
        codSituacao: z.number().nullable(),
        despacho: z.string().nullable(),
        url: z.string().nullable(),
      }),
    ),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}/tramitacoes`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch proposition procedures");
      }

      const data = await response.json();
      return data.dados;
    },
  });

export const createExplainPropositionAITool = (env: Env) =>
  createTool({
    id: "EXPLAIN_PROPOSITION_AI",
    description: "Explain a legislative proposition in simple terms using AI",
    inputSchema: z.object({
      ementa: z.string(),
    }),
    outputSchema: z.object({
      explanation: z.string(),
    }),
    execute: async ({ context }) => {
      const EXPLANATION_SCHEMA = {
        type: "object",
        properties: {
          explanation: {
            type: "string",
            description:
              "Explain the following legislative proposition's summary (ementa) in simple, clear, and impartial terms for a layperson. Focus on the practical impact on a citizen's life.",
          },
        },
        required: ["explanation"],
      };

      const result = await env.DECO_CHAT_WORKSPACE_API.AI_GENERATE_OBJECT({
        messages: [
          {
            role: "system",
            content:
              "You are an expert in Brazilian law and public policy, skilled at explaining complex topics to the general public.",
          },
          {
            role: "user",
            content: context.ementa,
          },
        ],
        schema: EXPLANATION_SCHEMA,
      });

      return {
        explanation:
          (result.object?.explanation as string) ??
          "Unable to generate explanation.",
      };
    },
  });

export const createGetPropositionThemesTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_THEMES",
    description: "Get the themes of a proposition",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.array(
      z.object({
        codTema: z.number(),
        tema: z.string(),
      }),
    ),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}/temas`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch proposition themes");
      }

      const data = await response.json();
      return data.dados;
    },
  });

export const createGetPropositionDetailsTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_DETAILS",
    description: "Get the details of a proposition, including its authors, procedures and AI explanation",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.object({
      proposition: createGetPropositionTool(env).outputSchema,
      authors: createGetPropositionAuthorsTool(env).outputSchema,
      procedures: createGetPropositionProceduresTool(env).outputSchema,
      explanation: createExplainPropositionAITool(env).outputSchema,
      themes: createGetPropositionThemesTool(env).outputSchema,
    }),
    execute: async ({ context, runtimeContext }) => {
      const getProposition = createGetPropositionTool(env);
      const getAuthors = createGetPropositionAuthorsTool(env);
      const getProcedures = createGetPropositionProceduresTool(env);
      const getThemes = createGetPropositionThemesTool(env);
      const explainProposition = createExplainPropositionAITool(env);

      const [proposition, authors, procedures, themes] = await Promise.all([
        getProposition.execute({ context, runtimeContext }),
        getAuthors.execute({ context, runtimeContext }),
        getProcedures.execute({ context, runtimeContext }),
        getThemes.execute({ context, runtimeContext }),
      ]);

      const explanation = await explainProposition.execute({
        context: {
          ementa: proposition.ementaDetalhada || proposition.ementa,
        },
        runtimeContext,
      });

      return {
        proposition,
        authors,
        procedures,
        themes,
        explanation,
      };
    },
  });

export const createAnalyzePropositionProceduresTool = (env: Env) =>
  createTool({
    id: "ANALYZE_PROPOSITION_PROCEDURES",
    description: "Get procedures for a proposition and generate an AI explanation of what happened and what's going to happen",
    inputSchema: z.object({
      propositionId: z.number(),
    }),
    outputSchema: z.object({
      explanation: z.string(),
      procedures: z.array(
        z.object({
          id: z.string().nullable(),
          uri: z.string().nullable(),
          dataHora: z.string().nullable(),
          sequencia: z.number().nullable(),
          siglaOrgao: z.string().nullable(),
          uriOrgao: z.string().nullable(),
          regime: z.string().nullable(),
          descricaoTramitacao: z.string().nullable(),
          codTipoTramitacao: z.string().nullable(),
          descricaoSituacao: z.string().nullable(),
          codSituacao: z.number().nullable(),
          despacho: z.string().nullable(),
          url: z.string().nullable(),
        }),
      ),
    }),
    execute: async ({ context, runtimeContext }) => {
      // Get the procedures for the proposition
      const getProcedures = createGetPropositionProceduresTool(env);
      const procedures = await getProcedures.execute({ 
        context: { id: context.propositionId },
        runtimeContext
      });

      if (!procedures || procedures.length === 0) {
        return {
          explanation: "Esta proposição não possui tramitações registradas ainda.",
          procedures: [],
        };
      }

      // Create a comprehensive prompt for AI analysis
      const ANALYSIS_SCHEMA = {
        type: "object",
        properties: {
          explanation: {
            type: "string",
            description: "Uma explicação clara e objetiva em português brasileiro sobre o que aconteceu nas tramitações e o que provavelmente vai acontecer a seguir. Use linguagem acessível mas precisa, considerando o contexto legislativo brasileiro.",
          },
        },
        required: ["explanation"],
      };

      // Prepare the procedures data for AI analysis
      const proceduresText = procedures
        .map((proc, index) => {
          const date = proc.dataHora ? new Date(proc.dataHora).toLocaleDateString('pt-BR') : 'Data não informada';
          const organ = proc.siglaOrgao || 'Órgão não especificado';
          const description = proc.descricaoTramitacao || 'Descrição não disponível';
          const situation = proc.descricaoSituacao || 'Situação não especificada';
          const despacho = proc.despacho || 'Sem despacho';
          
          return `${index + 1}. Data: ${date} | Órgão: ${organ} | Tramitação: ${description} | Situação: ${situation} | Despacho: ${despacho}`;
        })
        .join('\n');

      const prompt = `Analise as seguintes tramitações legislativas brasileiras e forneça uma explicação clara sobre:

${proceduresText}

Por favor, explique:
1. O que aconteceu em cada etapa importante
2. O status atual da proposição
3. Os próximos passos prováveis no processo legislativo
4. Qual o impacto prático para os cidadãos

Use linguagem clara e objetiva, considerando o contexto legislativo brasileiro.`;

      const result = await env.DECO_CHAT_WORKSPACE_API.AI_GENERATE_OBJECT({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em direito constitucional e processo legislativo brasileiro. Analise as tramitações fornecidas e forneça insights claros sobre o que aconteceu e o que pode acontecer a seguir. Use linguagem acessível mas precisa, focando no impacto prático para os cidadãos.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        schema: ANALYSIS_SCHEMA,
        temperature: 0.3, // Lower temperature for more consistent analysis
      });

      if (!result.object) {
        throw new Error("Failed to generate procedures analysis");
      }

      return {
        explanation: (result.object.explanation as string) ?? "Não foi possível gerar a análise das tramitações.",
        procedures,
      };
    },
  });

export const createGetPropositionPollsTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_POLLS",
    description: "Get the polls for a specific proposition",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.object({
      polls: z.array(
        z.object({
          id: z.number(),
          uri: z.string().nullable(),
          data: z.string().nullable(),
          dataHoraRegistro: z.string().nullable(),
          uriOrgao: z.string().nullable(),
          siglaOrgao: z.string().nullable(),
          descricao: z.string().nullable(),
          aprovacao: z.number().nullable(),
        }),
      ),
    }),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}/votacoes`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch proposition polls");
      }

      const data = await response.json();
      return { polls: data.dados };
    },
  });

export const createGetPollDetailsTool = (env: Env) =>
  createTool({
    id: "GET_POLL_DETAILS",
    description: "Get detailed information about a specific poll including individual votes",
    inputSchema: z.object({
      pollId: z.number(),
    }),
    outputSchema: z.object({
      poll: z.object({
        id: z.string(),
        uri: z.string().nullable(),
        data: z.string().nullable(),
        dataHoraRegistro: z.string().nullable(),
        siglaOrgao: z.string().nullable(),
        uriOrgao: z.string().nullable(),
        idOrgao: z.number().nullable(),
        uriEvento: z.string().nullable(),
        idEvento: z.number().nullable(),
        descricao: z.string().nullable(),
        aprovacao: z.number().nullable(),
        descUltimaAberturaVotacao: z.string().nullable(),
        dataHoraUltimaAberturaVotacao: z.string().nullable(),
        ultimaApresentacaoProposicao: z.object({
          dataHoraRegistro: z.string().nullable(),
          descricao: z.string().nullable(),
          uriProposicaoCitada: z.string().nullable(),
        }).nullable(),
        efeitosRegistrados: z.array(z.any()).nullable(),
        objetosPossiveis: z.array(
          z.object({
            id: z.number(),
            uri: z.string().nullable(),
            siglaTipo: z.string().nullable(),
            codTipo: z.number().nullable(),
            numero: z.number().nullable(),
            ano: z.number().nullable(),
            ementa: z.string().nullable(),
          })
        ).nullable(),
        proposicoesAfetadas: z.array(
          z.object({
            id: z.number(),
            uri: z.string().nullable(),
            siglaTipo: z.string().nullable(),
            codTipo: z.number().nullable(),
            numero: z.number().nullable(),
            ano: z.number().nullable(),
            ementa: z.string().nullable(),
          })
        ).nullable(),
      }),
      votes: z.array(
        z.object({
          id: z.number(),
          uri: z.string().nullable(),
          nome: z.string().nullable(),
          sigla: z.string().nullable(),
          siglaPartido: z.string().nullable(),
          uriPartido: z.string().nullable(),
          voto: z.string().nullable(),
          deputado: z.object({
            id: z.number(),
            uri: z.string().nullable(),
            nome: z.string().nullable(),
            siglaPartido: z.string().nullable(),
            uriPartido: z.string().nullable(),
            siglaUf: z.string().nullable(),
            idLegislatura: z.number().nullable(),
            urlFoto: z.string().nullable(),
          }).nullable(),
        })
      ),
    }),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/votacoes/${context.pollId}`,
        { headers: { Accept: "application/json" } },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch poll details");
      }

      const data = await response.json();
      
      const votesResponse = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/votacoes/${context.pollId}/votos`,
        { headers: { Accept: "application/json" } },
      );

      let votes = [];
      if (votesResponse.ok) {
        const votesData = await votesResponse.json();
        votes = votesData.dados || [];
      }

      return {
        poll: data.dados,
        votes,
      };
    },
  });

export const tools = [
  createListPropositionsTool,
  createGetPropositionTool,
  createGetPropositionAuthorsTool,
  createGetPropositionProceduresTool,
  createGetPropositionThemesTool,
  createExplainPropositionAITool,
  createGetPropositionDetailsTool,
  createAnalyzePropositionProceduresTool,
  createGetPropositionPollsTool,
  createGetPollDetailsTool,
];