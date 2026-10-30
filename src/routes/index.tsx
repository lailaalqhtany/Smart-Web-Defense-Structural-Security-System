import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { Button, Field, Panel } from "@/components/ui/primitives";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HASEEN — Smart Web Defense & Structural Security" },
      {
        name: "description",
        content:
          "Secure access to the HASEEN console: enterprise web defense with structural integrity monitoring and autonomous incident response.",
      },
      { property: "og:title", content: "HASEEN — Smart Web Defense & Structural Security" },
      {
        property: "og:description",
        content:
          "Sign in to the HASEEN security console with two-factor email verification.",
      },
    ],
  }),
  component: Access,
});

type Mode = "login" | "register" | "verify";

function Access() {
  const { t, lang } = useI18n();
  const { signIn } = useSession();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const enter = () => {
    signIn(email || "operator@haseen.sa");
    navigate({ to: "/dashboard" });
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, idx) => (idx === i ? d : x)));
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <AppShell>
      <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-border bg-card/60 p-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <ShieldCheck className="size-3.5" /> {t("brand")}
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight">{t("tagline")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {lang === "ar"
              ? "مراقبة مستمرة للسلامة البنائية للمواقع، كشف فوري للتلاعب والتشويه وحقن السكربتات، واستجابة ذاتية تعزل الخادم وتستعيد النسخة السليمة تلقائياً."
              : "Continuous structural integrity monitoring, instant detection of tampering, defacement and script injection, plus autonomous response that isolates servers and restores a clean state."}
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {(lang === "ar"
              ? ["كشف الهجمات الفوري", "استجابة ذاتية للحوادث", "تقارير جنائية وتنفيذية"]
              : ["Real-time attack detection", "Autonomous incident response", "Forensic & executive reporting"]
            ).map((x) => (
              <li key={x} className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" /> {x}
              </li>
            ))}
          </ul>
          <p className="mt-7 rounded-lg border border-border/70 bg-secondary/30 p-3 text-xs text-muted-foreground">
            {lang === "ar"
              ? "لا يمكن الوصول إلى لوحة الأمن أو التقارير إلا بعد تسجيل الدخول والتحقق."
              : "The security console and reports are accessible only after sign-in and verification."}
          </p>

        </div>

        {mode !== "verify" ? (
          <Panel>
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/40 p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t(m)}
                </button>
              ))}
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setMode("verify");
              }}
            >
              {mode === "register" && (
                <>
                  <Field label={t("fullname")} required placeholder="—" />
                  <Field label={t("org")} required placeholder="—" />
                </>
              )}
              <Field
                label={t("email")}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
              <Field label={t("password")} type="password" required placeholder="••••••••" />
              <Button type="submit" className="w-full">
                <KeyRound className="size-4" /> {t("continue")}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">{t("auth_note")}</p>
            </form>
          </Panel>
        ) : (
          <Panel>
            <div className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl border border-success/40 bg-success/10 text-success">
                <MailCheck className="size-6" />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{t("verify_title")}</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("verify_desc")}{" "}
                <span className="font-mono text-foreground">{email || "name@company.com"}</span>
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-2" dir="ltr">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  value={d}
                  inputMode="numeric"
                  aria-label={`Digit ${i + 1}`}
                  onChange={(e) => setDigit(i, e.target.value)}
                  className="size-12 rounded-md border border-input bg-secondary/40 text-center font-mono text-lg text-foreground outline-none focus:border-primary/70 focus:ring-2 focus:ring-ring/40"
                />
              ))}
            </div>
            <Button className="mt-6 w-full" onClick={enter} disabled={code.some((d) => !d)}>
              {t("verify_action")}
            </Button>
            <div className="mt-3 flex justify-between text-xs">
              <button onClick={() => setMode("login")} className="text-muted-foreground hover:text-foreground">
                {t("back")}
              </button>
              <button className="text-primary hover:underline">{t("resend")}</button>
            </div>
          </Panel>
        )}
      </div>
    </AppShell>
  );
}
