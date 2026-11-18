import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CardC({ card, className }) {
  const steps = card.steps ?? [];
  const [done, setDone] = useState(() => steps.map(() => false));

  function toggle(index) {
    setDone((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  function reset() {
    setDone(steps.map(() => false));
  }

  return (
    <div className={cn("rounded-3xl border border-emerald-200/70 bg-emerald-50/50 p-6 sm:p-8", className)}>
      {card.situation && (
        <div className="mb-5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-900/70">Situação</span>
          <p className="mt-1 text-base text-foreground">{card.situation}</p>
        </div>
      )}

      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-pressed={done[index]}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm transition-colors",
                done[index] ? "border-emerald-300 text-muted-foreground line-through" : "border-border hover:border-emerald-300",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                  done[index] ? "border-emerald-600 bg-emerald-600 text-white" : "border-muted-foreground/40",
                )}
              >
                {done[index] && <Check className="h-3 w-3" />}
              </span>
              <span>{step}</span>
            </button>
          </li>
        ))}
      </ol>

      <Button variant="ghost" size="sm" className="mt-4" onClick={reset}>
        <RotateCcw className="mr-2 h-3.5 w-3.5" />
        Reiniciar checklist
      </Button>
    </div>
  );
}
