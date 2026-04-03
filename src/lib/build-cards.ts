import type { Card, CardCategory, CardDifficulty } from "../types/card";

/**
 * EXTENSION POINT — buildCardsFromPgnSource
 *
 * Future entry point for generating cards from PGN databases.
 * When implemented, this function will:
 *
 * 1. Parse PGN files from sources like:
 *    - Lichess Open Database (CC0)
 *    - Lichess Opening Explorer API
 *    - The Week in Chess (TWIC) archives
 *    - PGN Mentor (supplementary)
 *
 * 2. Extract opening lines and generate cards of 4 types:
 *    - continuation: main line interrupted → user recalls next move
 *    - recognition: sequence shown → user identifies the variation
 *    - error: common deviation shown → user finds the refutation
 *    - concept: strategic question about the position/plan
 *
 * 3. Assign difficulty based on:
 *    - Line depth (early = base, deep = advanced)
 *    - Popularity in database (rare = advanced)
 *    - Tactical complexity
 *
 * Currently returns mock data. Replace with real PGN parsing logic.
 */
export function buildCardsFromPgnSource(
  _pgnContent: string,
  _opening: string,
  _options?: {
    maxCards?: number;
    categories?: CardCategory[];
    difficulties?: CardDifficulty[];
  }
): Card[] {
  // Placeholder: returns empty array
  // Future implementation will use a PGN parser library
  // and the Lichess Opening Explorer API for line validation

  console.info(
    "[buildCardsFromPgnSource] Stub called. Replace with PGN parser implementation."
  );

  return [];
}

/**
 * Validates a card has all required fields.
 * Useful when importing from external sources.
 */
export function validateCard(card: Partial<Card>): card is Card {
  return !!(
    card.id &&
    card.category &&
    card.difficulty &&
    card.opening &&
    card.variation &&
    card.side_to_move &&
    card.front?.question &&
    card.back?.answer_san &&
    card.back?.explanation
  );
}

/**
 * Generates a card ID from opening code and index.
 * Pattern: SCA-B-01, SCA-I-05, SCA-E-03, SCA-C-02
 */
export function generateCardId(
  openingCode: string,
  category: CardCategory,
  index: number
): string {
  const categoryMap: Record<CardCategory, string> = {
    continuation: "B",
    recognition: "V",
    concept: "C",
    error: "E",
  };
  const prefix = categoryMap[category] || "X";
  return `${openingCode}-${prefix}-${String(index).padStart(2, "0")}`;
}
