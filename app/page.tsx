"use client";

import { AnimatePresence, motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground";
import MatchupView from "@/components/MatchupView";

export default function Home() {
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
        <motion.div
          key="matchup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <MatchupView />
        </motion.div>
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
