import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildPdf, pdfFileName } from "@/lib/share";

export default function PdfExportButton({ cards = [], customCategories = [], label = "Salvar PDF", className }) {
  const [busy, setBusy] = useState(false);

  function save() {
    if (busy || cards.length === 0) return;
    setBusy(true);
    try {
      buildPdf(cards, { customCategories }).save(pdfFileName());
      toast.success(cards.length === 1 ? "PDF salvo no dispositivo." : "PDF com seus cartões salvo no dispositivo.");
    } catch (error) {
      void error;
      toast.error("Não foi possível gerar o PDF agora.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" onClick={save} disabled={busy || cards.length === 0} className={className}>
      <FileDown className="mr-2 h-4 w-4" />
      {busy ? "Gerando PDF…" : label}
    </Button>
  );
}
