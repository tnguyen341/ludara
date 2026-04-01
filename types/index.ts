export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface CardType {
  id: string;
  name: string;
  description: string;
  category: string;
  // Arcana-specific fields — optional; idea cards leave these unset
  rarity?: Rarity;
  symbol?: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  glowColor: string;
  symbol: string;
  gradient: string;
}
