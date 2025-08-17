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

export const createGetPropositionDetailsTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_DETAILS",
    description: "Get the details of a proposition, including its authors",
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
      autores: z.array(
        z.object({
          nome: z.string(),
          tipo: z.string(),
          uri: z.string(),
          ordemAssinatura: z.number(),
          proponente: z.number(),
        }),
      ),
    }),
    execute: async ({ context }) => {
      const propDetailsPromise = fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}`,
        { headers: { Accept: "application/json" } },
      ).then((res) => res.json());

      const authorsPromise = fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}/autores`,
        { headers: { Accept: "application/json" } },
      ).then((res) => res.json());

      const [propDetailsResponse, authorsResponse] = await Promise.all([
        propDetailsPromise,
        authorsPromise,
      ]);

      return {
        ...propDetailsResponse.dados,
        autores: authorsResponse.dados,
      };
    },
  });

export const createGetPropositionVotingsTool = (env: Env) =>
  createTool({
    id: "GET_PROPOSITION_VOTINGS",
    description: "Get the votings of a proposition",
    inputSchema: z.object({ id: z.number() }),
    outputSchema: z.object({
      votings: z.array(
        z.object({
          id: z.string(),
          data: z.string(),
          siglaOrgao: z.string(),
          aprovacao: z.number().nullable(),
          placarSim: z.number(),
          placarNao: z.number(),
          placarAbstencao: z.number(),
          presentes: z.number(),
        }),
      ),
    }),
    execute: async ({ context }) => {
      const response = await fetch(
        `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${context.id}/votacoes`,
        { headers: { Accept: "application/json" } },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch proposition votings");
      }
      const data = await response.json();
      return { votings: data.dados };
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

export const tools = [
  createListPropositionsTool,
  createGetPropositionDetailsTool,
  createExplainPropositionAITool,
  createGetPropositionVotingsTool,
];
