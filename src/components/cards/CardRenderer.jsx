import CardD from "@/components/cards/CardD";

export default function CardRenderer({ card, className }) {
  if (card?.type !== "D") {
    return (
      <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        Este cartão pertence a uma versão anterior e foi preservado para o app futuro.
      </div>
    );
  }
  return <CardD card={card} className={className} />;
}
