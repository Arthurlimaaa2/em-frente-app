import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SYSTEM_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "all", label: "Todos" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export default function LibraryFilters({ query, onQueryChange, type, onTypeChange, category, onCategoryChange }) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por título ou frase"
          className="h-11 rounded-full bg-card pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tipo</span>
        {TYPES.map((item) => (
          <Chip key={item.value} active={type === item.value} onClick={() => onTypeChange(item.value)}>
            {item.label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tema</span>
        <Chip active={category === "all"} onClick={() => onCategoryChange("all")}>
          Todos
        </Chip>
        {SYSTEM_CATEGORIES.map((item) => (
          <Chip key={item.key} active={category === item.key} onClick={() => onCategoryChange(item.key)}>
            {item.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
