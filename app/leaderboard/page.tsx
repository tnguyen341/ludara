"use client";

import { useEffect } from "react";
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
  const { hasPlayed, scores, resetSession } = useSessionStore();

  // Guard: if the user hasn't played yet, send them back to the start
  useEffect(() => {
    if (!hasPlayed) {
      router.replace("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topIdeas = IDEAS.filter((i) => scores[i.id] !== undefined)
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
    .slice(0, 5);

  const handleReset = () => {
    resetSession();
    router.push("/");
  };

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

      {/* Vignette */}
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
          Leaderboard
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
          Your committed idea is recorded.
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
          onClick={handleReset}
        >
          Start Over
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
