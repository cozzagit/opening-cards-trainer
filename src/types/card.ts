export type CardCategory = "continuation" | "recognition" | "concept" | "error";
export type CardDifficulty = "base" | "intermediate" | "advanced";
export type Side = "white" | "black";

export interface CardFront {
  moves_san: string[];
  question: string;
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

export type CardResult = "correct" | "incorrect" | "review";

export interface SessionStats {
  total: number;
  seen: number;
  correct: number;
  incorrect: number;
  review: number;
}

export type TrainingMode = "quiz" | "study";

export interface CardResponse {
  cardId: string;
  result: CardResult;
  timestamp: number;
}
