import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";

export function RequireSession({ children }: { children: ReactNode }) {
  const { ready, authed } = useSession();
  const { lang } = useI18n();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/", replace: true });
  }, [ready, authed, navigate]);

  if (!ready || !authed) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
            <Lock className="size-6" />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">
            {lang === "ar"
              ? "الوصول مقيّد — يجب تسجيل الدخول والتحقق أولاً."
              : "Restricted access — sign in and verify first."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
