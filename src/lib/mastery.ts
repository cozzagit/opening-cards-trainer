import { getItem, setItem } from "./storage";
import type { Card, CardMastery, MasteryLevel } from "../types/card";
import { MASTERY_THRESHOLDS, MASTERY_INTERVALS } from "../types/card";

function masteryKey(deckId: string): string {
  return `mastery_${deckId}`;
}

function computeLevel(consecutiveCorrect: number): MasteryLevel {
  if (consecutiveCorrect >= MASTERY_THRESHOLDS.mastered) return "mastered";
  if (consecutiveCorrect >= MASTERY_THRESHOLDS.familiar) return "familiar";
  if (consecutiveCorrect >= MASTERY_THRESHOLDS.learning) return "learning";
  return "new";
}

function computeNextReview(level: MasteryLevel): number {
  return Date.now() + MASTERY_INTERVALS[level];
}

// Load all mastery records for a deck
export function loadMastery(deckId: string): Map<string, CardMastery> {
  const records = getItem<CardMastery[]>(masteryKey(deckId), []);
  const map = new Map<string, CardMastery>();
  for (const r of records) map.set(r.cardId, r);
  return map;
}

// Save mastery records
export function saveMastery(deckId: string, mastery: Map<string, CardMastery>): void {
  setItem(masteryKey(deckId), Array.from(mastery.values()));
}

// Get or create mastery for a card
export function getCardMastery(mastery: Map<string, CardMastery>, cardId: string): CardMastery {
  return mastery.get(cardId) ?? {
    cardId,
    consecutiveCorrect: 0,
    totalSeen: 0,
    lastSeen: 0,
    level: "new",
    nextReview: 0,
  };
}

// Record a drill response: "knew" or "didn't know"
export function recordDrillResponse(
  deckId: string,
  mastery: Map<string, CardMastery>,
  cardId: string,
  knew: boolean
): Map<string, CardMastery> {
  const current = getCardMastery(mastery, cardId);
  const consecutiveCorrect = knew ? current.consecutiveCorrect + 1 : 0;
  const level = computeLevel(consecutiveCorrect);

  const updated: CardMastery = {
    cardId,
    consecutiveCorrect,
    totalSeen: current.totalSeen + 1,
    lastSeen: Date.now(),
    level,
    nextReview: computeNextReview(level),
  };

  const newMap = new Map(mastery);
  newMap.set(cardId, updated);
  saveMastery(deckId, newMap);
  return newMap;
}

// Order cards for drill: prioritize weak/unseen/due cards
export function orderCardsForDrill(
  cards: Card[],
  mastery: Map<string, CardMastery>
): Card[] {
  const now = Date.now();

  const getPriority = (card: Card): number => {
    const m = mastery.get(card.id);
    if (!m || m.level === "new") return 0; // highest priority
    if (m.nextReview <= now) return 1;      // due for review
    if (m.level === "learning") return 2;
    if (m.level === "familiar") return 3;
    return 4; // mastered
  };

  const getLastSeen = (card: Card): number => {
    return mastery.get(card.id)?.lastSeen ?? 0;
  };

  return [...cards].sort((a, b) => {
    const pa = getPriority(a);
    const pb = getPriority(b);
    if (pa !== pb) return pa - pb;
    return getLastSeen(a) - getLastSeen(b); // oldest first
  });
}

// Get only weak cards (new + learning)
export function getWeakCards(cards: Card[], mastery: Map<string, CardMastery>): Card[] {
  return cards.filter(c => {
    const m = mastery.get(c.id);
    return !m || m.level === "new" || m.level === "learning";
  });
}

// Get due cards (past their review date)
export function getDueCards(cards: Card[], mastery: Map<string, CardMastery>): Card[] {
  const now = Date.now();
  return cards.filter(c => {
    const m = mastery.get(c.id);
    if (!m) return true; // new cards are always due
    return m.nextReview <= now;
  });
}

// Deck summary for home screen
export interface DeckSummary {
  totalCards: number;
  newCount: number;
  learningCount: number;
  familiarCount: number;
  masteredCount: number;
  dueCount: number;
  lastReviewed: number | null;
  masteryPercent: number;
}

export function getDeckSummary(deckId: string, totalCards: number): DeckSummary {
  const mastery = loadMastery(deckId);
  let newCount = 0, learningCount = 0, familiarCount = 0, masteredCount = 0, dueCount = 0;
  let lastReviewed: number | null = null;
  const now = Date.now();

  // Count all cards in deck (some may not have mastery records yet)
  const seen = new Set<string>();
  for (const [, m] of mastery) {
    seen.add(m.cardId);
    if (m.level === "new") newCount++;
    else if (m.level === "learning") learningCount++;
    else if (m.level === "familiar") familiarCount++;
    else if (m.level === "mastered") masteredCount++;
    if (m.nextReview <= now && m.level !== "new") dueCount++;
    if (lastReviewed === null || m.lastSeen > lastReviewed) lastReviewed = m.lastSeen;
  }

  // Cards with no mastery record are "new"
  newCount += totalCards - seen.size;
  dueCount += totalCards - seen.size;

  const masteryPercent = totalCards > 0
    ? Math.round(((familiarCount + masteredCount) / totalCards) * 100)
    : 0;

  return { totalCards, newCount, learningCount, familiarCount, masteredCount, dueCount, lastReviewed, masteryPercent };
}

// Reset mastery for a deck
export function resetMastery(deckId: string): void {
  setItem(masteryKey(deckId), []);
}
