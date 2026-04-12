"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeIntroProps {
  onComplete: () => void;
}

export default function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const [done, setDone] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (done) return;
    setDone(true);
    setTimeout(() => onComplete(), 1200);
  };

  // Try autoplay — if blocked, show tap screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise) {
      playPromise
        .then(() => setPlaying(true))
        .catch(() => setNeedsTap(true));
    }
  }, []);

  // Tap to play video
  const handleTap = () => {
    if (playing) {
      handleVideoEnd();
      return;
    }
    const video = videoRef.current;
    if (video) {
      video.play()
        .then(() => {
          setNeedsTap(false);
          setPlaying(true);
        })
        .catch(() => handleVideoEnd());
    }
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "#000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onClick={handleTap}
        >
          <video
            ref={videoRef}
            src="/intro.MP4"
            muted
            playsInline
            onEnded={handleVideoEnd}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              display: needsTap ? "none" : "block",
            }}
          />

          {/* Tap to enter — shown if autoplay blocked */}
          {needsTap && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 10 }}>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 36, color: "#9f9f9d" }}>
                S &amp; A
              </p>
              <p style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 300,
                color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase",
              }}>
                Tap to enter
              </p>
            </div>
          )}

          {/* Skip button — only when video is playing */}
          {playing && (
            <button
              onClick={(e) => { e.stopPropagation(); handleVideoEnd(); }}
              style={{
                position: "absolute",
                bottom: 32,
                right: 32,
                zIndex: 10,
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                fontFamily: "'Cormorant Garamond', serif",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                background: "rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
