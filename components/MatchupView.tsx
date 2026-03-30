"use client";

import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  animate as fmAnimate,
} from "framer-motion";
import { useEffect, useState } from "react";
import type { CardType } from "@/types";
import { useSessionStore } from "@/store/sessionStore";
import { IDEAS } from "@/data/cards";

// ── Category theming ──────────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  Technology: "#3b82f6",
  Society:    "#f59e0b",
  Nature:     "#22c55e",
  Philosophy: "#a855f7",
  Design:     "#f43f5e",
  Economics:  "#06b6d4",
};

// IDEAS imported for AllDoneScreen leaderboard filtering

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

// ── AllDoneScreen ─────────────────────────────────────────────────────────────

function AllDoneScreen({
  scores,
  onReset,
}: {
  scores: Record<string, number>;
  onReset: () => void;
}) {
  const topIdeas = IDEAS.filter((i) => scores[i.id] !== undefined)
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
    .slice(0, 5);

  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "40px 24px",
        textAlign: "center",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2
        style={{
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: "1.5rem",
          fontWeight: 900,
          color: "#c9a84c",
          textShadow: "0 0 30px rgba(201,168,76,0.6)",
          marginBottom: 6,
        }}
      >
        All Matchups Complete
      </h2>
      <p
        style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: "0.85rem",
          color: "#c8b88a",
          opacity: 0.65,
          marginBottom: 32,
        }}
      >
        You've ranked every pair of ideas.
      </p>

      {topIdeas.length > 0 && (
        <div style={{ width: "100%", maxWidth: 340, marginBottom: 36 }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.45rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#c9a84c",
              opacity: 0.5,
              marginBottom: 12,
            }}
          >
            Top Ideas
          </p>
          {topIdeas.map((idea, i) => {
            const color = CATEGORY_COLOR[idea.category] ?? "#c9a84c";
            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 14px",
                  marginBottom: 5,
                  borderRadius: 10,
                  background: `${color}0d`,
                  border: `1px solid ${color}2a`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.6rem",
                    color,
                    opacity: 0.85,
                    minWidth: 22,
                    textAlign: "right",
                  }}
                >
                  {scores[idea.id]}×
                </span>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.58rem",
                    color: "#f0e0c0",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {idea.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Crimson Pro', serif",
                    fontSize: "0.52rem",
                    color,
                    opacity: 0.65,
                  }}
                >
                  {idea.category}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.button
        style={{
          padding: "10px 32px",
          borderRadius: 24,
          background: "transparent",
          border: "2px solid #c9a84c55",
          color: "#c9a84c",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
        whileHover={{ borderColor: "#c9a84c", opacity: 1 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReset}
      >
        Start Over
      </motion.button>
    </motion.div>
  );
}

// ── MatchupView ───────────────────────────────────────────────────────────────

export default function MatchupView({ onBack }: { onBack?: () => void }) {
  const { currentHand, hasPlayed, scores, initSession, commitCard, resetSession } =
    useSessionStore();

  // On first mount, draw a hand if none exists yet
  useEffect(() => {
    if (currentHand === null && !hasPlayed) {
      initSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation state — not business state, intentionally local
  const [committedId, setCommittedId] = useState<string | null>(null);

  // Called by MatchupCard after its fly-up animation fires (~420ms)
  const handleCommit = (winnerId: string) => {
    setCommittedId(winnerId);
    setTimeout(() => {
      commitCard(winnerId);
      setCommittedId(null);
    }, 480);
  };

  if (hasPlayed) {
    return <AllDoneScreen scores={scores} onReset={resetSession} />;
  }

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

  const [ideaA, ideaB] = currentHand;

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

      {/* Card pair — keyed on the pair so AnimatePresence handles transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${ideaA.id}--${ideaB.id}`}
          style={{ display: "flex", gap: 16, alignItems: "flex-start" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <MatchupCard
            idea={ideaA}
            onCommit={() => handleCommit(ideaA.id)}
            losingTo={committedId}
          />

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

          <MatchupCard
            idea={ideaB}
            onCommit={() => handleCommit(ideaB.id)}
            losingTo={committedId}
          />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
