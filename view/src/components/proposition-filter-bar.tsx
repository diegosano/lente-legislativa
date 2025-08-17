import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { ThemesCombobox } from "./themes-combobox"
import { THEMES } from "@/lib/constants"

interface PropositionFilterBarProps {
  selectedTypes: string[]
  selectedYear: number
  selectedTheme: string
  onTypeToggle: (type: string) => void
  onYearChange: (year: number) => void
  onThemeChange: (theme: string) => void
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
  selectedTheme,
  onTypeToggle,
  onYearChange,
  onThemeChange,
  onClearFilters,
}: PropositionFilterBarProps) {
  const hasActiveFilters = selectedTypes.length > 0 || selectedYear !== new Date().getFullYear() || selectedTheme

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="space-y-3">
          <label className="text-sm font-medium block">Tema</label>
          <ThemesCombobox value={selectedTheme} onChange={onThemeChange} />
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
                <X className="h-3 w-3 cursor-pointer pointer-events-auto!" onClick={() => onTypeToggle(type)} />
              </Badge>
            ))}

            {selectedYear !== new Date().getFullYear() && (
              <Badge variant="default" className="gap-1">
                {selectedYear}
                <X className="h-3 w-3 cursor-pointer pointer-events-auto!" onClick={() => onYearChange(new Date().getFullYear())} />
              </Badge>
            )}

            {selectedTheme && (
              <Badge variant="default" className="gap-1">
                {THEMES.find(t => t.value === selectedTheme)?.label}
                <X className="h-3 w-3 cursor-pointer pointer-events-auto!" onClick={() => onThemeChange("")} />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}