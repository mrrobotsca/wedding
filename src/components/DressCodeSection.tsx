"use client";

import { motion } from "framer-motion";
import ScrollDown from "./ScrollDown";
import { r, sectionBase, topBorder } from "./responsive";

const TEXT = {
  en: {
    header: "Dress Code",
    line1: "We kindly ask you to dress formally\nto join us on this very special day.",
    line2: "Please avoid wearing white, as it is\nreserved for the bride.",
    line3: "Black is also a color to avoid.",
  },
  fr: {
    header: "Code vestimentaire",
    line1: "Nous vous prions de vous habiller de\nmanière formelle pour cette journée spéciale.",
    line2: "Merci de ne pas porter de blanc,\ncette couleur est réservée à la mariée.",
    line3: "Le noir est également une couleur à éviter.",
  },
};

interface DressCodeSectionProps {
  lang: "en" | "fr";
  content?: { en: { header: string; line1: string; line2: string; line3: string }; fr: { header: string; line1: string; line2: string; line3: string } };
}

export default function DressCodeSection({ lang, content }: DressCodeSectionProps) {
  const t = TEXT[lang];
  const header = content?.[lang]?.header || t.header;
  const line1 = content?.[lang]?.line1 || t.line1;
  const line2 = content?.[lang]?.line2 || t.line2;
  const line3 = content?.[lang]?.line3 || t.line3;

  return (
    <section style={{ ...sectionBase, justifyContent: "space-between", padding: 0, overflow: "hidden" }}>
      <div style={topBorder} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: "100%", padding: "1vh 5vw calc(2vh - 8px)", position: "relative", zIndex: 10, boxSizing: "border-box",
      }}>

        {/* BOX 1: Logo */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <img src="/newlogo.png" alt="" style={{ width: "auto", height: "clamp(115px, 19vh, 195px)", objectFit: "contain", marginTop: 10, marginBottom: 25 }} />
          </motion.div>
        </div>

        {/* BOX 2: Header (top) → Content (space-evenly) → Line3 (bottom) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, width: "100%", padding: "10px 0" }}>

          {/* Header (top of box 2) */}
          <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(22, 25), fontWeight: 400, color: "#000000", letterSpacing: "0.5em", textTransform: "uppercase", textDecoration: "underline", textDecorationColor: "#b3985f", textUnderlineOffset: 6 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            {header}
          </motion.p>

          {/* Middle content (equally spaced) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", flex: 1, width: "100%" }}>

            {/* Ornament */}
            <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 0.4, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
              <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
                <path d="M0 10H48M72 10H120" stroke="#9f9f9d" strokeWidth="0.5" />
                <circle cx="60" cy="10" r="4" stroke="#9f9f9d" strokeWidth="0.5" fill="none" />
              </svg>
            </motion.div>

            {/* Line 1 */}
            <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(16, 21), fontWeight: 300, color: "#000000", lineHeight: 1.8, whiteSpace: "pre-line" }}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}>
              {line1}
            </motion.p>

            {/* Line 2 */}
            <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(16, 21), fontWeight: 300, color: "#000000", lineHeight: 1.8, whiteSpace: "pre-line" }}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
              {line2}
            </motion.p>
          </div>

          {/* Line 3 (bottom of box 2) */}
          <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(16, 21), fontWeight: 300, color: "#000000", lineHeight: 1.8, fontStyle: "italic", textDecoration: "underline", textDecorationColor: "#b3985f", textUnderlineOffset: 4 }}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}>
            {line3}
          </motion.p>
        </div>

        {/* BOX 3: Divider */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60, filter: "sepia(60%) saturate(60%) hue-rotate(-5deg) brightness(85%)" }} />
        </div>
      </div>

    </section>
  );
}
