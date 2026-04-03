import { useState, useCallback, useMemo, useEffect } from "react";
import { HomeScreen } from "./components/home-screen";
import { CardPlayer } from "./components/card-player";
import { StudyPlayer } from "./components/study-player";
import { useDeck } from "./hooks/use-deck";
import type { TrainingMode, Deck } from "./types/card";

type AppView = "home" | "quiz" | "study";

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
  const [pendingView, setPendingView] = useState<AppView | null>(null);

  const processedDeck = useMemo<Deck | null>(() => {
    if (!activeDeck) return null;
    if (!shouldShuffle) return activeDeck;
    return { ...activeDeck, cards: shuffleArray(activeDeck.cards) };
  }, [activeDeck, shouldShuffle]);

  // When deck finishes loading, transition to the pending view
  useEffect(() => {
    if (pendingView && processedDeck && !loading) {
      setView(pendingView);
      setPendingView(null);
    }
  }, [pendingView, processedDeck, loading]);

  const handleStart = useCallback(
    async (deckFile: string, mode: TrainingMode, shuffle?: boolean) => {
      setShouldShuffle(shuffle ?? false);
      setPendingView(mode);
      await loadDeckById(deckFile);
    },
    [loadDeckById]
  );

  const handleHome = useCallback(() => {
    setView("home");
    setPendingView(null);
    setShouldShuffle(false);
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

  // Show loading while deck is being fetched
  if (loading || pendingView) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-secondary font-sans">Caricamento mazzo...</div>
      </div>
    );
  }

  if (view === "home" || !processedDeck) {
    return <HomeScreen decks={decks} onStart={handleStart} />;
  }

  if (view === "study") {
    return <StudyPlayer deck={processedDeck} onHome={handleHome} />;
  }

  return <CardPlayer deck={processedDeck} onHome={handleHome} />;
}
