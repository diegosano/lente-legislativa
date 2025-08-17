import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  console.log(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString))
}

export function formatPropositionType(type: string) {
  const map: { [key: string]: string } = {
    PEC: "Proposta de Emenda à Constituição",
    PL: "Projeto de Lei",
    MPV: "Medida Provisória",
  }
  return map[type] || type
}

export function getPropositionTypeColor(type: string) {
  switch (type) {
    case "PEC":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "PL":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "MPV":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export function getPropositionStatusColor(status: string) {
  if (!status) {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }

  if (status.toLowerCase().includes("aprovad")) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  }
  if (status.toLowerCase().includes("rejeitad")) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }

  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
};
