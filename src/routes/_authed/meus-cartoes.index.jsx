import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PenLine, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/components/FavoritesProvider";
import CustomCategoryDialog from "@/components/my-cards/CustomCategoryDialog";
import LocalFavoritesBanner from "@/components/my-cards/LocalFavoritesBanner";
import PersonalCardTile from "@/components/my-cards/PersonalCardTile";
import PdfExportButton from "@/components/share/PdfExportButton";
import { SYSTEM_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/meus-cartoes/")({
  head: () => ({ meta: [{ title: "Minhas reflexões — Em Frente" }] }),
  component: MyCardsPage,
});

const TABS = [
  { value: "active", label: "Ativos" },
  { value: "draft", label: "Rascunhos" },
  { value: "favorite", label: "Favoritos" },
  { value: "archived", label: "Arquivados" },
];

function MyCardsPage() {
  const { favorites, refresh: refreshFavorites } = useFavorites();
  const [cards, setCards] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const load = useCallback(async () => {
    const [cardsPage, categoriesPage] = await Promise.all([
      base44.entities.PersonalCard.filter({}, { sort: "-updated_date", limit: 200 }),
      base44.entities.CustomCategory.filter({}, { sort: "sort_order", limit: 100 }),
    ]);
    setCards(cardsPage.items.filter((card) => card.type === "D"));
    setCustomCategories(categoriesPage.items);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const favoritePersonalIds = favorites.filter((f) => f.target_type === "personal").map((f) => f.target_id);

  const visibleCards = useMemo(() => {
    const term = query.trim().toLowerCase();
    const base =
      tab === "favorite" ? cards.filter((card) => favoritePersonalIds.includes(card.id)) : cards.filter((card) => card.status === tab);

    return base.filter((card) => {
      if (category !== "all" && card.category_key !== category) return false;
      if (!term) return true;
      return [card.title, card.anchor_phrase, card.thought, card.response, card.situation, ...(card.steps ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [cards, tab, query, category, favoritePersonalIds]);

  const pdfCards = cards.filter((card) => card.status !== "draft");
  const isEmpty = visibleCards.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Minhas reflexões</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Seus cartões são privados: só você consegue abrir, revisar ou apagar. Categorias e favoritos ficam
            sincronizados na sua conta.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/criar/enfrentamento">
              <PenLine className="mr-2 h-3.5 w-3.5" />
              Criar enfrentamento
            </Link>
          </Button>
          <CustomCategoryDialog categories={customCategories} onChange={load} />
          <PdfExportButton cards={pdfCards} customCategories={customCategories} className="h-9 text-sm" />
        </div>
      </div>

      <div className="mt-8">
        <LocalFavoritesBanner
          onImported={async () => {
            await refreshFavorites();
            await load();
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            aria-pressed={tab === item.value}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              tab === item.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nos meus cartões"
            className="h-10 rounded-full bg-card pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            aria-pressed={category === "all"}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              category === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
            )}
          >
            Todos os temas
          </button>
          {[...SYSTEM_CATEGORIES, ...customCategories.map((c) => ({ key: c.id, label: c.label }))].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategory(item.key)}
              aria-pressed={category === item.key}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                category === item.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carregando seus cartões…</p>
      ) : isEmpty ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm font-medium">
            {tab === "draft"
              ? "Nenhum rascunho por aqui."
              : tab === "archived"
                ? "Nenhum cartão arquivado."
                : tab === "favorite"
                  ? "Nenhum favorito ainda."
                  : "Você ainda não tem cartões ativos."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece pela biblioteca ou crie um cartão com as suas palavras.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/biblioteca">Ver biblioteca</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/criar/enfrentamento">Criar reflexão</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card) => (
            <PersonalCardTile key={card.id} card={card} customCategories={customCategories} />
          ))}
        </div>
      )}
    </div>
  );
}
