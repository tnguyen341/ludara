import type { CardType } from "@/types";
import { IDEAS } from "@/data/cards";

/**
 * Returns n randomly selected CardType items from IDEAS with no duplicates.
 * Clamps n to IDEAS.length if n exceeds the pool size.
 */
export function getRandomHand(n: number): CardType[] {
  const count = Math.min(n, IDEAS.length);
  const pool = IDEAS.slice();
  const hand: CardType[] = [];

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * (pool.length - i));
    hand.push(pool[idx]);
    // Swap picked item to the end of the unsorted region
    pool[idx] = pool[pool.length - 1 - i];
  }

  return hand;
}
