import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RequireSession } from "@/components/RequireSession";
import { Button, Panel, SeverityChip } from "@/components/ui/primitives";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Advanced Security Reports — HASEEN" },
      {
        name: "description",
        content:
          "Forensic incident breakdowns, AI behavioral code integrity analysis and printable executive security summaries.",
      },
      { property: "og:title", content: "Advanced Security Reports — HASEEN" },
      {
        property: "og:description",
        content: "Forensics, code integrity analytics and executive summaries for your web estate.",
      },
    ],
  }),
  component: () => (
    <RequireSession>
      <Reports />
    </RequireSession>
  ),
});

const forensics = [
  {
    id: "INC-4471",
    level: "critical" as const,
    vector: { en: "Structural tampering", ar: "تلاعب بالبنية" },
    origin: "185.220.101.44 · NL",
    asset: "/checkout/payment.html",
    outcome: { en: "Blocked, rolled back in 1.4s", ar: "محجوب، واسترجاع في 1.4 ثانية" },
  },
  {
    id: "INC-4468",
    level: "high" as const,
    vector: { en: "Script injection", ar: "حقن سكربتات" },
    origin: "45.83.67.12 · DE",
    asset: "/search?q=",
    outcome: { en: "Blocked at edge filter", ar: "محجوب على مرشح الحافة" },
  },
  {
    id: "INC-4460",
    level: "medium" as const,
    vector: { en: "Defacement attempt", ar: "محاولة تشويه" },
    origin: "102.44.9.87 · EG",
    asset: "/assets/hero-banner",
    outcome: { en: "Contained, asset restored", ar: "محتوى، وتمت استعادة الأصل" },
  },
];

const integrity = [
  { label: "Templates", ar: "القوالب", value: 98 },
  { label: "Client scripts", ar: "سكربتات العميل", value: 91 },
  { label: "Server routes", ar: "مسارات الخادم", value: 95 },
  { label: "Static assets", ar: "الأصول الثابتة", value: 88 },
  { label: "Config layer", ar: "طبقة الإعدادات", value: 99 },
];

function Reports() {
  const { t, lang } = useI18n();

  const download = () => {
    const rows = forensics
      .map(
        (f) =>
          `${f.id}\t${f.level}\t${lang === "ar" ? f.vector.ar : f.vector.en}\t${f.origin}\t${f.asset}\t${lang === "ar" ? f.outcome.ar : f.outcome.en}`,
      )
      .join("\n");
    const blob = new Blob(
      [`HASEEN — ${t("exec_summary")}\n\nID\tSeverity\tVector\tOrigin\tAsset\tOutcome\n${rows}\n`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "haseen-executive-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">{t("reports_title")}</h1>
        <div className="flex gap-2 print:hidden">
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="size-4" /> {t("print")}
          </Button>
          <Button onClick={download}>
            <Download className="size-4" /> {t("download")}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title={t("forensics")} className="lg:col-span-2">
          <div className="space-y-3">
            {forensics.map((f) => (
              <div key={f.id} className="rounded-lg border border-border/70 bg-secondary/30 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{f.id}</span>
                  <SeverityChip level={f.level} label={t(f.level)} />
                  <span className="text-sm font-medium">
                    {lang === "ar" ? f.vector.ar : f.vector.en}
                  </span>
                </div>
                <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">{t("origin")}</dt>
                    <dd className="mt-1 font-mono text-foreground">{f.origin}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("asset")}</dt>
                    <dd className="mt-1 font-mono text-foreground">{f.asset}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">{t("outcome")}</dt>
                    <dd className="mt-1 text-foreground">
                      {lang === "ar" ? f.outcome.ar : f.outcome.en}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t("ai_integrity")}>
          <div className="space-y-4">
            {integrity.map((i) => (
              <div key={i.label}>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{lang === "ar" ? i.ar : i.label}</span>
                  <span className="font-mono text-foreground">{i.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <span
                    className={`block h-full rounded-full ${i.value >= 95 ? "bg-success" : i.value >= 90 ? "bg-primary" : "bg-warning"}`}
                    style={{ width: `${i.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t("exec_summary")} className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label={t("posture")} value="A−" />
            <Stat label={t("critical")} value="3" />
            <Stat label={t("blocked")} value="1,284" />
            <Stat label={t("integrity")} value="96%" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {lang === "ar"
              ? "خلال آخر 24 ساعة تم رصد 1,284 محاولة ضارة، وحُجبت جميع الهجمات الحرجة قبل الوصول إلى طبقة العرض. متوسط زمن الاحتواء 1.4 ثانية، مع استعادة تلقائية كاملة للأصول المتأثرة والحفاظ على السلامة البنائية عند 96%."
              : "Over the last 24 hours, 1,284 malicious attempts were observed and every critical attack was blocked before reaching the presentation layer. Mean containment time was 1.4 seconds, with full automatic restoration of affected assets and structural integrity held at 96%."}
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/30 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
