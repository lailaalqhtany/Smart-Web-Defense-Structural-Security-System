import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Gauge, Radar, ShieldAlert, Timer, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireSession } from "@/components/RequireSession";
import { Panel, Switch, SeverityChip } from "@/components/ui/primitives";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Security Dashboard — HASEEN Web Defense" },
      {
        name: "description",
        content:
          "Monitor threat score, structural integrity, real-time attack detection and autonomous incident response across your web estate.",
      },
      { property: "og:title", content: "Security Dashboard — HASEEN Web Defense" },
      {
        property: "og:description",
        content:
          "Threat score, system health pulse, attack detection and autonomous response controls in one console.",
      },
    ],
  }),
  component: () => (
    <RequireSession>
      <Dashboard />
    </RequireSession>
  ),
});

type Log = {
  time: string;
  level: "critical" | "high" | "medium" | "low";
  en: string;
  ar: string;
  status: "blocked" | "monitoring" | "contained";
};

const logs: Log[] = [
  {
    time: "20:41:07",
    level: "critical",
    en: "DOM structure hash mismatch on /checkout — node tree altered",
    ar: "عدم تطابق بصمة بنية DOM في /checkout — تعديل في شجرة العناصر",
    status: "blocked",
  },
  {
    time: "20:38:52",
    level: "high",
    en: "Inline script injection attempt via query parameter",
    ar: "محاولة حقن سكربت مضمّن عبر معامل الرابط",
    status: "blocked",
  },
  {
    time: "20:33:14",
    level: "medium",
    en: "Unauthorized template asset replacement on landing banner",
    ar: "استبدال غير مصرح لأصل القالب في لافتة الصفحة الرئيسية",
    status: "contained",
  },
  {
    time: "20:27:03",
    level: "low",
    en: "Elevated crawler rate from ASN 14061 — throttled",
    ar: "ارتفاع معدل الزحف من ASN 14061 — تم التحديد",
    status: "monitoring",
  },
  {
    time: "20:19:45",
    level: "high",
    en: "Privileged file write outside allowed integrity scope",
    ar: "كتابة ملف بصلاحيات عالية خارج نطاق السلامة المسموح",
    status: "contained",
  },
];

function Dashboard() {
  const { t, lang } = useI18n();
  const [pulse, setPulse] = useState(96);
  const [autoMaint, setAutoMaint] = useState(true);
  const [isolate, setIsolate] = useState(false);
  const [rollback, setRollback] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setPulse(94 + Math.round(Math.random() * 5)), 3000);
    return () => clearInterval(id);
  }, []);

  const score = 82;

  return (
    <AppShell>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title={t("threat_score")} className="lg:col-span-1">
          <div className="flex items-center gap-5">
            <div
              className="grid size-28 place-items-center rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${score}%, var(--muted) ${score}% 100%)`,
              }}
            >
              <div className="grid size-[88px] place-items-center rounded-full bg-card">
                <span className="font-display text-3xl font-bold text-primary">{score}</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-destructive" /> 3 {t("critical")}
              </li>
              <li className="flex items-center gap-2">
                <Radar className="size-4 text-warning" /> 11 {t("high")}
              </li>
              <li className="flex items-center gap-2">
                <Zap className="size-4 text-success" /> 148 {t("events_hr")}
              </li>
            </ul>
          </div>
        </Panel>

        <Panel title={t("health_pulse")} className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric icon={<Activity className="size-4" />} label={t("integrity")} value={`${pulse}%`} tone="success" />
            <Metric icon={<Timer className="size-4" />} label={t("latency")} value="38 ms" tone="primary" />
            <Metric icon={<Gauge className="size-4" />} label={t("uptime")} value="99.98%" tone="success" />
          </div>
          <div className="mt-4 flex h-16 items-end gap-1">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-primary/70"
                style={{ height: `${20 + ((i * 37) % 70)}%`, opacity: 0.35 + ((i % 6) / 10) }}
              />
            ))}
          </div>
        </Panel>

        <Panel title={t("detection")} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            <Detect label={t("tampering")} count={4} tone="destructive" />
            <Detect label={t("defacement")} count={2} tone="warning" />
            <Detect label={t("injection")} count={9} tone="primary" />
          </div>
        </Panel>

        <Panel title={t("response")}>
          <div className="space-y-3">
            <Switch checked={autoMaint} onChange={setAutoMaint} label={t("auto_maint")} tone="primary" />
            <Switch checked={isolate} onChange={setIsolate} label={t("isolation")} tone="danger" />
            <Switch checked={rollback} onChange={setRollback} label={t("rollback")} tone="success" />
          </div>
        </Panel>

        <Panel title={t("logs")} className="lg:col-span-3">
          <div className="overflow-hidden rounded-lg border border-border/70">
            <table className="w-full text-start text-sm">
              <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-start font-semibold">UTC</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{t("severity")}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{t("vector")}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{t("outcome")}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.time} className="border-t border-border/60 hover:bg-secondary/25">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.time}</td>
                    <td className="px-4 py-3">
                      <SeverityChip level={l.level} label={t(l.level)} />
                    </td>
                    <td className="px-4 py-3 text-foreground">{lang === "ar" ? l.ar : l.en}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-muted-foreground">
                      {t(l.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "success" | "primary";
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/30 p-4">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={tone === "success" ? "text-success" : "text-primary"}>{icon}</span>
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Detect({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "destructive" | "warning" | "primary";
}) {
  const color =
    tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/30 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${color}`}>{count}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <span
          className={`block h-full rounded-full ${tone === "destructive" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary"}`}
          style={{ width: `${Math.min(count * 11, 100)}%` }}
        />
      </div>
    </div>
  );
}
