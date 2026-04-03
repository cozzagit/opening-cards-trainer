import type { Card, CardResult, CardCategory, CardDifficulty } from "../types/card";
import { ChessBoard } from "./chess-board";
import { Check, X, Clock, Eye } from "lucide-react";

interface CardFaceProps {
  card: Card;
  isRevealed: boolean;
  onReveal: () => void;
  onRespond: (result: CardResult) => void;
  onNext: () => void;
  cardIndex: number;
  totalCards: number;
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

const DIFF_DIAMONDS: Record<CardDifficulty, number> = { base: 1, intermediate: 2, advanced: 3 };

function Diamonds({ level, color }: { level: CardDifficulty; color: string }) {
  const n = DIFF_DIAMONDS[level];
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color }}>
      {[0, 1, 2].map(i => (
        <span key={i} className={`diamond ${i < n ? "diamond-filled" : ""}`} style={{ opacity: i < n ? 1 : 0.3 }} />
      ))}
    </span>
  );
}

export function CardFace({ card, isRevealed, onReveal, onRespond, cardIndex, totalCards }: CardFaceProps) {
  const catColor = CAT_COLORS[card.category];
  const catLight = CAT_LIGHT[card.category];
  const hasBoard = card.front.moves_san.length > 0;

  // NO 3D flip — instead we show front or back, full height, no collapsing
  if (!isRevealed) {
    return (
      <div
        className="w-full max-w-sm mx-auto bg-card rounded-2xl shadow-md border border-border-light overflow-hidden flex flex-col cursor-pointer active:scale-[0.99] transition-transform"
        onClick={onReveal}
      >
        {/* Category bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ background: catColor }}>
          <span className="text-[10px] font-sans font-semibold tracking-widest text-white/90">
            {CAT_LABELS[card.category]}
          </span>
          <Diamonds level={card.difficulty} color="rgba(255,255,255,0.9)" />
        </div>

        {/* Opening identity */}
        <div className="px-4 pt-3 pb-2 text-center">
          <h3 className="text-base font-serif font-semibold text-primary leading-tight">{card.opening}</h3>
          <p className="text-[11px] text-secondary font-sans mt-0.5">{card.variation}</p>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px" style={{ background: catColor, opacity: 0.15 }} />

        {/* Chess board + moves */}
        {hasBoard && (
          <div className="px-4 pt-3 flex flex-col items-center gap-2">
            <ChessBoard moves={card.front.moves_san} size={180} />
            <div className="san-moves text-[13px] leading-relaxed text-primary text-center px-2 py-1.5 bg-surface rounded-md w-full">
              {card.front.moves_san.join(" ")}
            </div>
            <div className="flex items-center gap-1.5 self-start">
              <div className={`w-3 h-3 rounded-sm border-[1.5px] border-primary ${card.side_to_move === "white" ? "bg-card" : "bg-primary"}`} />
              <span className="text-[10px] text-secondary font-sans">
                {card.side_to_move === "white" ? "Tratto al Bianco" : "Tratto al Nero"}
              </span>
            </div>
          </div>
        )}

        {/* Question */}
        <div className="px-4 pt-3 pb-3 flex-1">
          <div className="rounded-lg px-3 py-3" style={{ background: catLight }}>
            <p className="text-[15px] font-serif text-primary leading-relaxed">{card.front.question}</p>
          </div>
        </div>

        {/* Reveal CTA */}
        <div className="px-4 pb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onReveal(); }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-sans font-medium rounded-xl transition-all active:scale-[0.97]"
            style={{ background: "var(--accent)", color: "var(--text-inverse)" }}
          >
            <Eye className="w-4 h-4" />
            Mostra soluzione
            <span className="text-[10px] opacity-50 ml-1 font-mono hidden sm:inline">Space</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
            <span className="text-[9px] font-mono text-tertiary">{card.id}</span>
          </div>
          <span className="text-[9px] font-mono text-tertiary">{cardIndex + 1}/{totalCards}</span>
        </div>
      </div>
    );
  }

  // ══════ BACK (revealed) ══════
  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col card-back-pattern border border-accent/20">
      <div className="m-1.5 rounded-xl bg-[#2C2825] flex flex-col overflow-hidden flex-1">
        {/* Category echo */}
        <div className="h-1" style={{ background: catColor }} />

        {/* Header */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <span className="text-[10px] font-sans font-semibold tracking-widest" style={{ color: catColor }}>
            RISPOSTA
          </span>
          <span className="text-[9px] font-mono text-white/30">{card.id}</span>
        </div>

        {/* Answer */}
        <div className="px-4 pb-2">
          <div className="san-moves text-lg font-bold text-white text-center bg-white/5 rounded-lg px-3 py-3">
            {card.back.answer_san}
          </div>
        </div>

        {/* Explanation */}
        <div className="px-4 pb-3 flex-1">
          <div className="border-t border-dashed border-white/10 pt-3">
            <p className="text-[13px] font-serif text-white/80 leading-relaxed">
              {card.back.explanation}
            </p>
          </div>
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1">
            {card.tags.map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/35 font-sans">{tag}</span>
            ))}
          </div>
        )}

        {/* Response buttons — big touch targets */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <RespBtn onClick={() => onRespond("correct")} icon={<Check className="w-5 h-5" />} label="Sapevo" kbd="1" color="var(--correct)" />
            <RespBtn onClick={() => onRespond("incorrect")} icon={<X className="w-5 h-5" />} label="Non sapevo" kbd="2" color="var(--incorrect)" />
            <RespBtn onClick={() => onRespond("review")} icon={<Clock className="w-5 h-5" />} label="Rivedi" kbd="3" color="var(--review)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RespBtn({ onClick, icon, label, kbd, color }: {
  onClick: () => void; icon: React.ReactNode; label: string; kbd: string; color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-2 py-3 rounded-xl transition-all active:scale-95"
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
    >
      {icon}
      <span className="text-[11px] font-sans font-semibold">{label}</span>
      <span className="text-[9px] font-mono opacity-40 hidden sm:inline">{kbd}</span>
    </button>
  );
}
