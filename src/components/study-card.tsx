import { useState } from "react";
import type { Card, CardCategory, CardDifficulty } from "../types/card";
import { ChessBoard } from "./chess-board";
import { Eye, EyeOff } from "lucide-react";

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
  const [showAnswer, setShowAnswer] = useState(false);
  const catColor = CAT_COLORS[card.category];
  const catLight = CAT_LIGHT[card.category];
  const n = DIFF_DIAMONDS[card.difficulty];
  const hasBoard = card.front.moves_san.length > 0;

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden w-full max-w-sm mx-auto border border-border-light">
      {/* Category bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: catColor }}>
        <span className="text-[10px] font-sans font-semibold tracking-widest text-white/90">
          {CAT_LABELS[card.category]}
        </span>
        <span className="inline-flex items-center gap-0.5 text-white/90">
          {[0, 1, 2].map(i => (
            <span key={i} className={`diamond ${i < n ? "diamond-filled" : ""}`} style={{ opacity: i < n ? 1 : 0.3 }} />
          ))}
        </span>
      </div>

      {/* Identity */}
      <div className="px-4 pt-3 pb-2 text-center">
        <h3 className="text-base font-serif font-semibold text-primary">{card.opening}</h3>
        <p className="text-[11px] text-secondary font-sans mt-0.5">{card.variation}</p>
      </div>
      <div className="mx-4 h-px" style={{ background: catColor, opacity: 0.15 }} />

      {/* Board + moves */}
      {hasBoard && (
        <div className="px-4 pt-3 flex flex-col items-center gap-2">
          <ChessBoard moves={card.front.moves_san} size={160} />
          <div className="san-moves text-[12px] text-primary text-center px-2 py-1 bg-surface rounded-md w-full">
            {card.front.moves_san.join(" ")}
          </div>
        </div>
      )}

      {/* Question */}
      <div className="px-4 pt-3 pb-2">
        <div className="rounded-lg px-3 py-2" style={{ background: catLight }}>
          <p className="text-sm font-serif text-primary leading-relaxed">{card.front.question}</p>
        </div>
      </div>

      {/* Toggle answer */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-sans text-secondary hover:text-primary transition-colors"
        >
          {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showAnswer ? "Nascondi risposta" : "Mostra risposta"}
        </button>
      </div>

      {/* Answer (collapsible in study mode) */}
      {showAnswer && (
        <div className="border-t border-dashed border-border mx-4">
          <div className="py-3">
            <span className="text-[10px] font-sans font-semibold tracking-widest" style={{ color: catColor }}>RISPOSTA</span>
            <div className="san-moves text-base font-bold text-primary mt-1.5">{card.back.answer_san}</div>
            <p className="text-sm font-serif text-secondary leading-relaxed mt-1.5">{card.back.explanation}</p>
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {card.tags.map(tag => <span key={tag} className="tag-pill">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
          <span className="text-[9px] font-mono text-tertiary">{card.id}</span>
        </div>
      </div>
    </div>
  );
}
