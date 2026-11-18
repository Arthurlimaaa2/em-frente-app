import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const COLORS = [
  { value: "stone", label: "Neutro", className: "bg-stone-200" },
  { value: "rose", label: "Rosa", className: "bg-rose-200" },
  { value: "teal", label: "Verde-água", className: "bg-teal-200" },
  { value: "violet", label: "Lilás", className: "bg-violet-200" },
  { value: "amber", label: "Âmbar", className: "bg-amber-200" },
];

export default function CustomCategoryDialog({ categories, onChange }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("stone");
  const [busy, setBusy] = useState(false);

  async function create() {
    if (!label.trim() || busy) return;
    setBusy(true);
    try {
      await base44.entities.CustomCategory.create({ label: label.trim(), color, sort_order: categories.length });
      setLabel("");
      setColor("stone");
      await onChange();
      toast.success("Categoria criada");
    } finally {
      setBusy(false);
    }
  }

  async function remove(category) {
    await base44.entities.CustomCategory.delete(category.id);
    await onChange();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Minhas categorias</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-label">Nova categoria</Label>
            <div className="flex gap-2">
              <Input
                id="category-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Ex.: trabalho"
                maxLength={40}
              />
              <Button onClick={create} disabled={busy || !label.trim()}>
                Criar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {COLORS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setColor(item.value)}
                aria-pressed={color === item.value}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                  color === item.value ? "border-primary text-foreground" : "border-border text-muted-foreground",
                )}
              >
                <span className={cn("h-3 w-3 rounded-full", item.className)} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma categoria pessoal ainda.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                  <span className="text-sm">{category.label}</span>
                  <Button variant="ghost" size="icon" onClick={() => remove(category)} aria-label="Excluir categoria">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
