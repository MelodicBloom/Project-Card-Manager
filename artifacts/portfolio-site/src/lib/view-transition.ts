import { flushSync } from "react-dom";
import { useLocation } from "wouter";
import type { MouseEvent } from "react";

type VTDoc = Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };

/**
 * Navigate inside a View Transition when supported (Chrome/Edge/Safari 18+).
 * Falls back to a plain client-side navigation (and respects reduced motion).
 */
export function useViewTransitionNavigate() {
  const [, navigate] = useLocation();
  return (href: string, e?: MouseEvent, direction: "forward" | "back" = "forward") => {
    if (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab work
      e.preventDefault();
    }
    const doc = document as VTDoc;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }
    document.documentElement.dataset.vtDirection = direction;
    const t = doc.startViewTransition(() => {
      flushSync(() => navigate(href));
      window.scrollTo(0, 0);
    });
    t.finished.finally(() => delete document.documentElement.dataset.vtDirection);
  };
}
