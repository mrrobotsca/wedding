# Intro Section

**File:** `src/components/IntroSection.tsx`  
**Route:** `/?preview=true` or `/?admin=true`

---

## Elements

### 1. Logo
| Property | Value |
|----------|-------|
| Source | `/public/logo.png` |
| Height | `300px` |
| Width | `auto` |
| Object Fit | `contain` |
| Margin Bottom | `24px` |
| Animation | Fade in + scale (delay 0.2s) |

---

### 2. Dear Guest
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `16px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.15em` |
| Align | Center |
| Spacing Below | `40px` |
| EN | `Dear {guestName},` |
| FR | `Cher(e) {guestName},` |
| Animation | Fade in + slide up (delay 0.5s) |

---

### 3. We're Getting Married
| Property | Value |
|----------|-------|
| Font | Montserrat |
| Size | `16px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Align | Center |
| Spacing Below | `40px` |
| EN | `We're Getting Married` |
| FR | `Nous allons nous Marier` |
| Animation | Fade in + slide up (delay 0.8s) |

---

### 4. Sarah & Arman
| Property | Value |
|----------|-------|
| Font | Great Vibes |
| Size | `52px` |
| Color | `#9f9f9d` |
| Layout | Inline: `Sarah` `&` `Arman` |
| & Margin | `0 8px` |
| Spacing Below | `60px` |
| Animation | Fade in + slide up (delay 1.4s) |

---

### 5. Save the Date + Date
| Property | Value |
|----------|-------|
| **"Save the Date"** | |
| Font | Montserrat |
| Size | `16px` |
| Weight | `400` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.3em` |
| Transform | Uppercase |
| **Date** | |
| Font | Montserrat |
| Size | `16px` |
| Weight | `300` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.15em` |
| Gap above date | `4px (mt-1)` |
| EN | `June 26, 2026` |
| FR | `26 Juin 2026` |
| Animation | Fade in (delay 2s) |

---

### 6. Scroll Down (bottom)
| Property | Value |
|----------|-------|
| Position | Absolute, `bottom: 32px`, centered |
| Font | Cormorant Garamond |
| Size | `12px (text-xs)` |
| Color | `#9f9f9d` |
| Letter Spacing | `0.3em` |
| Transform | Uppercase |
| Arrow | SVG chevron, stroke `#9f9f9d` |
| EN | `Scroll down` |
| FR | `Défiler vers le bas` |
| Animation | Fade in (delay 3s), bounce loop |

---

## Global

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Section padding | `pt-12 px-6` |
| Alignment | `justify-start` (top) |
| Decorative orbs | 3 floating circles, `#9f9f9d` / `#d0d0ce`, 10% opacity |
| Language Toggle | Fixed `top: 40px right: 16px`, z-999 |
| Video Intro | `intro.MP4`, `object-fit: fill`, click anywhere to skip |
