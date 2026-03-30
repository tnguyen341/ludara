"use client";

import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  animate as fmAnimate,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CardType } from "@/types";
import { useSessionStore } from "@/store/sessionStore";

// ── Category theming ──────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  Technology: "#3b82f6",
  Society:    "#f59e0b",
  Nature:     "#22c55e",
  Philosophy: "#a855f7",
  Design:     "#f43f5e",
  Economics:  "#06b6d4",
};

// ── IdeaCardFace ──────────────────────────────────────────────────────────────
// Pure display — renders an Idea with category-keyed accent colors.

function IdeaCardFace({
  idea,
  width = 148,
  height = 210,
}: {
  idea: CardType;
  width?: number;
  height?: number;
}) {
  const color = CATEGORY_COLOR[idea.category] ?? "#c9a84c";
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 12,
        background: "linear-gradient(160deg, #2a1608 0%, #1a0d04 100%)",
        border: `2px solid ${color}55`,
        boxShadow: `0 12px 36px rgba(0,0,0,0.8), 0 0 18px ${color}1a`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          flexShrink: 0,
        }}
      />

      {/* Category badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "8px 10px 4px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.42rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color,
            opacity: 0.9,
            padding: "2px 8px",
            borderRadius: 10,
            border: `1px solid ${color}3a`,
            background: `${color}0d`,
          }}
        >
          {idea.category}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          padding: "6px 12px 2px",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "#f0e0c0",
          textAlign: "center",
          lineHeight: 1.3,
          textShadow: `0 0 14px ${color}33`,
          flexShrink: 0,
        }}
      >
        {idea.name}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          margin: "6px 14px",
          background: `linear-gradient(90deg, transparent, ${color}33, transparent)`,
          flexShrink: 0,
        }}
      />

      {/* Description */}
      <div
        style={{
          flex: 1,
          padding: "2px 12px 8px",
          fontFamily: "'Crimson Pro', serif",
          fontSize: "0.58rem",
          color: "#c8b88a",
          opacity: 0.85,
          lineHeight: 1.55,
          fontStyle: "italic",
          overflow: "hidden",
        }}
      >
        {idea.description}
      </div>

      {/* Bottom accent bar */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          flexShrink: 0,
        }}
      />

      {/* Sheen overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── MatchupCard ───────────────────────────────────────────────────────────────
// One draggable idea card. Drag/swipe up past threshold = commit as winner.
// When `losingTo` is set (the other card won), this card fades and drops.

function MatchupCard({
  idea,
  onCommit,
  losingTo,
}: {
  idea: CardType;
  onCommit: () => void;
  losingTo: string | null;
}) {
  const color = CATEGORY_COLOR[idea.category] ?? "#c9a84c";

  const my = useMotionValue(0);
  const mOp = useMotionValue(1);
  const mScale = useMotionValue(1);

  const [aboveThreshold, setAboveThreshold] = useState(false);
  const [committed, setCommitted] = useState(false);

  // Animate this card away when the other card wins
  const isLoser = losingTo !== null && losingTo !== idea.id;
  useEffect(() => {
    if (isLoser) {
      fmAnimate(mOp, 0, { duration: 0.38, ease: "easeOut" });
      fmAnimate(mScale, 0.88, { duration: 0.3, ease: "easeOut" });
      fmAnimate(my, 18, { duration: 0.3, ease: "easeOut" });
    }
  }, [isLoser]);

  const handleDrag = (_: PointerEvent, info: PanInfo) => {
    setAboveThreshold(info.offset.y < -60);
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y < -80 && !committed && !isLoser) {
      setCommitted(true);
      setAboveThreshold(false);
      const ease = [0.4, 0, 1, 1] as const;
      fmAnimate(my, my.get() - 700, { duration: 0.4, ease });
      fmAnimate(mOp, 0, { duration: 0.36, ease });
      fmAnimate(mScale, 0.82, { duration: 0.4, ease });
      setTimeout(onCommit, 420);
    } else {
      setAboveThreshold(false);
      fmAnimate(my, 0, { type: "spring", stiffness: 420, damping: 36 });
    }
  };

  return (
    <motion.div
      style={{
        y: my,
        opacity: mOp,
        scale: mScale,
        position: "relative",
        cursor: committed || isLoser ? "default" : "grab",
        touchAction: "none",
      }}
      drag={committed || isLoser ? false : "y"}
      dragConstraints={{ top: -800, bottom: 80 }}
      dragElastic={0.05}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <IdeaCardFace idea={idea} />

      {/* Glow ring when above the play threshold */}
      <AnimatePresence>
        {aboveThreshold && (
          <motion.div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: 18,
              border: `2px solid ${color}`,
              boxShadow: `0 0 28px ${color}66, 0 0 56px ${color}33`,
              pointerEvents: "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Swipe hint */}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#c9a84c",
            opacity: 0.3,
          }}
        >
          ↑ pick this
        </span>
      </div>
    </motion.div>
  );
}

// ── MatchupView ───────────────────────────────────────────────────────────────

export default function MatchupView({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const { currentHand, hasPlayed, initSession, commitCard } = useSessionStore();

  // Watch hasPlayed so the redirect fires even if Zustand hydrates after mount
  useEffect(() => {
    if (hasPlayed) {
      router.replace("/leaderboard");
      return;
    }
    // Draw a hand if the store hasn't done so yet
    if (currentHand === null) {
      initSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPlayed]);

  // Animation state — not business state, intentionally local
  const [committedId, setCommittedId] = useState<string | null>(null);

  // Called by MatchupCard after its fly-up animation completes (~420ms)
  const handleCommit = (winnerId: string) => {
    setCommittedId(winnerId);
    setTimeout(() => {
      commitCard(winnerId);
      router.push("/leaderboard");
    }, 480);
  };

  if (!currentHand) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <span
          style={{
            color: "#c9a84c",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            opacity: 0.45,
            letterSpacing: "0.2em",
          }}
        >
          Loading…
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px 48px",
        position: "relative",
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "transparent",
          border: "none",
          color: "#c9a84c",
          opacity: 0.45,
          cursor: "pointer",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.52rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        ← Back
      </button>

      {/* Header */}
      <motion.div
        style={{ textAlign: "center", marginBottom: 20 }}
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.42rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#c9a84c",
            opacity: 0.4,
            marginBottom: 4,
          }}
        >
          Ludara
        </p>
        <h2
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: "1.15rem",
            fontWeight: 900,
            color: "#c9a84c",
            textShadow: "0 0 24px rgba(201,168,76,0.5)",
          }}
        >
          Which matters more?
        </h2>
      </motion.div>

      {/* All 3 cards from the hand */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHand.map((c) => c.id).join("--")}
          style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {currentHand.map((idea, idx) => (
            <div key={idea.id} style={{ display: "contents" }}>
              {idx > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    paddingTop: 88,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.62rem",
                    color: "#c9a84c",
                    opacity: 0.28,
                    letterSpacing: "0.08em",
                    flexShrink: 0,
                  }}
                >
                  vs
                </div>
              )}
              <MatchupCard
                idea={idea}
                onCommit={() => handleCommit(idea.id)}
                losingTo={committedId}
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
