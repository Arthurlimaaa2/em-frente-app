import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { PrivacyNote } from "@/components/CategorySelect";
import EnfrentamentoWizard from "@/components/wizard/EnfrentamentoWizard";

export const Route = createFileRoute("/_authed/criar/enfrentamento")({
  validateSearch: (search) => ({ card: typeof search.card === "string" ? search.card : undefined }),
  head: () => ({ meta: [{ title: "Criar enfrentamento — Em Frente" }] }),
  component: WizardPage,
});

function WizardPage() {
  const { card: cardId } = Route.useSearch();
  const navigate = useNavigate();
  const [initialCard, setInitialCard] = useState(null);
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(Boolean(cardId));

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const categoriesPage = await base44.entities.CustomCategory.filter({}, { sort: "sort_order", limit: 100 });
        if (!alive) return;
        setCustomCategories(categoriesPage.items);

        if (cardId) {
          try {
          const found = await base44.entities.PersonalCard.get(cardId);
          if (alive) setInitialCard(found);
          } catch {
            toast.error("Cartão não encontrado. Vamos começar um novo.");
          }
        }
      } catch (error) {
        void error;
        if (alive) {
          setCustomCategories([]);
          toast.error("Não foi possível carregar seus dados locais. Tente novamente.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [cardId]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate({ to: "/meus-cartoes" })}>
        <ArrowLeft className="mr-2 h-3.5 w-3.5" />
        Meus cartões
      </Button>

      <h1 className="text-3xl sm:text-4xl">{initialCard ? "Revisar meu enfrentamento" : "Criar meu enfrentamento"}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Sete etapas curtas. A partir da segunda, tudo é opcional — você decide o que faz sentido responder.
      </p>

      <div className="mt-5">
        <PrivacyNote>
          O que você escrever aqui fica privado na sua conta. Nada é enviado para fora do app e nenhum texto é reescrito
          sem a sua confirmação.
        </PrivacyNote>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <div className="mt-8">
          <EnfrentamentoWizard
            initialCard={initialCard}
            customCategories={customCategories}
            onFinished={(savedId) => navigate({ to: "/meus-cartoes/$cardId", params: { cardId: savedId } })}
          />
        </div>
      )}
    </div>
  );
}
