import { getLocalRepository } from "./local-repository.js";

export const EMPTY_FORM_D = {
  title: "",
  category_key: "ansiedade",
  situation: "",
  thought: "",
  emotions: [],
  intensity_before: 5,
  evidence_for: "",
  evidence_against: "",
  alternative_perspective: "",
  response: "",
  anchor_phrase: "",
  steps: [""],
  intensity_after: undefined,
  next_review_date: "",
};

export function cardExcerpt(card) {
  if (card.type === "A") return card.anchor_phrase || "";
  if (card.type === "B") return card.thought || "";
  if (card.type === "C") return card.situation || "";
  return card.response || card.situation || "";
}

export function firstWords(text, count = 7) {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean).slice(0, count);
  return words.join(" ");
}

export function cardOfTheDay(templates) {
  if (!templates?.length) return null;
  const dayNumber = Math.floor(Date.now() / 86400000);
  return templates[dayNumber % templates.length];
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function cleanSteps(steps) {
  return (steps ?? []).map((step) => String(step ?? "").trim()).filter(Boolean);
}

export function cardPayloadFromForm(form) {
  return {
    title: String(form.title ?? "").trim() || firstWords(form.situation || form.thought || form.anchor_phrase, 6) || "Meu cartão",
    category_key: form.category_key || "ansiedade",
    situation: form.situation || "",
    thought: form.thought || "",
    response: form.response || "",
    anchor_phrase: form.anchor_phrase || "",
    steps: cleanSteps(form.steps),
    emotions: form.emotions ?? [],
    intensity_before: form.intensity_before ?? undefined,
    intensity_after: form.intensity_after ?? undefined,
    evidence_for: form.evidence_for || "",
    evidence_against: form.evidence_against || "",
    alternative_perspective: form.alternative_perspective || "",
    next_review_date: form.next_review_date || undefined,
  };
}

// Guarda a versão anterior do cartão antes de sobrescrever (retenção de 5 versões).
export async function saveRevisionSnapshot(card, repository = getLocalRepository()) {
  if (!card?.id) return;
  const revisions = await repository.revisions.listForCard(card.id);
  const last = revisions[0];
  const nextNumber = (last?.revision_number ?? 0) + 1;
  await repository.revisions.create({
    card_id: card.id,
    revision_number: nextNumber,
    title: card.title ?? "",
    type: card.type ?? "",
    snapshot_json: JSON.stringify(card),
  });
}

export async function updatePersonalCard(card, patch, repository = getLocalRepository()) {
  await saveRevisionSnapshot(card, repository);
  return repository.cards.update(card.id, patch);
}

export async function deletePersonalCard(card, repository = getLocalRepository()) {
  await repository.cards.remove(card.id);
}

export async function copyTemplateToPersonal(template, repository = getLocalRepository()) {
  return repository.cards.create({
    type: template.type,
    title: template.title,
    category_key: template.category_key,
    status: "active",
    source_template_id: template.id,
    anchor_phrase: template.anchor_phrase ?? "",
    thought: template.thought ?? "",
    response: template.response ?? "",
    situation: template.situation ?? "",
    steps: template.steps ?? [],
  });
}
