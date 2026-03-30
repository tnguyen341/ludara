import { describe, it, expect } from "vitest";
import { getRandomHand } from "./hand";
import { IDEAS } from "@/data/cards";

describe("getRandomHand", () => {
  it("returns exactly n cards", () => {
    expect(getRandomHand(3)).toHaveLength(3);
    expect(getRandomHand(1)).toHaveLength(1);
    expect(getRandomHand(5)).toHaveLength(5);
  });

  it("returns no duplicate cards in a single hand", () => {
    for (let run = 0; run < 50; run++) {
      const hand = getRandomHand(3);
      const ids = hand.map((c) => c.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(hand.length);
    }
  });

  it("clamps n to IDEAS.length when n exceeds the pool size", () => {
    const oversize = IDEAS.length + 10;
    const hand = getRandomHand(oversize);
    expect(hand).toHaveLength(IDEAS.length);

    const ids = hand.map((c) => c.id);
    expect(new Set(ids).size).toBe(IDEAS.length);
  });

  it("returns all cards from IDEAS (no cards outside the pool)", () => {
    const validIds = new Set(IDEAS.map((i) => i.id));
    const hand = getRandomHand(IDEAS.length);
    for (const card of hand) {
      expect(validIds.has(card.id)).toBe(true);
    }
  });
});
