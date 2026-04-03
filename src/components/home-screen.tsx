import { BookOpen, ChevronRight, Brain, Layers, Target, Shuffle } from "lucide-react";
import type { DeckMeta, TrainingMode } from "../types/card";

interface HomeScreenProps {
  decks: DeckMeta[];
  onStart: (deckFile: string, mode: TrainingMode, shuffle?: boolean) => void;
}

export function HomeScreen({ decks, onStart }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-10">
          {/* Knight logo */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-light border border-border-light mb-5 relative">
            <KnightIcon />
          </div>
          <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">
            Opening Cards
          </h1>
          <p className="text-sm font-sans text-secondary mt-2 max-w-xs mx-auto leading-relaxed">
            Allena il richiamo attivo delle aperture scacchistiche.
            Fronte, domanda, soluzione.
          </p>
        </div>

        {/* Method pillars */}
        <div className="grid grid-cols-3 gap-2.5 mb-8">
          <MethodPillar
            icon={<Brain className="w-4 h-4" />}
            title="Recall attivo"
            desc="Pensa prima di vedere"
          />
          <MethodPillar
            icon={<Layers className="w-4 h-4" />}
            title="4 tipi di carta"
            desc="Linee, varianti, concetti, errori"
          />
          <MethodPillar
            icon={<Target className="w-4 h-4" />}
            title="Tracciamento"
            desc="Monitora i tuoi progressi"
          />
        </div>

        {/* Deck selection */}
        <h2 className="text-[10px] font-sans font-semibold text-tertiary uppercase tracking-widest mb-3 px-1">
          Seleziona mazzo
        </h2>

        <div className="space-y-3">
          {decks.map((deck) => (
            <DeckCard key={deck.deck_id} deck={deck} onStart={onStart} />
          ))}

          {decks.length === 0 && (
            <div className="text-center py-12 text-tertiary text-sm font-sans">
              Caricamento mazzi...
            </div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] text-tertiary font-sans">
            <span className="kbd">Space</span> soluzione &middot;
            <span className="kbd ml-1">&larr;</span><span className="kbd">&rarr;</span> naviga &middot;
            <span className="kbd ml-1">1</span> sapevo &middot;
            <span className="kbd ml-1">2</span> non sapevo &middot;
            <span className="kbd ml-1">3</span> rivedi
          </p>
        </div>
      </div>
    </div>
  );
}

function DeckCard({
  deck,
  onStart,
}: {
  deck: DeckMeta;
  onStart: (file: string, mode: TrainingMode, shuffle?: boolean) => void;
}) {
  return (
    <div className="bg-card border border-border-light rounded-xl overflow-hidden shadow-sm">
      {/* Accent stripe */}
      <div className="h-1 bg-accent" />

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-serif font-semibold text-primary">
              {deck.deck_name}
            </h3>
            <p className="text-xs text-secondary font-sans mt-0.5 leading-relaxed">
              {deck.card_count} carte &middot; {deck.description}
            </p>
          </div>
          <BookOpen className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onStart(deck.file, "quiz")}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-accent text-inverse text-sm font-sans font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            Quiz
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onStart(deck.file, "quiz", true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-accent text-inverse text-sm font-sans font-medium rounded-lg hover:bg-accent-hover transition-colors"
            title="Quiz ordine casuale"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onStart(deck.file, "study")}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-surface text-secondary text-sm font-sans font-medium rounded-lg hover:bg-hover border border-border transition-colors"
          >
            Studio
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MethodPillar({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card border border-border-light rounded-xl p-3 text-center">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-accent-light text-accent mb-2">
        {icon}
      </div>
      <h3 className="text-xs font-sans font-semibold text-primary">{title}</h3>
      <p className="text-[10px] text-tertiary font-sans mt-0.5 leading-tight">{desc}</p>
    </div>
  );
}

function KnightIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 28h12M12 28v-4c0-1 .5-2 1.5-3l2-2c1-1 1.5-2 1.5-3.5V12c0-2-1-3.5-3-4.5L12 6.5c-.5-.3-.5-1 0-1.3L14 4c1-.5 2-.5 3 0l3 2c2 1.5 3 3.5 3 6v3.5c0 2-.5 3.5-2 5l-3 3c-1 1-1.5 2-1.5 3v1.5" />
      <circle cx="14" cy="9" r="1" fill="var(--accent)" stroke="none" />
    </svg>
  );
}
