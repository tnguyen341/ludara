"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LUDARA_PACK } from "@/data/cards";
import { useSessionStore } from "@/store/sessionStore";
import ParticleBackground from "@/components/ParticleBackground";
import CardReveal from "@/components/CardReveal";

type Stage = "pack" | "reveal";

export default function Home() {
  const router = useRouter();
  const { currentHand, initSession, commitCard, resetSession } = useSessionStore();
  const [stage, setStage] = useState<Stage>("pack");

  const handleOpenPack = () => {
    initSession();
    setStage("reveal");
  };

  const handleCommit = (winnerId: string) => {
    commitCard(winnerId);
    router.push("/leaderboard");
  };

  const handleReset = () => {
    resetSession();
    setStage("pack");
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

      <AnimatePresence mode="wait">
        {stage === "pack" && (
          <motion.div
            key="pack"
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pack visual */}
            <motion.button
              onClick={handleOpenPack}
              style={{
                background: LUDARA_PACK.gradient,
                border: `2px solid ${LUDARA_PACK.accentColor}55`,
                borderRadius: 16,
                width: 200,
                height: 280,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                cursor: "pointer",
                boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 32px ${LUDARA_PACK.glowColor}`,
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: `0 32px 80px rgba(0,0,0,0.85), 0 0 56px ${LUDARA_PACK.glowColor}`,
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${LUDARA_PACK.glowColor}`,
                  `0 24px 64px rgba(0,0,0,0.8), 0 0 48px ${LUDARA_PACK.glowColor}`,
                  `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${LUDARA_PACK.glowColor}`,
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span style={{ fontSize: "2.5rem" }}>{LUDARA_PACK.symbol}</span>
              <span
                style={{
                  fontFamily: "'Cinzel Decorative', cursive",
                  fontSize: "0.9rem",
                  fontWeight: 900,
                  color: LUDARA_PACK.accentColor,
                  letterSpacing: "0.08em",
                }}
              >
                {LUDARA_PACK.name}
              </span>
              <span
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: "0.6rem",
                  color: LUDARA_PACK.accentColor,
                  opacity: 0.55,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Tap to open
              </span>
            </motion.button>
          </motion.div>
        )}

        {stage === "reveal" && currentHand && (
          <motion.div
            key="reveal"
            style={{ position: "relative", zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Prompt */}
            <motion.p
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                textAlign: "center",
                paddingTop: 20,
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: LUDARA_PACK.accentColor,
                opacity: 0.6,
                zIndex: 10,
                pointerEvents: "none",
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Which idea is most interesting?
            </motion.p>

            <CardReveal
              cards={currentHand}
              pack={LUDARA_PACK}
              onCommit={handleCommit}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
