import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Smartphone, Trash2 } from "lucide-react";
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
import ReminderForm from "@/components/reminders/ReminderForm";
import { Widgets, isAndroid } from "@/lib/native-widgets";
import { deleteAllPersonalData, downloadJson, exportPersonalData } from "@/lib/privacy";

export const Route = createFileRoute("/_authed/preferencias")({
  head: () => ({ meta: [{ title: "Preferências e privacidade — Em Frente" }] }),
  component: PreferencesPage,
});

function PreferencesPage() {
  const [cards, setCards] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const page = await base44.entities.PersonalCard.filter({ status: "active" }, { sort: "title", limit: 100 });
    setCards(page.items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleExport() {
    if (busy) return;
    setBusy(true);
    try {
      const data = await exportPersonalData();
      data.DayCounter = isAndroid() ? await Widgets.getCounter() : JSON.parse(localStorage.getItem("em-frente-counter") || "null");
      downloadJson(data, `meus-dados-${new Date().toISOString().slice(0, 10)}.json`);
      toast.success("Exportação baixada.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (isAndroid()) await Widgets.clearCounter();
    else localStorage.removeItem("em-frente-counter");
    await deleteAllPersonalData();
    await load();
    toast.success("Seus dados pessoais foram apagados.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-3xl sm:text-4xl">Preferências e privacidade</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Controle lembretes, exporte o que é seu e apague quando quiser.
      </p>

      <section className="mt-8 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <h2 className="text-xl">Lembretes</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          O aviso aparece dentro do app quando você abre no horário escolhido. Notificação com o app fechado depende do
          aplicativo Android instalado.
        </p>
        <div className="mt-6">
          <ReminderForm cards={cards} />
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <h2 className="flex items-center gap-2 text-xl">
          <Smartphone className="h-4 w-4 text-primary" />
          Widget da tela inicial
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Na tela inicial do Android, abra Widgets e procure Em Frente. Reflexão rápida abre uma nova reflexão;
          Meus dias mostra o nome e a contagem do marco que você configurou no início do app.
        </p>
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <h2 className="text-xl">Seus dados</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Exportar gera um arquivo com seus cartões, revisões, favoritos, categorias e preferências. Apagar remove tudo
          isso da sua conta — sua conta de acesso continua existindo.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport} disabled={busy}>
            <Download className="mr-2 h-4 w-4" />
            Exportar meus dados
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar meus dados pessoais
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apagar todos os seus dados pessoais?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cartões, revisões, favoritos, categorias e preferências serão apagados definitivamente. Não é possível
                  desfazer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Apagar tudo</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-border bg-secondary/50 p-5 text-sm leading-relaxed text-muted-foreground sm:p-7">
        <h2 className="text-base text-foreground">Limites deste recurso</h2>
        <p className="mt-2">
          Este aplicativo é psicoeducativo e de autocuidado. Ele não faz diagnóstico, não mede eficácia clínica e não
          substitui psicoterapia. Em situação de crise, procure ajuda imediatamente — no Brasil, CVV 188.
        </p>
      </section>
    </div>
  );
}
