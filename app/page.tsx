"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { LUDARA_PACK } from "@/data/cards";
import { useSessionStore } from "@/store/sessionStore";
import ParticleBackground from "@/components/ParticleBackground";
import CardReveal from "@/components/CardReveal";

type Stage = "pack" | "reveal";

export default function Home() {
  const router = useRouter();
  const { currentHand, initSession, commitCard, resetSession } = useSessionStore();
  const [stage, setStage] = useState<Stage>("pack");
  const [isOpening, setIsOpening] = useState(false);

  const glowControls = useAnimation();
  const packControls = useAnimation();
  const promptControls = useAnimation();

  // Restart idle state whenever pack stage is (re)entered
  useEffect(() => {
    if (stage !== "pack") return;

    setIsOpening(false);
    packControls.set({ scale: 1, x: 0, opacity: 1, filter: "brightness(1)" });
    promptControls.set({ opacity: 0 });

    void glowControls.start({
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.15, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    });

    void promptControls.start({
      opacity: 1,
      transition: { delay: 1.5, duration: 0.6 },
    });
  }, [stage, glowControls, packControls, promptControls]);

  const handleOpenPack = async () => {
    if (isOpening) return;
    setIsOpening(true);
    glowControls.stop();

    // Beat 1 (0–0.3s): brighten + scale up; prompt fades out
    await Promise.all([
      packControls.start({
        scale: 1.08,
        filter: "brightness(1.5)",
        transition: { duration: 0.3, ease: "easeOut" },
      }),
      glowControls.start({
        opacity: 1,
        scale: 1.5,
        transition: { duration: 0.3, ease: "easeOut" },
      }),
      promptControls.start({
        opacity: 0,
        transition: { duration: 0.2 },
      }),
    ]);

    // Beat 2 (0.3–0.6s): horizontal shudder
    await packControls.start({
      x: [0, -10, 12, -8, 6, -3, 0],
      transition: { duration: 0.3, times: [0, 0.15, 0.35, 0.55, 0.7, 0.85, 1] },
    });

    // Beat 3 (0.6–1.0s): fade out + scale down
    await Promise.all([
      packControls.start({
        opacity: 0,
        scale: 0.85,
        filter: "brightness(2.5)",
        transition: { duration: 0.4, ease: "easeIn" },
      }),
      glowControls.start({
        opacity: 0,
        scale: 2,
        transition: { duration: 0.4, ease: "easeIn" },
      }),
    ]);

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
              gap: 28,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pack + glow */}
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Radial glow behind pack */}
              <motion.div
                animate={glowControls}
                style={{
                  position: "absolute",
                  width: 320,
                  height: 400,
                  borderRadius: "50%",
                  background: `radial-gradient(ellipse at center, ${LUDARA_PACK.glowColor} 0%, transparent 70%)`,
                  filter: "blur(28px)",
                  pointerEvents: "none",
                  opacity: 0.5,
                }}
              />

              {/* Pack image */}
              <motion.div
                animate={packControls}
                onClick={() => { void handleOpenPack(); }}
                style={{
                  position: "relative",
                  width: 200,
                  height: 280,
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: isOpening ? "default" : "pointer",
                  rotateX: 8,
                  rotateY: -12,
                  transformPerspective: 800,
                  boxShadow:
                    "0 24px 64px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.6)",
                  willChange: "transform",
                }}
              >
                <Image
                  src="/images/pack.jpeg"
                  alt="Ludara pack"
                  width={200}
                  height={280}
                  priority
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            </div>

            {/* "Tap to open" prompt */}
            <motion.p
              animate={promptControls}
              style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: LUDARA_PACK.accentColor,
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
                margin: 0,
              }}
            >
              Tap to open
            </motion.p>
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
                margin: 0,
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
