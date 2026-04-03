import { useState, useCallback, useMemo } from "react";
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

  const processedDeck = useMemo<Deck | null>(() => {
    if (!activeDeck) return null;
    if (!shouldShuffle) return activeDeck;
    return { ...activeDeck, cards: shuffleArray(activeDeck.cards) };
  }, [activeDeck, shouldShuffle]);

  const handleStart = useCallback(
    async (deckFile: string, mode: TrainingMode, shuffle?: boolean) => {
      setShouldShuffle(shuffle ?? false);
      await loadDeckById(deckFile);
      setView(mode);
    },
    [loadDeckById]
  );

  const handleHome = useCallback(() => {
    setView("home");
    setShouldShuffle(false);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-incorrect font-sans mb-2">Errore di caricamento</p>
          <p className="text-xs text-tertiary font-sans">{error}</p>
        </div>
      </div>
    );
  }

  if (view === "home" || !processedDeck) {
    return <HomeScreen decks={decks} onStart={handleStart} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-secondary font-sans">Caricamento mazzo...</div>
      </div>
    );
  }

  if (view === "study") {
    return <StudyPlayer deck={processedDeck} onHome={handleHome} />;
  }

  return <CardPlayer deck={processedDeck} onHome={handleHome} />;
}
