import { getLocalPublishedTemplate, listLocalPublishedTemplates } from "@/lib/local-card-templates";

export const getServerInfo = async () => ({
  renderedAt: new Date().toISOString(),
});

// Leituras públicas da biblioteca: só templates publicados, sem exigir sessão.
export const listPublishedTemplates = () => listLocalPublishedTemplates();

export const getTemplateById = ({ id }) => getLocalPublishedTemplate(id);
