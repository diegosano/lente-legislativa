import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, X, Filter } from "lucide-react"

interface PropositionFilterBarProps {
  selectedTypes: string[]
  selectedYear: number
  searchTerm: string
  onTypeToggle: (type: string) => void
  onYearChange: (year: number) => void
  onSearchChange: (term: string) => void
  onClearFilters: () => void
}

const PROPOSITION_TYPES = [
  { value: "PEC", label: "PEC - Proposta de Emenda à Constituição" },
  { value: "PL", label: "PL - Projeto de Lei" },
  { value: "MPV", label: "MPV - Medida Provisória" },
  { value: "PLP", label: "PLP - Projeto de Lei Complementar" },
  { value: "PDC", label: "PDC - Projeto de Decreto Legislativo" },
]

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

export function PropositionFilterBar({
  selectedTypes,
  selectedYear,
  searchTerm,
  onTypeToggle,
  onYearChange,
  onSearchChange,
  onClearFilters,
}: PropositionFilterBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const keywords = searchTerm.trim() ? searchTerm.trim().split(/\s+/).filter(Boolean) : []
  const hasActiveFilters = selectedTypes.length > 0 || selectedYear !== new Date().getFullYear() || searchTerm.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearchTerm)
  }

  const handleClearSearch = () => {
    setLocalSearchTerm("")
    onSearchChange("")
  }

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Filtros e Busca</h2>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium block">Buscar por palavras-chave</label>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Digite palavras-chave separadas por espaço..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {(localSearchTerm || searchTerm) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {localSearchTerm !== searchTerm && localSearchTerm.trim() && (
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">
              Buscar
            </Button>
          )}
        </form>

        {keywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {keywords.length === 1
                ? "Buscando por 1 palavra-chave"
                : `Buscando por ${keywords.length} palavras-chave (todas devem estar presentes)`}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium block">Ano</label>
          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number.parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium block">Tipos de Proposição</label>
          <div className="flex flex-wrap gap-2">
            {PROPOSITION_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={selectedTypes.includes(type.value) ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeToggle(type.value)}
                className="text-xs cursor-pointer"
                type="button"
              >
                {type.value}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filtros ativos</span>
            <Button type="button" variant="ghost" size="sm" onClick={onClearFilters} className="text-xs cursor-pointer">
              <X className="h-3 w-3 mr-1" />
              Limpar todos
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <Badge key={type} variant="default" className="gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onTypeToggle(type)} />
              </Badge>
            ))}
            {selectedYear !== new Date().getFullYear() && (
              <Badge variant="default" className="gap-1">
                {selectedYear}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onYearChange(new Date().getFullYear())} />
              </Badge>
            )}
            {searchTerm.trim() && (
              <Badge variant="default" className="gap-1">
                Busca: {keywords.length} palavra{keywords.length !== 1 ? "s" : ""}
                <X className="h-3 w-3 cursor-pointer" onClick={handleClearSearch} />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
