import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { getLocalRepository } from "@/lib/local-repository";

// Carrega os favoritos uma única vez por sessão e compartilha com todos os botões,
// para que nenhuma lista dispare uma requisição por cartão.
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const repository = useMemo(() => getLocalRepository(), []);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return setFavorites([]);
    setFavorites(await repository.favorites.list());
  }, [isAuthenticated, repository]);

  useEffect(() => {
    if (isLoadingAuth) return;
    let alive = true;

    repository.favorites.list().then((items) => {
      if (alive) setFavorites(isAuthenticated ? items : []);
    });

    return () => {
      alive = false;
    };
  }, [isAuthenticated, isLoadingAuth, repository]);

  const isFavorite = useCallback(
    (targetType, targetId) => {
      return favorites.some((favorite) => favorite.target_type === targetType && favorite.target_id === targetId);
    }, [favorites],
  );

  const toggle = useCallback(
    async (targetType, targetId) => {
      const existing = favorites.find(
        (favorite) => favorite.target_type === targetType && favorite.target_id === targetId,
      );
      if (existing) {
        const active = await repository.favorites.toggle(targetType, targetId);
        setFavorites((prev) => prev.filter((favorite) => favorite.id !== existing.id));
        return active;
      }
      const active = await repository.favorites.toggle(targetType, targetId);
      const items = await repository.favorites.list();
      setFavorites(items);
      return active;
    },
    [favorites, repository],
  );

  const value = useMemo(() => ({ favorites, isFavorite, toggle, refresh }), [favorites, isFavorite, toggle, refresh]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites precisa estar dentro de FavoritesProvider");
  return context;
}
