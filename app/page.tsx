"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GamePhase, Pack, CardType } from "@/types";
import { PACKS, generateCards } from "@/data/cards";
import ParticleBackground from "@/components/ParticleBackground";
import PackSelection from "@/components/PackSelection";
import PackInspect from "@/components/PackInspect";
import CardReveal from "@/components/CardReveal";

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>("select");
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);

  const handleSelectPack = useCallback((pack: Pack) => {
    setSelectedPack(pack);
    setPhase("inspect");
  }, []);

  const handleOpenPack = useCallback(() => {
    if (!selectedPack) return;
    setPhase("opening");

    // Generate cards and transition to reveal
    const generated = generateCards(selectedPack.id, selectedPack.cardCount);
    setCards(generated);

    setTimeout(() => {
      setPhase("reveal");
    }, 900);
  }, [selectedPack]);

  const handleBack = useCallback(() => {
    setSelectedPack(null);
    setPhase("select");
  }, []);

  const handleReset = useCallback(() => {
    setCards([]);
    setSelectedPack(null);
    setPhase("select");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 0%, #0f0f1a 0%, #050508 100%)",
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
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          >
            <PackSelection packs={PACKS} onSelect={handleSelectPack} />
          </motion.div>
        )}

        {(phase === "inspect" || phase === "opening") && selectedPack && (
          <motion.div
            key="inspect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PackInspect
              pack={selectedPack}
              onOpen={handleOpenPack}
              onBack={handleBack}
              phase={phase}
            />
          </motion.div>
        )}

        {phase === "reveal" && selectedPack && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardReveal
              cards={cards}
              pack={selectedPack}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle footer brand */}
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
        Arcana Pack Opener
      </div>
    </main>
  );
}
