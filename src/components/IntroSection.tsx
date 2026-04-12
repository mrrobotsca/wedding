"use client";

import { motion } from "framer-motion";
import type { DraggableItem } from "./AdminOverlay";
import ScrollDown from "./ScrollDown";
import { sectionBase } from "./responsive";

const TEXT = {
  en: {
    greeting: (name: string) => `Dear ${name},`,
    headline: "Are Getting Married.",
    saveTheDate: "Save the Date.",
    date: "June 26, 2026",
  },
  fr: {
    greeting: (name: string) => `Cher(e) ${name},`,
    headline: "Se marient.",
    saveTheDate: "Réservez la date.",
    date: "26 Juin 2026",
  },
};

interface IntroSectionProps {
  guestName?: string;
  lang: "en" | "fr";
  layout?: DraggableItem[];
}

export const DEFAULT_INTRO_LAYOUT: DraggableItem[] = [
  { id: "logo", label: "Logo", x: 0, y: 0, width: 300, scale: 1 },
  { id: "greeting", label: "Dear Guest", x: 0, y: 0, width: 300, scale: 1 },
  { id: "headline", label: "Getting Married", x: 0, y: 0, width: 300, scale: 1 },
  { id: "names", label: "Sarah & Arman", x: 0, y: 0, width: 400, scale: 1 },
  { id: "date", label: "Save the Date", x: 0, y: 0, width: 300, scale: 1 },
  { id: "scroll", label: "Scroll Down", x: 0, y: 0, width: 200, scale: 1 },
];

export default function IntroSection({ guestName, lang }: IntroSectionProps) {
  const t = TEXT[lang];

  return (
    <section suppressHydrationWarning style={{ ...sectionBase, justifyContent: "space-between", padding: 0, overflow: "hidden" }}>
      {/* Background image */}
      <div suppressHydrationWarning style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg5.jpg')", backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", opacity: 0.4, pointerEvents: "none" }} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: "100%", padding: "1vh 5vw 2vh", position: "relative", zIndex: 10, boxSizing: "border-box",
      }}>

        {/* BOX 1: Logo */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <img src="/logo3.png" alt="Wedding Logo" style={{ width: "auto", height: "clamp(140px, 22vh, 220px)", objectFit: "contain", marginBottom: -30 }} />
          </motion.div>
        </div>

        {/* BOX 2: Greeting (top) → Content (space-evenly) → Save the Date (bottom) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, width: "100%", padding: "10px 0" }}>

          {/* Greeting (top of box 2, no padding) */}
          {guestName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 400, color: "#000000", letterSpacing: "0.15em", textAlign: "center" }}>
                {t.greeting(guestName)}
              </p>
            </motion.div>
          )}

          {/* Middle content (equally spaced) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", flex: 1, width: "100%" }}>

            {/* Names */}
            <motion.div
              style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-0.1em" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 7vw, 54px)", color: "#C8A97E", letterSpacing: "0.1em" }}>Sarah</span>
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 7vw, 54px)", color: "#C8A97E", letterSpacing: "0.1em", margin: "0 8px" }}>&</span>
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 7vw, 54px)", color: "#C8A97E", letterSpacing: "0.1em" }}>Arman</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 20, color: "#000000", letterSpacing: "0.15em" }}>
                {t.headline}
              </p>
            </motion.div>
          </div>

          {/* Save the Date + Date (bottom of box 2, no padding) */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 20, color: "#000000", letterSpacing: "0.15em" }}>
              {t.saveTheDate}
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: 16, color: "#C8A97E", letterSpacing: "0.15em", marginTop: 4, textDecoration: "underline", textDecorationColor: "#C8A97E", textUnderlineOffset: 4 }}>
              {t.date}
            </p>
          </motion.div>
        </div>

        {/* BOX 3: Divider */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60 }} />
        </div>
      </div>

      <ScrollDown targetId="section-location" lang={lang} />
    </section>
  );
}
