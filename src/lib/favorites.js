const STORAGE_KEY = "cartoes-enfrentamento:favoritos";

// Favoritos de visitante ficam apenas neste dispositivo, sem enviar nada ao servidor.
export function readLocalFavorites() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function writeLocalFavorites(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleLocalFavorite(id) {
  const current = readLocalFavorites();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  writeLocalFavorites(next);
  return next.includes(id);
}

export function clearLocalFavorites() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
