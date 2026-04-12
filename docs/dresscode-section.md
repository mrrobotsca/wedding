# Dress Code Section

**File:** `src/components/DressCodeSection.tsx`

---

## Elements

### 1. Top Border
| Property | Value |
|----------|-------|
| Type | Gradient line |
| Width | `96px` |
| Height | `1px` |
| Color | `linear-gradient(90deg, transparent, #9f9f9d, transparent)` |
| Opacity | `0.3` |
| Position | Absolute top, centered |

### 2. Logo
| Property | Value |
|----------|-------|
| Source | `/public/logo.png` |
| Height | `270px` |
| Width | `auto` |
| Object Fit | `contain` |
| Margin Bottom | `40px` |
| Animation | whileInView fade+scale (delay 0s) |

### 3. Header
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `16px` |
| Weight | `400` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.4em` |
| Transform | Uppercase |
| Spacing Below | `40px` |
| EN | `Dress Code` |
| FR | `Code vestimentaire` |

### 4. Ornament
| Property | Value |
|----------|-------|
| Type | SVG (lines + circle, 100px wide) |
| Opacity | `0.4` |
| Spacing Below | `40px` |

### 5. Line 1 — Formal request
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `13px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Line Height | `1.8` |
| White Space | `pre-line` |
| Spacing Below | `30px` |
| EN | `We kindly ask you to dress formally\nto join us on this very special day.` |
| FR | `Nous vous prions de vous habiller de\nmanière formelle pour cette journée spéciale.` |

### 6. Line 2 — No white
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `13px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Line Height | `1.8` |
| White Space | `pre-line` |
| Spacing Below | `30px` |
| EN | `Please avoid wearing white, as it is\nreserved for the bride.` |
| FR | `Merci de ne pas porter de blanc,\ncette couleur est réservée à la mariée.` |

### 7. Line 3 — No black
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `13px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Line Height | `1.8` |
| Font Style | `italic` |
| EN | `Black is also a color to avoid.` |
| FR | `Le noir est également une couleur à éviter.` |

### 8. Scroll Down
| Property | Value |
|----------|-------|
| Component | `ScrollDown` |
| Target | `section-next` |

---

## Global

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Section height | `h-screen` (snap target) |
| Padding | `px-6` |
| Alignment | Center, `justify-center` |
| Max content width | `max-w-md` |
| Scroll snap | `scroll-snap-align: start` |
