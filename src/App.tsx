import { useState, useCallback, useMemo, useEffect } from "react";
import { HomeScreen } from "./components/home-screen";
import { CardPlayer } from "./components/card-player";
import { StudyPlayer } from "./components/study-player";
import { DrillPlayer } from "./components/drill-player";
import { DeckDetail } from "./components/deck-detail";
import { useDeck } from "./hooks/use-deck";
import type { TrainingMode, Deck } from "./types/card";

type AppView = "home" | "tree" | TrainingMode;

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  const { decks, activeDeck, loading, error, loadDeckById } = useDeck();
  const [view, setView] = useState<AppView>("home");
  const [shouldShuffle, setShouldShuffle] = useState(false);
  const [weakOnly, setWeakOnly] = useState(false);
  const [pendingView, setPendingView] = useState<AppView | null>(null);

  const processedDeck = useMemo<Deck | null>(() => {
    if (!activeDeck) return null;
    if (!shouldShuffle) return activeDeck;
    return { ...activeDeck, cards: shuffleArray(activeDeck.cards) };
  }, [activeDeck, shouldShuffle]);

  useEffect(() => {
    if (pendingView && processedDeck && !loading) {
      setView(pendingView);
      setPendingView(null);
    }
  }, [pendingView, processedDeck, loading]);

  const handleStart = useCallback(
    async (deckFile: string, mode: TrainingMode, shuffle?: boolean, weak?: boolean) => {
      setShouldShuffle(shuffle ?? false);
      setWeakOnly(weak ?? false);
      setPendingView(mode);
      await loadDeckById(deckFile);
    },
    [loadDeckById]
  );

  const handleViewTree = useCallback(
    async (deckFile: string) => {
      setShouldShuffle(false);
      setWeakOnly(false);
      setPendingView("tree");
      await loadDeckById(deckFile);
    },
    [loadDeckById]
  );

  const handleHome = useCallback(() => {
    setView("home");
    setPendingView(null);
    setShouldShuffle(false);
    setWeakOnly(false);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm font-sans mb-2" style={{ color: "var(--incorrect)" }}>Errore di caricamento</p>
          <p className="text-xs text-tertiary font-sans">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || pendingView) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-secondary font-sans">Caricamento...</span>
        </div>
      </div>
    );
  }

  if (view === "home" || !processedDeck) {
    return <HomeScreen decks={decks} onStart={handleStart} onViewTree={handleViewTree} />;
  }

  if (view === "tree") {
    return (
      <DeckDetail
        deck={processedDeck}
        onBack={handleHome}
        onDrill={() => { setView("drill"); }}
      />
    );
  }

  if (view === "drill" || view === "reverse") {
    return <DrillPlayer deck={processedDeck} onHome={handleHome} weakOnly={weakOnly} />;
  }

  if (view === "study") {
    return <StudyPlayer deck={processedDeck} onHome={handleHome} />;
  }

  return <CardPlayer deck={processedDeck} onHome={handleHome} />;
}
