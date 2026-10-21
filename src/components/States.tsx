import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" /> {label}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}

export function PageCard({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl bg-card p-6 shadow-card sm:p-8">{children}</div>;
}
