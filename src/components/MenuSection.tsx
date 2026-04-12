"use client";

import { motion } from "framer-motion";
import ScrollDown from "./ScrollDown";

const FONTS = {
  title: "'Playfair Display', serif",
  script: "'Allura', cursive",
  body: "'EB Garamond', serif",
  dish: "'Playfair Display', serif",
};

const COLOR = "#000000";
const COLOR_LIGHT = "#000000";

const TEXT = {
  en: {
    menuTitle: "Menu",
    starter: "Starter",
    mainCourse: "Main Course",
    or: "or",
    dessertHeader: "Dessert",
    dessertLine: "Wedding cake or Tiramisu",
    dishes: {
      fattoush: {
        name: "Fattoush",
        desc: "Romaine lettuce, Roma tomatoes, cherry tomatoes,\ncucumber, mint, parsley, radishes, red peppers\nHomemade pita chips, Lime oil & sumac dressing",
      },
      chicken: {
        name: "Herb Crusted Chicken",
        desc: "Lemon & herb crusted chicken supreme, lemon crème fraîche.\nFresh herb mash with confit garlic, grilled lemon zest asparagus",
      },
      salmon: {
        name: "Grilled Salmon",
        desc: "Grilled salmon, soy-maple glaze\nBaked broccoli with toasted sesame seeds, roasted yellow\nbeets & red onions",
      },
      filet: {
        name: "Filet Mignon",
        desc: "AAA Beef Filet Mignon, cherry wine reduction\nGrilled asparagus, Dauphinoise potatoes",
      },
      risotto: {
        name: "Mushroom Risotto (V)",
        desc: "",
      },
    },
  },
  fr: {
    menuTitle: "Menu",
    starter: "Entrée",
    mainCourse: "Plat principal",
    or: "ou",
    dessertHeader: "Dessert",
    dessertLine: "Gâteau de mariage ou Tiramisu",
    dishes: {
      fattoush: {
        name: "Fattoush",
        desc: "Laitue romaine, tomates Roma, tomates cerises,\nconcombre, menthe, persil, radis, poivrons rouges\nChips de pita maison, huile de lime & vinaigrette au sumac",
      },
      chicken: {
        name: "Poulet en croûte d'herbes",
        desc: "Suprême de poulet en croûte de citron et herbes, crème fraîche au citron.\nPurée aux herbes fraîches et ail confit, asperges grillées au zeste de citron",
      },
      salmon: {
        name: "Saumon grillé",
        desc: "Saumon grillé, glaçage soja-érable\nBrocoli rôti aux graines de sésame, betteraves jaunes\net oignons rouges rôtis",
      },
      filet: {
        name: "Filet Mignon",
        desc: "Filet Mignon de bœuf AAA, réduction au vin de cerise\nAsperges grillées, pommes Dauphinoise",
      },
      risotto: {
        name: "Risotto aux champignons (V)",
        desc: "",
      },
    },
  },
};

interface MenuSectionProps {
  lang: "en" | "fr";
}

function Divider() {
  return (
    <div className="flex items-center justify-center" style={{ padding: "12px 0" }}>
      <svg width="80" height="10" viewBox="0 0 80 10" fill="none">
        <path d="M0 5H32M48 5H80" stroke="#000000" strokeWidth="0.5" />
        <circle cx="40" cy="5" r="2" stroke="#000000" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  );
}

function DishBlock({ name, desc, delay }: { name: string; desc: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <p
        style={{
          fontFamily: FONTS.dish,
          fontSize: 11,
          fontWeight: 400,
          color: COLOR,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          paddingBottom: desc ? 8 : 0,
        }}
      >
        {name}
      </p>
      {desc && (
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: 12,
            fontWeight: 400,
            color: COLOR_LIGHT,
            lineHeight: 1.5,
            whiteSpace: "pre-line",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          {desc}
        </p>
      )}
    </motion.div>
  );
}

function OrDivider({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p
      style={{
        fontFamily: FONTS.body,
        fontSize: 15,
        fontWeight: 400,
        fontStyle: "italic",
        color: "#C8A97E",
        padding: "10px 0",
        textAlign: "center",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {text}
    </motion.p>
  );
}

export default function MenuSection({ lang }: MenuSectionProps) {
  const t = TEXT[lang];
  const d = t.dishes;

  return (
    <section
      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", padding: "1vh 5vw 2vh", background: "#f2f2f2", minHeight: "100vh", boxSizing: "border-box" }}
    >
      <div suppressHydrationWarning style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/bg5.jpg')", backgroundSize: "100% 100%", backgroundPosition: "center", backgroundRepeat: "no-repeat", opacity: 0.4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 96, height: 1, background: "linear-gradient(90deg, transparent, #9f9f9d, transparent)", opacity: 0.3 }} />

      {/* BOX 1: Logo */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <img src="/logo3.png" alt="" style={{ width: "auto", height: "clamp(140px, 22vh, 220px)", objectFit: "contain", marginBottom: -30 }} />
        </motion.div>
      </div>

      {/* BOX 2: Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%", maxWidth: 320, padding: "10px 0", position: "relative", zIndex: 10 }}>

        {/* ── MENU Title ── */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 24 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8Z" stroke="#000000" strokeWidth="0.5" fill="none" />
          </svg>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 22,
              fontWeight: 400,
              color: "#000000",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              textDecoration: "underline",
              textDecorationColor: "#C8A97E",
              textUnderlineOffset: 6,
            }}
          >
            {t.menuTitle}
          </p>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" style={{ marginLeft: -10 }}>
            <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8Z" stroke="#000000" strokeWidth="0.5" fill="none" />
          </svg>
        </motion.div>

        {/* ── Starter ── */}
        <motion.p
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 24,
            color: "#C8A97E",
            letterSpacing: "0.05em",
            marginTop: 40,
            paddingBottom: 6,
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {t.starter}
        </motion.p>

        <DishBlock name={d.fattoush.name} desc={d.fattoush.desc} delay={0.2} />

        <Divider />

        {/* ── Main Course ── */}
        <motion.p
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 24,
            color: "#C8A97E",
            letterSpacing: "0.05em",
            paddingBottom: 6,
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {t.mainCourse}
        </motion.p>

        <DishBlock name={d.chicken.name} desc={d.chicken.desc} delay={0.35} />
        <OrDivider text={t.or} delay={0.4} />
        <DishBlock name={d.salmon.name} desc={d.salmon.desc} delay={0.45} />
        <OrDivider text={t.or} delay={0.5} />
        <DishBlock name={d.filet.name} desc={d.filet.desc} delay={0.55} />
        <OrDivider text={t.or} delay={0.6} />
        <DishBlock name={d.risotto.name} desc={d.risotto.desc} delay={0.65} />

        <Divider />

        {/* ── Dessert ── */}
        <motion.p
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 24,
            color: "#C8A97E",
            letterSpacing: "0.05em",
            paddingBottom: 6,
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.68 }}
        >
          {t.dessertHeader}
        </motion.p>

        <motion.p
          style={{
            fontFamily: FONTS.body,
            fontSize: 10,
            fontWeight: 400,
            fontStyle: "italic",
            color: COLOR,
            letterSpacing: "0.05em",
          }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {t.dessertLine}
        </motion.p>
      </div>

      {/* BOX 3: Divider */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 10, marginTop: 30 }}>
        <img src="/divider-nobg.png" alt="" style={{ width: "60vw", maxWidth: 300, height: "auto", objectFit: "contain", pointerEvents: "none", marginTop: -60 }} />
      </div>
      <ScrollDown targetId="section-rsvp" lang={lang} />
    </section>
  );
}
