export function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

export function resolveStorage() {
  if (typeof globalThis.localStorage !== "undefined") return globalThis.localStorage;
  return createMemoryStorage();
}

export function readJson(storage, key, fallback) {
  try {
    const value = storage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function writeJson(storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
}
