import type { SessionStats } from "../types/card";
import { Check, X, Clock, Eye } from "lucide-react";

interface StatsPanelProps {
  stats: SessionStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const percentage = stats.seen > 0 ? Math.round((stats.correct / stats.seen) * 100) : 0;

  return (
    <div className="bg-card border border-border-light rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-sans font-semibold text-tertiary uppercase tracking-widest">
          Sessione
        </h3>
        <span className="text-lg font-semibold font-mono text-accent">{percentage}%</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatItem icon={<Eye className="w-3.5 h-3.5" />} label="Viste" value={stats.seen} total={stats.total} color="var(--text-secondary)" />
        <StatItem icon={<Check className="w-3.5 h-3.5" />} label="Corrette" value={stats.correct} color="var(--correct)" />
        <StatItem icon={<X className="w-3.5 h-3.5" />} label="Errate" value={stats.incorrect} color="var(--incorrect)" />
        <StatItem icon={<Clock className="w-3.5 h-3.5" />} label="Rivedi" value={stats.review} color="var(--review)" />
      </div>

      {/* Tri-color progress */}
      <div className="mt-3 h-1 bg-surface rounded-full overflow-hidden flex">
        {stats.correct > 0 && (
          <div className="h-full transition-all duration-300" style={{ width: `${(stats.correct / stats.total) * 100}%`, background: "var(--correct)" }} />
        )}
        {stats.incorrect > 0 && (
          <div className="h-full transition-all duration-300" style={{ width: `${(stats.incorrect / stats.total) * 100}%`, background: "var(--incorrect)" }} />
        )}
        {stats.review > 0 && (
          <div className="h-full transition-all duration-300" style={{ width: `${(stats.review / stats.total) * 100}%`, background: "var(--review)" }} />
        )}
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, total, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center mb-1" style={{ color }}>{icon}</div>
      <div className="text-base font-semibold font-mono" style={{ color }}>
        {value}
        {total !== undefined && <span className="text-tertiary text-xs">/{total}</span>}
      </div>
      <div className="text-[9px] font-sans text-tertiary">{label}</div>
    </div>
  );
}
