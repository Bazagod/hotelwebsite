import { type LucideIcon, Construction } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  features?: string[];
}

export function ComingSoon({ title, description, icon: Icon = Construction, features }: ComingSoonProps) {
  return (
    <>
      <DashboardHeader title={title} subtitle={description} />
      <div className="rounded-xl bg-white/5 border border-white/10 p-12 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-luxury-gold" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Module Under Development</h2>
        <p className="text-gray-400 text-sm mb-6">
          This module&apos;s backend schema and API structure are ready. The frontend interface is being built.
        </p>
        {features && features.length > 0 && (
          <div className="text-left bg-white/[0.02] rounded-lg border border-white/5 p-5 mt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Planned capabilities</p>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/60 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
