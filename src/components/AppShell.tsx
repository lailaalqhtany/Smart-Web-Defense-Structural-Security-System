import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Languages, LogOut, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";

export function AppShell({ children }: { children: ReactNode }) {
  const { t, toggle, lang } = useI18n();
  const { authed, signOut } = useSession();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          <Link to={authed ? "/dashboard" : "/"} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-semibold tracking-wide">
                {t("brand")}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                {t("tagline")}
              </span>
            </span>
          </Link>

          <nav className="mx-auto flex items-center gap-1">
            {authed ? (
              <>
                <Link
                  to="/dashboard"
                  className={linkClass}
                  activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium bg-secondary text-primary" }}
                >
                  {t("nav_dashboard")}
                </Link>
                <Link
                  to="/reports"
                  className={linkClass}
                  activeProps={{ className: "rounded-md px-3 py-2 text-sm font-medium bg-secondary text-primary" }}
                >
                  {t("nav_reports")}
                </Link>
              </>
            ) : (
              <Link to="/" className={linkClass}>
                {t("nav_access")}
              </Link>
            )}
          </nav>

          {authed && (
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/", replace: true });
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="size-4 rtl:rotate-180" />
              {t("signout")}
            </button>
          )}

          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Languages className="size-4" />
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
