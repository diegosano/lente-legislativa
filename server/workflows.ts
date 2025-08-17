/**
 * This is where you define your workflows.
 *
 * Workflows are a way to encode complex flows of steps
 * reusing your tools and with built-in observability
 * on the Deco project dashboard. They can also do much more!
 *
 * When exported, they will be available on the MCP server
 * via built-in tools for starting, resuming and cancelling
 * them.
 *
 * @see https://docs.deco.page/en/guides/building-workflows/
 */
import {
  createStepFromTool,
  createWorkflow,
} from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "./main.ts";
import {
  createGetPropositionTool,
  createGetPropositionAuthorsTool,
  createGetPropositionProceduresTool,
  createExplainPropositionAITool,
} from "./tools.ts";

export const createPropositionDetailsWorkflow = (env: Env) => {
  // Create steps from our existing tools
  const getPropositionStep = createStepFromTool(createGetPropositionTool(env));
  const getAuthorsStep = createStepFromTool(createGetPropositionAuthorsTool(env));
  const getProceduresStep = createStepFromTool(createGetPropositionProceduresTool(env));
  const explainPropositionStep = createStepFromTool(createExplainPropositionAITool(env));

  return createWorkflow({
    id: "PROPOSITION_DETAILS_WORKFLOW",
    description: "Process a proposition to get its details, authors, procedures, and AI explanation",
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.object({
      proposition: createGetPropositionTool(env).outputSchema,
      authors: createGetPropositionAuthorsTool(env).outputSchema,
      procedures: createGetPropositionProceduresTool(env).outputSchema,
      explanation: createExplainPropositionAITool(env).outputSchema,
    }),
  })
    .parallel([getPropositionStep, getAuthorsStep, getProceduresStep])
    .map(async ({ getStepResult }) => {
      const proposition = getStepResult(getPropositionStep);
      return {
        ementa: proposition.ementaDetalhada || proposition.ementa,
      };
    })
    .then(explainPropositionStep)
    .map(async ({ getStepResult }) => {
      const proposition = getStepResult(getPropositionStep);
      const authors = getStepResult(getAuthorsStep);
      const procedures = getStepResult(getProceduresStep);
      const explanation = getStepResult(explainPropositionStep);

      return {
        proposition,
        authors,
        procedures,
        explanation,
      };
    })
    .commit();
};

export const workflows = [createPropositionDetailsWorkflow];