"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EnvelopeIntro from "@/components/EnvelopeIntro";
import IntroSection, { DEFAULT_INTRO_LAYOUT } from "@/components/IntroSection";
import LocationSection from "@/components/LocationSection";
import DressCodeSection from "@/components/DressCodeSection";
import CountdownSection from "@/components/CountdownSection";
import OrderOfDaySection from "@/components/OrderOfDaySection";
import MenuSection from "@/components/MenuSection";
import RSVPSection from "@/components/RSVPSection";
import LanguageToggle from "@/components/LanguageToggle";
import type { GuestData } from "@/components/RSVPSection";

export default function InvitePage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoComplete, setVideoComplete] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/guest?id=${uuid}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setGuest(data);

        // Collect device info
        const screenSize = `${screen.width}x${screen.height}`;
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
        const device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";
        const fp = [navigator.userAgent, navigator.language, screenSize, Intl.DateTimeFormat().resolvedOptions().timeZone].join("|");
        const hash = Array.from(new TextEncoder().encode(fp))
          .reduce((a, b) => ((a << 5) - a + b) | 0, 0)
          .toString(36);

        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestId: uuid,
            event: "link_opened",
            fingerprint: hash,
            device,
            screenSize,
            language: navigator.language,
            platform: navigator.platform,
          }),
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [uuid]);

  // Loading
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f2f2f2",
      }}>
        <div style={{
          width: 24, height: 24, border: "2px solid #9f9f9d", borderTopColor: "transparent",
          borderRadius: "50%", animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Invalid link
  if (error || !guest) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "0 24px", textAlign: "center", background: "#f2f2f2",
      }}>
        <div style={{ maxWidth: 400 }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 36, color: "#9f9f9d", marginBottom: 16 }}>
            Oops
          </p>
          <div style={{ width: 48, height: 1, margin: "0 auto 16px", background: "linear-gradient(90deg, transparent, #9f9f9d, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "#9f9f9d", marginBottom: 8 }}>
            This invite link is invalid
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 300, color: "#b8b8b6" }}>
            Please check the link you received or contact us for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Full wedding site
  return (
    <main style={{ height: "100vh", overflowY: "auto", scrollSnapType: "y mandatory" }}>
      {!videoComplete && typeof window !== "undefined" && (
        <EnvelopeIntro onComplete={() => setVideoComplete(true)} />
      )}
      <LanguageToggle lang={lang} onToggle={() => setLang(lang === "en" ? "fr" : "en")} />

      <div id="section-intro" style={{ scrollSnapAlign: "start" }}>
        <IntroSection guestName={guest.greetingName} lang={lang} layout={DEFAULT_INTRO_LAYOUT} />
      </div>
      <div id="section-location" style={{ scrollSnapAlign: "start" }}>
        <LocationSection lang={lang} />
      </div>
      <div id="section-dresscode" style={{ scrollSnapAlign: "start" }}>
        <DressCodeSection lang={lang} />
      </div>
      <div id="section-countdown" style={{ scrollSnapAlign: "start" }}>
        <CountdownSection lang={lang} />
      </div>
      <div id="section-order" style={{ scrollSnapAlign: "start" }}>
        <OrderOfDaySection lang={lang} />
      </div>
      <div id="section-menu" style={{ scrollSnapAlign: "start" }}>
        <MenuSection lang={lang} />
      </div>
      <div id="section-rsvp" style={{ scrollSnapAlign: "start" }}>
        <RSVPSection lang={lang} guest={guest} />
      </div>
    </main>
  );
}
