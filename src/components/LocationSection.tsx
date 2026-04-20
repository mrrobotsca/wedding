"use client";

import { motion } from "framer-motion";
import ScrollDown from "./ScrollDown";
import { r, sectionBase, topBorder } from "./responsive";

const TEXT = {
  en: {
    header: "Location",
    venue: "Maison Principale",
    address: "872 Rue du Couvent, Montréal",
    dateTime: "June 26, 2026 — 5:00 PM",
    description: "We would be honoured to have you join us at this beautiful venue to celebrate our special day. Please arrive 30 minutes before the ceremony begins.",
    directions: "Get Directions",
    addCalendar: "Add to Calendar",
  },
  fr: {
    header: "Lieu",
    venue: "Maison Principale",
    address: "872 Rue du Couvent, Montréal",
    dateTime: "26 Juin 2026 — 17h00",
    description: "Nous serions honorés de vous accueillir dans ce magnifique lieu pour célébrer notre jour spécial. Veuillez arriver 30 minutes avant le début de la cérémonie.",
    directions: "Itinéraire",
    addCalendar: "Ajouter au calendrier",
  },
};

interface LocationSectionProps {
  lang: "en" | "fr";
  content?: { en: { header: string; venue: string; address: string; dateTime: string; description: string; directions: string; addCalendar: string }; fr: { header: string; venue: string; address: string; dateTime: string; description: string; directions: string; addCalendar: string } };
}

export default function LocationSection({ lang, content }: LocationSectionProps) {
  const t = TEXT[lang];
  const header = content?.[lang]?.header || t.header;
  const venue = content?.[lang]?.venue || t.venue;
  const address = content?.[lang]?.address || t.address;
  const dateTime = content?.[lang]?.dateTime || t.dateTime;
  const description = content?.[lang]?.description || t.description;
  const directions = content?.[lang]?.directions || t.directions;
  const addCalendar = content?.[lang]?.addCalendar || t.addCalendar;
  const mapsUrl = "https://maps.google.com/?q=872+Rue+du+Couvent+Montreal";
  const calendarUrl = generateCalendarUrl();

  return (
    <section suppressHydrationWarning style={{ ...sectionBase, justifyContent: "space-between", padding: 0, overflow: "hidden" }}>
      <div style={topBorder} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: "100%", padding: "1vh 5vw 2vh", position: "relative", zIndex: 10, boxSizing: "border-box",
      }}>

        {/* BOX 1: Logo */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",  }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <img src="/logo3.png" alt="" style={{ width: "auto", height: "clamp(140px, 22vh, 220px)", objectFit: "contain", marginBottom: -30 }} />
          </motion.div>
        </div>

        {/* BOX 2: Header → Content → Buttons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, width: "100%", padding: "10px 0",  }}>

          {/* Header (top of box 2, no padding) */}
          <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(22, 25), fontWeight: 400, color: "#000000", letterSpacing: "0.5em", textTransform: "uppercase", textDecoration: "underline", textDecorationColor: "#C8A97E", textUnderlineOffset: 6 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {header}
          </motion.p>

          {/* Middle content (equally spaced) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", flex: 1, width: "100%" }}>

            {/* Ornament */}
            <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 0.4, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <svg width="100" height="20" viewBox="0 0 100 20" fill="none">
                <path d="M0 10H40M60 10H100" stroke="#9f9f9d" strokeWidth="0.5" />
                <circle cx="50" cy="10" r="4" stroke="#9f9f9d" strokeWidth="0.5" fill="none" />
              </svg>
            </motion.div>

            {/* Venue */}
            <motion.p style={{ fontFamily: "'Great Vibes', cursive", fontSize: r(33, 47), color: "#C8A97E", letterSpacing: "0.05em" }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
              {venue}
            </motion.p>

            {/* Address + Date */}
            <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(18, 21), fontWeight: 400, color: "#000000", letterSpacing: "0.24em" }}>
                {address}
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(18, 21), fontWeight: 400, color: "#000000", letterSpacing: "0.24em" }}>
                {dateTime}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(10, 13), fontWeight: 300, color: "#000000", lineHeight: 1.8, maxWidth: 320, textAlign: "center" }}
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }}>
              {description}
            </motion.p>
          </div>

          {/* Buttons (bottom of box 2, no padding) */}
          <motion.div style={{ display: "flex", alignItems: "center", gap: r(8, 16), justifyContent: "center" }}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.8 }}>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(12, 14), fontWeight: 700, letterSpacing: "0.1em", color: "#ffffff", background: "#C8A97E", border: "none", borderRadius: 999, padding: `${r(10, 14)} ${r(14, 20)}`, width: 170, maxWidth: "42vw", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", overflow: "hidden", whiteSpace: "nowrap" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span style={{ fontSize: `min(${r(10, 12)}, 3vw)` }}>{directions}</span>
            </a>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(12, 14), fontWeight: 700, letterSpacing: "0.1em", color: "#ffffff", background: "#C8A97E", border: "none", borderRadius: 999, padding: `${r(10, 14)} ${r(14, 20)}`, width: 170, maxWidth: "42vw", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", overflow: "hidden", whiteSpace: "nowrap" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <span style={{ fontSize: `min(${r(10, 12)}, 3vw)` }}>{addCalendar}</span>
            </a>
          </motion.div>
        </div>

        {/* BOX 3: Divider */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",  }}>
          <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60, filter: "sepia(40%) hue-rotate(-10deg) saturate(80%) brightness(95%)" }} />
        </div>
      </div>

    </section>
  );
}

function generateCalendarUrl() {
  const title = encodeURIComponent("Sarah & Arman Wedding");
  const location = encodeURIComponent("Maison Principale, 872 Rue du Couvent, Montréal");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260626T170000/20260626T230000&location=${location}`;
}
