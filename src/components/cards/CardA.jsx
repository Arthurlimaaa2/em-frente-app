import { cn } from "@/lib/utils";

export default function CardA({ card, className }) {
  const phrase = card.anchor_phrase || card.response || "";
  return (
    <div className={cn("rounded-3xl border border-amber-200/70 bg-accent px-6 py-12 text-center sm:px-10", className)}>
      <p className="font-heading text-2xl leading-snug text-accent-foreground sm:text-3xl">
        <span aria-hidden="true">“</span>
        {phrase}
        <span aria-hidden="true">”</span>
      </p>
    </div>
  );
}
