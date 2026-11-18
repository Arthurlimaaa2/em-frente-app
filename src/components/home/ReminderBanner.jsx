import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BellRing } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

export default function ReminderBanner() {
  const { isAuthenticated } = useAuth();
  const [pref, setPref] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let alive = true;
    base44.entities.ReminderPreference.filter({}, { sort: "-created_date", limit: 1 }).then(({ items }) => {
      if (alive) setPref(items[0] ?? null);
    });
    return () => {
      alive = false;
    };
  }, [isAuthenticated]);

  if (!pref?.enabled) return null;

  const now = new Date();
  if (!(pref.weekdays ?? []).includes(String(now.getDay()))) return null;

  const [hour, minute] = (pref.time_local || "20:00").split(":").map(Number);
  if (now.getHours() * 60 + now.getMinutes() < hour * 60 + minute) return null;

  return (
    <div className="border-b border-primary/15 bg-primary/5">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
          <BellRing className="h-4 w-4" />
        </span>
        <p className="text-sm text-foreground">Seu lembrete está disponível.</p>
        <Button asChild size="sm" variant="outline" className="ml-auto bg-background">
          <Link to={pref.selected_card_id ? "/meus-cartoes/$cardId" : "/biblioteca"} params={pref.selected_card_id ? { cardId: pref.selected_card_id } : undefined}>
            Abrir cartão
          </Link>
        </Button>
      </div>
    </div>
  );
}
