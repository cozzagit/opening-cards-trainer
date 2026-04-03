import { CardFace } from "./card-face";
import { useSession } from "../hooks/use-session";
import { useKeyboard } from "../hooks/use-keyboard";
import { ArrowLeft, ArrowRight, Home, RotateCcw, Trophy } from "lucide-react";
import type { Deck } from "../types/card";

interface CardPlayerProps {
  deck: Deck;
  onHome: () => void;
}

export function CardPlayer({ deck, onHome }: CardPlayerProps) {
  const session = useSession(deck.deck_id, deck.cards);

  useKeyboard({
    reveal: session.reveal,
    respond: session.respond,
    next: session.next,
    prev: session.prev,
    isRevealed: session.isRevealed,
  });

  if (session.isComplete && session.stats.seen > 0) {
    return (
      <SessionComplete
        stats={session.stats}
        onReset={session.reset}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col px-3 py-3 sm:px-4 sm:py-4 max-w-md mx-auto">
      {/* Compact top bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onHome}
          className="p-2 -ml-2 text-tertiary hover:text-secondary transition-colors"
          aria-label="Menu"
        >
          <Home className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-serif font-semibold text-primary truncate mx-2">
          {deck.deck_name}
        </h2>
        <span className="text-[10px] font-mono text-tertiary flex-shrink-0">
          {session.currentIndex + 1}/{session.cards.length}
        </span>
      </div>

      {/* Progress bar — thin, unobtrusive */}
      <div className="h-0.5 bg-border-light rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${session.progress}%` }}
        />
      </div>

      {/* Card area — fills available space, card as big as possible */}
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: "60dvh" }}>
        {session.currentCard && (
          <CardFace
            card={session.currentCard}
            isRevealed={session.isRevealed}
            onReveal={session.reveal}
            onRespond={session.respond}
            onNext={session.next}
            cardIndex={session.currentIndex}
            totalCards={session.cards.length}
          />
        )}
      </div>

      {/* Navigation — big touch targets */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={session.prev}
          disabled={session.currentIndex === 0}
          className="flex items-center gap-1 px-4 py-3 text-sm font-sans text-secondary hover:text-primary disabled:text-tertiary disabled:opacity-40 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Prec</span>
        </button>

        {/* Mini stats inline */}
        <div className="flex items-center gap-3 text-center">
          <MiniStat value={session.stats.correct} color="var(--correct)" label="ok" />
          <MiniStat value={session.stats.incorrect} color="var(--incorrect)" label="no" />
          <MiniStat value={session.stats.review} color="var(--review)" label="rev" />
        </div>

        <button
          onClick={session.next}
          disabled={session.currentIndex >= session.cards.length - 1}
          className="flex items-center gap-1 px-4 py-3 text-sm font-sans text-secondary hover:text-primary disabled:text-tertiary disabled:opacity-40 transition-colors active:scale-95"
        >
          <span className="hidden sm:inline">Succ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function MiniStat({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base font-mono font-semibold" style={{ color }}>{value}</span>
      <span className="text-[9px] font-sans text-tertiary">{label}</span>
    </div>
  );
}

function SessionComplete({
  stats,
  onReset,
  onHome,
}: {
  stats: { correct: number; incorrect: number; review: number; seen: number; total: number };
  onReset: () => void;
  onHome: () => void;
}) {
  const percentage = stats.seen > 0 ? Math.round((stats.correct / stats.seen) * 100) : 0;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-light mb-5">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-serif font-semibold text-primary mb-1">Sessione completata</h2>
        <p className="text-sm font-sans text-secondary mb-6">Hai completato tutte le carte del mazzo.</p>

        <div className="bg-card border border-border-light rounded-xl p-5 mb-6 shadow-sm">
          <div className="text-4xl font-bold font-mono text-accent mb-4">{percentage}%</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-lg font-semibold font-mono text-correct">{stats.correct}</div>
              <div className="text-[10px] font-sans text-tertiary">Corrette</div>
            </div>
            <div>
              <div className="text-lg font-semibold font-mono text-incorrect">{stats.incorrect}</div>
              <div className="text-[10px] font-sans text-tertiary">Errate</div>
            </div>
            <div>
              <div className="text-lg font-semibold font-mono text-review">{stats.review}</div>
              <div className="text-[10px] font-sans text-tertiary">Da rivedere</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-accent text-inverse text-sm font-sans font-medium rounded-lg hover:bg-accent-hover transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4" /> Ricomincia
          </button>
          <button
            onClick={onHome}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-surface text-secondary text-sm font-sans font-medium rounded-lg hover:bg-hover border border-border transition-colors active:scale-95"
          >
            <Home className="w-4 h-4" /> Menu
          </button>
        </div>
      </div>
    </div>
  );
}
