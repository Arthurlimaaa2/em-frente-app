import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/criar/rapido")({
  validateSearch: (search) => ({ card: typeof search.card === "string" ? search.card : undefined }),
  head: () => ({ meta: [{ title: "Criar cartão rápido — Em Frente" }] }),
  component: QuickCardPage,
});

function QuickCardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/criar/enfrentamento", replace: true });
  }, [navigate]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 text-sm text-muted-foreground sm:px-6">
      Redirecionando para a reflexão…
    </div>
  );
}
