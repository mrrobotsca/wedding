"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

type Device = "mobile" | "tablet" | "desktop";

const DEVICE_CONFIG: Record<Device, { width: number; height: number; label: string; icon: ReactNode }> = {
  mobile: {
    width: 390,
    height: 844,
    label: "Mobile",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>,
  },
  tablet: {
    width: 768,
    height: 1024,
    label: "Tablet",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/></svg>,
  },
  desktop: {
    width: 1440,
    height: 900,
    label: "Desktop",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  },
};

export default function DevicePreview() {
  const [device, setDevice] = useState<Device>("desktop");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const config = DEVICE_CONFIG[device];

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const borderSize = device === "desktop" ? 0 : 8;
  const innerWidth = Math.min(containerWidth - 32, config.width + borderSize * 2) - borderSize * 2;
  const scale = innerWidth > 0 ? innerWidth / config.width : 1;
  const visibleHeight = config.height * scale;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1a1a" }}>
      {/* Toggle bar */}
      <div
        className="sticky top-0 z-[100] flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(30,30,30,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="text-sm tracking-wider uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c9a96e" }}>
          Preview
        </p>

        <div className="flex items-center gap-0.5 rounded-full p-[3px]" style={{ background: "rgba(255,255,255,0.06)" }}>
          {(Object.keys(DEVICE_CONFIG) as Device[]).map((d) => {
            const active = device === d;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all duration-200"
                style={{
                  background: active ? "rgba(201,169,110,0.15)" : "transparent",
                  color: active ? "#c9a96e" : "rgba(255,255,255,0.4)",
                  border: active ? "1px solid rgba(201,169,110,0.3)" : "1px solid transparent",
                }}
              >
                {DEVICE_CONFIG[d].icon}
                <span className="hidden sm:inline">{DEVICE_CONFIG[d].label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {config.width} × {config.height}
        </p>
      </div>

      {/* Preview area */}
      <div ref={containerRef} className="flex-1 flex items-start justify-center overflow-auto py-8 px-4">
        <div
          className="relative origin-top"
          style={{
            width: config.width,
            height: config.height,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            borderRadius: device === "mobile" ? 40 : device === "tablet" ? 24 : 12,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            border: device === "desktop" ? "none" : `${borderSize}px solid #2a2a2a`,
            marginBottom: visibleHeight - config.height,
          }}
        >
          {device === "mobile" && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-[60]"
              style={{ width: 150, height: 28, background: "#2a2a2a", borderRadius: "0 0 20px 20px" }}
            />
          )}

          <iframe
            key={device}
            src="/?preview=true"
            style={{
              width: config.width,
              height: config.height,
              border: "none",
              background: "#faf7f2",
              display: "block",
            }}
            title={`${config.label} preview`}
          />
        </div>
      </div>
    </div>
  );
}
