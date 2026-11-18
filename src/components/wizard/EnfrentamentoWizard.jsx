import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Info, Save } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import CategorySelect from "@/components/CategorySelect";
import { EmotionPicker, Question, StepsEditor, SuggestionChips } from "@/components/wizard/WizardFields";
import { EMOTIONS } from "@/lib/categories";
import { EMPTY_FORM_D, cardPayloadFromForm } from "@/lib/cards";
import { D_SUGGESTIONS } from "@/lib/d-suggestions";

const STEPS = [
  { title: "Situação", hint: "O que aconteceu ou pode acontecer? Descreva de forma concreta, sem julgar." },
  { title: "Pensamento", hint: "Que frase passou pela sua cabeça nessa hora?" },
  { title: "Emoções", hint: "Opcional. Nomear o que você sentiu ajuda, mas não é obrigatório." },
  { title: "Examinar", hint: "Perguntas para olhar de outro ângulo. Responda só o que fizer sentido." },
  { title: "Resposta alternativa", hint: "Uma frase equilibrada, nas suas palavras — sem prometer que tudo vai dar certo." },
  { title: "Ação concreta", hint: "Um passo pequeno, viável e específico para hoje." },
  { title: "Resumo", hint: "Dê um nome ao cartão, escolha a categoria e revise antes de salvar." },
];

function normalize(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formFromCard(card) {
  if (!card) return EMPTY_FORM_D;
  return {
    title: card.title ?? "",
    category_key: card.category_key ?? "ansiedade",
    situation: card.situation ?? "",
    thought: card.thought ?? "",
    emotions: card.emotions ?? [],
    intensity_before: card.intensity_before ?? 5,
    evidence_for: card.evidence_for ?? "",
    evidence_against: card.evidence_against ?? "",
    alternative_perspective: card.alternative_perspective ?? "",
    response: card.response ?? "",
    anchor_phrase: card.anchor_phrase ?? "",
    steps: card.steps?.length ? card.steps : [""],
    intensity_after: card.intensity_after,
    next_review_date: card.next_review_date ?? "",
  };
}

export default function EnfrentamentoWizard({ initialCard, customCategories = [], onFinished }) {
  const [form, setForm] = useState(() => formFromCard(initialCard));
  const [step, setStep] = useState(0);
  const [cardId, setCardId] = useState(initialCard?.id ?? null);
  const [busy, setBusy] = useState(false);
  const navigationGuard = useRef(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function persist(status) {
    const payload = { ...cardPayloadFromForm(form), type: "D", status };
    if (cardId) return base44.entities.PersonalCard.update(cardId, payload);
    const created = await base44.entities.PersonalCard.create(payload);
    setCardId(created.id);
    return created;
  }

  function goNext() {
    if (busy) return;
    if (step === 0 && !form.situation.trim()) {
      toast.error("Descreva a situação para continuar.");
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    if (busy) return;
    setStep((current) => Math.max(current - 1, 0));
  }

  function triggerNavigation(action) {
    if (navigationGuard.current) return;
    navigationGuard.current = true;
    action();
    window.setTimeout(() => {
      navigationGuard.current = false;
    }, 250);
  }

  async function finish(status) {
    setBusy(true);
    try {
      const saved = await persist(status);
      if (!saved?.id) throw new Error("O cartão não foi retornado pelo armazenamento local.");
      toast.success(status === "active" ? "Cartão completo salvo." : "Rascunho salvo. Você pode continuar depois.");
      onFinished(saved.id, status);
    } catch (error) {
      void error;
      toast.error("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  const matchedEmotion = EMOTIONS.find((emotion) => normalize(form.thought).includes(normalize(emotion)));
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Etapa {step + 1} de {STEPS.length} · {STEPS[step].title}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{STEPS[step].hint}</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
        {step === 0 && (
          <div className="space-y-4">
            <Question
              label="O que aconteceu ou pode acontecer?"
              value={form.situation}
              onChange={(value) => update("situation", value)}
              placeholder="Ex.: preciso responder a uma mensagem do trabalho e estou adiando há dois dias."
              rows={5}
            />
            <SuggestionChips suggestions={D_SUGGESTIONS.situation} onSelect={(value) => update("situation", value)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Question
              label="Que frase passou pela sua cabeça?"
              value={form.thought}
              onChange={(value) => update("thought", value)}
              placeholder="Ex.: se eu responder agora, vou falar algo errado."
              rows={4}
            />
            <SuggestionChips suggestions={D_SUGGESTIONS.thought} onSelect={(value) => update("thought", value)} />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => update("thought", "Ainda não sei")}>
                Ainda não sei
              </Button>
            </div>
            {matchedEmotion && form.thought.trim() && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                <p className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    “{matchedEmotion}” parece descrever o que você sentiu, não o que você pensou. Você decide: pode
                    manter como pensamento ou registrar como emoção.
                  </span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-white"
                  onClick={() => {
                    update("emotions", [...new Set([...form.emotions, matchedEmotion])]);
                    update("thought", "");
                  }}
                >
                  Registrar como emoção
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                Emoções <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <EmotionPicker value={form.emotions} onChange={(value) => update("emotions", value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">
                Intensidade agora: <span className="font-semibold">{form.intensity_before}/10</span>
              </Label>
              <Slider
                value={[form.intensity_before ?? 0]}
                min={0}
                max={10}
                step={1}
                onValueChange={([value]) => update("intensity_before", value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Question
              label="O que sustenta esse pensamento?"
              optional
              value={form.evidence_for}
              onChange={(value) => update("evidence_for", value)}
              placeholder="Fatos que apontam para isso."
              rows={3}
            />
            <SuggestionChips
              suggestions={D_SUGGESTIONS.evidence_for}
              onSelect={(value) => update("evidence_for", value)}
            />
            <Question
              label="O que aponta para outro desfecho?"
              optional
              value={form.evidence_against}
              onChange={(value) => update("evidence_against", value)}
              placeholder="Fatos, experiências anteriores, exceções."
              rows={3}
            />
            <SuggestionChips
              suggestions={D_SUGGESTIONS.evidence_against}
              onSelect={(value) => update("evidence_against", value)}
            />
            <Question
              label="O que você diria a um amigo na mesma situação?"
              optional
              value={form.alternative_perspective}
              onChange={(value) => update("alternative_perspective", value)}
              rows={3}
            />
            <SuggestionChips
              suggestions={D_SUGGESTIONS.alternative_perspective}
              onSelect={(value) => update("alternative_perspective", value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <Question
              label="Uma resposta mais equilibrada"
              hint="Realista, sem prometer que a situação terminará bem. Use as suas palavras."
              value={form.response}
              onChange={(value) => update("response", value)}
              placeholder="Ex.: posso responder de forma simples e corrigir depois se precisar."
              rows={5}
            />
            <SuggestionChips suggestions={D_SUGGESTIONS.response} onSelect={(value) => update("response", value)} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm">O que você pode fazer, concretamente?</Label>
              <StepsEditor steps={form.steps} onChange={(value) => update("steps", value)} />
              <SuggestionChips
                suggestions={D_SUGGESTIONS.steps}
                onSelect={(value) => {
                  const next = form.steps.some((step) => step.trim()) ? [...form.steps, value] : [value];
                  update("steps", next.slice(0, 5));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">
                Intensidade imaginada depois:{" "}
                <span className="font-semibold">
                  {form.intensity_after === undefined ? "não informada" : `${form.intensity_after}/10`}
                </span>
              </Label>
              <Slider
                defaultValue={[form.intensity_after ?? 0]}
                min={0}
                max={10}
                step={1}
                onValueCommit={([value]) => update("intensity_after", value)}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="card-title" className="text-sm">
                Nome do cartão
              </Label>
              <Input
                id="card-title"
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Ex.: responder o trabalho sem travar"
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Categoria</Label>
              <CategorySelect
                value={form.category_key}
                onChange={(value) => update("category_key", value)}
                customCategories={customCategories}
              />
            </div>
            <Question
              label="Frase-âncora"
              optional
              hint="Uma frase curta para o widget ou para reler rápido."
              value={form.anchor_phrase}
              onChange={(value) => update("anchor_phrase", value)}
              rows={2}
            />
            <SuggestionChips
              suggestions={D_SUGGESTIONS.anchor_phrase}
              onSelect={(value) => update("anchor_phrase", value)}
            />
            <div className="space-y-2">
              <Label htmlFor="next-review" className="text-sm">
                Próxima revisão <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="next-review"
                type="date"
                value={form.next_review_date}
                onChange={(event) => update("next_review_date", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Prévia</Label>
              <div className="rounded-2xl border border-violet-200/70 bg-violet-50/50 p-4 text-sm">
                <p className="font-semibold text-foreground">{form.title || "Meu cartão"}</p>
                <p className="mt-2 text-foreground/90">{form.response || "Sua resposta alternativa aparecerá aqui."}</p>
                {form.situation && <p className="mt-2 text-muted-foreground">Situação: {form.situation}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          onPointerDown={(event) => { event.preventDefault(); triggerNavigation(goBack); }}
          onTouchStart={() => triggerNavigation(goBack)}
          onClick={() => triggerNavigation(goBack)}
          disabled={step === 0 || busy}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => finish("draft")} disabled={busy}>
            <Save className="mr-2 h-4 w-4" />
            Salvar e sair
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onPointerDown={(event) => { event.preventDefault(); triggerNavigation(goNext); }}
              onTouchStart={() => triggerNavigation(goNext)}
              onClick={() => triggerNavigation(goNext)}
              disabled={busy}
            >
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => finish("active")} disabled={busy}>
              <Check className="mr-2 h-4 w-4" />
              Salvar cartão
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
