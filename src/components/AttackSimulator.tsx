import { useState } from "react";
import {
  ShieldAlert,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RotateCcw,
  Activity,
  ShieldCheck,
} from "lucide-react";

export type Severity = "Critical" | "High" | "Medium";

export interface Log {
  id: number;
  type: string;
  ip: string;
  time: string;
  status: "Active" | "Blocked";
  severity: Severity;
}

export default function AttackSimulator() {
  const [logs, setLogs] = useState<Log[]>([
    {
      id: 1,
      type: "SQL Injection Attempt",
      ip: "192.168.1.105",
      time: "08:42:10 PM",
      status: "Active",
      severity: "Critical",
    },
    {
      id: 2,
      type: "Unauthorized Access",
      ip: "10.0.0.42",
      time: "08:40:15 PM",
      status: "Active",
      severity: "Medium",
    },
  ]);

  const handleSimulateAttack = () => {
    const attackOptions: Array<{ name: string; severity: Severity }> = [
      { name: "XSS Attack Detected", severity: "High" },
      { name: "Brute Force Attempt", severity: "Medium" },
      { name: "DDoS Attack Spike", severity: "Critical" },
      { name: "Defacement Warning", severity: "High" },
      { name: "Ransomware Behavior", severity: "Critical" },
    ];

    const randomIP = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const randomIndex = Math.floor(Math.random() * attackOptions.length);
    const selectedAttack = attackOptions[randomIndex];

    if (!selectedAttack) return;

    const newLog: Log = {
      id: Date.now(),
      type: selectedAttack.name,
      ip: randomIP,
      time: new Date().toLocaleTimeString(),
      status: "Active",
      severity: selectedAttack.severity,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  const handleBlockIP = (id: number) => {
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status: "Blocked" } : log))
    );
  };

  const handleReset = () => {
    setLogs([]);
  };

  const activeThreats = logs.filter((l) => l.status === "Active").length;
  const blockedThreats = logs.filter((l) => l.status === "Blocked").length;

  return (
    <div dir="rtl" className="p-6 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-500 w-7 h-7 animate-pulse" />
          <div>
            <h2 className="text-xl font-bold tracking-wide">HASEEN SOC Live Monitor</h2>
            <p className="text-xs text-slate-400">نظام المراقبة والاستجابة الفورية للهجمات السيبرانية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm py-2 px-3 rounded-lg transition-all border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> مسح
          </button>
          <button
            onClick={handleSimulateAttack}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-lg active:scale-95"
          >
            <Zap className="w-4 h-4" /> محاكاة هجوم جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">إجمالي الهجمات</div>
            <div className="text-xl font-bold">{logs.length}</div>
          </div>
          <Activity className="w-5 h-5 text-blue-400" />
        </div>

        <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">تهديدات نشطة</div>
            <div className="text-xl font-bold text-red-400">{activeThreats}</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>

        <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">تم حظرها</div>
            <div className="text-xl font-bold text-emerald-400">{blockedThreats}</div>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            لا توجد تهديدات مسجلة حالياً. اضغط محاكاة هجوم جديد للبدء.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                log.status === "Blocked"
                  ? "bg-slate-950/40 border-emerald-900/40 opacity-60"
                  : "bg-slate-800/70 border-slate-700 hover:border-red-500/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {log.status === "Blocked" ? (
                  <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0 animate-bounce" />
                )}
                <div>
                  <div className="font-semibold flex items-center gap-2 text-sm md:text-base">
                    {log.type}
                    <span
                      className={`text-xs px-2 py-0.5 rounded border font-normal ${
                        log.severity === "Critical"
                          ? "bg-red-950 text-red-400 border-red-800"
                          : log.severity === "High"
                          ? "bg-orange-950 text-orange-400 border-orange-800"
                          : "bg-amber-950 text-amber-400 border-amber-800"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>Target IP: <code className="text-slate-200 inline-block">{log.ip}</code></span>
                    <span>•</span>
                    <span>الوقت: {log.time}</span>
                  </div>
                </div>
              </div>

              <div>
                {log.status === "Blocked" ? (
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
                    تم الحظر (Blocked)
                  </span>
                ) : (
                  <button
                    onClick={() => handleBlockIP(log.id)}
                    className="flex items-center gap-1 bg-slate-700 hover:bg-red-600 text-white text-xs md:text-sm font-medium py-1.5 px-3 rounded transition-colors"
                  >
                    <Ban className="w-4 h-4" /> حظر IP
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}