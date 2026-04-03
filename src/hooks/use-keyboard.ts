import { useEffect } from "react";
import type { CardResult } from "../types/card";

interface KeyboardActions {
  reveal: () => void;
  respond: (result: CardResult) => void;
  next: () => void;
  prev: () => void;
  isRevealed: boolean;
}

export function useKeyboard({
  reveal,
  respond,
  next,
  prev,
  isRevealed,
}: KeyboardActions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (!isRevealed) reveal();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "1":
          if (isRevealed) {
            e.preventDefault();
            respond("correct");
          }
          break;
        case "2":
          if (isRevealed) {
            e.preventDefault();
            respond("incorrect");
          }
          break;
        case "3":
          if (isRevealed) {
            e.preventDefault();
            respond("review");
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reveal, respond, next, prev, isRevealed]);
}
