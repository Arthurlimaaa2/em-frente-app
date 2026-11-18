import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CardRenderer from "@/components/cards/CardRenderer";
import CategoryChip from "@/components/cards/CategoryChip";
import FavoriteButton from "@/components/cards/FavoriteButton";
import TypeBadge from "@/components/cards/TypeBadge";
import { PrivacyNote } from "@/components/CategorySelect";
import { useAuth } from "@/lib/AuthContext";
import { copyTemplateToPersonal } from "@/lib/cards";
import { getTemplateById } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/biblioteca/$templateId")({
  loader: async ({ params }) => {
    const template = await getTemplateById({ data: { id: params.templateId } });
    if (!template) throw notFound();
    return template;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Cartão"} — Em Frente` },
      { name: "description", content: loaderData?.anchor_phrase || loaderData?.thought || "Cartão da biblioteca." },
    ],
  }),
  component: TemplateDetail,
});

function TemplateDetail() {
  const template = Route.useLoaderData();
  const { isAuthenticated, navigateToLogin } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function copyCard() {
    if (!isAuthenticated) {
      toast.info("Entre na sua conta para salvar uma cópia deste cartão.");
      navigateToLogin();
      return;
    }
    setBusy(true);
    try {
      const created = await copyTemplateToPersonal(template);
      toast.success("Cópia criada em Meus cartões.");
      navigate({ to: "/meus-cartoes/$cardId", params: { cardId: created.id } });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link to="/biblioteca" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Biblioteca
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <TypeBadge type={template.type} />
        <CategoryChip categoryKey={template.category_key} />
      </div>
      <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{template.title}</h1>

      <div className="mt-7">
        <CardRenderer card={template} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <FavoriteButton targetType="template" targetId={template.id} withLabel />
        <Button variant="outline" onClick={copyCard} disabled={busy}>
          <Copy className="mr-2 h-4 w-4" />
          Salvar cópia em meus cartões
        </Button>
      </div>

      <div className="mt-6">
        <PrivacyNote>
          Este é um cartão da biblioteca e não pode ser alterado. Ao salvar uma cópia, ela passa a ser sua: você edita,
          revisa e pode apagar quando quiser.
        </PrivacyNote>
      </div>
    </div>
  );
}
