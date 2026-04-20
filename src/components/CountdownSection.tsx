"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollDown from "./ScrollDown";
import { r, sectionBase, topBorder, flowerTopLeft, flowerBottomRight } from "./responsive";

const WEDDING_DATE = new Date("2026-06-26T17:00:00").getTime();

const TEXT = {
  en: { header: "Countdown", subtitle: "To the most special day of our lives", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  fr: { header: "Compte à rebours", subtitle: "Vers le jour le plus spécial de notre vie", days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes" },
};

interface CountdownSectionProps {
  lang: "en" | "fr";
  content?: { en: { header: string; subtitle: string; days: string; hours: string; minutes: string; seconds: string }; fr: { header: string; subtitle: string; days: string; hours: string; minutes: string; seconds: string } };
}

function getTimeLeft() {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) };
}

export default function CountdownSection({ lang, content }: CountdownSectionProps) {
  const t = TEXT[lang];
  const header = content?.[lang]?.header || t.header;
  const subtitle = content?.[lang]?.subtitle || t.subtitle;
  const daysLabel = content?.[lang]?.days || t.days;
  const hoursLabel = content?.[lang]?.hours || t.hours;
  const minutesLabel = content?.[lang]?.minutes || t.minutes;
  const secondsLabel = content?.[lang]?.seconds || t.seconds;
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setTime(getTimeLeft()); const i = setInterval(() => setTime(getTimeLeft()), 1000); return () => clearInterval(i); }, []);

  const units = [
    { value: time.days, label: daysLabel }, { value: time.hours, label: hoursLabel },
    { value: time.minutes, label: minutesLabel }, { value: time.seconds, label: secondsLabel },
  ];

  return (
    <section style={{ ...sectionBase, justifyContent: "flex-start", paddingTop: "1vh" }}>
      <div style={topBorder} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "85vw", width: "100%", position: "relative", zIndex: 10 }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <img src="/newlogo.png" alt="" style={{ width: "auto", height: r(135, 215), objectFit: "contain", marginBottom: r(28, 44), marginTop: 20 }} />
        </motion.div>

        {/* Header */}
        <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(22, 25), fontWeight: 400, color: "#000000", letterSpacing: "0.5em", textTransform: "uppercase", textDecoration: "underline", textDecorationColor: "#b3985f", textUnderlineOffset: 6, paddingBottom: r(8, 16) }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          {header}
        </motion.p>

        {/* Subtitle */}
        <motion.p style={{ fontFamily: "'Great Vibes', cursive", fontSize: r(33, 47), color: "#b3985f", letterSpacing: "0.05em", paddingBottom: r(110, 160) }}
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
          {subtitle}
        </motion.p>

        {/* Counter */}
        <motion.div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: r(6, 24) }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
          {units.map((unit, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: r(6, 24) }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(24, 36), fontWeight: 300, color: "#000000", lineHeight: 1, minWidth: r(36, 50), textAlign: "center" }}>
                  {mounted ? String(unit.value).padStart(2, "0") : "00"}
                </span>
                <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: r(21, 23), fontWeight: 500, color: "#b3985f", letterSpacing: "0.05em", marginTop: r(4, 8) }}>
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(18, 28), fontWeight: 200, color: "#d0d0ce", marginBottom: r(10, 14) }}>:</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <img src="/divider-nobg.png" alt="" style={{ position: "absolute", bottom: "6vh", left: "50%", transform: "translateX(-50%)", width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", zIndex: 10, pointerEvents: "none", filter: "sepia(60%) saturate(60%) hue-rotate(-5deg) brightness(85%)" }} />
    </section>
  );
}
