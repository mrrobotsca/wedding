"use client";

import { motion } from "framer-motion";
import ScrollDown from "./ScrollDown";
import { r, sectionBase, topBorder } from "./responsive";

const TEXT = {
  en: {
    header: "Order of the Day",
    items: [
      { time: "17:00", title: "Arrival & Welcome Drinks", desc: "Reception and welcome cocktails at the venue" },
      { time: "18:00", title: "Ceremony", desc: "The most special moment of the day" },
      { time: "19:00", title: "Cocktail Hour & Dinner", desc: "Party" },
      { time: "Until 1 AM", title: "Let's dance the night away!", desc: "" },
    ],
  },
  fr: {
    header: "Déroulement de la journée",
    items: [
      { time: "17:00", title: "Arrivée & Cocktail de bienvenue", desc: "Réception et cocktails de bienvenue sur place" },
      { time: "18:00", title: "Cérémonie", desc: "Le moment le plus spécial de la journée" },
      { time: "19:00", title: "Cocktail & Dîner", desc: "La fête" },
      { time: "Jusqu'à 1h", title: "Dansons toute la nuit !", desc: "" },
    ],
  },
};

interface OrderOfDaySectionProps {
  lang: "en" | "fr";
  content?: { en: { header: string; items: { time: string; title: string; desc: string }[] }; fr: { header: string; items: { time: string; title: string; desc: string }[] } };
}

export default function OrderOfDaySection({ lang, content }: OrderOfDaySectionProps) {
  const t = TEXT[lang];
  const header = content?.[lang]?.header || t.header;
  const items = content?.[lang]?.items || t.items;

  return (
    <section style={{ ...sectionBase, justifyContent: "space-between", padding: 0, overflow: "hidden" }}>
      <div style={topBorder} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: "100%", padding: "1vh 5vw 2vh", position: "relative", zIndex: 10, boxSizing: "border-box",
      }}>

        {/* BOX 1: Logo */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <img src="/newlogo.png" alt="" style={{ width: "auto", height: "clamp(130px, 21vh, 210px)", objectFit: "contain", marginBottom: -30 }} />
          </motion.div>
        </div>

        {/* BOX 2: Header (top) → Timeline (space-evenly) → Last item (bottom) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, width: "100%", padding: "10px 0" }}>

          {/* Header (top of box 2) */}
          <motion.p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(22, 25), fontWeight: 400, color: "#000000", letterSpacing: "0.5em", textTransform: "uppercase", textDecoration: "underline", textDecorationColor: "#b3985f", textUnderlineOffset: 6 }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {header}
          </motion.p>

          {/* Timeline items (equally spaced) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly", flex: 1, width: "100%", marginTop: 40 }}>
            {items.map((item, i) => (
              <motion.div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}>

                {i > 0 && <div style={{ width: 1, height: r(8, 14), background: "#000000", opacity: 0.4, marginBottom: r(2, 4) }} />}

                <div style={{ width: r(4, 6), height: r(4, 6), borderRadius: "50%", background: "#000000", opacity: 0.6, marginBottom: r(3, 6) }} />

                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(8, 11), fontWeight: 500, color: "#000000", letterSpacing: "0.2em", textTransform: "uppercase", paddingBottom: r(6, 10) }}>
                  {item.time}
                </p>

                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: r(18, 30), color: "#b3985f", letterSpacing: "0.05em", paddingBottom: item.desc ? r(1, 2) : 0 }}>
                  {item.title}
                </p>

                {item.desc && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: r(9, 12), fontWeight: 300, color: "#000000", maxWidth: 240 }}>
                    {item.desc}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOX 3: Divider */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60, filter: "sepia(60%) saturate(60%) hue-rotate(-5deg) brightness(85%)" }} />
        </div>
      </div>

    </section>
  );
}
