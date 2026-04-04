import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const MIN_SWIPE = 50; // minimum distance in px
const MAX_TIME = 300; // max time in ms

export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }: SwipeHandlers) {
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.t;
    touchStart.current = null;

    if (dt > MAX_TIME) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy && absDx > MIN_SWIPE) {
      if (dx > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    } else if (absDy > absDx && absDy > MIN_SWIPE) {
      if (dy > 0) onSwipeDown?.();
      else onSwipeUp?.();
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return { onTouchStart, onTouchEnd };
}
