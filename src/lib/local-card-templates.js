import cardTemplates from "../../data/card-templates.json" with { type: "json" };

const publishedTemplates = cardTemplates.filter(
  (template) => template.status === "published" && template.type === "D",
);

export async function listLocalPublishedTemplates() {
  return publishedTemplates;
}

export async function getLocalPublishedTemplate(id) {
  return publishedTemplates.find((template) => template.id === id) ?? null;
}
