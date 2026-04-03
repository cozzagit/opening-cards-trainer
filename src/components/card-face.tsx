import type { Card, CardResult } from "../types/card";
import { Check, X, Clock, ChevronRight, Eye } from "lucide-react";

interface CardFaceProps {
  card: Card;
  isRevealed: boolean;
  onReveal: () => void;
  onRespond: (result: CardResult) => void;
  onNext: () => void;
  cardIndex: number;
  totalCards: number;
  previousResult?: CardResult;
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

const DIFFICULTY_LABELS: Record<string, string> = {
  base: "Base",
  intermediate: "Intermedio",
  advanced: "Avanzato",
};

export function CardFace({
  card,
  isRevealed,
  onReveal,
  onRespond,
  onNext,
  cardIndex,
  totalCards,
}: CardFaceProps) {
  return (
    <div className="card-container w-full max-w-xl mx-auto">
      <div className={`card-inner relative ${isRevealed ? "flipped" : ""}`}>
        {/* FRONT */}
        <div className="card-front absolute inset-0">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
            {/* Card header */}
            <div className="px-5 pt-4 pb-3 border-b border-border-light">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: CATEGORY_COLORS[card.category] }}
                  />
                  <span className="text-xs font-medium text-secondary">
                    {CATEGORY_LABELS[card.category]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-tertiary">
                    {DIFFICULTY_LABELS[card.difficulty]}
                  </span>
                  <span className="text-xs font-mono text-tertiary">
                    {cardIndex + 1}/{totalCards}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-primary">
                {card.opening}
              </h3>
              <p className="text-xs text-secondary">{card.variation}</p>
            </div>

            {/* Moves */}
            <div className="px-5 py-4 flex-1 flex flex-col">
              {card.front.moves_san.length > 0 && (
                <div className="san-moves text-base text-primary bg-surface rounded-lg px-4 py-3 mb-4">
                  {card.front.moves_san.join(" ")}
                </div>
              )}

              {/* Side to move */}
              {card.front.moves_san.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-3 h-3 rounded-sm border border-border ${
                      card.side_to_move === "white" ? "bg-white" : "bg-primary"
                    }`}
                  />
                  <span className="text-xs text-secondary">
                    {card.side_to_move === "white" ? "Tratto al Bianco" : "Tratto al Nero"}
                  </span>
                </div>
              )}

              {/* Question */}
              <div className="mt-auto">
                <p className="text-base font-medium text-primary leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                  {card.front.question}
                </p>
              </div>
            </div>

            {/* Reveal button */}
            <div className="px-5 pb-4">
              <button
                onClick={onReveal}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-inverse text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors"
              >
                <Eye className="w-4 h-4" />
                Mostra soluzione
                <span className="kbd text-inverse/60 bg-accent-hover border-accent-hover shadow-none ml-1">Space</span>
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="card-back absolute inset-0">
          <div className="bg-card-back text-inverse border border-transparent rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
            {/* Back header */}
            <div className="px-5 pt-4 pb-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">Soluzione</span>
                <span className="text-xs font-mono text-white/40">{card.id}</span>
              </div>
            </div>

            {/* Answer */}
            <div className="px-5 py-4 flex-1 flex flex-col">
              <div className="san-moves text-lg font-semibold text-white bg-white/10 rounded-lg px-4 py-3 mb-4">
                {card.back.answer_san}
              </div>

              <p className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                {card.back.explanation}
              </p>

              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Response buttons */}
            <div className="px-5 pb-4 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onRespond("correct")}
                  className="flex flex-col items-center gap-1 px-3 py-2.5 bg-correct/20 text-correct rounded-xl hover:bg-correct/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">Sapevo</span>
                  <span className="kbd text-correct/60 bg-correct/10 border-correct/20 shadow-none text-[10px]">1</span>
                </button>
                <button
                  onClick={() => onRespond("incorrect")}
                  className="flex flex-col items-center gap-1 px-3 py-2.5 bg-incorrect/20 text-incorrect rounded-xl hover:bg-incorrect/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-xs font-medium">Non sapevo</span>
                  <span className="kbd text-incorrect/60 bg-incorrect/10 border-incorrect/20 shadow-none text-[10px]">2</span>
                </button>
                <button
                  onClick={() => onRespond("review")}
                  className="flex flex-col items-center gap-1 px-3 py-2.5 bg-review/20 text-review rounded-xl hover:bg-review/30 transition-colors"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Rivedi</span>
                  <span className="kbd text-review/60 bg-review/10 border-review/20 shadow-none text-[10px]">3</span>
                </button>
              </div>
              <button
                onClick={onNext}
                className="w-full flex items-center justify-center gap-1 px-4 py-2 text-white/40 text-xs hover:text-white/60 transition-colors"
              >
                Salta senza valutare <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
