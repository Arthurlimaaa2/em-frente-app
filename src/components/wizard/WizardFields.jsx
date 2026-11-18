import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMOTIONS } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function Question({ label, hint, value, onChange, placeholder, rows = 4, optional }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || input.value === value || document.activeElement === input) return;
    input.value = value;
  }, [value]);

  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-sm">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">(opcional)</span>}
      </Label>
      {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      <textarea
        ref={inputRef}
        aria-label={label}
        defaultValue={value}
        placeholder={placeholder}
        rows={rows}
        className="min-h-[60px] w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
        onInput={(event) => onChange(event.currentTarget.value)}
      />
    </div>
  );
}

export function SuggestionChips({ suggestions, onSelect, label = "Sugestões para começar" }) {
  if (!suggestions?.length) return null;

  return (
    <div className="space-y-2 rounded-2xl border border-dashed border-primary/25 bg-primary/[0.03] p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            aria-label={`Usar sugestão: ${suggestion}`}
            onClick={() => onSelect(suggestion)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs leading-relaxed text-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EmotionPicker({ value, onChange }) {
  function toggle(emotion) {
    onChange(value.includes(emotion) ? value.filter((item) => item !== emotion) : [...value, emotion]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {EMOTIONS.map((emotion) => {
        const active = value.includes(emotion);
        return (
          <button
            key={emotion}
            type="button"
            onClick={() => toggle(emotion)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {emotion}
          </button>
        );
      })}
    </div>
  );
}

export function StepsEditor({ steps, onChange, max = 5 }) {
  function update(index, value) {
    onChange(steps.map((step, i) => (i === index ? value : step)));
  }

  function add() {
    if (steps.length >= max) return;
    onChange([...steps, ""]);
  }

  function remove(index) {
    const next = steps.filter((_, i) => i !== index);
    onChange(next.length ? next : [""]);
  }

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-5 text-sm text-muted-foreground">{index + 1}.</span>
          <Input
            aria-label={`Passo ${index + 1}`}
            defaultValue={step}
            placeholder="Um passo pequeno e possível"
            onInput={(event) => update(index, event.currentTarget.value)}
          />
          <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remover passo">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      {steps.length < max && (
        <Button variant="ghost" size="sm" onClick={add}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Adicionar passo
        </Button>
      )}
    </div>
  );
}
