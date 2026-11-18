import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { formatDate, updatePersonalCard } from "@/lib/cards";

const RESTORABLE = [
  "title",
  "category_key",
  "anchor_phrase",
  "thought",
  "response",
  "situation",
  "steps",
  "emotions",
  "intensity_before",
  "intensity_after",
  "evidence_for",
  "evidence_against",
  "alternative_perspective",
  "next_review_date",
];

export default function RevisionHistory({ card, onRestored }) {
  const [revisions, setRevisions] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    base44.entities.CardRevision.filter({ card_id: card.id }, { sort: "-revision_number", limit: 5 }).then(({ items }) => {
      if (alive) setRevisions(items);
    });
    return () => {
      alive = false;
    };
  }, [card.id, card.updated_date]);

  async function restore(revision) {
    if (busy) return;
    setBusy(true);
    try {
      const snapshot = JSON.parse(revision.snapshot_json ?? "{}");
      const patch = {};
      RESTORABLE.forEach((field) => {
        if (snapshot[field] !== undefined) patch[field] = snapshot[field];
      });
      await updatePersonalCard(card, patch);
      toast.success("Versão restaurada.");
      onRestored();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="flex items-center gap-2 font-heading text-base">
        <History className="h-4 w-4 text-primary" />
        Histórico de revisões
      </p>
      <p className="mt-1 text-xs text-muted-foreground">Guardamos as 5 últimas versões anteriores deste cartão.</p>

      {revisions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhuma versão anterior ainda.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {revisions.map((revision) => (
            <li key={revision.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm">Versão {revision.revision_number}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDate(revision.created_date)} · {revision.title || "sem título"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => restore(revision)} disabled={busy}>
                Restaurar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
