import type { Rarity } from "@/types";

export const RARITY_CONFIG: Record<
  Rarity,
  { label: string; color: string; glow: string; border: string; bg: string }
> = {
  common: {
    label: "Common",
    color: "#9ca3af",
    glow: "rgba(156,163,175,0.3)",
    border: "#4b5563",
    bg: "linear-gradient(160deg, #1f2937 0%, #111827 100%)",
  },
  uncommon: {
    label: "Uncommon",
    color: "#34d399",
    glow: "rgba(52,211,153,0.4)",
    border: "#059669",
    bg: "linear-gradient(160deg, #064e3b 0%, #022c22 100%)",
  },
  rare: {
    label: "Rare",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.5)",
    border: "#2563eb",
    bg: "linear-gradient(160deg, #1e3a8a 0%, #0f1f4a 100%)",
  },
  epic: {
    label: "Epic",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.6)",
    border: "#7c3aed",
    bg: "linear-gradient(160deg, #4c1d95 0%, #2e1065 100%)",
  },
  legendary: {
    label: "Legendary",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.7)",
    border: "#d97706",
    bg: "linear-gradient(160deg, #78350f 0%, #451a03 100%)",
  },
};
