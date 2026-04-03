import { CardFace } from "./card-face";
import { StatsPanel } from "./stats-panel";
import { ProgressBar } from "./progress-bar";
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
    <div className="min-h-screen flex flex-col px-4 py-4 max-w-xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onHome}
          className="flex items-center gap-1 text-xs text-tertiary hover:text-secondary transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Menu</span>
        </button>
        <h2 className="text-sm font-semibold text-primary">{deck.deck_name}</h2>
        <span className="text-xs text-tertiary">Quiz</span>
      </div>

      <ProgressBar current={session.currentIndex + 1} total={session.cards.length} />

      {/* Card area — fixed height for flip */}
      <div className="flex-1 flex items-center justify-center py-4" style={{ minHeight: 420 }}>
        {session.currentCard && (
          <CardFace
            card={session.currentCard}
            isRevealed={session.isRevealed}
            onReveal={session.reveal}
            onRespond={session.respond}
            onNext={session.next}
            cardIndex={session.currentIndex}
            totalCards={session.cards.length}
            previousResult={session.responses.get(session.currentCard.id)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={session.prev}
          disabled={session.currentIndex === 0}
          className="flex items-center gap-1 px-3 py-2 text-sm text-secondary hover:text-primary disabled:text-tertiary disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Prec
        </button>
        <button
          onClick={session.next}
          disabled={session.currentIndex >= session.cards.length - 1}
          className="flex items-center gap-1 px-3 py-2 text-sm text-secondary hover:text-primary disabled:text-tertiary disabled:cursor-not-allowed transition-colors"
        >
          Succ <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <StatsPanel stats={session.stats} />
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-light mb-5">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-primary mb-1">Sessione completata</h2>
        <p className="text-sm text-secondary mb-6">Hai completato tutte le carte del mazzo.</p>

        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <div className="text-4xl font-bold font-mono text-accent mb-3">{percentage}%</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold font-mono text-correct">{stats.correct}</div>
              <div className="text-xs text-tertiary">Corrette</div>
            </div>
            <div>
              <div className="font-semibold font-mono text-incorrect">{stats.incorrect}</div>
              <div className="text-xs text-tertiary">Errate</div>
            </div>
            <div>
              <div className="font-semibold font-mono text-review">{stats.review}</div>
              <div className="text-xs text-tertiary">Da rivedere</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-inverse text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Ricomincia
          </button>
          <button
            onClick={onHome}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface text-secondary text-sm font-medium rounded-lg hover:bg-hover border border-border transition-colors"
          >
            <Home className="w-4 h-4" /> Menu
          </button>
        </div>
      </div>
    </div>
  );
}
