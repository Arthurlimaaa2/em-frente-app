import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Widgets, isAndroid } from "@/lib/native-widgets";

const STORAGE_KEY = "em-frente-appearance";
const AppearanceContext = createContext(null);

export const APPEARANCE_OPTIONS = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "colorblind", label: "Paleta para daltonismo" },
];

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (APPEARANCE_OPTIONS.some((option) => option.value === saved)) setAppearance(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.appearance = appearance;
    if (ready) window.localStorage.setItem(STORAGE_KEY, appearance);
    if (isAndroid()) void Widgets.setAppearance({ appearance }).catch(() => {});
  }, [appearance, ready]);

  const value = useMemo(() => ({ appearance, setAppearance }), [appearance]);
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used within <AppearanceProvider>");
  return context;
}
