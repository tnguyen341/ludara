"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSessionStore } from "@/store/sessionStore";
import { IDEAS } from "@/data/cards";
import ParticleBackground from "@/components/ParticleBackground";

const CATEGORY_COLOR: Record<string, string> = {
  Technology: "#3b82f6",
  Society:    "#f59e0b",
  Nature:     "#22c55e",
  Philosophy: "#a855f7",
  Design:     "#f43f5e",
  Economics:  "#06b6d4",
};

export default function LeaderboardPage() {
  const router = useRouter();
  const { scores } = useSessionStore();

  const ranked = IDEAS
    .filter((idea) => (scores[idea.id] ?? 0) >= 1)
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, #261408 0%, #0e0701 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <ParticleBackground />

      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <motion.div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: "48px 20px 80px",
          maxWidth: 480,
          margin: "0 auto",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Header */}
        <h1
          style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "#c9a84c",
            textShadow: "0 0 28px rgba(201,168,76,0.55)",
            marginBottom: 4,
            textAlign: "center",
          }}
        >
          Leaderboard
        </h1>
        <p
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: "0.82rem",
            color: "#c8b88a",
            opacity: 0.55,
            marginBottom: 36,
            textAlign: "center",
          }}
        >
          Ideas ranked by votes across all sessions
        </p>

        {/* Empty state */}
        {ranked.length === 0 && (
          <motion.div
            style={{ textAlign: "center", marginTop: 32 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.72rem",
                color: "#c9a84c",
                opacity: 0.45,
                letterSpacing: "0.12em",
                marginBottom: 8,
              }}
            >
              No votes yet
            </p>
            <p
              style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: "0.78rem",
                color: "#c8b88a",
                opacity: 0.45,
                marginBottom: 32,
              }}
            >
              Open a pack and commit an idea to see it here.
            </p>
          </motion.div>
        )}

        {/* Ranked list */}
        {ranked.length > 0 && (
          <div style={{ width: "100%", marginBottom: 36 }}>
            {ranked.map((idea, i) => {
              const color = CATEGORY_COLOR[idea.category] ?? "#c9a84c";
              const voteCount = scores[idea.id] ?? 0;
              return (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    marginBottom: 6,
                    borderRadius: 10,
                    background: `${color}0c`,
                    border: `1px solid ${color}28`,
                  }}
                >
                  {/* Rank */}
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      color: "#c9a84c",
                      opacity: 0.45,
                      minWidth: 20,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>

                  {/* Title */}
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.62rem",
                      color: "#f0e0c0",
                      flex: 1,
                      lineHeight: 1.35,
                    }}
                  >
                    {idea.name}
                  </span>

                  {/* Category */}
                  <span
                    style={{
                      fontFamily: "'Crimson Pro', serif",
                      fontSize: "0.52rem",
                      color,
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  >
                    {idea.category}
                  </span>

                  {/* Vote count */}
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.6rem",
                      color,
                      minWidth: 28,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {voteCount}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Back to home */}
        <motion.button
          style={{
            padding: "10px 32px",
            borderRadius: 24,
            background: "transparent",
            border: "2px solid #c9a84c55",
            color: "#c9a84c",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
          whileHover={{ borderColor: "#c9a84c", opacity: 1 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0.7 }}
          onClick={() => router.push("/")}
        >
          Back to home
        </motion.button>
      </motion.div>

      {/* Footer brand */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.55rem",
          letterSpacing: "0.35em",
          color: "#c9a84c",
          opacity: 0.25,
          zIndex: 5,
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        Ludara
      </div>
    </main>
  );
}
