# Order of the Day Section

**File:** `src/components/OrderOfDaySection.tsx`

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
| Spacing Below | `50px` |
| EN | `Order of the Day` |
| FR | `Déroulement de la journée` |

### 3. Timeline Items (×4)

Each item: **Line segment (between items) → Dot → Time → Title → Description**

#### Shared Styles
| Property | Value |
|----------|-------|
| Segment Line | `1px` wide, `30px` tall, `#9f9f9d`, opacity `0.2`, `mb-3` |
| Dot | `8px` circle, `#9f9f9d`, opacity `0.4`, `mb-4` |
| Time Font | Montserrat, `13px`, weight `500` |
| Time Spacing | `0.2em`, uppercase |
| Time Color | `#9f9f9d` |
| Time Padding Below | `6px` |
| Title Font | Great Vibes, `30px` |
| Title Color | `#9f9f9d` |
| Title Padding Below | `6px` (if has desc) |
| Desc Font | Montserrat, `12px`, weight `300` |
| Desc Color | `#b8b8b6` |
| Desc Max Width | `260px` |
| Desc Padding Below | `16px` |
| Animation | whileInView fade+slide, staggered `0.2s` per item (base delay `0.3s`) |

#### Item 1: Arrival
| Property | Value |
|----------|-------|
| Time | `17:00` |
| EN Title | `Arrival & Welcome Drinks` |
| FR Title | `Arrivée & Cocktail de bienvenue` |
| EN Desc | `Reception and welcome cocktails at the venue` |
| FR Desc | `Réception et cocktails de bienvenue sur place` |

#### Item 2: Ceremony
| Property | Value |
|----------|-------|
| Time | `18:00` |
| EN Title | `Ceremony` |
| FR Title | `Cérémonie` |
| EN Desc | `The most special moment of the day` |
| FR Desc | `Le moment le plus spécial de la journée` |

#### Item 3: Dinner
| Property | Value |
|----------|-------|
| Time | `19:00` |
| EN Title | `Cocktail Hour & Dinner` |
| FR Title | `Cocktail & Dîner` |
| EN Desc | `Party` |
| FR Desc | `La fête` |

#### Item 4: Dancing
| Property | Value |
|----------|-------|
| Time EN | `Until 1 AM` |
| Time FR | `Jusqu'à 1h` |
| EN Title | `Let's dance the night away!` |
| FR Title | `Dansons toute la nuit !` |
| Desc | _(none)_ |

### 4. Bottom Ornament
| Property | Value |
|----------|-------|
| Type | SVG (lines + circle, 100px wide) |
| Opacity | `0.25` |
| Position | Absolute, `bottom: 40px`, centered |

---

## Global

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Section height | `h-screen` (snap target) |
| Padding | `px-6` |
| Alignment | Center, `justify-center` |
| Max content width | `max-w-md` |
| Scroll snap | `scroll-snap-align: start` (set in page.tsx wrapper) |
