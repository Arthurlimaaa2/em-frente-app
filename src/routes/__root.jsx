import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { AppearanceProvider } from "@/lib/AppearanceContext";
import appCss from "@/index.css?url";

export const Route = createRootRoute({
  // Per-page <title>/meta come from each route's head(); this is the shared base.
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Em Frente" },
      { name: "description", content: "Em Frente: cartões de enfrentamento inspirados na TCC, com dados locais." },
    ],
    // No icon link: the platform adds the app's logo when serving.
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Outlet />
          <Toaster />
        </FavoritesProvider>
      </AuthProvider>
    </AppearanceProvider>
  );
}

// The document. There is no index.html: the server renders <html> from here.
function RootDocument({ children }) {
  if (typeof document !== "undefined") return children;

  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      {/* data-react-root: the builder's preview bridge looks for #root and falls back to this. */}
      <body data-react-root="true">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
