import { useState } from "react";
import { FileDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { buildPdf, buildPlainText, pdfFileName, sharePlainText } from "@/lib/share";
import { cn } from "@/lib/utils";

export default function ShareDialog({
  cards,
  customCategories = [],
  initialSelectedIds = [],
  label = "Compartilhar",
  variant = "outline",
  className,
}) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const [format, setFormat] = useState("pdf");
  const [summary, setSummary] = useState(false);
  const [busy, setBusy] = useState(false);

  const selected = cards.filter((card) => selectedIds.includes(card.id));
  const preview = selected.length ? buildPlainText(selected, { summary, customCategories }) : "";

  function toggle(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function confirm() {
    if (!selected.length || busy) return;
    setBusy(true);
    try {
      if (format === "pdf") {
        buildPdf(selected, { summary, customCategories }).save(pdfFileName());
        toast.success("PDF gerado. Escolha o destinatário no compartilhamento do sistema.");
      } else {
        const result = await sharePlainText(buildPlainText(selected, { summary, customCategories }));
        if (result === "copied") toast.success("Texto copiado para a área de transferência.");
        else if (result === "shared") toast.success("Pronto para enviar.");
        else toast.error("Não foi possível compartilhar neste dispositivo.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Compartilhar com quem você escolher</DialogTitle>
          <DialogDescription>
            Você escolhe os cartões, vê exatamente o que será enviado e decide o destinatário. Nada é enviado
            automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Cartões incluídos</Label>
            {cards.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum cartão próprio disponível.</p>
            ) : (
              <div className="max-h-44 space-y-1 overflow-y-auto rounded-2xl border border-border p-2">
                {cards.map((card) => (
                  <label
                    key={card.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm hover:bg-secondary/60"
                  >
                    <Checkbox checked={selectedIds.includes(card.id)} onCheckedChange={() => toggle(card.id)} />
                    <span className="flex-1 truncate">{card.title}</span>
                    <span className="text-xs text-muted-foreground">Tipo {card.type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Label>Formato</Label>
            {[
              { value: "pdf", label: "PDF" },
              { value: "text", label: "Texto" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFormat(item.value)}
                aria-pressed={format === item.value}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  format === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Versão resumida</p>
              <p className="text-xs text-muted-foreground">Deixa de fora emoções, intensidade e evidências.</p>
            </div>
            <Switch checked={summary} onCheckedChange={setSummary} />
          </div>

          <div className="space-y-2">
            <Label>Prévia exata do conteúdo</Label>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl bg-secondary/60 p-3 text-[11px] leading-relaxed text-foreground/90">
              {preview || "Selecione pelo menos um cartão para ver a prévia."}
            </pre>
          </div>

          <Button onClick={confirm} disabled={busy || !selected.length} className="w-full">
            <FileDown className="mr-2 h-4 w-4" />
            {format === "pdf" ? "Gerar PDF" : "Compartilhar texto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
