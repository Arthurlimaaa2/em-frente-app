// Categorias fixas do sistema. Categorias pessoais ficam na entidade CustomCategory.
export const SYSTEM_CATEGORIES = [
  { key: "ansiedade", label: "Ansiedade", chip: "border-teal-200 bg-teal-50 text-teal-900", dot: "bg-teal-500" },
  { key: "incerteza", label: "Incerteza", chip: "border-sky-200 bg-sky-50 text-sky-900", dot: "bg-sky-500" },
  { key: "autocritica", label: "Autocrítica", chip: "border-rose-200 bg-rose-50 text-rose-900", dot: "bg-rose-500" },
  { key: "comparacao", label: "Comparação social", chip: "border-violet-200 bg-violet-50 text-violet-900", dot: "bg-violet-500" },
  { key: "procrastinacao", label: "Procrastinação", chip: "border-amber-200 bg-amber-50 text-amber-900", dot: "bg-amber-500" },
  { key: "frustracao", label: "Frustração", chip: "border-orange-200 bg-orange-50 text-orange-900", dot: "bg-orange-500" },
  { key: "limites", label: "Limites pessoais", chip: "border-emerald-200 bg-emerald-50 text-emerald-900", dot: "bg-emerald-500" },
  { key: "relacoes", label: "Relações", chip: "border-indigo-200 bg-indigo-50 text-indigo-900", dot: "bg-indigo-500" },
  { key: "mudancas", label: "Adaptação a mudanças", chip: "border-lime-200 bg-lime-50 text-lime-900", dot: "bg-lime-500" },
];

export const CUSTOM_CHIP = "border-stone-200 bg-stone-50 text-stone-800";

export function systemCategory(key) {
  return SYSTEM_CATEGORIES.find((c) => c.key === key) || null;
}

export function categoryLabel(key, customCategories = []) {
  const system = systemCategory(key);
  if (system) return system.label;
  const custom = customCategories.find((c) => c.id === key);
  return custom ? custom.label : "Sem categoria";
}

export function categoryChipStyle(key) {
  return systemCategory(key)?.chip ?? CUSTOM_CHIP;
}

export const CARD_TYPE_LABEL = {
  A: "Frase-âncora",
  B: "Pensamento e resposta",
  C: "Ação orientada",
  D: "Reestruturação completa",
};

export const EMOTIONS = [
  "ansiedade",
  "medo",
  "tristeza",
  "raiva",
  "vergonha",
  "culpa",
  "frustração",
  "impotência",
  "confusão",
  "cansaço",
  "alívio",
  "esperança",
];

export const WEEKDAYS = [
  { value: "0", label: "Dom" },
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" },
];
