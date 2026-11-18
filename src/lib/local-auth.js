import { readJson, resolveStorage, writeJson } from "./local-store.js";

const PROFILE_KEY = "cartoes-tcc:local-profile";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `local_${Date.now()}`;
}

export function getLocalProfile(storage = resolveStorage()) {
  return readJson(storage, PROFILE_KEY, null);
}

export function createLocalProfile(storage = resolveStorage(), values = {}) {
  const existing = getLocalProfile(storage);
  if (existing) return existing;
  const profile = {
    id: createId(),
    role: "user",
    displayName: values.displayName || "Perfil local",
    created_date: new Date().toISOString(),
  };
  writeJson(storage, PROFILE_KEY, profile);
  return profile;
}

export function clearLocalProfile(storage = resolveStorage()) {
  storage.removeItem(PROFILE_KEY);
}
