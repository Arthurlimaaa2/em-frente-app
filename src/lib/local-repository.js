import { createMemoryStorage, readJson, resolveStorage, writeJson } from "./local-store.js";

const COLLECTIONS = ["cards", "revisions", "favorites", "categories", "reminder"];

function createId(prefix) {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `${prefix}_${uuid ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function now() {
  return new Date().toISOString();
}

export function createLocalRepository(storage = resolveStorage(), { profileId = "local-profile" } = {}) {
  const key = (collection) => `cartoes-tcc:${profileId}:${collection}`;
  const read = (collection, fallback = []) => readJson(storage, key(collection), fallback);
  const write = (collection, value) => writeJson(storage, key(collection), value);

  const cards = {
    list: async () => read("cards"),
    get: async (id) => read("cards").find((card) => card.id === id) ?? null,
    create: async (data) => {
      const timestamp = now();
      const card = { ...data, id: data.id ?? createId("card"), created_date: timestamp, updated_date: timestamp };
      write("cards", [...read("cards"), card]);
      return card;
    },
    update: async (id, patch) => {
      const records = read("cards");
      const index = records.findIndex((card) => card.id === id);
      if (index < 0) return null;
      const updated = { ...records[index], ...patch, id, updated_date: now() };
      records[index] = updated;
      write("cards", records);
      return updated;
    },
    remove: async (id) => {
      write("cards", read("cards").filter((card) => card.id !== id));
      write("revisions", read("revisions").filter((revision) => revision.card_id !== id));
    },
  };

  const revisions = {
    listForCard: async (cardId) =>
      read("revisions")
        .filter((revision) => cardId ? revision.card_id === cardId : true)
        .sort((a, b) => b.revision_number - a.revision_number),
    create: async (data) => {
      const current = read("revisions").filter((revision) => revision.card_id === data.card_id);
      const revision = {
        ...data,
        id: data.id ?? createId("revision"),
        revision_number: data.revision_number ?? Math.max(0, ...current.map((item) => item.revision_number ?? 0)) + 1,
        created_date: now(),
      };
      const next = [...read("revisions"), revision]
        .filter((item) => item.card_id !== data.card_id || item.id === revision.id || item.revision_number > revision.revision_number - 5);
      write("revisions", next);
      return revision;
    },
    removeForCard: async (cardId) => write("revisions", read("revisions").filter((item) => item.card_id !== cardId)),
  };

  const favorites = {
    list: async () => read("favorites"),
    toggle: async (targetType, targetId) => {
      const current = read("favorites");
      const existing = current.find((item) => item.target_type === targetType && item.target_id === targetId);
      if (existing) {
        write("favorites", current.filter((item) => item.id !== existing.id));
        return false;
      }
      write("favorites", [...current, { id: createId("favorite"), target_type: targetType, target_id: targetId }]);
      return true;
    },
  };

  const categories = {
    list: async () => read("categories"),
    create: async (data) => {
      const category = { ...data, id: data.id ?? createId("category"), created_date: now() };
      write("categories", [...read("categories"), category]);
      return category;
    },
    remove: async (id) => write("categories", read("categories").filter((category) => category.id !== id)),
  };

  const reminder = {
    get: async () => read("reminder", null),
    save: async (data) => {
      const value = { ...(read("reminder", {}) ?? {}), ...data, updated_date: now() };
      write("reminder", value);
      return value;
    },
  };

  return {
    cards,
    revisions,
    favorites,
    categories,
    reminder,
    async clearAll() {
      COLLECTIONS.forEach((collection) => storage.removeItem(key(collection)));
    },
  };
}

let defaultRepository;

export function getLocalRepository() {
  defaultRepository ??= createLocalRepository();
  return defaultRepository;
}

export { createMemoryStorage };
