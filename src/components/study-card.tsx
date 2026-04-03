import type { Card, CardCategory, CardDifficulty } from "../types/card";

const CAT_LABELS: Record<CardCategory, string> = {
  continuation: "CONTINUAZIONE",
  recognition: "RICONOSCIMENTO",
  concept: "CONCETTO",
  error: "ERRORE",
};

const CAT_COLORS: Record<CardCategory, string> = {
  continuation: "var(--cat-continuation)",
  recognition: "var(--cat-recognition)",
  concept: "var(--cat-concept)",
  error: "var(--cat-error)",
};

const CAT_LIGHT: Record<CardCategory, string> = {
  continuation: "var(--cat-continuation-light)",
  recognition: "var(--cat-recognition-light)",
  concept: "var(--cat-concept-light)",
  error: "var(--cat-error-light)",
};

const DIFF_DIAMONDS: Record<CardDifficulty, number> = { base: 1, intermediate: 2, advanced: 3 };

export function StudyCard({ card }: { card: Card }) {
  const catColor = CAT_COLORS[card.category];
  const catLight = CAT_LIGHT[card.category];
  const diamonds = DIFF_DIAMONDS[card.difficulty];

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden w-full max-w-md mx-auto border border-border-light">
      {/* Category bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: catColor }}>
        <span className="text-[10px] font-sans font-semibold tracking-widest text-white/90">
          {CAT_LABELS[card.category]}
        </span>
        <span className="inline-flex items-center gap-0.5 text-white/90">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`diamond ${i < diamonds ? "diamond-filled" : ""}`} style={{ opacity: i < diamonds ? 1 : 0.3 }} />
          ))}
        </span>
      </div>

      {/* Identity */}
      <div className="px-5 pt-4 pb-3 text-center">
        <h3 className="text-lg font-serif font-medium text-primary">{card.opening}</h3>
        <p className="text-xs text-secondary font-sans mt-0.5">{card.variation}</p>
        <div className="mt-3 h-px w-full" style={{ background: catColor, opacity: 0.2 }} />
      </div>

      {/* Front — moves + question */}
      <div className="px-5 pb-3">
        {card.front.moves_san.length > 0 && (
          <div className="san-moves text-[15px] text-primary bg-surface rounded-lg px-4 py-3 mb-3 text-center">
            {card.front.moves_san.join(" ")}
          </div>
        )}
        <div className="rounded-lg px-4 py-3" style={{ background: catLight }}>
          <p className="text-sm font-serif text-primary leading-relaxed">{card.front.question}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-dashed border-border" />

      {/* Back — answer + explanation (always visible) */}
      <div className="px-5 py-4">
        <span className="text-[10px] font-sans font-semibold tracking-widest" style={{ color: catColor }}>
          RISPOSTA
        </span>
        <div className="san-moves text-base font-bold text-primary mt-2 mb-2">
          {card.back.answer_san}
        </div>
        <p className="text-sm font-serif text-secondary leading-relaxed">
          {card.back.explanation}
        </p>
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {card.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
          <span className="text-[10px] font-mono text-tertiary">{card.id}</span>
        </div>
      </div>
    </div>
  );
}
