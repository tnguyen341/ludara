export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface CardType {
  id: string;
  name: string;
  description: string;
  category: string;
  // Arcana-specific fields — optional; idea cards leave these unset
  rarity?: Rarity;
  power?: number;
  element?: string;
  symbol?: string;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  theme: string;
  accentColor: string;
  glowColor: string;
  symbol: string;
  gradient: string;
}

export type GamePhase =
  | "select"       // Choose a pack
  | "inspect"      // Looking at chosen pack before opening
  | "opening"      // Pack tear animation
  | "reveal"       // Cards fanning out
  | "done"         // All revealed, can reset
  | "matchup";     // Idea matchup board
