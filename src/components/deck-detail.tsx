import { useState, useMemo } from "react";
import { VariationTree } from "./variation-tree";
import { loadMastery } from "../lib/mastery";
import { ArrowLeft, GitBranch } from "lucide-react";
import type { Deck, Card } from "../types/card";

interface DeckDetailProps {
  deck: Deck;
  onBack: () => void;
  onDrill: (card?: Card) => void;
}

export function DeckDetail({ deck, onBack, onDrill }: DeckDetailProps) {
  const mastery = useMemo(() => loadMastery(deck.deck_id), [deck.deck_id]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div className="min-h-[100dvh] flex flex-col px-3 py-3 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 -ml-2 text-tertiary hover:text-secondary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-serif font-semibold text-primary">{deck.deck_name}</h2>
          <p className="text-[10px] text-secondary font-sans">Albero delle varianti · {deck.cards.length} carte</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-3 py-2 bg-surface rounded-lg">
        <LegendItem color="var(--text-tertiary)" label="Nuova" />
        <LegendItem color="var(--review)" label="In apprendimento" />
        <LegendItem color="var(--cat-continuation)" label="Familiare" />
        <LegendItem color="var(--correct)" label="Padroneggiata" />
      </div>

      {/* Tree */}
      <div className="bg-card rounded-xl border border-border-light p-3 mb-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2">
          <GitBranch className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-sans font-semibold text-tertiary uppercase tracking-wider">Mappa varianti</span>
        </div>
        <VariationTree
          cards={deck.cards}
          mastery={mastery}
          onSelectCard={(card) => setSelectedCard(card)}
        />
      </div>

      {/* Selected card preview */}
      {selectedCard && (
        <div className="bg-card rounded-xl border border-border-light p-4 mb-4 shadow-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-sans text-secondary">{selectedCard.variation}</p>
              <p className="text-sm font-serif text-primary mt-1">{selectedCard.front.question}</p>
            </div>
            <span className="text-[9px] font-mono text-tertiary">{selectedCard.id}</span>
          </div>
          <button
            onClick={() => onDrill(selectedCard)}
            className="w-full mt-2 px-3 py-2 bg-accent text-inverse text-xs font-sans font-medium rounded-lg active:scale-95"
          >
            Drill questa carta
          </button>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[8px] font-sans text-tertiary">{label}</span>
    </div>
  );
}
