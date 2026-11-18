import { Link } from "@tanstack/react-router";
import CategoryChip from "@/components/cards/CategoryChip";
import FavoriteButton from "@/components/cards/FavoriteButton";
import TypeBadge from "@/components/cards/TypeBadge";
import { cardExcerpt, formatDate } from "@/lib/cards";

const STATUS_LABEL = {
  draft: { text: "Rascunho", className: "border-stone-200 bg-stone-100 text-stone-700" },
  archived: { text: "Arquivado", className: "border-amber-200 bg-amber-50 text-amber-900" },
};

export default function PersonalCardTile({ card, customCategories = [] }) {
  const status = STATUS_LABEL[card.status];

  return (
    <article className="flex flex-col rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <Link
        to="/meus-cartoes/$cardId"
        params={{ cardId: card.id }}
        className="flex flex-1 flex-col focus-visible:outline-none"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TypeBadge type={card.type} showLabel={false} />
          {status && (
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.className}`}>
              {status.text}
            </span>
          )}
        </div>
        <h3 className="text-lg leading-snug">{card.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{cardExcerpt(card)}</p>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <CategoryChip categoryKey={card.category_key} customCategories={customCategories} />
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">{formatDate(card.updated_date)}</span>
          <FavoriteButton targetType="personal" targetId={card.id} />
        </div>
      </div>
    </article>
  );
}
