import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/FavoritesProvider";
import { cn } from "@/lib/utils";

export default function FavoriteButton({ targetType = "template", targetId, className, withLabel = false }) {
  const { isFavorite, toggle } = useFavorites();
  const [busy, setBusy] = useState(false);
  const active = isFavorite(targetType, targetId);

  async function handle(event) {
    event.preventDefault();
    event.stopPropagation();
    if (busy || !targetId) return;
    setBusy(true);
    try {
      await toggle(targetType, targetId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-border bg-background text-muted-foreground hover:border-rose-200 hover:text-rose-700",
        className,
      )}
    >
      <Heart className={cn("h-3.5 w-3.5", active && "fill-rose-600 text-rose-600")} />
      {withLabel && <span>{active ? "Favorito" : "Favoritar"}</span>}
    </button>
  );
}
