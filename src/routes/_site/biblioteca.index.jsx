import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { D_SUGGESTION_GUIDE } from "@/lib/d-suggestions";

export const Route = createFileRoute("/_site/biblioteca/")({
  head: () => ({
    meta: [
      { title: "Sugestões para a reflexão — Em Frente" },
      {
        name: "description",
        content: "Sugestões curtas para preencher uma reflexão no Em Frente.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Cartão D</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Sugestões para escrever</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Use uma frase como ponto de partida e adapte para a sua situação. Não existe resposta certa nem necessidade
            de preencher tudo.
          </p>
        </div>
        <Button asChild>
          <Link to="/criar/enfrentamento">
            Criar reflexão
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {D_SUGGESTION_GUIDE.map((item) => (
          <article key={item.title} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <h2 className="font-heading text-lg">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-dashed border-primary/30 bg-primary/[0.03] p-6 text-sm leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">Como usar</p>
        <p className="mt-2">
          Escolha uma sugestão apenas se ela combinar com você. Se não combinar, escreva do seu jeito ou avance sem
          preencher a etapa opcional.
        </p>
      </div>
    </div>
  );
}
