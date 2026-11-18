import test from "node:test";
import assert from "node:assert/strict";

import { createLocalRepository, createMemoryStorage } from "../src/lib/local-repository.js";
import { copyTemplateToPersonal, deletePersonalCard, updatePersonalCard } from "../src/lib/cards.js";
import { clearLocalProfile, createLocalProfile, getLocalProfile } from "../src/lib/local-auth.js";
import { deleteAllPersonalData, exportPersonalData } from "../src/lib/privacy.js";
import { base44 } from "../src/api/base44Client.js";

test("persists cards and isolates profiles in the same storage", async () => {
  const storage = createMemoryStorage();
  const first = createLocalRepository(storage, { profileId: "profile-a" });
  const second = createLocalRepository(storage, { profileId: "profile-b" });

  const created = await first.cards.create({ title: "Cartão local", type: "D", status: "active" });

  assert.equal((await first.cards.list()).length, 1);
  assert.equal((await second.cards.list()).length, 0);
  assert.equal((await first.cards.get(created.id)).title, "Cartão local");
});

test("updates and deletes a card while retaining revision snapshots", async () => {
  const repository = createLocalRepository(createMemoryStorage());
  const card = await repository.cards.create({ title: "Antes", type: "A", status: "active" });

  await repository.revisions.create({ card_id: card.id, title: card.title, snapshot_json: JSON.stringify(card) });
  const updated = await repository.cards.update(card.id, { title: "Depois" });

  assert.equal(updated.title, "Depois");
  assert.equal((await repository.revisions.listForCard(card.id)).length, 1);

  await repository.cards.remove(card.id);
  assert.equal(await repository.cards.get(card.id), null);
  assert.equal((await repository.revisions.listForCard(card.id)).length, 0);
});

test("toggles favorites, stores categories and saves one reminder preference", async () => {
  const repository = createLocalRepository(createMemoryStorage());

  assert.equal(await repository.favorites.toggle("template", "template-1"), true);
  assert.equal(await repository.favorites.toggle("template", "template-1"), false);

  const category = await repository.categories.create({ label: "Minha categoria", color: "blue" });
  await repository.reminder.save({ enabled: true, time_local: "20:00" });

  assert.equal((await repository.favorites.list()).length, 0);
  assert.equal((await repository.categories.list())[0].id, category.id);
  assert.equal((await repository.reminder.get()).enabled, true);
});

test("clears every personal record without affecting another profile", async () => {
  const storage = createMemoryStorage();
  const first = createLocalRepository(storage, { profileId: "profile-a" });
  const second = createLocalRepository(storage, { profileId: "profile-b" });

  await first.cards.create({ title: "A", type: "A", status: "active" });
  await second.cards.create({ title: "B", type: "A", status: "active" });
  await first.clearAll();

  assert.equal((await first.cards.list()).length, 0);
  assert.equal((await second.cards.list()).length, 1);
});

test("card helpers create, revise, update and delete personal cards locally", async () => {
  const repository = createLocalRepository(createMemoryStorage());
  const card = await copyTemplateToPersonal(
    { id: "template-1", type: "A", title: "Âncora", category_key: "ansiedade", anchor_phrase: "Eu consigo pausar" },
    repository,
  );

  const updated = await updatePersonalCard(card, { title: "Âncora editada" }, repository);
  assert.equal(updated.title, "Âncora editada");
  assert.equal((await repository.revisions.listForCard(card.id)).length, 1);

  await deletePersonalCard(updated, repository);
  assert.equal(await repository.cards.get(card.id), null);
});

test("creates and clears a local profile in persistent storage", () => {
  const storage = createMemoryStorage();

  assert.equal(getLocalProfile(storage), null);
  const profile = createLocalProfile(storage, { displayName: "Perfil de teste" });
  assert.equal(getLocalProfile(storage).id, profile.id);
  assert.equal(getLocalProfile(storage).displayName, "Perfil de teste");

  clearLocalProfile(storage);
  assert.equal(getLocalProfile(storage), null);
});

test("exports and deletes all local personal data", async () => {
  const repository = createLocalRepository(createMemoryStorage());
  const card = await repository.cards.create({ title: "Exportável", type: "D", status: "active" });
  await repository.revisions.create({ card_id: card.id, snapshot_json: JSON.stringify(card) });
  await repository.favorites.toggle("personal", card.id);
  await repository.categories.create({ label: "Privada" });
  await repository.reminder.save({ enabled: true });

  const exported = await exportPersonalData(repository);
  assert.equal(exported.PersonalCard.length, 1);
  assert.equal(exported.CardRevision.length, 1);
  assert.equal(exported.Favorite.length, 1);
  assert.equal(exported.CustomCategory.length, 1);
  assert.equal(exported.ReminderPreference.enabled, true);

  await deleteAllPersonalData(repository);
  assert.equal((await repository.cards.list()).length, 0);
  assert.equal((await repository.favorites.list()).length, 0);
});

test("local compatibility client exposes the entity operations used by the UI", async () => {
  const created = await base44.entities.PersonalCard.create({ title: "Compatível", type: "A", status: "active" });
  const page = await base44.entities.PersonalCard.filter({ status: "active" });

  assert.ok(page.items.some((card) => card.id === created.id));
  await base44.entities.PersonalCard.delete(created.id);
  assert.equal(await base44.entities.PersonalCard.get(created.id), null);
});
