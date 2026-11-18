import { jsPDF } from "jspdf";
import { CARD_TYPE_LABEL, categoryLabel } from "@/lib/categories";
import { formatDate } from "@/lib/cards";

const DISCLAIMER =
  "Material psicoeducativo inspirado na TCC. Não é diagnóstico nem substitui psicoterapia ou atendimento de emergência.";

function has(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function cardBlocks(card, { includeEmotions = true, customCategories = [] } = {}) {
  const blocks = [{ label: "Tipo", value: `${card.type} — ${CARD_TYPE_LABEL[card.type]}` }];
  blocks.push({ label: "Categoria", value: categoryLabel(card.category_key, customCategories) });

  if (card.situation) blocks.push({ label: "Situação", value: card.situation });
  if (card.thought) blocks.push({ label: "Pensamento automático", value: card.thought });

  if (includeEmotions && (card.emotions?.length || has(card.intensity_before))) {
    const parts = [];
    if (card.emotions?.length) parts.push(card.emotions.join(", "));
    if (has(card.intensity_before)) parts.push(`intensidade inicial ${card.intensity_before}/10`);
    if (has(card.intensity_after)) parts.push(`intensidade final ${card.intensity_after}/10`);
    blocks.push({ label: "Emoções", value: parts.join(" · ") });
  }

  if (includeEmotions && card.evidence_for) blocks.push({ label: "Evidências a favor", value: card.evidence_for });
  if (includeEmotions && card.evidence_against) blocks.push({ label: "Evidências contrárias", value: card.evidence_against });
  if (includeEmotions && card.alternative_perspective) {
    blocks.push({ label: "Outra perspectiva", value: card.alternative_perspective });
  }

  if (card.response) {
    const label = card.type === "B" ? "Resposta alternativa" : "Resposta alternativa";
    blocks.push({ label, value: card.response });
  }
  if (card.anchor_phrase) blocks.push({ label: "Frase-âncora", value: card.anchor_phrase });
  if (card.steps?.length) blocks.push({ label: "Ação concreta", value: card.steps.map((step, i) => `${i + 1}. ${step}`).join("\n") });

  return blocks;
}

export function buildPlainText(cards, options = {}) {
  const header = [
    "EM FRENTE",
    `Exportado em ${formatDate(new Date().toISOString())}`,
    options.summary ? "Versão resumida" : "Versão completa",
    "",
  ];

  const body = cards.map((card, index) => {
    const headerLine = `${index + 1}. ${card.title}`;
    const blocks = cardBlocks(card, options)
      .map((block) => `${block.label}: ${block.value}`)
      .join("\n");
    return `${headerLine}\n${"-".repeat(Math.max(12, headerLine.length))}\n${blocks}`;
  });

  return [...header, ...body, "", DISCLAIMER].join("\n");
}

export function buildPdf(cards, options = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = 64;

  function ensureSpace(height) {
    const bottom = doc.internal.pageSize.getHeight() - 56;
    if (y + height > bottom) {
      doc.addPage();
      y = 64;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Em Frente", margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(
    `Exportado em ${formatDate(new Date().toISOString())} · ${options.summary ? "versão resumida" : "versão completa"}`,
    margin,
    y,
  );
  y += 26;
  doc.setTextColor(30);

  cards.forEach((card, index) => {
    ensureSpace(90);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(`${index + 1}. ${card.title}`, width);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 16 + 8;

    cardBlocks(card, options).forEach((block) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(95);
      doc.text(block.label.toUpperCase(), margin, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30);
      const lines = doc.splitTextToSize(block.value, width);
      lines.forEach((line) => {
        ensureSpace(16);
        doc.text(line, margin, y);
        y += 15;
      });
      y += 6;
    });

    y += 10;
  });

  ensureSpace(40);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.splitTextToSize(DISCLAIMER, width).forEach((line) => {
    doc.text(line, margin, y);
    y += 12;
  });

  return doc;
}

export function pdfFileName() {
  return `cartoes-enfrentamento-${new Date().toISOString().slice(0, 10)}.pdf`;
}

export async function sharePlainText(text) {
  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ title: "Em Frente", text });
    return "shared";
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return "copied";
  }
  return "unsupported";
}
