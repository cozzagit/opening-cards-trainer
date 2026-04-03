import { useState } from "react";
import type { Card, CardCategory, CardDifficulty, MasteryLevel } from "../types/card";
import { MASTERY_COLORS } from "../types/card";
import { ChessBoard } from "./chess-board";
import { FormattedMoves } from "./formatted-moves";
import { Eye, CheckCircle2, XCircle, ChevronDown } from "lucide-react";

type DrillPhase = "visualize" | "verify" | "answer";

interface DrillCardProps {
  card: Card;
  mastery?: MasteryLevel;
  onResponse: (knew: boolean) => void;
}

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
  new: "Nuova", learning: "In apprendimento", familiar: "Familiare", mastered: "Padroneggiata",
};

export function DrillCard({ card, mastery = "new", onResponse }: DrillCardProps) {
  const [phase, setPhase] = useState<DrillPhase>("visualize");
  const catColor = CAT_COLORS[card.category];
  const catLight = CAT_LIGHT[card.category];
  const hasBoard = card.front.moves_san.length > 0;
  const diamonds = DIFF_N[card.difficulty];

  const advance = () => {
    if (phase === "visualize") setPhase("verify");
    else if (phase === "verify") setPhase("answer");
  };

  // Reset phase when card changes (via key in parent)

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Card */}
      <div className="bg-card rounded-2xl shadow-md border border-border-light overflow-hidden">
        {/* Category bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ background: catColor }}>
          <span className="text-[10px] font-sans font-semibold tracking-widest text-white/90">
            {CAT_LABELS[card.category]}
          </span>
          <div className="flex items-center gap-2">
            {/* Mastery indicator */}
            <span className="text-[9px] font-sans text-white/60">{MASTERY_LABELS[mastery]}</span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: MASTERY_COLORS[mastery], boxShadow: `0 0 4px ${MASTERY_COLORS[mastery]}` }}
            />
            {/* Difficulty diamonds */}
            <span className="inline-flex items-center gap-0.5 text-white/90">
              {[0, 1, 2].map(i => (
                <span key={i} className={`diamond ${i < diamonds ? "diamond-filled" : ""}`} style={{ opacity: i < diamonds ? 1 : 0.3 }} />
              ))}
            </span>
          </div>
        </div>

        {/* Identity */}
        <div className="px-4 pt-3 pb-2 text-center">
          <h3 className="text-base font-serif font-semibold text-primary leading-tight">{card.opening}</h3>
          <p className="text-[11px] text-secondary font-sans mt-0.5">{card.variation}</p>
        </div>
        <div className="mx-4 h-px" style={{ background: catColor, opacity: 0.15 }} />

        {/* ── PHASE 1: Visualize (moves only, no board) ── */}
        {phase === "visualize" && (
          <div className="px-4 pt-3 pb-4">
            {hasBoard && (
              <>
                {/* Moves */}
                <div className="bg-surface rounded-lg px-3 py-3 mb-3">
                  <FormattedMoves moves={card.front.moves_san} />
                </div>

                {/* Side to move */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className={`w-3 h-3 rounded-sm border-[1.5px] border-primary ${card.side_to_move === "white" ? "bg-card" : "bg-primary"}`} />
                  <span className="text-[10px] text-secondary font-sans">
                    {card.side_to_move === "white" ? "Tratto al Bianco" : "Tratto al Nero"}
                  </span>
                </div>

                {/* Blind board placeholder */}
                <div className="flex flex-col items-center gap-2 py-4">
                  <div
                    className="w-[180px] h-[180px] rounded-lg flex flex-col items-center justify-center gap-2"
                    style={{ background: "var(--bg-surface)", border: "2px dashed var(--border)" }}
                  >
                    <span className="text-3xl opacity-20">&#9822;</span>
                    <span className="text-[11px] font-sans text-tertiary text-center px-4">
                      Visualizza mentalmente la posizione
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Question */}
            <div className="rounded-lg px-3 py-3 mb-3" style={{ background: catLight }}>
              <p className="text-[15px] font-serif text-primary leading-relaxed">{card.front.question}</p>
            </div>

            {/* Advance button */}
            <button
              onClick={advance}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-sans font-medium rounded-xl transition-all active:scale-[0.97]"
              style={{ background: "var(--accent)", color: "var(--text-inverse)" }}
            >
              <Eye className="w-4 h-4" />
              {hasBoard ? "Verifica posizione" : "Mostra risposta"}
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </button>
          </div>
        )}

        {/* ── PHASE 2: Verify (board revealed, answer still hidden) ── */}
        {phase === "verify" && hasBoard && (
          <div className="px-4 pt-3 pb-4">
            {/* Moves */}
            <div className="bg-surface rounded-lg px-3 py-3 mb-3">
              <FormattedMoves moves={card.front.moves_san} />
            </div>

            {/* Board revealed with subtle animation */}
            <div className="flex justify-center mb-3 animate-[fadeIn_0.3s_ease-out]">
              <ChessBoard moves={card.front.moves_san} size={200} />
            </div>

            {/* Question */}
            <div className="rounded-lg px-3 py-3 mb-3" style={{ background: catLight }}>
              <p className="text-[15px] font-serif text-primary leading-relaxed">{card.front.question}</p>
            </div>

            {/* Advance to answer */}
            <button
              onClick={advance}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-sans font-medium rounded-xl transition-all active:scale-[0.97]"
              style={{ background: "var(--accent)", color: "var(--text-inverse)" }}
            >
              <Eye className="w-4 h-4" />
              Mostra risposta
            </button>
          </div>
        )}

        {/* ── PHASE 3: Answer ── */}
        {(phase === "answer" || (phase === "verify" && !hasBoard)) && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* Board (keep visible) */}
            {hasBoard && (
              <div className="px-4 pt-3">
                <div className="flex justify-center mb-2">
                  <ChessBoard moves={card.front.moves_san} size={160} />
                </div>
                <div className="bg-surface rounded-lg px-3 py-2 mb-2">
                  <FormattedMoves moves={card.front.moves_san} className="text-[11px]" />
                </div>
              </div>
            )}

            {/* Answer panel */}
            <div className="mx-3 mb-3 rounded-xl overflow-hidden" style={{ background: "var(--bg-card-back)" }}>
              <div className="h-0.5" style={{ background: catColor }} />
              <div className="px-4 py-3">
                <span className="text-[10px] font-sans font-semibold tracking-widest" style={{ color: catColor }}>RISPOSTA</span>
                <div className="san-moves text-lg font-bold text-white mt-2">{card.back.answer_san}</div>
                <p className="text-[13px] font-serif text-white/75 leading-relaxed mt-2 border-t border-dashed border-white/10 pt-2">
                  {card.back.explanation}
                </p>
              </div>
            </div>

            {/* Self-assessment — 2 buttons only (knew / didn't know) */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => onResponse(true)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans font-semibold text-sm transition-all active:scale-95"
                style={{ background: "color-mix(in srgb, var(--correct) 12%, var(--bg-card))", color: "var(--correct)" }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Sapevo
              </button>
              <button
                onClick={() => onResponse(false)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans font-semibold text-sm transition-all active:scale-95"
                style={{ background: "color-mix(in srgb, var(--incorrect) 12%, var(--bg-card))", color: "var(--incorrect)" }}
              >
                <XCircle className="w-5 h-5" />
                Non sapevo
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: catColor }} />
            <span className="text-[9px] font-mono text-tertiary">{card.id}</span>
          </div>
          <span className="text-[9px] font-mono text-tertiary">
            {phase === "visualize" ? "Fase 1 · Visualizza" : phase === "verify" ? "Fase 2 · Verifica" : "Fase 3 · Valuta"}
          </span>
        </div>
      </div>
    </div>
  );
}
