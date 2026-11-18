import { getLocalRepository } from "../lib/local-repository.js";
import { createLocalProfile, clearLocalProfile, getLocalProfile } from "../lib/local-auth.js";
import { listLocalPublishedTemplates, getLocalPublishedTemplate } from "../lib/local-card-templates.js";

function sortItems(items, sort) {
  if (!sort) return items;
  const descending = sort.startsWith("-");
  const field = descending ? sort.slice(1) : sort;
  return [...items].sort((left, right) => String(left[field] ?? "").localeCompare(String(right[field] ?? "")) * (descending ? -1 : 1));
}

function matches(item, filter = {}) {
  return Object.entries(filter).every(([key, value]) => item[key] === value);
}

function entityAdapter(list, get, create, update, remove) {
  return {
    async filter(filter = {}, options = {}) {
      const items = sortItems((await list()).filter((item) => matches(item, filter)), options.sort).slice(0, options.limit ?? 200);
      return { items };
    },
    get,
    create,
    update,
    delete: remove,
    async bulkCreate(records) {
      return Promise.all(records.map(create));
    },
  };
}

function createLocalEntities(repository) {
  const templates = {
    filter: async (filter = {}, options = {}) => ({
      items: sortItems((await listLocalPublishedTemplates()).filter((item) => matches(item, filter)), options.sort).slice(0, options.limit ?? 200),
    }),
    get: getLocalPublishedTemplate,
  };
  const revisions = entityAdapter(
    () => repository.revisions.listForCard(),
    (id) => repository.revisions.listForCard().then((items) => items.find((item) => item.id === id) ?? null),
    repository.revisions.create,
    async () => null,
    async (id) => repository.revisions.removeForCard(id),
  );
  const favorites = entityAdapter(
    repository.favorites.list,
    (id) => repository.favorites.list().then((items) => items.find((item) => item.id === id) ?? null),
    async (data) => {
      await repository.favorites.toggle(data.target_type, data.target_id);
      return (await repository.favorites.list()).find((item) => item.target_type === data.target_type && item.target_id === data.target_id);
    },
    async () => null,
    async (id) => {
      const item = (await repository.favorites.list()).find((favorite) => favorite.id === id);
      if (item) await repository.favorites.toggle(item.target_type, item.target_id);
    },
  );
  return {
    CardTemplate: templates,
    PersonalCard: entityAdapter(repository.cards.list, repository.cards.get, repository.cards.create, repository.cards.update, repository.cards.remove),
    CardRevision: revisions,
    Favorite: favorites,
    CustomCategory: entityAdapter(repository.categories.list, async (id) => (await repository.categories.list()).find((item) => item.id === id) ?? null, repository.categories.create, async () => null, repository.categories.remove),
    ReminderPreference: entityAdapter(
      async () => { const item = await repository.reminder.get(); return item ? [item] : []; },
      async () => repository.reminder.get(),
      repository.reminder.save,
      async (_id, patch) => repository.reminder.save(patch),
      async () => repository.clearAll(),
    ),
  };
}

const repository = getLocalRepository();

export const base44 = {
  entities: createLocalEntities(repository),
  auth: {
    hasToken: () => Boolean(getLocalProfile()),
    me: async () => getLocalProfile() ?? createLocalProfile(),
    setToken: () => createLocalProfile(),
    logout: () => clearLocalProfile(),
    redirectToLogin: () => window.location.assign("/"),
    loginWithProvider: async () => ({ user: createLocalProfile() }),
    register: async () => ({ access_token: "local" }),
    verifyOtp: async () => ({ access_token: "local" }),
    resendOtp: async () => ({}),
    resetPasswordRequest: async () => ({}),
    resetPassword: async () => ({}),
  },
};
