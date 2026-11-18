import { useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CardRenderer from "@/components/cards/CardRenderer";
import CategorySelect from "@/components/CategorySelect";
import { StepsEditor } from "@/components/wizard/WizardFields";
import { cardPayloadFromForm, cleanSteps, updatePersonalCard } from "@/lib/cards";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "A", label: "A · Frase-âncora" },
  { value: "B", label: "B · Pensamento e resposta" },
  { value: "C", label: "C · Ação orientada" },
];

function formFromCard(card, defaultType) {
  return {
    type: card?.type ?? defaultType,
    title: card?.title ?? "",
    category_key: card?.category_key ?? "ansiedade",
    anchor_phrase: card?.anchor_phrase ?? "",
    thought: card?.thought ?? "",
    response: card?.response ?? "",
    situation: card?.situation ?? "",
    steps: card?.steps?.length ? card.steps : [""],
  };
}

export default function QuickCardForm({ initialCard, defaultType = "A", customCategories = [], onSaved, onCancel }) {
  const isEditing = Boolean(initialCard?.id);
  const [form, setForm] = useState(() => formFromCard(initialCard, defaultType));
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (form.type === "A" && !form.anchor_phrase.trim()) return "Escreva a frase do cartão.";
    if (form.type === "B" && (!form.thought.trim() || !form.response.trim())) return "Preencha o pensamento e a resposta.";
    if (form.type === "C" && (!form.situation.trim() || cleanSteps(form.steps).length === 0)) {
      return "Descreva a situação e pelo menos um passo.";
    }
    return null;
  }

  async function save() {
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        ...cardPayloadFromForm(form),
        type: form.type,
        status: initialCard?.status === "archived" ? "archived" : "active",
        steps: form.type === "C" ? cleanSteps(form.steps) : [],
      };
      const saved = isEditing
        ? await updatePersonalCard(initialCard, payload)
        : await base44.entities.PersonalCard.create(payload);
      toast.success(isEditing ? "Cartão atualizado." : "Cartão criado.");
      onSaved(saved ?? { ...initialCard, ...payload });
    } finally {
      setBusy(false);
    }
  }

  const previewCard = { ...form, type: form.type };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        {!isEditing && (
          <div className="space-y-2">
            <Label className="text-sm">Tipo de cartão</Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => update("type", item.value)}
                  aria-pressed={form.type === item.value}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    form.type === item.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="quick-title" className="text-sm">
            Nome do cartão <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="quick-title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Ex.: mensagem do trabalho"
            maxLength={80}
          />
        </div>

        {form.type === "A" && (
          <div className="space-y-2">
            <Label htmlFor="quick-phrase" className="text-sm">
              Frase-âncora
            </Label>
            <Textarea
              id="quick-phrase"
              rows={4}
              value={form.anchor_phrase}
              onChange={(event) => update("anchor_phrase", event.target.value)}
              placeholder="Uma frase curta que você queira reler."
            />
          </div>
        )}

        {form.type === "B" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="quick-thought" className="text-sm">
                Pensamento
              </Label>
              <Textarea
                id="quick-thought"
                rows={3}
                value={form.thought}
                onChange={(event) => update("thought", event.target.value)}
                placeholder="O que passa pela sua cabeça."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-response" className="text-sm">
                Resposta mais equilibrada
              </Label>
              <Textarea
                id="quick-response"
                rows={3}
                value={form.response}
                onChange={(event) => update("response", event.target.value)}
                placeholder="Uma leitura realista da mesma situação."
              />
            </div>
          </>
        )}

        {form.type === "C" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="quick-situation" className="text-sm">
                Situação
              </Label>
              <Textarea
                id="quick-situation"
                rows={3}
                value={form.situation}
                onChange={(event) => update("situation", event.target.value)}
                placeholder="Quando isso costuma acontecer."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Passos</Label>
              <StepsEditor steps={form.steps} onChange={(value) => update("steps", value)} />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label className="text-sm">Categoria</Label>
          <CategorySelect
            value={form.category_key}
            onChange={(value) => update("category_key", value)}
            customCategories={customCategories}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={save} disabled={busy}>
            {isEditing ? "Salvar alterações" : "Salvar cartão"}
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={busy}>
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm">Prévia</Label>
        <CardRenderer card={previewCard} />
      </div>
    </div>
  );
}
