import { useEffect } from "react";

interface DrillKeyboardActions {
  onKnew: () => void;
  onDidntKnow: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpace: () => void;
}

export function useDrillKeyboard({ onKnew, onDidntKnow, onPrev, onNext, onSpace }: DrillKeyboardActions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case " ": e.preventDefault(); onSpace(); break;
        case "1": e.preventDefault(); onKnew(); break;
        case "2": e.preventDefault(); onDidntKnow(); break;
        case "ArrowLeft": e.preventDefault(); onPrev(); break;
        case "ArrowRight": e.preventDefault(); onNext(); break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKnew, onDidntKnow, onPrev, onNext, onSpace]);
}
