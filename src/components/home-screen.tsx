import { BookOpen, ChevronRight, Brain, Layers, Target } from "lucide-react";
import type { DeckMeta, TrainingMode } from "../types/card";

interface HomeScreenProps {
  decks: DeckMeta[];
  onStart: (deckFile: string, mode: TrainingMode) => void;
}

export function HomeScreen({ decks, onStart }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-light border border-border-light mb-5">
            <span className="text-3xl" style={{ fontFamily: "serif" }}>&#9822;</span>
          </div>
          <h1 className="text-2xl font-semibold text-primary tracking-tight">
            Opening Cards Trainer
          </h1>
          <p className="text-sm text-secondary mt-2 max-w-sm mx-auto leading-relaxed">
            Allena il richiamo attivo delle varianti di apertura.
            Carte digitali ispirate al metodo flashcard: fronte, domanda, soluzione.
          </p>
        </div>

        {/* Method description */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <MethodCard
            icon={<Brain className="w-4 h-4" />}
            title="Recall attivo"
            desc="Pensa prima di vedere la risposta"
          />
          <MethodCard
            icon={<Layers className="w-4 h-4" />}
            title="4 tipi di carta"
            desc="Continuazione, variante, concetto, errore"
          />
          <MethodCard
            icon={<Target className="w-4 h-4" />}
            title="Tracciamento"
            desc="Monitora i tuoi progressi sessione per sessione"
          />
        </div>

        {/* Deck selection */}
        <div className="space-y-3">
          <h2 className="text-xs font-medium text-tertiary uppercase tracking-wider px-1">
            Seleziona mazzo
          </h2>

          {decks.map((deck) => (
            <div
              key={deck.deck_id}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-primary">
                    {deck.deck_name}
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    {deck.card_count} carte &middot; {deck.description}
                  </p>
                </div>
                <BookOpen className="w-5 h-5 text-tertiary flex-shrink-0 mt-0.5" />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onStart(deck.file, "quiz")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-inverse text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Modalità Quiz
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onStart(deck.file, "study")}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface text-secondary text-sm font-medium rounded-lg hover:bg-hover border border-border transition-colors"
                >
                  Modalità Studio
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {decks.length === 0 && (
            <div className="text-center py-8 text-tertiary text-sm">
              Caricamento mazzi...
            </div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="mt-8 text-center">
          <p className="text-xs text-tertiary">
            <span className="kbd">Space</span> mostra soluzione &middot;
            <span className="kbd ml-1">&#8594;</span> prossima &middot;
            <span className="kbd ml-1">1</span> sapevo &middot;
            <span className="kbd ml-1">2</span> non sapevo &middot;
            <span className="kbd ml-1">3</span> rivedi
          </p>
        </div>
      </div>
    </div>
  );
}

function MethodCard({
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
      <h3 className="text-xs font-semibold text-primary">{title}</h3>
      <p className="text-[10px] text-tertiary mt-0.5 leading-tight">{desc}</p>
    </div>
  );
}
