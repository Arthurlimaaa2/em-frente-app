import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Archive, ArrowLeft, CalendarClock, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CardRenderer from "@/components/cards/CardRenderer";
import CategoryChip from "@/components/cards/CategoryChip";
import FavoriteButton from "@/components/cards/FavoriteButton";
import TypeBadge from "@/components/cards/TypeBadge";
import RevisionHistory from "@/components/my-cards/RevisionHistory";
import PdfExportButton from "@/components/share/PdfExportButton";
import { deletePersonalCard, formatDate, updatePersonalCard } from "@/lib/cards";

export const Route = createFileRoute("/_authed/meus-cartoes/$cardId")({
  head: () => ({ meta: [{ title: "Meu cartão — Em Frente" }] }),
  component: PersonalCardDetail,
});

function PersonalCardDetail() {
  const { cardId } = Route.useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setCard(await base44.entities.PersonalCard.get(cardId));
    } catch {
      setCard(null);
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleArchive() {
    if (!card || busy) return;
    setBusy(true);
    try {
      const nextStatus = card.status === "archived" ? "active" : "archived";
      await updatePersonalCard(card, { status: nextStatus });
      await load();
      toast.success(nextStatus === "archived" ? "Cartão arquivado." : "Cartão reativado.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!card) return;
    await deletePersonalCard(card);
    toast.success("Cartão excluído.");
    navigate({ to: "/meus-cartoes" });
  }

  if (loading) {
    return <div className="mx-auto w-full max-w-3xl px-4 py-16 text-sm text-muted-foreground sm:px-6">Carregando cartão…</div>;
  }

  if (!card) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <p className="font-heading text-2xl">Cartão não encontrado</p>
        <p className="mt-2 text-sm text-muted-foreground">Ele pode ter sido excluído, ou não pertence à sua conta.</p>
        <Button asChild variant="outline" className="mt-5">
          <Link to="/meus-cartoes">Voltar para meus cartões</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link to="/meus-cartoes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Meus cartões
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <TypeBadge type={card.type} />
        <CategoryChip categoryKey={card.category_key} />
        {card.status === "draft" && (
          <span className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-700">
            Rascunho
          </span>
        )}
        {card.status === "archived" && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-900">
            Arquivado
          </span>
        )}
      </div>

      <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{card.title}</h1>
      <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Atualizado em {formatDate(card.updated_date)}</span>
        {card.next_review_date && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            Próxima revisão: {formatDate(card.next_review_date)}
          </span>
        )}
      </p>

      <div className="mt-7">
        <CardRenderer card={card} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {card.type === "D" ? (
          <Button asChild>
            <Link to="/criar/enfrentamento" search={{ card: card.id }}>
              <Pencil className="mr-2 h-4 w-4" />
              {card.status === "draft" ? "Continuar preenchendo" : "Revisar e editar"}
            </Link>
          </Button>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            Este cartão pertence a um modelo antigo e fica preservado para o app futuro.
          </p>
        )}
        <FavoriteButton targetType="personal" targetId={card.id} withLabel />
        <PdfExportButton cards={[card]} label="Salvar PDF" />
        <Button variant="outline" onClick={toggleArchive} disabled={busy}>
          {card.status === "archived" ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reativar
            </>
          ) : (
            <>
              <Archive className="mr-2 h-4 w-4" />
              Arquivar
            </>
          )}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir este cartão?</AlertDialogTitle>
              <AlertDialogDescription>
                O cartão e o histórico de versões serão apagados definitivamente. Essa ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={remove}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-10">
        <RevisionHistory card={card} onRestored={load} />
      </div>
    </div>
  );
}
