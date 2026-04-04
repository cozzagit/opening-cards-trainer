import { useState, useCallback, useMemo } from "react";
import { DrillCard } from "./drill-card";
import { loadMastery, recordDrillResponse, orderCardsForDrill, getCardMastery, getDeckSummary } from "../lib/mastery";
import { recordTrainingDay } from "../lib/streak";
import { useDrillKeyboard } from "../hooks/use-drill-keyboard";
import { useSwipe } from "../hooks/use-swipe";
import { ArrowLeft, ArrowRight, Home, RotateCcw, Award } from "lucide-react";
import type { Deck, CardMastery } from "../types/card";
import { MASTERY_COLORS } from "../types/card";

interface DrillPlayerProps {
  deck: Deck;
  onHome: () => void;
  weakOnly?: boolean;
}

export function DrillPlayer({ deck, onHome, weakOnly }: DrillPlayerProps) {
  const [mastery, setMastery] = useState(() => loadMastery(deck.deck_id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionSeen, setSessionSeen] = useState(0);
  const [sessionKnew, setSessionKnew] = useState(0);
  const [complete, setComplete] = useState(false);

  const orderedCards = useMemo(() => {
    let cards = orderCardsForDrill(deck.cards, mastery);
    if (weakOnly) {
      cards = cards.filter(c => {
        const m = mastery.get(c.id);
        return !m || m.level === "new" || m.level === "learning";
      });
    }
    return cards;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.cards, weakOnly]); // Don't re-sort on mastery change mid-session

  const card = orderedCards[currentIndex];
  const cardMastery = card ? getCardMastery(mastery, card.id) : undefined;

  const handleResponse = useCallback((knew: boolean) => {
    if (!card) return;
    const updated = recordDrillResponse(deck.deck_id, mastery, card.id, knew);
    setMastery(updated);
    setSessionSeen(s => s + 1);
    if (knew) setSessionKnew(s => s + 1);
    recordTrainingDay();

    if (currentIndex < orderedCards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setComplete(true);
    }
  }, [card, deck.deck_id, mastery, currentIndex, orderedCards.length]);

  const prev = useCallback(() => { if (currentIndex > 0) setCurrentIndex(i => i - 1); }, [currentIndex]);
  const next = useCallback(() => { if (currentIndex < orderedCards.length - 1) setCurrentIndex(i => i + 1); }, [currentIndex, orderedCards.length]);

  useDrillKeyboard({
    onKnew: () => handleResponse(true),
    onDidntKnow: () => handleResponse(false),
    onPrev: prev,
    onNext: next,
    onSpace: () => {}, // Space handled by DrillCard phases internally
  });

  // Empty deck
  if (orderedCards.length === 0) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <Award className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-lg font-serif font-semibold text-primary mb-2">
            {weakOnly ? "Nessuna carta debole!" : "Mazzo vuoto"}
          </h2>
          <p className="text-sm font-sans text-secondary mb-4">
            {weakOnly ? "Tutte le carte sono almeno a livello familiare." : "Questo mazzo non contiene carte."}
          </p>
          <button onClick={onHome} className="px-4 py-2.5 bg-accent text-inverse text-sm font-sans font-medium rounded-lg active:scale-95">
            Torna ai mazzi
          </button>
        </div>
      </div>
    );
  }

  // Session complete
  if (complete) {
    const summary = getDeckSummary(deck.deck_id, deck.cards.length);
    return (
      <DrillComplete
        sessionSeen={sessionSeen}
        sessionKnew={sessionKnew}
        summary={summary}
        onHome={onHome}
        onRestart={() => { setCurrentIndex(0); setSessionSeen(0); setSessionKnew(0); setComplete(false); }}
      />
    );
  }

  const swipeHandlers = useSwipe({ onSwipeLeft: next, onSwipeRight: prev });

  return (
    <div className="min-h-[100dvh] flex flex-col px-3 py-3 sm:px-4 sm:py-4 max-w-md mx-auto" {...swipeHandlers}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={onHome} className="p-2 -ml-2 text-tertiary hover:text-secondary transition-colors">
          <Home className="w-4 h-4" />
        </button>
        <div className="text-center flex-1 mx-2">
          <h2 className="text-sm font-serif font-semibold text-primary truncate">{deck.deck_name}</h2>
          <span className="text-[9px] font-sans text-tertiary">
            {weakOnly ? "Carte deboli" : "Drill"} · {currentIndex + 1}/{orderedCards.length}
          </span>
        </div>
        <MasteryDots mastery={mastery} cards={orderedCards.map(c => c.id)} currentIndex={currentIndex} />
      </div>

      {/* Segmented progress bar */}
      <div className="h-1 bg-border-light rounded-full overflow-hidden mb-3 flex gap-px">
        {orderedCards.map((c, i) => {
          const m = mastery.get(c.id);
          const level = m?.level ?? "new";
          const isCurrent = i === currentIndex;
          return (
            <div
              key={c.id}
              className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
              style={{
                flex: 1,
                background: isCurrent ? "var(--accent)" : MASTERY_COLORS[level],
                opacity: isCurrent ? 1 : i < currentIndex ? 0.7 : 0.25,
              }}
            />
          );
        })}
      </div>

      {/* Card — scrollable on long cards */}
      <div className="flex-1 overflow-y-auto pt-1 pb-2">
        {card && (
          <DrillCard
            key={`${card.id}-${currentIndex}`}
            card={card}
            mastery={cardMastery?.level}
            onResponse={handleResponse}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between py-1.5 flex-shrink-0 border-t border-border-light mt-1">
        <button onClick={prev} disabled={currentIndex === 0}
          className="flex items-center gap-1 px-3 py-2 text-secondary disabled:opacity-25 active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span style={{ color: "var(--correct)" }}>{sessionKnew}</span>
          <span className="text-tertiary">·</span>
          <span style={{ color: "var(--incorrect)" }}>{sessionSeen - sessionKnew}</span>
        </div>
        <button onClick={next} disabled={currentIndex >= orderedCards.length - 1}
          className="flex items-center gap-1 px-3 py-2 text-secondary disabled:opacity-25 active:scale-95">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function MasteryDots({ mastery, cards, currentIndex }: { mastery: Map<string, CardMastery>; cards: string[]; currentIndex: number }) {
  const start = Math.max(0, currentIndex - 3);
  const end = Math.min(cards.length, currentIndex + 4);
  return (
    <div className="flex items-center gap-0.5">
      {cards.slice(start, end).map((id, i) => {
        const m = mastery.get(id);
        const level = m?.level ?? "new";
        const isCurrent = start + i === currentIndex;
        return (
          <div key={id} className="rounded-full transition-all duration-200"
            style={{ width: isCurrent ? 8 : 5, height: isCurrent ? 8 : 5, background: MASTERY_COLORS[level], opacity: isCurrent ? 1 : 0.5 }} />
        );
      })}
    </div>
  );
}

function DrillComplete({ sessionSeen, sessionKnew, summary, onHome, onRestart }: {
  sessionSeen: number; sessionKnew: number;
  summary: ReturnType<typeof getDeckSummary>;
  onHome: () => void; onRestart: () => void;
}) {
  const pct = sessionSeen > 0 ? Math.round((sessionKnew / sessionSeen) * 100) : 0;
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Award className="w-14 h-14 text-accent mx-auto mb-4" />
        <h2 className="text-xl font-serif font-semibold text-primary mb-1">Sessione completata</h2>
        <div className="bg-card border border-border-light rounded-xl p-5 mb-4 shadow-sm">
          <div className="text-3xl font-bold font-mono text-accent mb-3">{pct}%</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-lg font-semibold font-mono" style={{ color: "var(--correct)" }}>{sessionKnew}</div>
              <div className="text-[10px] font-sans text-tertiary">Sapevo</div>
            </div>
            <div>
              <div className="text-lg font-semibold font-mono" style={{ color: "var(--incorrect)" }}>{sessionSeen - sessionKnew}</div>
              <div className="text-[10px] font-sans text-tertiary">Non sapevo</div>
            </div>
          </div>
          <div className="border-t border-border-light pt-3">
            <p className="text-[10px] font-sans text-tertiary uppercase tracking-wider mb-2">Padronanza mazzo</p>
            <div className="h-2 rounded-full bg-surface overflow-hidden flex mb-2">
              {summary.masteredCount > 0 && <div className="h-full" style={{ flex: summary.masteredCount, background: "var(--correct)" }} />}
              {summary.familiarCount > 0 && <div className="h-full" style={{ flex: summary.familiarCount, background: "var(--cat-continuation)" }} />}
              {summary.learningCount > 0 && <div className="h-full" style={{ flex: summary.learningCount, background: "var(--review)" }} />}
              {summary.newCount > 0 && <div className="h-full" style={{ flex: summary.newCount, background: "var(--border)" }} />}
            </div>
            <div className="text-sm font-mono font-semibold text-accent">{summary.masteryPercent}%</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onRestart} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-accent text-inverse text-sm font-sans font-medium rounded-lg active:scale-95">
            <RotateCcw className="w-4 h-4" /> Ancora
          </button>
          <button onClick={onHome} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 bg-surface text-secondary text-sm font-sans font-medium rounded-lg border border-border active:scale-95">
            <Home className="w-4 h-4" /> Menu
          </button>
        </div>
      </div>
    </div>
  );
}
