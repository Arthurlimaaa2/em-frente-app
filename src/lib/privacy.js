import { getLocalRepository } from "./local-repository.js";

function models(repository) {
  return [
    { name: "PersonalCard", list: repository.cards.list },
    { name: "CardRevision", list: repository.revisions.listForCard },
    { name: "Favorite", list: repository.favorites.list },
    { name: "CustomCategory", list: repository.categories.list },
    { name: "ReminderPreference", list: repository.reminder.get },
  ];
}

export async function exportPersonalData(repository = getLocalRepository()) {
  const payload = {};
  for (const { name, list } of models(repository)) {
    const value = await list();
    payload[name] = value === null ? [] : value;
  }
  return payload;
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function deleteAllPersonalData(repository = getLocalRepository()) {
  await repository.clearAll();
}
