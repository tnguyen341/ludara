"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CardType, Pack } from "@/types";
import Card from "./Card";
import { RARITY_CONFIG } from "@/data/cards";

interface CardRevealProps {
  cards: CardType[];
  pack: Pack;
  onReset: () => void;
}

export default function CardReveal({ cards, pack, onReset }: CardRevealProps) {
  const [fanned, setFanned] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [allFlipped, setAllFlipped] = useState(false);

  useEffect(() => {
    // Delay fan-out slightly after entering
    const t = setTimeout(() => setFanned(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Auto-reveal hint after fan completes
  useEffect(() => {
    if (fanned) {
      const t = setTimeout(() => setRevealedCount(cards.length), 1200);
      return () => clearTimeout(t);
    }
  }, [fanned, cards.length]);

  const handleRevealAll = () => {
    setAllFlipped(true);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p
          className="font-body text-sm tracking-[0.3em] uppercase mb-2"
          style={{ color: pack.accentColor, opacity: 0.7 }}
        >
          {pack.name}
        </p>
        <h2
          className="font-display text-2xl md:text-3xl font-black"
          style={{
            color: pack.accentColor,
            textShadow: `0 0 30px ${pack.glowColor}`,
          }}
        >
          Your Cards
        </h2>
      </motion.div>

      {/* Fan container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 500,
          height: 300,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {cards.map((card, i) => (
          <CardWrapper
            key={card.id}
            card={card}
            index={i}
            total={cards.length}
            isFanned={fanned}
            isRevealed={i < revealedCount}
            forceFlip={allFlipped}
          />
        ))}
      </div>

      {/* Buttons */}
      <motion.div
        className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          className="px-10 py-3 rounded-full font-serif text-sm tracking-widest uppercase"
          style={{
            background: `linear-gradient(135deg, ${pack.accentColor}33, ${pack.accentColor}11)`,
            border: `2px solid ${pack.accentColor}`,
            color: pack.accentColor,
            boxShadow: `0 0 20px ${pack.glowColor}`,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${pack.glowColor}` }}
          whileTap={{ scale: 0.96 }}
          onClick={handleRevealAll}
        >
          Reveal All
        </motion.button>

        <motion.button
          className="px-10 py-3 rounded-full font-serif text-sm tracking-widest uppercase"
          style={{
            background: "transparent",
            border: "2px solid #c9a84c44",
            color: "#c9a84c",
            opacity: 0.7,
          }}
          whileHover={{ opacity: 1, borderColor: "#c9a84c" }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
        >
          Open Another
        </motion.button>
      </motion.div>

      {/* Card summary shown after all flipped */}
      <AnimatePresence>
        {allFlipped && (
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-3 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {cards.map((card) => {
              const cfg = RARITY_CONFIG[card.rarity];
              return (
                <div
                  key={card.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{
                    background: `${cfg.color}11`,
                    border: `1px solid ${cfg.border}66`,
                  }}
                >
                  <span style={{ color: cfg.color, fontSize: "0.65rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
                    {cfg.label.toUpperCase()}
                  </span>
                  <span style={{ color: "#c8b88a", fontSize: "0.7rem", fontFamily: "'Crimson Pro', serif" }}>
                    {card.name}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrapper to manage per-card flip state
function CardWrapper({
  card,
  index,
  total,
  isFanned,
  isRevealed,
  forceFlip,
}: {
  card: CardType;
  index: number;
  total: number;
  isFanned: boolean;
  isRevealed: boolean;
  forceFlip: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (forceFlip && !flipped) {
      const t = setTimeout(() => setFlipped(true), index * 120);
      return () => clearTimeout(t);
    }
  }, [forceFlip, flipped, index]);

  return (
    <Card
      card={card}
      index={index}
      total={total}
      isRevealed={isRevealed}
      isFanned={isFanned}
      onReveal={() => setFlipped(true)}
    />
  );
}
