import { cn } from "@/lib/utils";
import { categoryChipStyle, categoryLabel } from "@/lib/categories";

const CUSTOM_COLORS = {
  stone: "border-stone-200 bg-stone-50 text-stone-800",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  teal: "border-teal-200 bg-teal-50 text-teal-900",
  violet: "border-violet-200 bg-violet-50 text-violet-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
};

export default function CategoryChip({ categoryKey, customCategories = [], className }) {
  const custom = customCategories.find((category) => category.id === categoryKey);
  const style = custom ? CUSTOM_COLORS[custom.color] ?? CUSTOM_COLORS.stone : categoryChipStyle(categoryKey);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
    >
      {categoryLabel(categoryKey, customCategories)}
    </span>
  );
}
