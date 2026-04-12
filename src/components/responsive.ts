// Responsive helpers — generates clamp() values that scale between mobile (375px) and desktop (1440px)
// Usage: r(12, 16) → "clamp(12px, calc(12px + (16 - 12) * ((100vw - 375px) / (1440 - 375))), 16px)"

export function r(min: number, max: number): string {
  return `clamp(${min}px, calc(${min}px + ${max - min} * ((100vw - 375px) / 1065)), ${max}px)`;
}

// For gaps/spacing — same logic but bigger range
export function gap(min: number, max: number): string {
  return r(min, max);
}

// Logo height responsive
export function logoH(min: number, max: number): string {
  return r(min, max);
}

// Section styles shared across all sections
export const sectionBase: React.CSSProperties = {
  position: "relative",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  padding: "5vh 6vw",
  background: "#f2f2f2",
  boxSizing: "border-box",
};

export const sectionScrollable: React.CSSProperties = {
  ...sectionBase,
  height: "auto",
  minHeight: "100vh",
  justifyContent: "flex-start",
  paddingTop: "8vh",
};

export const topBorder: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: 96,
  height: 1,
  background: "linear-gradient(90deg, transparent, #9f9f9d, transparent)",
  opacity: 0.3,
};

export const flowerTopLeft: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "min(240px, 35vw)",
  height: "auto",
  objectFit: "contain" as const,
  opacity: 0.8,
  pointerEvents: "none" as const,
};

export const flowerBottomRight: React.CSSProperties = {
  position: "absolute",
  bottom: "5vh",
  right: "3vw",
  width: "min(240px, 35vw)",
  height: "auto",
  objectFit: "contain" as const,
  opacity: 0.8,
  pointerEvents: "none" as const,
  transform: "scaleX(-1) scaleY(-1)",
  margin: 0,
  padding: 0,
  display: "block",
};
