import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  desc,
  action,
  children,
  className,
}: {
  title?: string;
  desc?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card/80 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="text-sm font-semibold tracking-wide text-foreground">{title}</h2>
            )}
            {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-input bg-secondary/40 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/70 focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: { variant?: "primary" | "ghost" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/85 shadow-[0_0_24px_-8px_var(--primary)]",
        variant === "ghost" &&
          "border border-border bg-secondary/50 text-foreground hover:border-primary/50 hover:text-primary",
        variant === "danger" && "bg-destructive text-destructive-foreground hover:bg-destructive/85",
        className,
      )}
    />
  );
}

export function Switch({
  checked,
  onChange,
  label,
  desc,
  tone = "primary",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
  tone?: "primary" | "success" | "danger";
}) {
  const onColor =
    tone === "danger" ? "bg-destructive" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-secondary/30 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors",
          checked ? onColor : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-background transition-all",
            checked ? "start-[22px]" : "start-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function SeverityChip({ level, label }: { level: string; label: string }) {
  const map: Record<string, string> = {
    critical: "border-destructive/50 bg-destructive/15 text-destructive",
    high: "border-warning/50 bg-warning/15 text-warning",
    medium: "border-primary/50 bg-primary/15 text-primary",
    low: "border-success/50 bg-success/15 text-success",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        map[level] ?? map["low"],
      )}
    >
      {label}
    </span>
  );
}
