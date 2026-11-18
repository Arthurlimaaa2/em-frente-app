import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FileDown, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import DayCounter from "@/components/DayCounter";
import ReminderBanner from "@/components/home/ReminderBanner";
import { D_SUGGESTION_GUIDE } from "@/lib/d-suggestions";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Em Frente — reflexão" },
      {
        name: "description",
        content: "Crie um reflexão com perguntas guiadas, sugestões de escrita e salvamento local em PDF.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <ReminderBanner />

      <section className="border-b border-border/70 bg-gradient-to-br from-secondary via-background to-accent/60">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary">
            Em Frente · reflexão
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Sempre há um novo começo possível.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Responda perguntas curtas com as suas palavras, use uma sugestão quando travar e salve o resultado em PDF
            para reler quando precisar.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/criar/enfrentamento">
                <PenLine className="mr-2 h-4 w-4" />
                Iniciar reflexão
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-background">
              <Link to="/biblioteca">
                Ver sugestões
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            O conteúdo é seu. O app não diagnostica nem substitui atendimento profissional.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl">Quando faltar uma frase, comece por aqui</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            As sugestões são apenas pontos de partida. Você pode adaptar, apagar ou deixar qualquer etapa em branco.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {D_SUGGESTION_GUIDE.map((item) => (
            <article key={item.title} className="rounded-3xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 rounded-3xl bg-primary p-8 text-primary-foreground sm:grid-cols-3 sm:p-10">
          <div className="sm:col-span-2">
            <h2 className="text-2xl text-primary-foreground">Seu cartão, em sete etapas curtas.</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
              Situação, pensamento, emoções, exame dos fatos, resposta alternativa, ação concreta e resumo.
            </p>
          </div>
          <div className="flex items-center sm:justify-end">
            <Button asChild size="lg" variant="secondary">
              <Link to="/criar/enfrentamento">
                Começar agora
                <PenLine className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: "Sugestões simples", text: "Exemplos curtos aparecem apenas quando podem ajudar." },
            { icon: PenLine, title: "Suas palavras", text: "Nada é enviado para uma IA nem reescrito sem você escolher." },
            { icon: FileDown, title: "PDF local", text: "Salve o cartão no dispositivo para consultar depois." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-heading text-base text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <DayCounter />
    </div>
  );
}
