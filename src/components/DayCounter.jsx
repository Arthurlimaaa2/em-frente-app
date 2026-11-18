import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { todayISO, elapsedDays } from "@/lib/day-counter";
import { Widgets, isAndroid } from "@/lib/native-widgets";

export default function DayCounter() {
  const [counter, setCounter] = useState(null);
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    let active = true;
    const read = async () => {
      try {
        const value = isAndroid() ? await Widgets.getCounter() : JSON.parse(localStorage.getItem("em-frente-counter") || "null");
        if (active) { setCounter(value?.start ? value : null); setReady(true); }
      } catch { if(active) setMessage("Não foi possível carregar o contador. Tente reabrir o app."); }
    };
    read();
    const tick = () => setNow(new Date());
    const timer = setInterval(tick, 60000);
    document.addEventListener("visibilitychange", tick);
    return () => { active = false; clearInterval(timer); document.removeEventListener("visibilitychange",tick); };
  }, []);
  async function save(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = { name: String(data.get("name")).trim(), start: String(data.get("start")) };
    if (!value.name || !value.start || value.start > todayISO()) { setMessage("Escolha um nome e uma data até hoje."); return; }
    setBusy(true);
    try {
      if (isAndroid()) await Widgets.setCounter(value);
      else localStorage.setItem("em-frente-counter", JSON.stringify(value));
      setCounter(value); setEditing(false); setMessage("Contador salvo.");
    } catch { setMessage("Não foi possível salvar. Tente novamente."); }
    finally { setBusy(false); }
  }
  async function pin(kind) {
    try {
      const result = await Widgets.pin({kind});
      setMessage(result.supported ? "Confirme a adição na tela do Android." : "Na tela inicial, pressione um espaço vazio e procure Em Frente em Widgets.");
    } catch { setMessage("Adicione pela tela inicial do Android: pressione um espaço vazio e abra Widgets."); }
  }
  return <section id="contador" className="mx-auto max-w-3xl px-4 py-8 scroll-mt-24">
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Meus dias</h2>
      <p className="mt-1 text-sm text-muted-foreground">Um marco que importa para você.</p>
      {counter && !editing && <div className="py-6 text-center">
        <p className="break-words text-primary font-medium">{counter.name}</p>
        <p className="my-2 text-6xl font-semibold text-primary">{elapsedDays(counter.start, now)}</p>
        <p className="text-muted-foreground">dias</p>
        <Button className="mt-4" variant="ghost" onClick={() => setEditing(true)}>Editar contador</Button>
      </div>}
      {ready && (!counter || editing) && <form onSubmit={save} className="mt-5 space-y-4">
        <label className="block text-sm font-medium">Nome do contador
          <input name="name" required maxLength={60} defaultValue={counter?.name || ""} placeholder="Meu recomeço" className="mt-2 w-full rounded-xl border bg-background p-3"/>
        </label>
        <label className="block text-sm font-medium">Data inicial
          <input type="date" name="start" required max={todayISO(now)} defaultValue={counter?.start || todayISO(now)} className="mt-2 block min-w-0 w-full rounded-xl border bg-background p-3"/>
        </label>
        <p className="text-xs text-muted-foreground">A contagem começa em zero na data escolhida.</p>
        <Button disabled={busy} type="submit">{busy ? "Salvando…" : "Salvar contador"}</Button>
        {counter && <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>}
      </form>}
      {isAndroid() && <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => pin("quick")}>Atalho de reflexão</Button>
        {counter && <Button variant="outline" onClick={() => pin("counter")}>Widget de dias</Button>}
      </div>}
      <p role="status" className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  </section>;
}

