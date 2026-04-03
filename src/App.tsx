import { useState, useCallback } from "react";
import { HomeScreen } from "./components/home-screen";
import { CardPlayer } from "./components/card-player";
import { StudyPlayer } from "./components/study-player";
import { useDeck } from "./hooks/use-deck";
import type { TrainingMode } from "./types/card";

type AppView = "home" | "quiz" | "study";

export default function App() {
  const { decks, activeDeck, loading, error, loadDeckById } = useDeck();
  const [view, setView] = useState<AppView>("home");

  const handleStart = useCallback(
    async (deckFile: string, mode: TrainingMode) => {
      await loadDeckById(deckFile);
      setView(mode);
    },
    [loadDeckById]
  );

  const handleHome = useCallback(() => {
    setView("home");
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-incorrect mb-2">Errore di caricamento</p>
          <p className="text-xs text-tertiary">{error}</p>
        </div>
      </div>
    );
  }

  if (view === "home" || !activeDeck) {
    return (
      <HomeScreen
        decks={decks}
        onStart={handleStart}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-secondary">Caricamento mazzo...</div>
      </div>
    );
  }

  if (view === "study") {
    return <StudyPlayer deck={activeDeck} onHome={handleHome} />;
  }

  return <CardPlayer deck={activeDeck} onHome={handleHome} />;
}
