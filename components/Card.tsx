"use client";

import { motion } from "framer-motion";
import { CardType } from "@/types";
import { RARITY_CONFIG } from "@/data/cards";
import { useState } from "react";

interface CardProps {
  card: CardType;
  index: number;
  total: number;
  isRevealed: boolean;
  isFanned: boolean;
  onReveal: () => void;
}

// Fan angle calculation
function getFanTransform(index: number, total: number): { rotate: number; x: number; y: number } {
  const spread = Math.min(total * 14, 70);
  const mid = (total - 1) / 2;
  const offset = index - mid;
  const rotate = offset * (spread / (total - 1));
  const arcRadius = 200;
  const y = Math.abs(offset) * (arcRadius / total);
  const x = offset * 22;
  return { rotate, x, y };
}

export default function Card({ card, index, total, isRevealed, isFanned, onReveal }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cfg = RARITY_CONFIG[card.rarity];
  const fan = getFanTransform(index, total);

  const handleClick = () => {
    if (!isFlipped && isRevealed) {
      setIsFlipped(true);
    }
  };

  // Start position: stacked at center
  const stackVariant = {
    x: (Math.random() - 0.5) * 6,
    y: 0,
    rotate: (Math.random() - 0.5) * 4,
    opacity: 0,
    scale: 0.85,
  };

  const fanVariant = {
    x: fan.x,
    y: fan.y,
    rotate: fan.rotate,
    opacity: 1,
    scale: 1,
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: 160,
        height: 224,
        transformOrigin: "bottom center",
        perspective: "1000px",
        zIndex: isFlipped ? 20 + index : index,
      }}
      variants={{ stacked: stackVariant, fanned: fanVariant }}
      initial="stacked"
      animate={isFanned ? "fanned" : "stacked"}
      transition={{
        duration: 0.9,
        delay: isFanned ? index * 0.08 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        isFanned && !isFlipped
          ? { y: fan.y - 20, scale: 1.08, zIndex: 50, transition: { duration: 0.2 } }
          : {}
      }
      onClick={handleClick}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* BACK FACE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "12px",
            background: "linear-gradient(160deg, #1a1a2e 0%, #0d0d1a 100%)",
            border: "1px solid #c9a84c44",
            boxShadow: "0 10px 40px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Back pattern */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              border: "1px solid #c9a84c22",
              borderRadius: "8px",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 14,
              border: "1px solid #c9a84c11",
              borderRadius: "6px",
            }}
          />
          <div style={{ fontSize: "3rem", color: "#c9a84c", opacity: 0.6, lineHeight: 1 }}>✦</div>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.55rem",
              color: "#c9a84c",
              opacity: 0.5,
              letterSpacing: "0.3em",
              marginTop: "8px",
              textTransform: "uppercase",
            }}
          >
            Arcana
          </div>
          {/* Top stripe */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
            }}
          />

          {/* Tap hint */}
          {isRevealed && (
            <motion.div
              style={{
                position: "absolute",
                bottom: 16,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "0.65rem",
                color: "#c9a84c",
                opacity: 0.6,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Tap to reveal
            </motion.div>
          )}
        </div>

        {/* FRONT FACE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "12px",
            background: cfg.bg,
            border: `2px solid ${cfg.border}`,
            boxShadow: `0 10px 40px rgba(0,0,0,0.8), 0 0 30px ${cfg.glow}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top color bar */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
            }}
          />

          {/* Rarity badge */}
          <div
            style={{
              margin: "8px 8px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.5rem",
                color: cfg.color,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              {cfg.label}
            </span>
            <span style={{ fontSize: "0.9rem", color: cfg.color, opacity: 0.8 }}>{card.symbol}</span>
          </div>

          {/* Art area */}
          <div
            style={{
              flex: "0 0 80px",
              margin: "8px",
              borderRadius: "6px",
              background: `radial-gradient(ellipse at 50% 40%, ${cfg.color}22 0%, rgba(0,0,0,0.4) 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${cfg.border}44`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {card.rarity === "legendary" && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `conic-gradient(from 0deg, transparent, ${cfg.color}33, transparent)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span style={{ fontSize: "2.2rem", lineHeight: 1, position: "relative", zIndex: 1 }}>
              {card.symbol}
            </span>
          </div>

          {/* Card name */}
          <div
            style={{
              padding: "0 10px 4px",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: cfg.color,
              letterSpacing: "0.05em",
              textAlign: "center",
              lineHeight: 1.3,
              textShadow: `0 0 10px ${cfg.glow}`,
            }}
          >
            {card.name}
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              margin: "4px 12px",
              background: `linear-gradient(90deg, transparent, ${cfg.border}88, transparent)`,
            }}
          />

          {/* Element & Power */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 10px 4px",
              fontFamily: "'Crimson Pro', serif",
              fontSize: "0.6rem",
              color: cfg.color,
              opacity: 0.8,
            }}
          >
            <span>{card.element}</span>
            <span>PWR {card.power}</span>
          </div>

          {/* Description */}
          <div
            style={{
              flex: 1,
              padding: "0 10px 8px",
              fontFamily: "'Crimson Pro', serif",
              fontSize: "0.58rem",
              color: "#c8b88a",
              opacity: 0.75,
              lineHeight: 1.5,
              fontStyle: "italic",
              overflow: "hidden",
            }}
          >
            {card.description}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
            }}
          />

          {/* Shine */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
