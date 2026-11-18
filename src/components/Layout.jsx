import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Check, Eye, Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { APPEARANCE_OPTIONS, useAppearance } from "@/lib/AppearanceContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import BrandMark from "@/components/BrandMark";

const PUBLIC_NAV = [
  { to: "/", label: "Início" },
  { to: "/biblioteca", label: "Biblioteca" },
];

const AUTHED_NAV = [
  { to: "/meus-cartoes", label: "Minhas reflexões" },
  { to: "/preferencias", label: "Preferências" },
];

function NavLink({ item, onNavigate }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      {item.label}
    </Link>
  );
}

export default function Layout({ children }) {
  const { isAuthenticated, isLoadingAuth, logout, navigateToLogin } = useAuth();
  const { appearance, setAppearance } = useAppearance();
  const [open, setOpen] = useState(false);
  const nav = isAuthenticated ? [...PUBLIC_NAV, ...AUTHED_NAV] : PUBLIC_NAV;

  const sessionAction = isLoadingAuth ? null : isAuthenticated ? (
    <Button variant="ghost" size="sm" onClick={() => logout()}>
      Sair
    </Button>
  ) : (
    <Button size="sm" onClick={() => navigateToLogin()}>
      Entrar
    </Button>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="app-header sticky top-0 z-40 border-b border-border/70 bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BrandMark />
            </span>
            <span className="font-heading text-[15px] leading-tight">
              Em Frente
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">{sessionAction}</div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/20" role="presentation" onClick={() => setOpen(false)}>
          <aside
            role="dialog"
            aria-label="Menu"
            className="absolute right-0 top-0 h-full w-[min(20rem,85vw)] bg-background p-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-heading text-lg">Menu</h2>
              <Button type="button" variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 flex flex-col gap-1">
              {nav.map((item) => (
                <NavLink key={item.to} item={item} onNavigate={() => setOpen(false)} />
              ))}
            </div>
            <div className="mt-6">{sessionAction}</div>
            <section className="mt-6 border-t border-border pt-5" aria-labelledby="appearance-heading">
              <h3 id="appearance-heading" className="text-sm font-semibold">Aparência</h3>
              <div className="mt-3 space-y-1" role="radiogroup" aria-label="Modo de aparência">
                {APPEARANCE_OPTIONS.map((option) => {
                  const Icon = option.value === "light" ? Sun : option.value === "dark" ? Moon : Eye;
                  const selected = appearance === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAppearance(option.value)}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors",
                        selected ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{option.label}</span>
                      {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl space-y-3 px-4 py-10 text-sm text-muted-foreground sm:px-6">
          <p className="font-heading text-base text-foreground">Em Frente</p>
          <p className="max-w-2xl">
            Recurso psicoeducativo e de autocuidado inspirado na terapia cognitivo-comportamental. Não faz diagnóstico,
            não promete eficácia clínica e não substitui psicoterapia ou atendimento de emergência.
          </p>
          <p className="max-w-2xl">
            Em situação de crise, procure ajuda agora. No Brasil, o CVV atende 24 horas pelo <strong>188</strong> (ligação
            gratuita) ou pelo site cvv.org.br.
          </p>
        </div>
      </footer>
    </div>
  );
}
