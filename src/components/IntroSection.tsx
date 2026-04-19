"use client";

import { motion } from "framer-motion";
import type { DraggableItem } from "./AdminOverlay";
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

interface IntroContentProps {
  en: { greeting: string; headline: string; saveTheDate: string; date: string; };
  fr: { greeting: string; headline: string; saveTheDate: string; date: string; };
  namesLine1: string;
  namesLine2: string;
}

interface IntroSectionProps {
  guestName?: string;
  lang: "en" | "fr";
  layout?: DraggableItem[];
  content?: IntroContentProps;
}

export const DEFAULT_INTRO_LAYOUT: DraggableItem[] = [
  { id: "logo", label: "Logo", x: 0, y: 0, width: 300, scale: 1 },
  { id: "greeting", label: "Dear Guest", x: 0, y: 0, width: 300, scale: 1 },
  { id: "headline", label: "Getting Married", x: 0, y: 0, width: 300, scale: 1 },
  { id: "names", label: "Sarah & Arman", x: 0, y: 0, width: 400, scale: 1 },
  { id: "date", label: "Save the Date", x: 0, y: 0, width: 300, scale: 1 },
  { id: "scroll", label: "Scroll Down", x: 0, y: 0, width: 200, scale: 1 },
];

export default function IntroSection({ guestName, lang, content }: IntroSectionProps) {
  const defaults = TEXT[lang];
  const c = content?.[lang];
  const greeting = c?.greeting ? c.greeting.replace("{name}", guestName || "") : defaults.greeting(guestName || "");
  const headline = c?.headline || defaults.headline;
  const saveTheDate = c?.saveTheDate || defaults.saveTheDate;
  const date = c?.date || defaults.date;
  const name1 = content?.namesLine1 || "Sarah";
  const name2 = content?.namesLine2 || "Arman";

  return (
    <section suppressHydrationWarning style={{ ...sectionBase, justifyContent: "space-between", padding: 0, overflow: "hidden" }}>
      {/* GIF with transparent background */}
      <img
        src="/no_bg_video.gif"
        alt=""
        style={{
          position: "absolute",
          top: "-20vh",
          left: 0,
          right: 0,
          bottom: "20vh",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: "100%", padding: "1vh 5vw 2vh", position: "relative", zIndex: 10, boxSizing: "border-box",
      }}>

        {/* BOX 2: All content equally spaced */}
        {/* Spacer to push text under chandelier (55% of height) */}
        <div style={{ flexShrink: 0, height: "45vh" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", textAlign: "center", flex: 1, width: "100%", padding: "0", zIndex: 10 }}>

          {/* Dear Guest */}
          {guestName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 400, color: "#000000", letterSpacing: "0.15em", textAlign: "center" }}>
                {greeting}
              </p>
            </motion.div>
          )}

          {/* Names + Headline grouped */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <motion.div
              style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-0.1em" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 7vw, 54px)", color: "#C8A97E", letterSpacing: "0.1em" }}>{name1}</span>
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 7vw, 54px)", color: "#C8A97E", letterSpacing: "0.1em", margin: "0 8px" }}>&</span>
              <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(40px, 7vw, 54px)", color: "#C8A97E", letterSpacing: "0.1em" }}>{name2}</span>
            </motion.div>

            <motion.div
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 20, color: "#000000", letterSpacing: "0.15em" }}>
                {headline}
              </p>
            </motion.div>
          </div>

          {/* Save the Date + Date */}
          <motion.div
            style={{ textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 20, color: "#000000", letterSpacing: "0.15em" }}>
              {saveTheDate}
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: 16, color: "#C8A97E", letterSpacing: "0.15em", marginTop: 4, textDecoration: "underline", textDecorationColor: "#C8A97E", textUnderlineOffset: 4 }}>
              {date}
            </p>
          </motion.div>
        </div>

        {/* BOX 3: Divider */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60, filter: "sepia(40%) hue-rotate(-10deg) saturate(80%) brightness(95%)" }} />
        </div>
      </div>

    </section>
  );
}
