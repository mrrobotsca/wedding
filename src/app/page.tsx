"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EnvelopeIntro from "@/components/EnvelopeIntro";
import IntroSection, { DEFAULT_INTRO_LAYOUT } from "@/components/IntroSection";
import LocationSection from "@/components/LocationSection";
import OrderOfDaySection from "@/components/OrderOfDaySection";
import DressCodeSection from "@/components/DressCodeSection";
import MenuSection from "@/components/MenuSection";
import CountdownSection from "@/components/CountdownSection";
import RSVPSection from "@/components/RSVPSection";
import LanguageToggle from "@/components/LanguageToggle";
import DevicePreview from "@/components/DevicePreview";
import AdminOverlay from "@/components/AdminOverlay";
import type { DraggableItem } from "@/components/AdminOverlay";

function WeddingContent() {
  const [videoComplete, setVideoComplete] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const isAdmin = searchParams.get("admin") === "true";

  const [layout, setLayout] = useState<DraggableItem[]>(DEFAULT_INTRO_LAYOUT);

  const guestName = "Bary Family";

  if (isPreview || isAdmin) {
    return (
      <main
        suppressHydrationWarning
        style={{ height: "100vh", overflowY: "auto", scrollSnapType: "y mandatory" }}
      >
        {!isAdmin && !videoComplete && (
          <EnvelopeIntro onComplete={() => setVideoComplete(true)} />
        )}
        <LanguageToggle lang={lang} onToggle={() => setLang(lang === "en" ? "fr" : "en")} />
        <div id="section-intro" style={{ scrollSnapAlign: "start" }}>
          <IntroSection guestName={guestName} lang={lang} layout={layout} />
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
          <RSVPSection lang={lang} />
        </div>
        <AdminOverlay enabled={isAdmin} items={layout} onUpdate={setLayout} />
      </main>
    );
  }

  return <DevicePreview />;
}

export default function Home() {
  return (
    <Suspense>
      <WeddingContent />
    </Suspense>
  );
}
