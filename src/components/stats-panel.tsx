import type { SessionStats } from "../types/card";
import { Check, X, Clock, Eye } from "lucide-react";

interface StatsPanelProps {
  stats: SessionStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const percentage =
    stats.seen > 0
      ? Math.round((stats.correct / stats.seen) * 100)
      : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-tertiary uppercase tracking-wider">
          Sessione
        </h3>
        <span className="text-lg font-semibold font-mono text-accent">
          {percentage}%
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <StatItem
          icon={<Eye className="w-3.5 h-3.5" />}
          label="Viste"
          value={stats.seen}
          total={stats.total}
          color="text-secondary"
        />
        <StatItem
          icon={<Check className="w-3.5 h-3.5" />}
          label="Corrette"
          value={stats.correct}
          color="text-correct"
        />
        <StatItem
          icon={<X className="w-3.5 h-3.5" />}
          label="Errate"
          value={stats.incorrect}
          color="text-incorrect"
        />
        <StatItem
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Rivedi"
          value={stats.review}
          color="text-review"
        />
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-surface rounded-full overflow-hidden flex">
        {stats.correct > 0 && (
          <div
            className="h-full bg-correct transition-all duration-300"
            style={{ width: `${(stats.correct / stats.total) * 100}%` }}
          />
        )}
        {stats.incorrect > 0 && (
          <div
            className="h-full bg-incorrect transition-all duration-300"
            style={{ width: `${(stats.incorrect / stats.total) * 100}%` }}
          />
        )}
        {stats.review > 0 && (
          <div
            className="h-full bg-review transition-all duration-300"
            style={{ width: `${(stats.review / stats.total) * 100}%` }}
          />
        )}
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  total,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`inline-flex items-center justify-center ${color} mb-1`}>
        {icon}
      </div>
      <div className={`text-base font-semibold font-mono ${color}`}>
        {value}
        {total !== undefined && (
          <span className="text-tertiary text-xs">/{total}</span>
        )}
      </div>
      <div className="text-[10px] text-tertiary">{label}</div>
    </div>
  );
}
