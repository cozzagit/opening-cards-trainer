import { useState, useCallback, useMemo } from "react";
import { saveResponse, computeSessionStats, clearStats, loadStats } from "../lib/stats";
import type { Card, CardResult, CardResponse, SessionStats } from "../types/card";

interface UseSessionReturn {
  cards: Card[];
  currentIndex: number;
  currentCard: Card | null;
  isRevealed: boolean;
  stats: SessionStats;
  responses: Map<string, CardResult>;
  reveal: () => void;
  respond: (result: CardResult) => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  reset: () => void;
  isComplete: boolean;
  progress: number;
}

export function useSession(deckId: string, cards: Card[]): UseSessionReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [responseList, setResponseList] = useState<CardResponse[]>(() =>
    loadStats(deckId)
  );

  const responses = useMemo(() => {
    const map = new Map<string, CardResult>();
    for (const r of responseList) {
      map.set(r.cardId, r.result);
    }
    return map;
  }, [responseList]);

  const currentCard = cards[currentIndex] ?? null;

  const stats = useMemo(
    () => computeSessionStats(cards.length, responseList),
    [cards.length, responseList]
  );

  const reveal = useCallback(() => setIsRevealed(true), []);

  const respond = useCallback(
    (result: CardResult) => {
      if (!currentCard) return;

      const response: CardResponse = {
        cardId: currentCard.id,
        result,
        timestamp: Date.now(),
      };

      saveResponse(deckId, response);
      setResponseList((prev) => {
        const filtered = prev.filter((r) => r.cardId !== currentCard.id);
        return [...filtered, response];
      });

      // Auto-advance after response
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsRevealed(false);
      }
    },
    [currentCard, deckId, currentIndex, cards.length]
  );

  const next = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsRevealed(false);
    }
  }, [currentIndex, cards.length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsRevealed(false);
    }
  }, [currentIndex]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsRevealed(false);
  }, []);

  const reset = useCallback(() => {
    clearStats(deckId);
    setResponseList([]);
    setCurrentIndex(0);
    setIsRevealed(false);
  }, [deckId]);

  const isComplete = stats.seen >= cards.length;
  const progress = cards.length > 0 ? (stats.seen / cards.length) * 100 : 0;

  return {
    cards,
    currentIndex,
    currentCard,
    isRevealed,
    stats,
    responses,
    reveal,
    respond,
    next,
    prev,
    goTo,
    reset,
    isComplete,
    progress,
  };
}
