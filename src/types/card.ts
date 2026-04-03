export type CardCategory = "continuation" | "recognition" | "concept" | "error";
export type CardDifficulty = "base" | "intermediate" | "advanced";
export type Side = "white" | "black";

export interface CardFront {
  moves_san: string[];
  question: string;
  fen?: string; // pre-computed for accuracy, fallback to SAN parser
}

export interface CardBack {
  answer_san: string;
  explanation: string;
}

export interface Card {
  id: string;
  category: CardCategory;
  difficulty: CardDifficulty;
  opening: string;
  variation: string;
  side_to_move: Side;
  front: CardFront;
  back: CardBack;
  tags: string[];
}

export interface Deck {
  deck_id: string;
  deck_name: string;
  description: string;
  card_count: number;
  cards: Card[];
}

export interface DeckMeta {
  deck_id: string;
  deck_name: string;
  description: string;
  card_count: number;
  file: string;
}

// Training modes
export type TrainingMode = "quiz" | "study" | "drill" | "reverse";

// Legacy quiz support
export type CardResult = "correct" | "incorrect" | "review";

export interface CardResponse {
  cardId: string;
  result: CardResult;
  timestamp: number;
}

export interface SessionStats {
  total: number;
  seen: number;
  correct: number;
  incorrect: number;
  review: number;
}

// Mastery system
export type MasteryLevel = "new" | "learning" | "familiar" | "mastered";

export interface CardMastery {
  cardId: string;
  consecutiveCorrect: number;
  totalSeen: number;
  lastSeen: number;
  level: MasteryLevel;
  nextReview: number; // timestamp
}

export const MASTERY_THRESHOLDS = {
  learning: 1,   // 1+ consecutive correct
  familiar: 3,   // 3+ consecutive correct
  mastered: 6,   // 6+ consecutive correct
} as const;

export const MASTERY_INTERVALS = {
  new: 0,           // immediate
  learning: 86400000,     // 1 day
  familiar: 259200000,    // 3 days
  mastered: 604800000,    // 7 days
} as const;

export const MASTERY_COLORS: Record<MasteryLevel, string> = {
  new: "var(--text-tertiary)",
  learning: "var(--review)",
  familiar: "var(--cat-continuation)",
  mastered: "var(--correct)",
};
