import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CardB({ card, className }) {
  const [side, setSide] = useState("front");
  const isFront = side === "front";
  const text = isFront ? card.thought : card.response;

  return (
    <div className={cn("rounded-3xl border border-sky-200/70 bg-sky-50/60 p-6 sm:p-8", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-900/70">
          {isFront ? "Pensamento" : "Resposta"}
        </span>
        <span className="text-[11px] text-sky-900/50">{isFront ? "frente" : "verso"}</span>
      </div>

      <div className="min-h-28">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={side}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-heading text-xl leading-relaxed text-foreground sm:text-2xl"
          >
            {text}
          </motion.p>
        </AnimatePresence>
      </div>

      <Button variant="outline" size="sm" className="mt-5 bg-white" onClick={() => setSide(isFront ? "back" : "front")}>
        {isFront ? "Ver resposta" : "Voltar ao pensamento"}
      </Button>
    </div>
  );
}
