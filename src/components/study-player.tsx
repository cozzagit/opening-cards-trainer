import { useState, useMemo, useEffect } from "react";
import { StudyCard } from "./study-card";
import { loadMastery, getCardMastery } from "../lib/mastery";
import { recordTrainingDay } from "../lib/streak";
import { useSwipe } from "../hooks/use-swipe";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import type { Deck } from "../types/card";

interface StudyPlayerProps {
  deck: Deck;
  onHome: () => void;
}

export function StudyPlayer({ deck, onHome }: StudyPlayerProps) {
  const [index, setIndex] = useState(0);
  const mastery = useMemo(() => loadMastery(deck.deck_id), [deck.deck_id]);
  const card = deck.cards[index];
  const cardMastery = card ? getCardMastery(mastery, card.id) : undefined;

  useEffect(() => { recordTrainingDay(); }, []);

  const prev = () => { if (index > 0) setIndex(index - 1); };
  const next = () => { if (index < deck.cards.length - 1) setIndex(index + 1); };

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

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
          <span className="text-[9px] font-sans text-tertiary">Studio · {index + 1}/{deck.cards.length}</span>
        </div>
        <div className="w-8" /> {/* spacer */}
      </div>

      {/* Progress */}
      <div className="h-0.5 bg-border-light rounded-full overflow-hidden mb-3">
        <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${((index + 1) / deck.cards.length) * 100}%` }} />
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto pt-1 pb-2">
        {card && <StudyCard key={card.id} card={card} mastery={cardMastery?.level} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between py-1.5 flex-shrink-0 border-t border-border-light mt-1">
        <button onClick={prev} disabled={index === 0}
          className="flex items-center gap-1 px-4 py-3 text-secondary disabled:opacity-25 active:scale-95">
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-sans">Prec</span>
        </button>
        <span className="text-xs font-mono text-tertiary">{index + 1} / {deck.cards.length}</span>
        <button onClick={next} disabled={index >= deck.cards.length - 1}
          className="flex items-center gap-1 px-4 py-3 text-secondary disabled:opacity-25 active:scale-95">
          <span className="hidden sm:inline text-sm font-sans">Succ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
