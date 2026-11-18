import { ShieldCheck } from "lucide-react";
import { SYSTEM_CATEGORIES } from "@/lib/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CategorySelect({ value, onChange, customCategories = [], id }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Escolher categoria" />
      </SelectTrigger>
      <SelectContent>
        {SYSTEM_CATEGORIES.map((category) => (
          <SelectItem key={category.key} value={category.key}>
            {category.label}
          </SelectItem>
        ))}
        {customCategories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PrivacyNote({ children }) {
  return (
    <p className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </p>
  );
}
