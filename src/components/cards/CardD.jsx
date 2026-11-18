import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

function Section({ value, title, children }) {
  return (
    <AccordionItem value={value} className="border-violet-200/70">
      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent className="text-sm leading-relaxed text-foreground/90">{children}</AccordionContent>
    </AccordionItem>
  );
}

export default function CardD({ card, className }) {
  const steps = card.steps ?? [];
  const emotions = card.emotions ?? [];
  const hasIntensity = card.intensity_before !== undefined && card.intensity_before !== null;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="rounded-3xl border border-violet-200/70 bg-violet-50/50 p-6 sm:p-8">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-900/70">Resposta alternativa</span>
        <p className="mt-2 font-heading text-xl leading-relaxed text-foreground sm:text-2xl">{card.response}</p>
        {card.anchor_phrase && (
          <p className="mt-4 border-l-2 border-violet-300 pl-3 text-sm italic text-foreground/80">{card.anchor_phrase}</p>
        )}
      </div>

      <Accordion type="multiple" className="rounded-3xl border border-border bg-card px-5">
        {card.situation && (
          <Section value="situacao" title="Situação">
            {card.situation}
          </Section>
        )}
        {card.thought && (
          <Section value="pensamento" title="Pensamento automático">
            {card.thought}
          </Section>
        )}
        {(emotions.length > 0 || hasIntensity) && (
          <Section value="emocoes" title="Emoções e intensidade">
            {emotions.length > 0 && <p className="capitalize">{emotions.join(" · ")}</p>}
            {hasIntensity && <p className="mt-1 text-muted-foreground">Intensidade inicial: {card.intensity_before}/10</p>}
            {card.intensity_after !== undefined && card.intensity_after !== null && (
              <p className="text-muted-foreground">Intensidade final: {card.intensity_after}/10</p>
            )}
          </Section>
        )}
        {card.evidence_for && (
          <Section value="favor" title="Evidências a favor do pensamento">
            {card.evidence_for}
          </Section>
        )}
        {card.evidence_against && (
          <Section value="contra" title="Evidências contrárias">
            {card.evidence_against}
          </Section>
        )}
        {card.alternative_perspective && (
          <Section value="perspectiva" title="Outra perspectiva">
            {card.alternative_perspective}
          </Section>
        )}
        {steps.length > 0 && (
          <Section value="acao" title="Ação concreta">
            <ol className="list-decimal space-y-1 pl-5">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </Section>
        )}
      </Accordion>
    </div>
  );
}
