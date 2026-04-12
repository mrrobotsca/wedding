"use client";

interface LanguageToggleProps {
  lang: "en" | "fr";
  onToggle: () => void;
}

export default function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: "fixed",
        top: "max(env(safe-area-inset-top, 12px), 12px)",
        right: 16,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: "0.1em",
        color: "#ffffff",
        background: "#9f9f9d",
        border: "none",
        borderRadius: 999,
        padding: "12px 22px",
        cursor: "pointer",
      }}
    >
      <span style={{ opacity: lang === "en" ? 1 : 0.5, fontWeight: lang === "en" ? 600 : 400 }}>EN</span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span style={{ opacity: lang === "fr" ? 1 : 0.5, fontWeight: lang === "fr" ? 600 : 400 }}>FR</span>
    </button>
  );
}
