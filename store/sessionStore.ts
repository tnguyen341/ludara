import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CardType } from "@/types";
import { getRandomHand } from "@/lib/hand";

export interface SessionState {
  hasPlayed: boolean;
  scores: Record<string, number>;
  currentHand: CardType[] | null;
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
        set({ currentHand: getRandomHand(3) });
      },

      commitCard(winnerId: string) {
        set((state) => ({
          hasPlayed: true,
          currentHand: null,
          scores: {
            ...state.scores,
            [winnerId]: (state.scores[winnerId] ?? 0) + 1,
          },
        }));
      },

      resetSession() {
        set({ hasPlayed: false, scores: {}, currentHand: null });
      },
    }),
    {
      name: "ludara-session",
      storage: createJSONStorage(() => localStorage),
      // Persist business state. currentHand is always derived fresh on rehydration.
      partialize: (state) => ({
        hasPlayed: state.hasPlayed,
        scores: state.scores,
      }),
      merge(persisted, current) {
        const p = persisted as Record<string, unknown>;

        const hasPlayed =
          typeof p["hasPlayed"] === "boolean" ? p["hasPlayed"] : false;

        const rawScores = p["scores"];
        const scores =
          rawScores !== null &&
          typeof rawScores === "object" &&
          !Array.isArray(rawScores)
            ? (rawScores as Record<string, number>)
            : {};

        return {
          ...current,
          hasPlayed,
          scores,
          // If the user already committed this session, don't draw a new hand.
          currentHand: hasPlayed ? null : getRandomHand(3),
        };
      },
    }
  )
);
