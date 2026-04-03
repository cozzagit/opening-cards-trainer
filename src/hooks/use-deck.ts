import { useState, useEffect, useCallback } from "react";
import { loadDeckIndex, loadDeck } from "../lib/deck-loader";
import type { Deck, DeckMeta, Card, CardCategory, CardDifficulty } from "../types/card";

interface UseDeckReturn {
  decks: DeckMeta[];
  activeDeck: Deck | null;
  loading: boolean;
  error: string | null;
  loadDeckById: (file: string) => Promise<void>;
  getFilteredCards: (
    categories?: CardCategory[],
    difficulties?: CardDifficulty[]
  ) => Card[];
}

export function useDeck(): UseDeckReturn {
  const [decks, setDecks] = useState<DeckMeta[]>([]);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeckIndex()
      .then(setDecks)
      .catch((e) => setError(e.message));
  }, []);

  const loadDeckById = useCallback(async (file: string) => {
    setLoading(true);
    setError(null);
    try {
      const deck = await loadDeck(file);
      setActiveDeck(deck);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load deck");
    } finally {
      setLoading(false);
    }
  }, []);

  const getFilteredCards = useCallback(
    (categories?: CardCategory[], difficulties?: CardDifficulty[]): Card[] => {
      if (!activeDeck) return [];
      let cards = activeDeck.cards;
      if (categories?.length) {
        cards = cards.filter((c) => categories.includes(c.category));
      }
      if (difficulties?.length) {
        cards = cards.filter((c) => difficulties.includes(c.difficulty));
      }
      return cards;
    },
    [activeDeck]
  );

  return { decks, activeDeck, loading, error, loadDeckById, getFilteredCards };
}
