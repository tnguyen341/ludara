"use client";

import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  animate as fmAnimate,
} from "framer-motion";
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

const PLAY_ZONE = 0.45; // top 45% of viewport triggers play

// ── Shared card face ─────────────────────────────────────────────────────────
// Used by both the desktop fan (Card) and the mobile carousel (CardReveal).
export function CardFace({
  card,
  flipped,
  width = 160,
  height = 224,
  flipDuration = 0.52,
}: {
  card: CardType;
  flipped: boolean;
  width?: number;
  height?: number;
  flipDuration?: number;
}) {
  const cfg = RARITY_CONFIG[card.rarity];
  return (
    <motion.div
      style={{
        width,
        height,
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: flipDuration, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── BACK FACE ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          borderRadius: "12px",
          background: `
            radial-gradient(ellipse at 25% 20%, rgba(130,75,18,0.4) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 85%, rgba(90,45,8,0.45) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 40%, rgba(60,28,4,0.3) 0%, transparent 60%),
            linear-gradient(160deg, #3e2108 0%, #2b1507 40%, #1e0e04 70%, #301b09 100%)
          `,
          border: "3px solid #7a5410",
          boxShadow: `
            0 12px 44px rgba(0,0,0,0.85),
            inset 0 0 0 3px #2e1804,
            inset 0 0 0 5px #8a6418,
            inset 0 0 0 8px #2e1804
          `,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: `
            repeating-linear-gradient(2deg, transparent, transparent 3px, rgba(200,140,40,0.025) 3px, rgba(200,140,40,0.025) 5px),
            repeating-linear-gradient(92deg, transparent, transparent 4px, rgba(80,40,8,0.03) 4px, rgba(80,40,8,0.03) 8px)
          `,
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 11, border: "1.5px solid #b07818", borderRadius: "7px", opacity: 0.65 }} />
        <div style={{ position: "absolute", inset: 15, border: "1px solid #7a520e", borderRadius: "5px", opacity: 0.45 }} />
        {([
          { top: 18, left: 18 }, { top: 18, right: 18 },
          { bottom: 18, left: 18 }, { bottom: 18, right: 18 },
        ] as Array<{ top?: number; left?: number; right?: number; bottom?: number }>).map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos,
            width: 10, height: 10, border: "1.5px solid #b07818",
            borderRadius: "2px", transform: "rotate(45deg)", opacity: 0.7,
          }} />
        ))}
        <div style={{ fontSize: "2.6rem", color: "#c08820", opacity: 0.78, lineHeight: 1, textShadow: "0 2px 10px rgba(0,0,0,0.7), 0 0 20px rgba(180,110,20,0.4)" }}>✦</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", color: "#a87018", opacity: 0.6, letterSpacing: "0.38em", marginTop: "8px", textTransform: "uppercase" }}>Arcana</div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #b07818, transparent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #b07818, transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(230,170,60,0.07) 0%, transparent 45%, rgba(0,0,0,0.25) 100%)", pointerEvents: "none" }} />
      </div>

      {/* ── FRONT FACE ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)", borderRadius: "12px",
          background: cfg.bg, border: `2px solid ${cfg.border}`,
          boxShadow: `0 10px 40px rgba(0,0,0,0.8), 0 0 30px ${cfg.glow}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div style={{ height: "4px", background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />
        <div style={{ margin: "8px 8px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", color: cfg.color, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.9 }}>{cfg.label}</span>
          <span style={{ fontSize: "0.9rem", color: cfg.color, opacity: 0.8 }}>{card.symbol}</span>
        </div>
        <div style={{ flex: "0 0 80px", margin: "8px", borderRadius: "6px", background: `radial-gradient(ellipse at 50% 40%, ${cfg.color}22 0%, rgba(0,0,0,0.4) 100%)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${cfg.border}44`, position: "relative", overflow: "hidden" }}>
          {card.rarity === "legendary" && (
            <motion.div
              style={{ position: "absolute", inset: 0, background: `conic-gradient(from 0deg, transparent, ${cfg.color}33, transparent)` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          )}
          <span style={{ fontSize: "2.2rem", lineHeight: 1, position: "relative", zIndex: 1 }}>{card.symbol}</span>
        </div>
        <div style={{ padding: "0 10px 4px", fontFamily: "'Cinzel', serif", fontSize: "0.65rem", fontWeight: 700, color: cfg.color, letterSpacing: "0.05em", textAlign: "center", lineHeight: 1.3, textShadow: `0 0 10px ${cfg.glow}` }}>{card.name}</div>
        <div style={{ height: "1px", margin: "4px 12px", background: `linear-gradient(90deg, transparent, ${cfg.border}88, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px 4px", fontFamily: "'Crimson Pro', serif", fontSize: "0.6rem", color: cfg.color, opacity: 0.8 }}>
          <span>{card.element}</span>
          <span>PWR {card.power}</span>
        </div>
        <div style={{ flex: 1, padding: "0 10px 8px", fontFamily: "'Crimson Pro', serif", fontSize: "0.58rem", color: "#c8b88a", opacity: 0.75, lineHeight: 1.5, fontStyle: "italic", overflow: "hidden" }}>{card.description}</div>
        <div style={{ height: "4px", background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      </div>
    </motion.div>
  );
}

// ── Desktop fan card ─────────────────────────────────────────────────────────
export default function Card({
  card, index, total, isFanned, isPlayed, onPlay, onDragStateChange,
}: CardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aboveThreshold, setAboveThreshold] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [willChange, setWillChange] = useState<"auto" | "transform">("auto");

  const cfg = RARITY_CONFIG[card.rarity];
  const fan = getFanTransform(index, total);

  const mx = useMotionValue(0);
  const my = useMotionValue(50);
  const mScale = useMotionValue(0.82);
  const mOpacity = useMotionValue(0);
  const mRotate = useMotionValue(0);

  useEffect(() => {
    if (isFanned && !flipped) {
      const t = setTimeout(() => setFlipped(true), 500 + index * 140);
      return () => clearTimeout(t);
    }
  }, [isFanned, flipped, index]);

  useEffect(() => {
    if (!isFanned) {
      mx.set(0); my.set(50); mScale.set(0.82); mOpacity.set(0); mRotate.set(0);
      return;
    }
    setWillChange("transform");
    const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
    const delay = index * 0.1;
    const controls = [
      fmAnimate(mx, fan.x, { duration: 0.72, delay, ease }),
      fmAnimate(my, fan.y, { duration: 0.72, delay, ease }),
      fmAnimate(mScale, 1, { duration: 0.72, delay, ease }),
      fmAnimate(mOpacity, 1, { duration: 0.72, delay, ease }),
      fmAnimate(mRotate, fan.rotate, { duration: 0.72, delay, ease }),
    ];
    const wc = setTimeout(() => setWillChange("auto"), (0.72 + delay) * 1000 + 100);
    return () => { controls.forEach(c => c.stop()); clearTimeout(wc); };
  }, [isFanned, fan.x, fan.y, fan.rotate]);

  const handleDragStart = () => {
    setIsDragging(true);
    setWillChange("transform");
    fmAnimate(mRotate, 0, { duration: 0.12, ease: "easeOut" });
    fmAnimate(mScale, 1.12, { duration: 0.15, ease: "easeOut" });
    onDragStateChange(true, false);
  };

  const handleDrag = (_: PointerEvent, info: PanInfo) => {
    const above = info.point.y < window.innerHeight * PLAY_ZONE;
    if (above !== aboveThreshold) {
      setAboveThreshold(above);
      onDragStateChange(true, above);
    }
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const shouldPlay = info.point.y < window.innerHeight * PLAY_ZONE;
    setIsDragging(false);
    setAboveThreshold(false);
    onDragStateChange(false, false);

    if (shouldPlay) {
      setIsBursting(true);
      const ease = [0.4, 0, 1, 1] as const;
      fmAnimate(mOpacity, 0, { duration: 0.4, ease });
      fmAnimate(mScale, 0.8, { duration: 0.4, ease });
      fmAnimate(my, my.get() - 800, { duration: 0.4, ease });
      fmAnimate(mx, mx.get() * 0.3, { duration: 0.32 });
      setTimeout(() => { setIsBursting(false); onPlay(); }, 450);
    } else {
      const spring = { type: "spring" as const, stiffness: 500, damping: 38 };
      fmAnimate(mx, fan.x, spring);
      fmAnimate(my, fan.y, spring);
      fmAnimate(mRotate, fan.rotate, spring);
      fmAnimate(mScale, 1, spring);
      setTimeout(() => setWillChange("auto"), 700);
    }
  };

  const handleHoverStart = () => {
    if (!isFanned || isPlayed || isDragging) return;
    fmAnimate(my, fan.y - 42, { duration: 0.18, ease: "easeOut" });
    fmAnimate(mScale, 1.14, { duration: 0.18, ease: "easeOut" });
  };

  const handleHoverEnd = () => {
    if (isDragging) return;
    fmAnimate(my, fan.y, { duration: 0.22, ease: "easeOut" });
    fmAnimate(mScale, 1, { duration: 0.22, ease: "easeOut" });
  };

  return (
    <motion.div
      className="absolute select-none"
      style={{
        width: 160, height: 224,
        x: mx, y: my, scale: mScale, opacity: mOpacity,
        zIndex: isPlayed ? 0 : isDragging ? 100 : index + 2,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none", willChange,
      }}
      drag={!isFanned || isPlayed ? false : true}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {/* Rotation wrapper — isolated from draggable so drag tracks 1:1 */}
      <motion.div style={{ width: "100%", height: "100%", transformOrigin: "bottom center", rotate: mRotate }}>
        <CardFace card={card} flipped={flipped} width={160} height={224} />
      </motion.div>

      <AnimatePresence>
        {aboveThreshold && (
          <motion.div
            style={{ position: "absolute", inset: -8, borderRadius: 18, border: `2px solid ${cfg.color}`, boxShadow: `0 0 30px ${cfg.glow}, 0 0 70px ${cfg.glow}66`, pointerEvents: "none" }}
            initial={{ opacity: 0 }} animate={{ opacity: [0.7, 1, 0.7] }} exit={{ opacity: 0 }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBursting && (
          <motion.div
            style={{ position: "absolute", inset: -28, borderRadius: 28, background: `radial-gradient(circle, ${cfg.color}cc 0%, ${cfg.color}44 40%, transparent 70%)`, pointerEvents: "none", zIndex: 150 }}
            initial={{ opacity: 1, scale: 0.3 }} animate={{ opacity: 0, scale: 3.5 }}
            transition={{ duration: 0.6, ease: [0, 0.5, 0.8, 1] }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
