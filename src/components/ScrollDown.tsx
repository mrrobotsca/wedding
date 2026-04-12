"use client";

import { motion } from "framer-motion";

const LABEL = { en: "Scroll down", fr: "Défiler vers le bas" };

interface ScrollDownProps { targetId: string; lang: "en" | "fr"; }

export default function ScrollDown({ targetId, lang }: ScrollDownProps) {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      style={{ position: "absolute", bottom: "3vh", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 2, duration: 1 }}
    >
      <motion.button
        onClick={handleClick}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", background: "none", border: "none", padding: 0 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(18px, 4vw, 24px)", color: "#000000", margin: 0 }}>
          {LABEL[lang]}
        </p>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 8L10 14L16 8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
