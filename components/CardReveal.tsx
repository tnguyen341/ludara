"use client";

import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  animate as fmAnimate,
} from "framer-motion";
import { useEffect, useState } from "react";
import { CardType, Pack } from "@/types";
import Card from "./Card";
import { CardFace } from "./Card";
import { RARITY_CONFIG } from "@/data/rarityConfig";

// ── SSR-safe desktop hook ─────────────────────────────────────────────────────
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ── Carousel constants ────────────────────────────────────────────────────────
const CARD_W = 200;
const CARD_H = 280;
const SLOT = CARD_W + 24; // 224px centre-to-centre

function getSnapX(idx: number): number {
  const vw = typeof window !== "undefined" ? window.innerWidth : 375;
  return vw / 2 - SLOT * idx - CARD_W / 2;
}

function findNextUnplayed(
  currentIdx: number,
  cards: CardType[],
  playedIds: Set<string>
): number {
  for (let i = currentIdx + 1; i < cards.length; i++) {
    if (!playedIds.has(cards[i].id)) return i;
  }
  for (let i = currentIdx - 1; i >= 0; i--) {
    if (!playedIds.has(cards[i].id)) return i;
  }
  return Math.min(currentIdx, cards.length - 1);
}

// ── Played summary row ────────────────────────────────────────────────────────
function PlayedSummary({ cards, playedIds }: { cards: CardType[]; playedIds: Set<string> }) {
  const played = cards.filter((c) => playedIds.has(c.id));
  if (played.length === 0) return null;
  return (
    <motion.div
      style={{ width: "100%", maxWidth: 360, padding: "0 16px", marginBottom: 8 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.5rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#c9a84c",
          opacity: 0.5,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Played
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
        {played.map((card) => {
          const cfg = RARITY_CONFIG[card.rarity ?? "common"];
          return (
            <div
              key={card.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 20,
                background: `${cfg.color}11`,
                border: `1px solid ${cfg.border}66`,
              }}
            >
              <span style={{ fontSize: "0.7rem" }}>{card.symbol}</span>
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.06em",
                  color: cfg.color,
                }}
              >
                {card.name}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Mobile carousel ───────────────────────────────────────────────────────────
function MobileCarousel({
  cards,
  pack,
  onReset,
}: {
  cards: CardType[];
  pack: Pack;
  onReset: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  const [playedIds, setPlayedIds] = useState<Set<string>>(new Set());
  const [revealAll, setRevealAll] = useState(false);

  const carouselX = useMotionValue(getSnapX(0));
  const overlayY = useMotionValue(0);
  const overlayOp = useMotionValue(0);
  const overlayScale = useMotionValue(0.92);

  // Animate overlay in on mount
  useEffect(() => {
    fmAnimate(overlayOp, 1, { duration: 0.22 });
    fmAnimate(overlayScale, 1, { duration: 0.22 });
  }, []);

  // Snap carousel + fade in overlay whenever activeIndex changes
  useEffect(() => {
    fmAnimate(carouselX, getSnapX(activeIndex), {
      type: "spring",
      stiffness: 400,
      damping: 40,
    });
    overlayY.set(0);
    overlayOp.set(0);
    overlayScale.set(0.92);
    fmAnimate(overlayOp, 1, { duration: 0.22 });
    fmAnimate(overlayScale, 1, { duration: 0.22 });
  }, [activeIndex]);

  const handleRevealAll = () => {
    setRevealAll(true);
    setFlippedIds(new Set(cards.map((c) => c.id)));
  };

  // ── Carousel drag ──
  const handleCarouselDragEnd = (_: PointerEvent, info: PanInfo) => {
    const vx = info.velocity.x;
    let target = activeIndex;

    if (Math.abs(vx) > 300) {
      target =
        vx < 0
          ? Math.min(activeIndex + 1, cards.length - 1)
          : Math.max(activeIndex - 1, 0);
    } else {
      const cx = carouselX.get();
      let nearestDist = Infinity;
      cards.forEach((_, i) => {
        const dist = Math.abs(cx - getSnapX(i));
        if (dist < nearestDist) {
          nearestDist = dist;
          target = i;
        }
      });
    }

    if (target === activeIndex) {
      // Same card — just re-snap in case of drift
      fmAnimate(carouselX, getSnapX(activeIndex), {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    } else {
      setActiveIndex(target);
    }
  };

  // ── Active card tap = flip ──
  const handleOverlayTap = () => {
    const id = cards[activeIndex]?.id;
    if (!id || playedIds.has(id)) return;
    setFlippedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Active card swipe-up = play ──
  const handleOverlayDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y < -80) {
      const ease = [0.4, 0, 1, 1] as const;
      fmAnimate(overlayY, overlayY.get() - 800, { duration: 0.4, ease });
      fmAnimate(overlayOp, 0, { duration: 0.38, ease });
      fmAnimate(overlayScale, 0.8, { duration: 0.4, ease });

      const playedId = cards[activeIndex].id;
      setTimeout(() => {
        setPlayedIds((prev) => {
          const next = new Set(Array.from(prev).concat(playedId));
          const nextIdx = findNextUnplayed(activeIndex, cards, next);
          setActiveIndex(nextIdx);
          return next;
        });
      }, 440);
    } else {
      fmAnimate(overlayY, 0, { type: "spring", stiffness: 400, damping: 36 });
    }
  };

  const activeCard = cards[activeIndex];
  const activeIsPlayed = playedIds.has(activeCard?.id);
  const isFlippedActive = flippedIds.has(activeCard?.id) || revealAll;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <motion.div
        style={{ textAlign: "center", paddingTop: 48, marginBottom: 20 }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: pack.accentColor,
            opacity: 0.7,
            marginBottom: 6,
          }}
        >
          {pack.name}
        </p>
        <h2
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: "1.5rem",
            fontWeight: 900,
            color: pack.accentColor,
            textShadow: `0 0 30px ${pack.glowColor}`,
          }}
        >
          Your Hand
        </h2>
      </motion.div>

      {/* Track + overlay wrapper */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: CARD_H + 48,
          overflow: "visible",
          flexShrink: 0,
        }}
      >
        {/* Carousel track — drag="x" */}
        <motion.div
          drag="x"
          dragElastic={0.1}
          dragMomentum={false}
          dragConstraints={{
            left: getSnapX(cards.length - 1) - CARD_W * 0.5,
            right: getSnapX(0) + CARD_W * 0.5,
          }}
          onDragEnd={handleCarouselDragEnd}
          style={{
            x: carouselX,
            position: "absolute",
            top: 16,
            left: 0,
            display: "flex",
            gap: 24,
          }}
        >
          {cards.map((card, i) => {
            const isActive = i === activeIndex;
            const isPlayed = playedIds.has(card.id);
            const isFlipped = flippedIds.has(card.id) || revealAll;

            return (
              <motion.div
                key={card.id}
                animate={{
                  opacity: isActive ? 0 : isPlayed ? 0.15 : 0.6,
                  scale: isActive ? 1 : 0.88,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  flexShrink: 0,
                  position: "relative",
                  cursor: "pointer",
                }}
                onTap={() => {
                  if (!isActive) setActiveIndex(i);
                }}
              >
                <CardFace card={card} flipped={isFlipped} width={CARD_W} height={CARD_H} />
                {isPlayed && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      background: "rgba(0,0,0,0.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.5rem",
                        letterSpacing: "0.2em",
                        color: "#c9a84c",
                        textTransform: "uppercase",
                        opacity: 0.6,
                      }}
                    >
                      Played
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active card overlay — drag="y", centred at fixed screen position */}
        {activeCard && !activeIsPlayed && (
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              marginLeft: -CARD_W / 2,
              top: 16,
              width: CARD_W,
              height: CARD_H,
              y: overlayY,
              opacity: overlayOp,
              scale: overlayScale,
              zIndex: 20,
              cursor: "grab",
              touchAction: "none",
            }}
            drag="y"
            dragConstraints={{ top: -900, bottom: 80 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleOverlayDragEnd}
            onTap={handleOverlayTap}
          >
            <CardFace
              card={activeCard}
              flipped={isFlippedActive}
              width={CARD_W}
              height={CARD_H}
            />
            {/* Swipe hint */}
            <AnimatePresence>
              {isFlippedActive && (
                <motion.div
                  style={{
                    position: "absolute",
                    bottom: -26,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span
                    style={{
                      fontFamily: "'Crimson Pro', serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#c9a84c",
                    }}
                  >
                    ↑ Swipe up to play
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 6, marginTop: 36, marginBottom: 16 }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            animate={{
              width: i === activeIndex ? 18 : 6,
              opacity: playedIds.has(card.id) ? 0.2 : i === activeIndex ? 1 : 0.35,
              background: i === activeIndex ? pack.accentColor : "#c9a84c",
            }}
            transition={{ duration: 0.18 }}
            style={{ height: 6, borderRadius: 3, cursor: "pointer" }}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      {/* Reveal All */}
      <AnimatePresence>
        {!revealAll && (
          <motion.button
            style={{
              marginBottom: 12,
              padding: "8px 24px",
              borderRadius: 20,
              background: "transparent",
              border: `1px solid ${pack.accentColor}66`,
              color: pack.accentColor,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRevealAll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
          >
            Reveal All
          </motion.button>
        )}
      </AnimatePresence>

      {/* Played summary */}
      <PlayedSummary cards={cards} playedIds={playedIds} />

      {/* Open Another */}
      <motion.button
        style={{
          marginTop: 16,
          marginBottom: 40,
          padding: "10px 32px",
          borderRadius: 24,
          background: "transparent",
          border: `2px solid ${pack.accentColor}55`,
          color: pack.accentColor,
          fontFamily: "'Cinzel', serif",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
        whileHover={{ opacity: 1 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.0 }}
      >
        Open Another
      </motion.button>
    </div>
  );
}

// ── Desktop fan ───────────────────────────────────────────────────────────────
function DesktopFan({
  cards,
  pack,
  onReset,
}: {
  cards: CardType[];
  pack: Pack;
  onReset: () => void;
}) {
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

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      {/* Drop zone */}
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
          className="font-display text-3xl font-black"
          style={{ color: pack.accentColor, textShadow: `0 0 30px ${pack.glowColor}` }}
        >
          Your Hand
        </h2>
      </motion.div>

      {/* Fan */}
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

      {/* Hint */}
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

      {/* Played summary */}
      <div style={{ marginTop: 16 }}>
        <PlayedSummary cards={cards} playedIds={playedIds} />
      </div>

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

// ── Entry point ───────────────────────────────────────────────────────────────
interface CardRevealProps {
  cards: CardType[];
  pack: Pack;
  onReset: () => void;
}

export default function CardReveal({ cards, pack, onReset }: CardRevealProps) {
  const isDesktop = useIsDesktop();

  return isDesktop ? (
    <DesktopFan cards={cards} pack={pack} onReset={onReset} />
  ) : (
    <MobileCarousel cards={cards} pack={pack} onReset={onReset} />
  );
}
