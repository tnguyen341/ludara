import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CardType } from "@/types";
import { getRandomHand } from "@/lib/hand";

export interface SessionState {
  hasPlayed: boolean;
  scores: Record<string, number>;
  currentHand: [CardType, CardType, CardType] | null;
  initSession: () => void;
  commitCard: (winnerId: string) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      hasPlayed: false,
      scores: {},
      currentHand: null,

      initSession() {
        set({ currentHand: getRandomHand(3) as [CardType, CardType, CardType] });
      },

      commitCard(winnerId: string) {
        set((state) => ({
          hasPlayed: true,
          scores: {
            ...state.scores,
            [winnerId]: (state.scores[winnerId] ?? 0) + 1,
          },
        }));
      },

      resetSession() {
        set({
          hasPlayed: false,
          currentHand: getRandomHand(3) as [CardType, CardType, CardType],
        });
      },
    }),
    {
      name: "ludara-session",
      storage: createJSONStorage(() => localStorage),
      // Persist scores only — hasPlayed resets each visit, currentHand derived fresh
      partialize: (state) => ({
        scores: state.scores,
      }),
      merge(persisted, current) {
        const p = persisted as Record<string, unknown>;
        const rawScores = p["scores"];
        const scores =
          rawScores !== null &&
          typeof rawScores === "object" &&
          !Array.isArray(rawScores)
            ? (rawScores as Record<string, number>)
            : {};
        return {
          ...current,
          scores,
          currentHand: getRandomHand(3) as [CardType, CardType, CardType],
        };
      },
    }
  )
);
