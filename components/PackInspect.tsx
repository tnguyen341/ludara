"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pack } from "@/types";
import { useState } from "react";

interface PackInspectProps {
  pack: Pack;
  onOpen: () => void;
  onBack: () => void;
  phase: "inspect" | "opening";
}

export default function PackInspect({ pack, onOpen, onBack, phase }: PackInspectProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);

  const handleOpen = () => {
    // Spawn burst particles
    const burst = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      angle: (i / 20) * 360,
    }));
    setParticles(burst);
    onOpen();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
      <AnimatePresence>
        {phase === "inspect" && (
          <motion.div
            key="inspect"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Back button */}
            <motion.button
              className="absolute top-8 left-8 font-serif text-sm tracking-widest uppercase"
              style={{ color: "#c9a84c", opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              onClick={onBack}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
            >
              ← Back
            </motion.button>

            {/* Pack visual */}
            <motion.div
              className="relative mb-12"
              animate={{
                y: [0, -12, 0],
                rotate: [0, 1, -1, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PackVisual pack={pack} size="large" />
            </motion.div>

            {/* Pack info */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p
                className="font-body text-sm tracking-[0.3em] uppercase mb-3"
                style={{ color: pack.accentColor, opacity: 0.7 }}
              >
                Selected Pack
              </p>
              <h2
                className="font-display text-3xl md:text-4xl font-black mb-4"
                style={{
                  color: pack.accentColor,
                  textShadow: `0 0 30px ${pack.glowColor}`,
                }}
              >
                {pack.name}
              </h2>
              <p
                className="font-body text-lg max-w-sm mx-auto leading-relaxed"
                style={{ color: "#c8b88a", opacity: 0.8 }}
              >
                {pack.description}
              </p>
            </motion.div>

            {/* Open button */}
            <motion.button
              className="relative px-14 py-4 rounded-full font-serif text-lg tracking-widest uppercase overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${pack.accentColor}33, ${pack.accentColor}11)`,
                border: `2px solid ${pack.accentColor}`,
                color: pack.accentColor,
                boxShadow: `0 0 30px ${pack.glowColor}`,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 60px ${pack.glowColor}, 0 0 100px ${pack.glowColor}`,
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpen}
              animate={{
                boxShadow: [
                  `0 0 20px ${pack.glowColor}`,
                  `0 0 50px ${pack.glowColor}`,
                  `0 0 20px ${pack.glowColor}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="relative z-10">Open Pack</span>
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, transparent 30%, ${pack.accentColor}22 50%, transparent 70%)`,
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.button>
          </motion.div>
        )}

        {phase === "opening" && (
          <motion.div
            key="opening"
            className="flex flex-col items-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 0.8, 2], rotate: [0, -10, 10, 0], opacity: [1, 1, 1, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <PackVisual pack={pack} size="large" />
            </motion.div>

            {/* Burst ring */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="rounded-full"
                style={{ border: `3px solid ${pack.accentColor}`, width: 200, height: 200 }}
                animate={{ scale: [0.5, 3], opacity: [1, 0] }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PackVisual({ pack, size = "medium" }: { pack: Pack; size?: "small" | "medium" | "large" }) {
  const dims = {
    small: { w: 100, h: 140 },
    medium: { w: 160, h: 220 },
    large: { w: 220, h: 310 },
  }[size];

  const fontSize = { small: "2rem", medium: "3rem", large: "4.5rem" }[size];
  const nameFontSize = { small: "0.55rem", medium: "0.7rem", large: "0.9rem" }[size];

  return (
    <div
      style={{
        width: dims.w,
        height: dims.h,
        background: pack.gradient,
        border: `2px solid ${pack.accentColor}66`,
        borderRadius: "16px",
        boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${pack.glowColor}, inset 0 1px 0 ${pack.accentColor}44`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${pack.accentColor}, transparent)`,
        }}
      />

      {/* Corner ornaments */}
      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos}`}
          style={{
            width: 12,
            height: 12,
            border: `1px solid ${pack.accentColor}88`,
            borderRadius: "2px",
            transform: "rotate(45deg)",
          }}
        />
      ))}

      {/* Symbol */}
      <div
        style={{
          fontSize,
          color: pack.accentColor,
          textShadow: `0 0 20px ${pack.glowColor}`,
          marginBottom: "12px",
          lineHeight: 1,
        }}
      >
        {pack.symbol}
      </div>

      {/* Pack name */}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: nameFontSize,
          color: pack.accentColor,
          textAlign: "center",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: 0.9,
          padding: "0 12px",
          lineHeight: 1.4,
        }}
      >
        {pack.name}
      </div>

      {/* Bottom shimmer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${pack.accentColor}, transparent)`,
        }}
      />

      {/* Inner glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${pack.accentColor}15 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
