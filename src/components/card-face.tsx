import type { Card, CardResult, CardCategory, CardDifficulty } from "../types/card";
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

const DIFF_DIAMONDS: Record<CardDifficulty, number> = {
  base: 1,
  intermediate: 2,
  advanced: 3,
};

function DifficultyDiamonds({ level, color }: { level: CardDifficulty; color: string }) {
  const count = DIFF_DIAMONDS[level];
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={`diamond ${i < count ? "diamond-filled" : ""}`}
          style={{ opacity: i < count ? 1 : 0.3 }}
        />
      ))}
    </span>
  );
}

function SideIndicator({ side }: { side: "white" | "black" }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`side-indicator ${side === "white" ? "side-white" : "side-black"}`} />
      <span className="text-xs text-secondary font-sans">
        {side === "white" ? "Tratto al Bianco" : "Tratto al Nero"}
      </span>
    </div>
  );
}

export function CardFace({
  card,
  isRevealed,
  onReveal,
  onRespond,
  onNext,
  cardIndex,
  totalCards,
}: CardFaceProps) {
  const catColor = CAT_COLORS[card.category];
  const catLight = CAT_LIGHT[card.category];

  return (
    <div className="card-container w-full max-w-md mx-auto">
      <div className={`card-inner relative ${isRevealed ? "flipped" : ""}`}>
        {/* ════ FRONT ════ */}
        <div className="card-front absolute inset-0">
          <div className="bg-card rounded-xl shadow-sm overflow-hidden h-full flex flex-col border border-border-light">
            {/* Zone 1 — Category Bar */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ background: catColor }}
            >
              <span className="text-[10px] font-sans font-semibold tracking-widest text-white/90">
                {CAT_LABELS[card.category]}
              </span>
              <DifficultyDiamonds level={card.difficulty} color="rgba(255,255,255,0.9)" />
            </div>

            {/* Zone 2 — Opening Identity */}
            <div className="px-5 pt-4 pb-3">
              <h3 className="text-lg font-serif font-medium text-primary text-center">
                {card.opening}
              </h3>
              <p className="text-xs text-secondary text-center mt-0.5 font-sans">
                {card.variation}
              </p>
              <div
                className="mt-3 h-px w-full"
                style={{ background: catColor, opacity: 0.2 }}
              />
            </div>

            {/* Zone 3 — Move Display */}
            <div className="px-5 flex-1 flex flex-col">
              {card.front.moves_san.length > 0 && (
                <div className="san-moves text-[15px] leading-relaxed text-primary bg-surface rounded-lg px-4 py-3 mb-3 text-center">
                  {card.front.moves_san.join(" ")}
                </div>
              )}

              {card.front.moves_san.length > 0 && (
                <div className="mb-3">
                  <SideIndicator side={card.side_to_move} />
                </div>
              )}

              {/* Zone 4 — Question */}
              <div
                className="rounded-lg px-4 py-3 mt-auto mb-3"
                style={{ background: catLight }}
              >
                <p className="text-base font-serif text-primary leading-relaxed">
                  {card.front.question}
                </p>
              </div>
            </div>

            {/* Reveal button */}
            <div className="px-5 pb-4">
              <button
                onClick={onReveal}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-inverse text-sm font-sans font-medium rounded-lg transition-colors"
                style={{ background: "var(--accent)", }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
              >
                <Eye className="w-4 h-4" />
                Mostra soluzione
                <span className="kbd text-inverse/50 bg-white/10 border-white/20 shadow-none ml-1">Space</span>
              </button>
            </div>

            {/* Zone 5 — Footer */}
            <div className="px-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
                <span className="text-[10px] font-mono text-tertiary">{card.id}</span>
              </div>
              <span className="text-[10px] font-mono text-tertiary">
                {cardIndex + 1}/{totalCards}
              </span>
            </div>
          </div>
        </div>

        {/* ════ BACK ════ */}
        <div className="card-back absolute inset-0">
          <div className="card-back-pattern rounded-xl overflow-hidden h-full flex flex-col border border-accent/30">
            {/* Inner content panel */}
            <div className="flex-1 flex flex-col m-2 rounded-lg bg-[#2C2825] overflow-hidden">
              {/* Category echo bar */}
              <div className="h-1" style={{ background: catColor }} />

              {/* Answer header */}
              <div className="px-5 pt-4 pb-2 text-center">
                <span
                  className="text-[10px] font-sans font-semibold tracking-widest"
                  style={{ color: catColor }}
                >
                  RISPOSTA
                </span>
              </div>

              {/* Answer display */}
              <div className="px-5 pb-3">
                <div className="san-moves text-xl font-bold text-white text-center bg-white/5 rounded-lg px-4 py-3">
                  {card.back.answer_san}
                </div>
              </div>

              {/* Explanation */}
              <div className="px-5 pb-3 flex-1">
                <div className="border-t border-dashed border-white/10 pt-3">
                  <p className="text-sm font-serif text-white/75 leading-relaxed">
                    {card.back.explanation}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {card.tags.length > 0 && (
                <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-white/40 font-sans">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Response buttons */}
              <div className="px-4 pb-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <ResponseButton
                    onClick={() => onRespond("correct")}
                    icon={<Check className="w-4 h-4" />}
                    label="Sapevo"
                    kbd="1"
                    color="var(--correct)"
                  />
                  <ResponseButton
                    onClick={() => onRespond("incorrect")}
                    icon={<X className="w-4 h-4" />}
                    label="Non sapevo"
                    kbd="2"
                    color="var(--incorrect)"
                  />
                  <ResponseButton
                    onClick={() => onRespond("review")}
                    icon={<Clock className="w-4 h-4" />}
                    label="Rivedi"
                    kbd="3"
                    color="var(--review)"
                  />
                </div>
                <button
                  onClick={onNext}
                  className="w-full flex items-center justify-center gap-1 py-1.5 text-white/30 text-[11px] hover:text-white/50 transition-colors font-sans"
                >
                  Salta <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponseButton({
  onClick,
  icon,
  label,
  kbd,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  kbd: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg transition-colors"
      style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = `color-mix(in srgb, ${color} 25%, transparent)`)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = `color-mix(in srgb, ${color} 15%, transparent)`)
      }
    >
      {icon}
      <span className="text-[11px] font-sans font-medium">{label}</span>
      <span className="text-[9px] font-mono opacity-50">{kbd}</span>
    </button>
  );
}
