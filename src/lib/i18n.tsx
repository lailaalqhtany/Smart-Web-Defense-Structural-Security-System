import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

const dict = {
  brand: { en: "HASEEN", ar: "حصين" },
  tagline: {
    en: "Smart Web Defense & Structural Security System",
    ar: "نظام الدفاع الذكي والأمن البنائي للويب",
  },
  nav_dashboard: { en: "Dashboard", ar: "لوحة الأمن" },
  nav_reports: { en: "Reports", ar: "التقارير" },
  nav_access: { en: "Access", ar: "الدخول" },
  lang_switch: { en: "العربية", ar: "English" },

  // auth
  login: { en: "Sign in", ar: "تسجيل الدخول" },
  register: { en: "Create account", ar: "إنشاء حساب" },
  email: { en: "Work email", ar: "البريد المؤسسي" },
  password: { en: "Password", ar: "كلمة المرور" },
  org: { en: "Organization", ar: "الجهة" },
  fullname: { en: "Full name", ar: "الاسم الكامل" },
  continue: { en: "Continue", ar: "متابعة" },
  verify_title: { en: "Email verification", ar: "التحقق من البريد" },
  verify_desc: {
    en: "Enter the 6-digit security code sent to",
    ar: "أدخل رمز الأمان المكوّن من 6 أرقام المُرسل إلى",
  },
  verify_action: { en: "Verify & unlock console", ar: "تحقق وافتح المنصة" },
  resend: { en: "Resend code", ar: "إعادة إرسال الرمز" },
  signout: { en: "Sign out", ar: "تسجيل الخروج" },
  back: { en: "Back", ar: "رجوع" },
  auth_note: {
    en: "Protected by hardened session policies and two-factor enforcement.",
    ar: "محمي بسياسات جلسات مشددة وتحقق ثنائي إلزامي.",
  },

  // dashboard
  threat_score: { en: "Overall threat score", ar: "مؤشر التهديد العام" },
  health_pulse: { en: "System health pulse", ar: "نبض سلامة النظام" },
  uptime: { en: "Uptime", ar: "زمن التشغيل" },
  latency: { en: "Response latency", ar: "زمن الاستجابة" },
  integrity: { en: "Structural integrity", ar: "السلامة البنائية" },
  detection: { en: "Real-time attack detection", ar: "كشف الهجمات الفوري" },
  tampering: { en: "Structural tampering", ar: "تلاعب بالبنية" },
  defacement: { en: "Defacement attempt", ar: "محاولة تشويه" },
  injection: { en: "Script injection", ar: "حقن سكربتات" },
  response: { en: "Autonomous incident response", ar: "الاستجابة الذاتية للحوادث" },
  auto_maint: { en: "Auto maintenance mode", ar: "وضع الصيانة التلقائي" },
  isolation: { en: "Server isolation", ar: "عزل الخادم" },
  rollback: { en: "Instant rollback", ar: "استرجاع فوري" },
  logs: { en: "Live audit log", ar: "سجل التدقيق الحي" },
  severity: { en: "Severity", ar: "الخطورة" },
  critical: { en: "Critical", ar: "حرج" },
  high: { en: "High", ar: "مرتفع" },
  medium: { en: "Medium", ar: "متوسط" },
  low: { en: "Low", ar: "منخفض" },
  blocked: { en: "Blocked", ar: "محجوب" },
  monitoring: { en: "Monitoring", ar: "مراقبة" },
  contained: { en: "Contained", ar: "محتوى" },
  events_hr: { en: "events / hour", ar: "حدث / ساعة" },
  active_shields: { en: "Active shields", ar: "الدروع النشطة" },

  // reports
  reports_title: { en: "Advanced security reports", ar: "التقارير الأمنية المتقدمة" },
  forensics: { en: "Forensic breakdown", ar: "التحليل الجنائي" },
  ai_integrity: { en: "AI behavioral code integrity", ar: "سلامة الكود السلوكية بالذكاء الاصطناعي" },
  exec_summary: { en: "Executive summary", ar: "الملخص التنفيذي" },
  print: { en: "Print report", ar: "طباعة التقرير" },
  download: { en: "Download summary", ar: "تنزيل الملخص" },
  vector: { en: "Attack vector", ar: "ناقل الهجوم" },
  origin: { en: "Origin", ar: "المصدر" },
  asset: { en: "Targeted asset", ar: "الأصل المستهدف" },
  outcome: { en: "Outcome", ar: "النتيجة" },
  posture: { en: "Security posture", ar: "الوضع الأمني" },

  // alerts
  alert_log: { en: "Alert log", ar: "سجل الإشعارات" },
  alert_recipient: { en: "Recipient", ar: "المستلم" },
  alert_time: { en: "Timestamp (UTC)", ar: "الوقت (UTC)" },
  alert_status: { en: "Threat status", ar: "حالة التهديد" },
  alert_none: {
    en: "No alerts dispatched in this session yet.",
    ar: "لا توجد إشعارات مُرسلة في هذه الجلسة بعد.",
  },
  notify_soc: { en: "Escalate to SOC", ar: "تصعيد إلى مركز العمليات" },
  alert_sent: {
    en: "Automated Incident Alert Sent to SOC Analyst (analyst@company.com)",
    ar: "تم إرسال إشعار فوري لمهندس الأمن (analyst@company.com)",
  },
  open_menu: { en: "Open security menu", ar: "فتح قائمة الأمن" },
} as const;

export type Key = keyof typeof dict;

const Ctx = createContext<{
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (k: Key) => string;
  toggle: () => void;
}>({ lang: "en", dir: "ltr", t: (k) => dict[k].en, toggle: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback((k: Key) => dict[k][lang], [lang]);
  const toggle = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);

  return <Ctx.Provider value={{ lang, dir, t, toggle }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
