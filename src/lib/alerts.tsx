import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const SOC_RECIPIENT = "analyst@company.com";

export type AlertEntry = {
  id: string;
  time: string; // HH:MM:SS UTC
  date: string; // YYYY-MM-DD
  recipient: string;
  level: "critical" | "high" | "medium" | "low";
  vector: { en: string; ar: string };
  status: { en: string; ar: string };
};

const KEY = "haseen.alerts";

const seed: AlertEntry[] = [
  {
    id: "ALR-2201",
    date: "2026-09-11",
    time: "20:41:09",
    recipient: SOC_RECIPIENT,
    level: "critical",
    vector: { en: "Structural tampering", ar: "تلاعب بالبنية" },
    status: { en: "Blocked", ar: "محجوب" },
  },
  {
    id: "ALR-2198",
    date: "2026-09-11",
    time: "20:33:16",
    recipient: SOC_RECIPIENT,
    level: "medium",
    vector: { en: "Defacement attempt", ar: "محاولة تشويه" },
    status: { en: "Contained", ar: "محتوى" },
  },
];

type Ctx = {
  alerts: AlertEntry[];
  pushAlert: (a: Omit<AlertEntry, "id" | "time" | "date" | "recipient">) => AlertEntry;
};

const AlertsCtx = createContext<Ctx>({
  alerts: seed,
  pushAlert: () => seed[0]!,
});

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertEntry[]>(seed);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) setAlerts(JSON.parse(raw) as AlertEntry[]);
    } catch {
      /* ignore */
    }
  }, []);

  const pushAlert = useCallback<Ctx["pushAlert"]>((partial) => {
    const now = new Date();
    const entry: AlertEntry = {
      id: `ALR-${2200 + Math.floor(Math.random() * 800)}`,
      date: now.toISOString().slice(0, 10),
      time: now.toISOString().slice(11, 19),
      recipient: SOC_RECIPIENT,
      ...partial,
    };
    setAlerts((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    return entry;
  }, []);

  return <AlertsCtx.Provider value={{ alerts, pushAlert }}>{children}</AlertsCtx.Provider>;
}

export const useAlerts = () => useContext(AlertsCtx);
