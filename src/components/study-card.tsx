import type { Card } from "../types/card";

interface StudyCardProps {
  card: Card;
}

const CATEGORY_LABELS: Record<string, string> = {
  continuation: "Continuazione",
  recognition: "Riconoscimento",
  concept: "Concetto",
  error: "Errore tipico",
};

const CATEGORY_COLORS: Record<string, string> = {
  continuation: "#3B82F6",
  recognition: "#8B5CF6",
  concept: "#059669",
  error: "#DC2626",
};

export function StudyCard({ card }: StudyCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-border-light">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: CATEGORY_COLORS[card.category] }}
            />
            <span className="text-xs font-medium text-secondary">
              {CATEGORY_LABELS[card.category]}
            </span>
            <span className="text-xs text-tertiary">&middot; {card.difficulty}</span>
          </div>
          <span className="text-xs font-mono text-tertiary">{card.id}</span>
        </div>
        <h3 className="text-sm font-semibold text-primary">{card.opening}</h3>
        <p className="text-xs text-secondary">{card.variation}</p>
      </div>

      {/* Front content */}
      <div className="px-5 py-4 border-b border-border-light">
        {card.front.moves_san.length > 0 && (
          <div className="san-moves text-base text-primary bg-surface rounded-lg px-4 py-3 mb-3">
            {card.front.moves_san.join(" ")}
          </div>
        )}
        <p className="text-sm text-secondary" style={{ fontFamily: "var(--font-serif)" }}>
          {card.front.question}
        </p>
      </div>

      {/* Back content (always visible in study mode) */}
      <div className="px-5 py-4 bg-surface/50">
        <div className="san-moves text-base font-semibold text-primary mb-2">
          {card.back.answer_san}
        </div>
        <p className="text-sm text-secondary leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
          {card.back.explanation}
        </p>
      </div>
    </div>
  );
}
