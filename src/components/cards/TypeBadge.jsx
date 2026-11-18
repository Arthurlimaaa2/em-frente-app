import { cn } from "@/lib/utils";
import { CARD_TYPE_LABEL } from "@/lib/categories";

const TYPE_STYLE = {
  A: "border-amber-200 bg-amber-50 text-amber-900",
  B: "border-sky-200 bg-sky-50 text-sky-900",
  C: "border-emerald-200 bg-emerald-50 text-emerald-900",
  D: "border-violet-200 bg-violet-50 text-violet-900",
};

export default function TypeBadge({ type, showLabel = true, className }) {
  if (type === "D") return <span className={cn("text-xs font-medium text-primary", className)}>Reflexão</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        TYPE_STYLE[type] ?? TYPE_STYLE.A,
        className,
      )}
    >
      Tipo {type}
      {showLabel && <span className="font-normal opacity-75">· {CARD_TYPE_LABEL[type]}</span>}
    </span>
  );
}
