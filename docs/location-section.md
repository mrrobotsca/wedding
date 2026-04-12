# Location Section

**File:** `src/components/LocationSection.tsx`

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

### 2. Header
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `16px` |
| Weight | `400` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.4em` |
| Transform | Uppercase |
| Spacing Below | `40px` |
| EN | `Location` |
| FR | `Lieu` |
| Animation | whileInView fade+slide (delay 0s) |

### 3. Decorative Ornament
| Property | Value |
|----------|-------|
| Type | SVG (lines + circle) |
| Width | `100px` |
| Circle Radius | `4px` |
| Stroke | `#9f9f9d`, `0.5` width |
| Opacity | `0.4` |
| Spacing Below | `30px` |
| Animation | whileInView scale (delay 0.2s) |

### 4. Venue Name
| Property | Value |
|----------|-------|
| Font | Great Vibes |
| Size | `42px` |
| Color | `#9f9f9d` |
| Spacing Below | `16px` |
| Text | `Maison Principale` |
| Animation | whileInView fade+slide (delay 0.3s) |

### 5. Address
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `14px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.1em` |
| Spacing Below | `8px` |
| Text | `872 Rue du Couvent, Montréal` |
| Animation | whileInView fade+slide (delay 0.4s) |

### 6. Date & Time
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `14px` |
| Weight | `400` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.15em` |
| Spacing Below | `40px` |
| EN | `June 26, 2026 — 5:00 PM` |
| FR | `26 Juin 2026 — 17h00` |
| Animation | whileInView fade+slide (delay 0.5s) |

### 7. Description
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `13px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Line Height | `1.8` |
| Max Width | `320px` |
| Text Align | Center |
| Spacing Below | `40px` |
| EN | `We would be honoured to have you join us at this beautiful venue to celebrate our special day. Please arrive 30 minutes before the ceremony begins.` |
| FR | `Nous serions honorés de vous accueillir dans ce magnifique lieu pour célébrer notre jour spécial. Veuillez arriver 30 minutes avant le début de la cérémonie.` |
| Animation | whileInView fade+slide (delay 0.6s) |

### 8. Buttons (Get Directions + Add to Calendar)
| Property | Value |
|----------|-------|
| Style | Filled pill (Style B) |
| Font | Montserrat |
| Size | `12px` (scales down with `min(12px, 3vw)`) |
| Weight | `400` |
| Letter Spacing | `0.1em` |
| Color | `#ffffff` |
| Background | `#9f9f9d` |
| Border Radius | `999px` (pill) |
| Padding | `14px 20px` |
| Width | `170px` fixed |
| Icons | SVG map pin + calendar, stroke `#ffffff` |
| Container | `px-6` margin from edges |
| Maps URL | `https://maps.google.com/?q=872+Rue+du+Couvent+Montreal` |
| Calendar | Google Calendar (June 26 2026, 5PM–11PM) |
| Animation | whileInView fade+slide (delay 0.8s) |

### 9. Bottom Ornament
| Property | Value |
|----------|-------|
| Type | SVG (lines + circle) |
| Width | `40px` |
| Opacity | `0.25` |
| Position | Absolute, `bottom: 40px`, centered |

---

## Global

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Section height | `h-screen` (snap target) |
| Padding | `py-20 px-6` |
| Alignment | Center, `justify-center` |
| Max content width | `max-w-lg` |
| Scroll snap | `scroll-snap-align: start` (set in page.tsx wrapper) |
| Animations | `whileInView` with staggered delays |
