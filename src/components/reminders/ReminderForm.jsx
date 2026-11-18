import { useEffect, useState } from "react";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WEEKDAYS } from "@/lib/categories";
import { cn } from "@/lib/utils";

const EMPTY_PREF = {
  enabled: false,
  time_local: "20:00",
  weekdays: ["1", "2", "3", "4", "5"],
  selection_mode: "random",
  selected_card_id: "",
  show_sensitive_on_lockscreen: false,
};

export default function ReminderForm({ cards = [] }) {
  const [pref, setPref] = useState(EMPTY_PREF);
  const [prefId, setPrefId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    base44.entities.ReminderPreference.filter({}, { sort: "-created_date", limit: 1 }).then(({ items }) => {
      if (!alive) return;
      const current = items[0] ?? null;
      if (current) {
        setPrefId(current.id);
        setPref({
          enabled: Boolean(current.enabled),
          time_local: current.time_local || "20:00",
          weekdays: current.weekdays?.length ? current.weekdays : EMPTY_PREF.weekdays,
          selection_mode: current.selection_mode || "random",
          selected_card_id: current.selected_card_id || "",
          show_sensitive_on_lockscreen: Boolean(current.show_sensitive_on_lockscreen),
        });
      }
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  function update(field, value) {
    setPref((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDay(day) {
    update("weekdays", pref.weekdays.includes(day) ? pref.weekdays.filter((d) => d !== day) : [...pref.weekdays, day].sort());
  }

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      const payload = { ...pref, selected_card_id: pref.selection_mode === "fixed" ? pref.selected_card_id : "" };
      if (prefId) await base44.entities.ReminderPreference.update(prefId, payload);
      else {
        const created = await base44.entities.ReminderPreference.create(payload);
        setPrefId(created.id);
      }
      toast.success("Preferências de lembrete salvas.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando preferências…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Lembrete diário</p>
          <p className="text-xs leading-relaxed text-muted-foreground">Desligado por padrão. Você escolhe o horário.</p>
        </div>
        <Switch checked={pref.enabled} onCheckedChange={(value) => update("enabled", value)} aria-label="Ativar lembrete" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminder-time" className="text-sm">
          Horário
        </Label>
        <input
          id="reminder-time"
          type="time"
          value={pref.time_local}
          onChange={(event) => update("time_local", event.target.value)}
          className="h-10 w-36 rounded-xl border border-input bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Dias</Label>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              aria-pressed={pref.weekdays.includes(day.value)}
              className={cn(
                "h-9 w-11 rounded-xl border text-xs font-medium transition-colors",
                pref.weekdays.includes(day.value)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Qual cartão mostrar</Label>
        <Select value={pref.selection_mode} onValueChange={(value) => update("selection_mode", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="random">Um cartão aleatório da biblioteca</SelectItem>
            <SelectItem value="favorite">Um dos meus favoritos</SelectItem>
            <SelectItem value="fixed">Um cartão específico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pref.selection_mode === "fixed" && (
        <div className="space-y-2">
          <Label className="text-sm">Cartão</Label>
          <Select value={pref.selected_card_id || ""} onValueChange={(value) => update("selected_card_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Escolher cartão" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {cards.length === 0 && <p className="text-xs text-muted-foreground">Você ainda não tem cartões próprios ativos.</p>}
        </div>
      )}

      <div className="flex items-start justify-between gap-4 rounded-2xl border border-border px-4 py-3">
        <div>
          <p className="text-sm font-medium">Mostrar conteúdo na tela bloqueada</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Desligado por padrão: a notificação diz apenas “Seu lembrete está disponível”.
          </p>
        </div>
        <Switch
          checked={pref.show_sensitive_on_lockscreen}
          onCheckedChange={(value) => update("show_sensitive_on_lockscreen", value)}
          aria-label="Mostrar conteúdo na tela bloqueada"
        />
      </div>

      <div className="rounded-2xl border border-border bg-secondary/50 p-4">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <BellRing className="h-3.5 w-3.5" />
          Prévia da notificação
        </p>
        <div className="mt-2 rounded-xl bg-card px-3 py-2 text-sm">
          <p className="font-medium">Em Frente</p>
          <p className="text-muted-foreground">
            {pref.show_sensitive_on_lockscreen ? "Seu cartão de hoje está pronto." : "Seu lembrete está disponível."}
          </p>
        </div>
      </div>

      <Button onClick={save} disabled={busy}>
        Salvar preferências
      </Button>
    </div>
  );
}
