import type { Deck, DeckMeta } from "../types/card";

export async function loadDeckIndex(): Promise<DeckMeta[]> {
  const res = await fetch("/decks/index.json");
  if (!res.ok) throw new Error("Failed to load deck index");
  return res.json();
}

export async function loadDeck(file: string): Promise<Deck> {
  const res = await fetch(`/decks/${file}`);
  if (!res.ok) throw new Error(`Failed to load deck: ${file}`);
  return res.json();
}
