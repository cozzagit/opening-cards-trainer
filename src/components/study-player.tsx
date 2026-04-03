import { useState } from "react";
import { StudyCard } from "./study-card";
import { ProgressBar } from "./progress-bar";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import type { Deck } from "../types/card";

interface StudyPlayerProps {
  deck: Deck;
  onHome: () => void;
}

export function StudyPlayer({ deck, onHome }: StudyPlayerProps) {
  const [index, setIndex] = useState(0);
  const card = deck.cards[index];

  const prev = () => index > 0 && setIndex(index - 1);
  const next = () => index < deck.cards.length - 1 && setIndex(index + 1);

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
        <span className="text-xs text-tertiary">Studio</span>
      </div>

      <ProgressBar current={index + 1} total={deck.cards.length} />

      {/* Card */}
      <div className="flex-1 flex items-center justify-center py-4">
        {card && <StudyCard card={card} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prev}
          disabled={index === 0}
          className="flex items-center gap-1 px-3 py-2 text-sm text-secondary hover:text-primary disabled:text-tertiary disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Prec
        </button>
        <button
          onClick={next}
          disabled={index >= deck.cards.length - 1}
          className="flex items-center gap-1 px-3 py-2 text-sm text-secondary hover:text-primary disabled:text-tertiary disabled:cursor-not-allowed transition-colors"
        >
          Succ <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
