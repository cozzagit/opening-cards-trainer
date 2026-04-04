import { useState } from "react";
import type { Card, CardCategory, CardDifficulty, MasteryLevel } from "../types/card";
import { MASTERY_COLORS } from "../types/card";
import { ChessBoard } from "./chess-board";
import { FormattedMoves } from "./formatted-moves";
import { Eye, EyeOff } from "lucide-react";

const CAT_LABELS: Record<CardCategory, string> = {
  continuation: "CONTINUAZIONE", recognition: "RICONOSCIMENTO",
  concept: "CONCETTO", error: "ERRORE",
};
const CAT_COLORS: Record<CardCategory, string> = {
  continuation: "var(--cat-continuation)", recognition: "var(--cat-recognition)",
  concept: "var(--cat-concept)", error: "var(--cat-error)",
};
const CAT_LIGHT: Record<CardCategory, string> = {
  continuation: "var(--cat-continuation-light)", recognition: "var(--cat-recognition-light)",
  concept: "var(--cat-concept-light)", error: "var(--cat-error-light)",
};
const DIFF_N: Record<CardDifficulty, number> = { base: 1, intermediate: 2, advanced: 3 };
const MASTERY_LABELS: Record<MasteryLevel, string> = {
  new: "Nuova", learning: "App.", familiar: "Fam.", mastered: "Padr.",
};

interface StudyCardProps {
  card: Card;
  mastery?: MasteryLevel;
}

export function StudyCard({ card, mastery = "new" }: StudyCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const catColor = CAT_COLORS[card.category];
  const catLight = CAT_LIGHT[card.category];
  const diamonds = DIFF_N[card.difficulty];
  const hasBoard = card.front.moves_san.length > 0;

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden w-full max-w-sm mx-auto border border-border-light">
      {/* Category bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: catColor }}>
        <span className="text-[10px] font-sans font-semibold tracking-widest text-white/90">{CAT_LABELS[card.category]}</span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-sans text-white/60">{MASTERY_LABELS[mastery]}</span>
          <div className="w-2 h-2 rounded-full" style={{ background: MASTERY_COLORS[mastery], boxShadow: `0 0 4px ${MASTERY_COLORS[mastery]}` }} />
          <span className="inline-flex items-center gap-0.5 text-white/90">
            {[0, 1, 2].map(i => (
              <span key={i} className={`diamond ${i < diamonds ? "diamond-filled" : ""}`} style={{ opacity: i < diamonds ? 1 : 0.3 }} />
            ))}
          </span>
        </div>
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
          <div className="bg-surface rounded-lg px-3 py-2 w-full">
            <FormattedMoves moves={card.front.moves_san} className="text-[11px]" />
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
      <div className="px-4 pb-1">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans font-medium rounded-lg transition-all active:scale-[0.97]"
          style={!showAnswer ? { background: "var(--accent)", color: "var(--text-inverse)" } : { background: "var(--bg-surface)", color: "var(--text-secondary)" }}
        >
          {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showAnswer ? "Nascondi risposta" : "Mostra risposta"}
        </button>
      </div>

      {/* Answer */}
      {showAnswer && (
        <div className="mx-4 mt-2 mb-3 rounded-xl overflow-hidden animate-[fadeIn_0.2s_ease-out]" style={{ background: "var(--bg-card-back)" }}>
          <div className="h-0.5" style={{ background: catColor }} />
          <div className="px-4 py-3">
            <span className="text-[10px] font-sans font-semibold tracking-widest" style={{ color: catColor }}>RISPOSTA</span>
            <div className="san-moves text-base font-bold text-white mt-1.5">{card.back.answer_san}</div>
            <p className="text-[13px] font-serif text-white/75 leading-relaxed mt-1.5 border-t border-dashed border-white/10 pt-2">
              {card.back.explanation}
            </p>
            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {card.tags.map(tag => <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/35 font-sans">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
          <span className="text-[9px] font-mono text-tertiary">{card.id}</span>
        </div>
      </div>
    </div>
  );
}
