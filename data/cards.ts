import { Pack, CardType, Rarity } from "@/types";

export const PACKS: Pack[] = [
  {
    id: "void",
    name: "Void Ascendant",
    description: "Cards born from the space between stars. Dark power, absolute dominion.",
    cardCount: 5,
    theme: "cosmic",
    accentColor: "#7c3aed",
    glowColor: "rgba(124,58,237,0.6)",
    symbol: "✦",
    gradient: "linear-gradient(135deg, #1a0533 0%, #0d0020 50%, #200040 100%)",
  },
  {
    id: "inferno",
    name: "Inferno Rites",
    description: "Forged in the heart of volcanoes. Scorching might, undeniable force.",
    cardCount: 5,
    theme: "fire",
    accentColor: "#dc2626",
    glowColor: "rgba(220,38,38,0.6)",
    symbol: "◈",
    gradient: "linear-gradient(135deg, #3b0a0a 0%, #1c0505 50%, #2d0a00 100%)",
  },
  {
    id: "arcane",
    name: "Arcane Codex",
    description: "Ancient knowledge sealed in gold. Wisdom as a weapon, truth as armor.",
    cardCount: 5,
    theme: "arcane",
    accentColor: "#c9a84c",
    glowColor: "rgba(201,168,76,0.6)",
    symbol: "❋",
    gradient: "linear-gradient(135deg, #1a1500 0%, #0f0d00 50%, #1a1200 100%)",
  },
  {
    id: "abyss",
    name: "Abyssal Tides",
    description: "Pulled from crushing ocean depths. Cold precision, relentless pressure.",
    cardCount: 5,
    theme: "water",
    accentColor: "#0891b2",
    glowColor: "rgba(8,145,178,0.6)",
    symbol: "◉",
    gradient: "linear-gradient(135deg, #001a2d 0%, #00070f 50%, #001520 100%)",
  },
];

const ELEMENTS = ["Shadow", "Flame", "Arcane", "Tide", "Storm", "Void", "Iron", "Spirit"];
const SYMBOLS = ["⚔", "🜂", "⚡", "☽", "✶", "⬡", "◈", "✦", "❋", "⚘"];

function getRarityForIndex(index: number, packId: string): Rarity {
  // Weighted distribution per pack
  const roll = Math.random();
  if (roll < 0.01) return "legendary";
  if (roll < 0.07) return "epic";
  if (roll < 0.22) return "rare";
  if (roll < 0.50) return "uncommon";
  return "common";
}

const CARD_NAMES: Record<string, string[]> = {
  common: ["Stone Familiar", "Mire Wretch", "Dusk Warden", "Pale Servant", "Hollow Shade"],
  uncommon: ["Thornbind Mage", "Ember Sentinel", "Tidal Enforcer", "Hex Weaver", "Veil Walker"],
  rare: ["Obsidian Revenant", "Cinder Archon", "Abyssal Sovereign", "Glyph Tyrant", "Rift Phantom"],
  epic: ["Voidborn Colossus", "Pyroclastic Herald", "Maelstrom Primarch", "Runic Dreadnought", "Umbral Warlord"],
  legendary: ["The Eternal Undone", "Ignis Infinitum", "Leviathan Unchained", "Axiom of End", "The First Silence"],
};

const CARD_DESC: Record<string, string[]> = {
  common: [
    "A loyal servant of shadow, bound by forgotten oaths.",
    "Risen from ash and ruin, it hungers still.",
    "Patient guardian of crumbling thresholds.",
  ],
  uncommon: [
    "Trained in arts that blur the line between life and ruin.",
    "Its gaze turns thought to stone and stone to dust.",
    "Bound to no master — only to the tide of war.",
  ],
  rare: [
    "Once a warden of heaven; now lord of the in-between.",
    "Forged where magma meets the void of space.",
    "Its name erases lesser names from memory.",
  ],
  epic: [
    "To face it is to understand one's own smallness.",
    "Entire civilizations have knelt at its shadow.",
    "Reality bends where it walks. History rewrites itself.",
  ],
  legendary: [
    "Before time had a name, this existed.",
    "The gods themselves made room when it arrived.",
    "It does not destroy. It simply ends.",
  ],
};

export function generateCards(packId: string, count: number): CardType[] {
  return Array.from({ length: count }, (_, i) => {
    const rarity = getRarityForIndex(i, packId);
    const names = CARD_NAMES[rarity];
    const descs = CARD_DESC[rarity];
    const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const powerBase: Record<Rarity, [number, number]> = {
      common: [10, 30],
      uncommon: [30, 55],
      rare: [55, 75],
      epic: [75, 92],
      legendary: [93, 100],
    };

    const [min, max] = powerBase[rarity];
    const power = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
      id: `${packId}-card-${i}-${Date.now()}`,
      name: names[Math.floor(Math.random() * names.length)],
      rarity,
      description: descs[Math.floor(Math.random() * descs.length)],
      power,
      element,
      symbol,
    };
  });
}

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; glow: string; border: string; bg: string }> = {
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
