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
  const [shaking, setShaking] = useState(false);

  const handleOpen = () => {
    const burst = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 50,
      y: 50,
      angle: (i / 20) * 360,
    }));
    setParticles(burst);
    onOpen();
  };

  const handleButtonClick = () => {
    if (shaking) return;
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      handleOpen();
    }, 580);
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
              animate={
                shaking
                  ? { x: [-10, 10, -14, 14, -10, 10, -5, 5, 0], scale: [1, 1.04, 1.02, 1.05, 1] }
                  : { y: [0, -12, 0], rotate: [0, 1, -1, 0] }
              }
              transition={
                shaking
                  ? { duration: 0.55, ease: "easeInOut" }
                  : { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }
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

            {/* Open button — candlelight pulse */}
            <motion.button
              className="relative px-14 py-4 rounded-full font-serif text-lg tracking-widest uppercase overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(180,110,20,0.35) 0%, rgba(120,70,10,0.18) 100%)",
                border: "2px solid #c9902a",
                color: "#f0c84a",
                letterSpacing: "0.25em",
              }}
              whileHover={{
                scale: 1.07,
                boxShadow: "0 0 50px rgba(240,160,40,0.9), 0 0 100px rgba(200,120,20,0.55), 0 0 160px rgba(160,90,10,0.25)",
              }}
              whileTap={{ scale: 0.94 }}
              onClick={handleButtonClick}
              animate={{
                boxShadow: [
                  "0 0 18px rgba(200,130,30,0.55), 0 0 40px rgba(180,100,20,0.25)",
                  "0 0 38px rgba(245,165,50,0.9), 0 0 85px rgba(210,130,25,0.5), 0 0 130px rgba(160,90,10,0.2)",
                  "0 0 24px rgba(200,130,30,0.6), 0 0 52px rgba(180,100,20,0.28)",
                  "0 0 44px rgba(250,175,55,0.95), 0 0 95px rgba(215,140,30,0.55)",
                  "0 0 18px rgba(200,130,30,0.55), 0 0 40px rgba(180,100,20,0.25)",
                ],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              <span className="relative z-10" style={{ textShadow: "0 0 12px rgba(255,200,80,0.7)" }}>
                Open Pack
              </span>
              {/* Candlelight shimmer sweep */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(105deg, transparent 25%, rgba(255,200,80,0.18) 50%, transparent 75%)",
                }}
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
              />
              {/* Inner warm fill on hover */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 50% 120%, rgba(200,120,20,0.2) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
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
