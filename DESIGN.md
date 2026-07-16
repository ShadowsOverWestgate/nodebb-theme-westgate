---
name: Westgate
description: Dark velvet-and-gold NodeBB theme for Shadows Over Westgate
colors:
  tarnished-gold: "#c2a35a"
  old-gilt: "#a8893f"
  gold-lit: "#e0c878"
  bruised-plum: "#2a1222"
  plum-bloom: "#3a1830"
  dried-blood: "#8e3438"
  wax-seal: "#a84a4e"
  crypt-black: "#0f0d12"
  grave-black: "#09080b"
  velvet-panel: "#18141d"
  velvet-panel-deep: "#110f15"
  velvet-panel-raised: "#201924"
  bone-text: "#e6e0d6"
  ash-text: "#b9b2a6"
  dust-text: "#9a9086"
  ledger-ink: "#d8c28a"
  ledger-ink-muted: "#a99d8f"
typography:
  display:
    fontFamily: "Cinzel, Georgia, 'Times New Roman', serif"
    fontWeight: 600
    letterSpacing: "0"
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "0.86rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  code:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontWeight: 400
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  2xs: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "#5a4a1a"
    textColor: "#f0e6d8"
  button-primary-hover:
    backgroundColor: "#6a5720"
    textColor: "#fff4dd"
  button-ghost:
    backgroundColor: "#08070a1f"
    textColor: "#d8cec0"
  input:
    backgroundColor: "#120f16f5"
    textColor: "{colors.bone-text}"
  card:
    backgroundColor: "{colors.velvet-panel}"
    textColor: "{colors.ash-text}"
    rounded: "{rounded.lg}"
---

# Design System: Westgate

## 1. Overview

**Creative North Star: "The Velvet Ledger"**

The forum is the account book of a vampire court: pages of near-black velvet, ruled with faint gold lines, written in tarnished gilt ink, stamped here and there with a dried-blood seal. Every surface is dark and plush. Gold appears as thin edges, rulings, and small marks of importance — the way gilt survives on an old book long after the leather has gone dark. Nothing is bright. Nothing is flat. Depth comes from fabric and candlelight, not from floating cards.

This system explicitly rejects anything bright, playful, clinical, or flat SaaS-style, and any loud ornament. It must never read as a generic default forum skin. It is a working forum first: text stays readable, focus stays visible, and the atmosphere never taxes reading.

**Key Characteristics:**
- Near-black plum-tinted surfaces with velvet gradient sheen
- Tarnished gold carries all borders, links, and affordances
- Engraved serif headings (Cinzel) over calm geometric body text (Jost)
- Red reserved for states and small stamped details
- Ambient, candlelit shadows; hierarchy by panel tone, not lift

## 2. Colors

A tarnish-and-decay palette: gold that has aged, plum that has bruised, black that has settled.

### Primary
- **Tarnished Gold** (#c2a35a): the voice of the theme. Links, borders (usually at 8–18% alpha), icons, focus rings, selection. It marks what can be touched.
- **Old Gilt** (#a8893f): darker gold for pressed states and primary-button borders.
- **Gold Lit** (#e0c878): link hover — the gilt catching candlelight.

### Secondary
- **Bruised Plum** (#2a1222): the tint inside velvet gradients and inner glows. Almost never a flat fill; it blooms through surfaces.
- **Plum Bloom** (#3a1830): the brighter bruise, used at hover in the velvet gradients.

### Tertiary
- **Dried-Blood Red** (#8e3438): danger and warning states, small details. Never a large surface.
- **Wax Seal** (#a84a4e): stamped accents inside ledger surfaces.

### Neutral
- **Crypt Black** (#0f0d12): the body background.
- **Grave Black** (#09080b): the deepest layer (status ring backdrops, page depths).
- **Velvet Panel** (#18141d), **Velvet Panel Deep** (#110f15), **Velvet Panel Raised** (#201924): the three panel tones that build hierarchy.
- **Bone Text** (#e6e0d6): headings and emphasized text.
- **Ash Text** (#b9b2a6): body text.
- **Dust Text** (#9a9086): muted and secondary text.
- **Ledger Ink** (#d8c28a) / **Ledger Ink Muted** (#a99d8f): text written on ledger surfaces.

### Named Rules
**The Gilt Edge Rule.** Gold is edging, not paint. It lives in 1px borders, thin rules, icons, and text. The only gold-filled surface in the theme is the primary button, and even that is a dark #5a4a1a, not bright gold.

**The Sparing Red Rule.** Red is a state and a detail — an error, a seal, a warning. It is never a background, never decoration, never loud.

## 3. Typography

**Display Font:** Cinzel (with Georgia, 'Times New Roman', serif)
**Body Font:** Jost (with system-ui, sans-serif)
**Code Font:** IBM Plex Mono (with ui-monospace, monospace)

**Character:** An engraved Roman capital face over a calm geometric sans. Cinzel gives headings the feel of letters cut into stone or stamped in gilt; Jost keeps long forum threads quiet and easy to read. The pairing contrasts on a real axis (carved serif vs geometric sans), so each has a clear job.

### Hierarchy
- **Display / Headings** (Cinzel 600, letter-spacing 0): all h1–h5, category titles, topic titles. Carries a faint etch: `text-shadow: 0 1px 0 rgba(0,0,0,0.9), 0 0 10px rgba(104,32,76,0.16)`.
- **Label** (Cinzel 600, ~0.86rem, tracked 0.08–0.16em, often uppercase): topbar items, footer headings, table headers, search labels. The wider tracking is reserved for these small engraved labels.
- **Body** (Jost 400, 1rem): posts, descriptions, lists. UI metadata (timestamps, stats) also uses Jost with letter-spacing 0.
- **Code** (IBM Plex Mono 400/500): code blocks and inline code.

### Named Rules
**The Engraving Rule.** Wide letter-spacing and uppercase belong only to small Cinzel labels. Headings at reading size keep letter-spacing 0. Body text is never tracked, never uppercase.

## 3½. Spacing & Layout

Tokens in `_tokens.scss`: `--wg-space-2xs/xs/sm/md/lg/xl` (0.25 / 0.5 / 0.75 / 1 / 1.5 / 2rem, a 4pt scale). Surface-level rules:

- Card interiors pad `--wg-space-md`; compact control bars (topic-list header) pad `--wg-space-xs`.
- Gaps between sibling cards/widgets are `--wg-space-sm`; below `lg` card padding also drops to `--wg-space-sm`.
- The ledger ruling row height is one token everywhere: `--wg-ledger-line` (1.78rem).
- Page rails (topbar, footer, content) share `--wg-page-width` (1420px).
- Fine optical values (tag chips, badge padding, etched insets) stay hand-tuned; the scale governs surface-level spacing, not micro-typography.

## 4. Elevation

Shadows here are candlelight, not physics. They set mood — a soft top highlight like sheen on fabric, an inner plum glow, a wide black falloff — and they do not communicate stacking. Hierarchy between surfaces is carried by panel tone (Velvet Panel Deep → Velvet Panel → Velvet Panel Raised) and by border strength (gold at 8% → 14% → 18–22% alpha).

### Shadow Vocabulary
- **Velvet rest** (`inset 0 1px 0 rgba(255,255,255,0.025), inset 0 0 34px rgba(96,32,68,0.11), 0 10px 26px rgba(0,0,0,0.24)`): the default surface shadow — sheen, bruise, and depth.
- **Velvet hover** (`inset 0 1px 0 rgba(255,255,255,0.035), inset 0 0 38px rgba(120,36,84,0.14), 0 12px 30px rgba(0,0,0,0.3)`): the same material, slightly warmed and lifted on hover.
- **Ledger rest** (`inset 0 1px 0 rgba(255,255,255,0.024), inset 0 -1px 0 rgba(0,0,0,0.42), 0 8px 18px rgba(0,0,0,0.2)`): flatter, page-like; for ledger surfaces.
- **Control depth** (`inset 0 1px 0 rgba(255,244,221,0.04), 0 2px 8px rgba(0,0,0,0.22)`): small ambient depth on buttons.

### Named Rules
**The Candlelight Rule.** Shadows are atmosphere. If you need to show one thing sits above another, change the panel tone and border alpha; do not invent a bigger shadow.

## 4½. Motion & Modes

- Transitions are short (0.16–0.25s) and touch only paint/composite properties (color, background, border-color, box-shadow, transform). No layout-property animation.
- A global `prefers-reduced-motion: reduce` block zeroes all transition and animation durations.
- Box-shadow focus rings carry a transparent 2px outline so forced-colors / high-contrast mode still shows focus.

## 5. Components

Etched and restrained: controls read as engraved metal — thin gilt borders, quiet vertical gradients, nothing shouts.

### Buttons
- **Shape:** softly rounded. Radius scale: 8px for surfaces (cards, panels, dropdowns), 6px for controls and post containers, 4px for chips and inline code, 3px for tiny badges.
- **Primary:** dark gold plate. Gradient #5a4a1a → #473914, border Old Gilt (#a8893f), text #f0e6d8, with a 1px inner top highlight. Hover warms the gradient to #6a5720 → #53431a and brightens the border to Tarnished Gold.
- **Secondary / Ghost:** near-transparent dark fill (rgba(8,7,10,0.12)) with a gilt border at 28% alpha and text #d8cec0. Hover adds a faint gold wash (rgba(194,163,90,0.075)) and strengthens the border.
- **Focus:** 2px outline in solid Tarnished Gold (#c2a35a, the `--wg-focus-ring` token) — WCAG wants ≥3:1 for focus indicators, so the outline never uses the soft alpha token. The soft token (rgba(194,163,90,0.28)) is only for input glows.

### Cards / Containers (the velvet surface)
- **Corner Style:** 8px radius (6px on post containers).
- **Background:** the velvet gradient — a 100° sweep from bruised plum (rgba(42,18,34,0.46)) into near-black — over category rows, topic rows, post containers, and headers.
- **Border:** 1px Tarnished Gold at 14% alpha; hover raises it to 22%.
- **Shadow Strategy:** Velvet rest → Velvet hover (see Elevation).
- **Plain panels** (cards, list-group items) use flat Velvet Panel (#18141d) with a soft gold border at 8% alpha.

### Inputs / Fields
- **Style:** near-black well (rgba(18,15,22,0.96)), 1px gilt border at 18% alpha, Bone Text. Placeholders are Ash Text at 74% alpha (the floor that keeps 4.5:1 contrast).
- **Focus:** border rises to gold at 50% alpha plus a 1px gold ring (rgba(194,163,90,0.28)) and a faint light wash. Focus is always visible.
- **Selects:** custom gold chevron (inline SVG, stroke #c2a35a).
- **Switches:** dark track with gilt border; the thumb is a Ledger Ink dot.

### Navigation (topbar)
- Cinzel labels, tracked 0.08em and uppercase, over the dark base. Count bubbles honor the `hidden` class and only show with a real count.

### Code (posts, composer preview, wiki prose)
Code is written in a darker well of the same page: blocks use a vertical near-black gradient (rgba(18,15,22,0.92) → rgba(8,7,10,0.82)) with a gilt border at 22% alpha and 6px radius; inline code sits in rgba(8,7,10,0.45) with a 12% gilt border and 4px radius, in IBM Plex Mono. Syntax colors stay in the court's palette: keywords Gold Lit (#e0c878), titles/functions Ledger Ink (#d8c28a), types/built-ins Tarnished Gold (#c2a35a), strings a muted moss (#a3c58a), numbers/attributes a dry apricot (#d9a37a), comments Dust Text italic, deletions #c55a5f. Never ship the highlighter's default light theme.

### The Ledger (signature component)
Ruled, page-like surfaces (notification tables, list ledgers): a flat 100° gradient from dark plum into black, faint gold rulings (rgba(194,163,90,0.055)) with stronger rules (0.16) for structure, headers in Cinzel Ledger Ink Muted, text in Ledger Ink, and Wax Seal (#a84a4e) for stamped accents.

## 6. Do's and Don'ts

### Do:
- **Do** keep body text at or above 4.5:1 contrast; Ash Text (#b9b2a6) on Crypt Black is the floor. Drop to Dust Text only for genuinely secondary metadata.
- **Do** carry the theme to every surface — wiki, custom pages, applications, reports, admin-facing lists. One unthemed page breaks the spell.
- **Do** build hierarchy with the three panel tones and border alpha steps (8% / 14% / 18–22%), per the Candlelight Rule.
- **Do** keep a visible 2px gold focus outline on everything interactive.
- **Do** stay a small child theme: inherit from Harmony and override only what Westgate needs.

### Don't:
- **Don't** make anything "bright, playful, clinical, or flat SaaS-style" (PRODUCT.md). No white surfaces, no saturated blues, no flat borderless cards.
- **Don't** add "loud ornament" (PRODUCT.md). No filigree backgrounds, no large gold fills, no glow effects beyond the existing plum bloom.
- **Don't** use red as a surface or decoration — states and small seals only (the Sparing Red Rule).
- **Don't** track or uppercase body text; that treatment belongs to small Cinzel labels only (the Engraving Rule).
- **Don't** ship anything that could pass as a generic default forum skin. If a screenshot could be any NodeBB forum, it is not done.
