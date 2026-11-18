import { Link } from "@tanstack/react-router";
import CategoryChip from "@/components/cards/CategoryChip";
import FavoriteButton from "@/components/cards/FavoriteButton";
import TypeBadge from "@/components/cards/TypeBadge";
import { cardExcerpt } from "@/lib/cards";

export default function TemplateTile({ template, customCategories = [] }) {
  return (
    <article
      className="flex flex-col rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
      style={{ contentVisibility: "auto", containIntrinsicSize: "360px" }}
    >
      <Link
        to="/biblioteca/$templateId"
        params={{ templateId: template.id }}
        className="flex flex-1 flex-col focus-visible:outline-none"
      >
        <div className="mb-3">
          <TypeBadge type={template.type} showLabel={false} />
        </div>
        <h3 className="text-lg leading-snug">{template.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {cardExcerpt(template)}
        </p>
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2">
        <CategoryChip categoryKey={template.category_key} customCategories={customCategories} />
        <FavoriteButton targetType="template" targetId={template.id} />
      </div>
    </article>
  );
}
