import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { clearLocalFavorites, readLocalFavorites } from "@/lib/favorites";

export default function LocalFavoritesBanner({ onImported }) {
  const [ids, setIds] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIds(readLocalFavorites());
  }, []);

  if (!ids.length) return null;

  async function importFavorites() {
    if (busy) return;
    setBusy(true);
    try {
      const { items } = await base44.entities.Favorite.filter({ target_type: "template" }, { limit: 200 });
      const existing = new Set(items.map((favorite) => favorite.target_id));
      const pending = ids.filter((id) => !existing.has(id));
      if (pending.length) {
        await base44.entities.Favorite.bulkCreate(
          pending.map((id) => ({ target_type: "template", target_id: id })),
        );
      }
      clearLocalFavorites();
      setIds([]);
      toast.success(`${pending.length} favoritos importados.`);
      onImported?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
      <p className="text-sm text-sky-900">
        Você tem {ids.length} {ids.length === 1 ? "favorito salvo" : "favoritos salvos"} neste dispositivo antes de
        entrar. Quer trazer para a sua conta?
      </p>
      <Button size="sm" variant="outline" className="ml-auto bg-white" onClick={importFavorites} disabled={busy}>
        <Download className="mr-2 h-3.5 w-3.5" />
        Importar
      </Button>
    </div>
  );
}
