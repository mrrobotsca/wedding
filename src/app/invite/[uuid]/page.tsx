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
import type { SiteContent } from "@/lib/db";

export default function InvitePage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoComplete, setVideoComplete] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    async function load() {
      try {
        const [guestRes, contentRes] = await Promise.all([
          fetch(`/api/guest?id=${uuid}`),
          fetch("/api/content"),
        ]);

        if (!guestRes.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await guestRes.json();
        setGuest(data);

        const contentData = await contentRes.json();
        if (contentData && Object.keys(contentData).length > 0) {
          setContent(contentData);
        }

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

  // Full wedding site — continuous scroll with fixed background
  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      {/* Fixed background that stays in place */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "#f2f2f2",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/bg9.jpg')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5,
        }} />
      </div>

      {!videoComplete && typeof window !== "undefined" && (
        <EnvelopeIntro onComplete={() => setVideoComplete(true)} />
      )}
      <LanguageToggle lang={lang} onToggle={() => setLang(lang === "en" ? "fr" : "en")} />

      {/* Scrollable content over fixed background */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div id="section-intro">
          <IntroSection guestName={guest.greetingName} lang={lang} layout={DEFAULT_INTRO_LAYOUT} content={content?.intro} />
        </div>
        <div id="section-location">
          <LocationSection lang={lang} content={content?.location} />
        </div>
        <div id="section-dresscode">
          <DressCodeSection lang={lang} content={content?.dresscode} />
        </div>
        <div id="section-countdown">
          <CountdownSection lang={lang} content={content?.countdown} />
        </div>
        <div id="section-order">
          <OrderOfDaySection lang={lang} content={content?.orderOfDay} />
        </div>
        <div id="section-menu">
          <MenuSection lang={lang} content={content?.menu} />
        </div>
        <div id="section-rsvp">
          <RSVPSection lang={lang} guest={guest} content={content?.rsvp} />
        </div>
      </div>
    </main>
  );
}
