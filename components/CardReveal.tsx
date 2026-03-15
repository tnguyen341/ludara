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
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [anyDragging, setAnyDragging] = useState(false);
  const [dropZoneReady, setDropZoneReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFanned(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handlePlay = (cardId: string) => {
    setPlayedIds((prev) => new Set(Array.from(prev).concat(cardId)));
  };

  const handleDragStateChange = (isDragging: boolean, aboveThreshold: boolean) => {
    setAnyDragging(isDragging);
    setDropZoneReady(aboveThreshold);
  };

  const playedCards = cards.filter((c) => playedIds.has(c.id));

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">

      {/* ── Drop Zone ── */}
      <AnimatePresence>
        {anyDragging && (
          <motion.div
            style={{
              position: "absolute",
              top: 72,
              left: "50%",
              marginLeft: -120,
              width: 240,
              height: 96,
              borderRadius: 48,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px dashed ${dropZoneReady ? pack.accentColor : "#c9a84c33"}`,
              background: dropZoneReady ? `${pack.accentColor}18` : "transparent",
            }}
            initial={{ opacity: 0, scale: 0.88, y: -8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: dropZoneReady
                ? [
                    `0 0 24px ${pack.glowColor}`,
                    `0 0 52px ${pack.glowColor}`,
                    `0 0 24px ${pack.glowColor}`,
                  ]
                : "0 0 0px transparent",
            }}
            exit={{ opacity: 0, scale: 0.88, y: -8 }}
            transition={{ duration: 0.22, boxShadow: { duration: 0.7, repeat: Infinity } }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: dropZoneReady ? pack.accentColor : "#c9a84c44",
              }}
            >
              {dropZoneReady ? "✦ Release! ✦" : "Drop to Play"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div
        className="text-center mb-6"
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
          style={{ color: pack.accentColor, textShadow: `0 0 30px ${pack.glowColor}` }}
        >
          Your Hand
        </h2>
      </motion.div>

      {/* Fan container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 580,
          height: 380,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            total={cards.length}
            isFanned={fanned}
            isPlayed={playedIds.has(card.id)}
            onPlay={() => handlePlay(card.id)}
            onDragStateChange={handleDragStateChange}
          />
        ))}
      </div>

      {/* Hint text */}
      <AnimatePresence>
        {fanned && !anyDragging && playedIds.size < cards.length && (
          <motion.p
            style={{
              marginTop: 24,
              color: "#c9a84c",
              opacity: 0.42,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "0.78rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.42 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.8 }}
          >
            Drag a card upward to play it
          </motion.p>
        )}
      </AnimatePresence>

      {/* Played card summary */}
      <AnimatePresence>
        {playedCards.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-2 max-w-lg"
            style={{ marginTop: 16 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {playedCards.map((card) => {
              const cfg = RARITY_CONFIG[card.rarity];
              return (
                <motion.div
                  key={card.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{
                    background: `${cfg.color}11`,
                    border: `1px solid ${cfg.border}66`,
                  }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28 }}
                >
                  <span style={{ fontSize: "0.75rem" }}>{card.symbol}</span>
                  <span
                    style={{
                      color: cfg.color,
                      fontSize: "0.62rem",
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {card.name}
                  </span>
                  <span
                    style={{
                      color: "#c8b88a",
                      fontSize: "0.58rem",
                      fontFamily: "'Crimson Pro', serif",
                      opacity: 0.55,
                    }}
                  >
                    played
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Another */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        <motion.button
          className="px-10 py-3 rounded-full font-serif text-sm tracking-widest uppercase"
          style={{
            background: "transparent",
            border: `2px solid ${pack.accentColor}55`,
            color: pack.accentColor,
            opacity: 0.7,
          }}
          whileHover={{ opacity: 1, borderColor: pack.accentColor }}
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
        >
          Open Another
        </motion.button>
      </motion.div>
    </div>
  );
}
