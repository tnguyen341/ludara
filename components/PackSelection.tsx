"use client";

import { motion } from "framer-motion";
import { Pack } from "@/types";

interface PackSelectionProps {
  packs: Pack[];
  onSelect: (pack: Pack) => void;
}

export default function PackSelection({ packs, onSelect }: PackSelectionProps) {
  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-16">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <p
          className="font-body text-sm tracking-[0.4em] uppercase mb-4"
          style={{ color: "#c9a84c", opacity: 0.7 }}
        >
          The Arcana Awaits
        </p>
        <h1
          className="font-display text-4xl md:text-6xl font-black glow-gold shimmer-text mb-6 leading-tight"
        >
          PACK OPENER
        </h1>
        <div
          className="h-px w-48 mx-auto mb-6"
          style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }}
        />
        <p
          className="font-body text-lg md:text-xl max-w-md mx-auto leading-relaxed"
          style={{ color: "#c8b88a", opacity: 0.8 }}
        >
          Choose your pack. Each contains 5 cards drawn from the depths of fate.
        </p>
      </motion.div>

      {/* Pack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {packs.map((pack, i) => (
          <PackCard
            key={pack.id}
            pack={pack}
            index={i}
            onSelect={() => onSelect(pack)}
          />
        ))}
      </div>

      <motion.p
        className="mt-16 font-body text-sm tracking-widest uppercase"
        style={{ color: "#c9a84c", opacity: 0.4 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        Tap a pack to begin
      </motion.p>
    </div>
  );
}

function PackCard({
  pack,
  index,
  onSelect,
}: {
  pack: Pack;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.button
      className="relative group text-left rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: pack.gradient,
        border: `1px solid ${pack.accentColor}33`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6)`,
      }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: 0.2 + index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${pack.glowColor}`,
        borderColor: pack.accentColor,
        y: -6,
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
    >
      {/* Glow overlay on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${pack.accentColor}20 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Top decoration */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${pack.accentColor}, transparent)` }}
      />

      <div className="p-6">
        {/* Symbol */}
        <motion.div
          className="text-5xl mb-4 block"
          style={{ color: pack.accentColor }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
        >
          {pack.symbol}
        </motion.div>

        {/* Pack name */}
        <h3
          className="font-serif text-lg font-bold mb-2 leading-tight"
          style={{ color: pack.accentColor }}
        >
          {pack.name}
        </h3>

        {/* Description */}
        <p
          className="font-body text-sm leading-relaxed mb-5"
          style={{ color: "#c8b88a", opacity: 0.7 }}
        >
          {pack.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="font-serif text-xs tracking-widest uppercase"
            style={{ color: pack.accentColor, opacity: 0.7 }}
          >
            {pack.cardCount} Cards
          </span>
          <motion.span
            className="font-serif text-xs tracking-widest uppercase px-3 py-1 rounded-full"
            style={{
              color: pack.accentColor,
              border: `1px solid ${pack.accentColor}55`,
              background: `${pack.accentColor}11`,
            }}
            whileHover={{ background: `${pack.accentColor}22` }}
          >
            Open →
          </motion.span>
        </div>
      </div>

      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 + index * 0.5 }}
      />
    </motion.button>
  );
}
