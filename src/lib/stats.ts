import { getItem, setItem } from "./storage";
import type { CardResponse, SessionStats } from "../types/card";

interface StoredStats {
  responses: CardResponse[];
  lastSession: string;
}

function getStatsKey(deckId: string): string {
  return `stats_${deckId}`;
}

export function loadStats(deckId: string): CardResponse[] {
  const stored = getItem<StoredStats>(getStatsKey(deckId), {
    responses: [],
    lastSession: new Date().toISOString(),
  });
  return stored.responses;
}

export function saveResponse(deckId: string, response: CardResponse): void {
  const stored = getItem<StoredStats>(getStatsKey(deckId), {
    responses: [],
    lastSession: new Date().toISOString(),
  });

  // Keep only latest response per card
  const filtered = stored.responses.filter((r) => r.cardId !== response.cardId);
  filtered.push(response);

  setItem(getStatsKey(deckId), {
    responses: filtered,
    lastSession: new Date().toISOString(),
  });
}

export function computeSessionStats(
  totalCards: number,
  responses: CardResponse[]
): SessionStats {
  const correct = responses.filter((r) => r.result === "correct").length;
  const incorrect = responses.filter((r) => r.result === "incorrect").length;
  const review = responses.filter((r) => r.result === "review").length;

  return {
    total: totalCards,
    seen: responses.length,
    correct,
    incorrect,
    review,
  };
}

export function clearStats(deckId: string): void {
  setItem(getStatsKey(deckId), {
    responses: [],
    lastSession: new Date().toISOString(),
  });
}
