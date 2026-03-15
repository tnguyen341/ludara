"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { CardType } from "@/types";
import { RARITY_CONFIG } from "@/data/cards";
import { useEffect, useState } from "react";

interface CardProps {
  card: CardType;
  index: number;
  total: number;
  isFanned: boolean;
  isPlayed: boolean;
  onPlay: () => void;
  onDragStateChange: (isDragging: boolean, aboveThreshold: boolean) => void;
}

// Circular arc fan — mirrors Hearthstone's hand curve
function getFanTransform(index: number, total: number) {
  const totalSpreadDeg = Math.min(total * 14, 78);
  const mid = (total - 1) / 2;
  const offset = index - mid;
  const angleDeg = total > 1 ? offset * (totalSpreadDeg / (total - 1)) : 0;
  const angleRad = (angleDeg * Math.PI) / 180;
  const arcRadius = 360;
  const x = arcRadius * Math.sin(angleRad) * 0.62;
  const y = arcRadius * (1 - Math.cos(angleRad));
  return { rotate: angleDeg, x, y };
}

// How far up (px) you need to drag to trigger play
const PLAY_THRESHOLD = -60;

export default function Card({
  card,
  index,
  total,
  isFanned,
  isPlayed,
  onPlay,
  onDragStateChange,
}: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aboveThreshold, setAboveThreshold] = useState(false);
  const cfg = RARITY_CONFIG[card.rarity];
  const fan = getFanTransform(index, total);

  // Auto-flip face-up as each card slides into its fan position
  useEffect(() => {
    if (isFanned && !flipped) {
      const t = setTimeout(() => setFlipped(true), 500 + index * 140);
      return () => clearTimeout(t);
    }
  }, [isFanned, flipped, index]);

  const getAnimate = () => {
    if (!isFanned) return { x: 0, y: 50, rotate: 0, opacity: 0, scale: 0.82 };
    if (isPlayed) return { x: fan.x * 0.3, y: -720, rotate: fan.rotate * 0.15, opacity: 0, scale: 2.1 };
    return { x: fan.x, y: fan.y, rotate: fan.rotate, opacity: 1, scale: 1 };
  };

  const getTransition = () => {
    if (isPlayed) return { duration: 0.48, ease: [0.3, 0, 0.8, 1] as const };
    return {
      duration: 0.72,
      delay: isFanned ? index * 0.1 : 0,
      ease: [0.16, 1, 0.3, 1] as const,
    };
  };

  const handleDragStart = () => {
    setIsDragging(true);
    onDragStateChange(true, false);
  };

  const handleDrag = (_: PointerEvent, info: PanInfo) => {
    const above = info.offset.y < PLAY_THRESHOLD;
    if (above !== aboveThreshold) {
      setAboveThreshold(above);
      onDragStateChange(true, above);
    }
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y < PLAY_THRESHOLD) {
      onPlay();
    }
    setIsDragging(false);
    setAboveThreshold(false);
    onDragStateChange(false, false);
  };

  return (
    <motion.div
      className="absolute select-none"
      style={{
        width: 160,
        height: 224,
        transformOrigin: "bottom center",
        perspective: "1000px",
        zIndex: isPlayed ? 0 : isDragging ? 100 : index + 2,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      initial={{ x: 0, y: 50, rotate: 0, opacity: 0, scale: 0.82 }}
      animate={getAnimate()}
      transition={getTransition()}
      drag={isFanned && !isPlayed}
      dragSnapToOrigin
      dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
      dragElastic={1}
      dragMomentum={false}
      dragTransition={{ bounceStiffness: 480, bounceDamping: 46 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileHover={
        isFanned && !isPlayed && !isDragging
          ? { y: fan.y - 42, scale: 1.14, zIndex: 50, transition: { duration: 0.18, ease: "easeOut" } }
          : {}
      }
      whileDrag={{ scale: 1.1, rotate: 0 }}
    >
      {/* 3D flip container */}
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── BACK FACE ── */}
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
          <div style={{ position: "absolute", inset: 8, border: "1px solid #c9a84c22", borderRadius: "8px" }} />
          <div style={{ position: "absolute", inset: 14, border: "1px solid #c9a84c11", borderRadius: "6px" }} />
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
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
        </div>

        {/* ── FRONT FACE ── */}
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
          <div style={{ height: "4px", background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />

          <div style={{ margin: "8px 8px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            <span style={{ fontSize: "2.2rem", lineHeight: 1, position: "relative", zIndex: 1 }}>{card.symbol}</span>
          </div>

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

          <div style={{ height: "1px", margin: "4px 12px", background: `linear-gradient(90deg, transparent, ${cfg.border}88, transparent)` }} />

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

          <div style={{ height: "4px", background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />

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

      {/* Drag-above-threshold glow ring */}
      <AnimatePresence>
        {aboveThreshold && (
          <motion.div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: 18,
              border: `2px solid ${cfg.color}`,
              boxShadow: `0 0 30px ${cfg.glow}, 0 0 70px ${cfg.glow}66`,
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Burst flash on play */}
      <AnimatePresence>
        {isPlayed && (
          <motion.div
            style={{
              position: "absolute",
              inset: -28,
              borderRadius: 28,
              background: `radial-gradient(circle, ${cfg.color}cc 0%, ${cfg.color}44 40%, transparent 70%)`,
              pointerEvents: "none",
              zIndex: 150,
            }}
            initial={{ opacity: 1, scale: 0.3 }}
            animate={{ opacity: 0, scale: 3.5 }}
            transition={{ duration: 0.6, ease: [0, 0.5, 0.8, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
