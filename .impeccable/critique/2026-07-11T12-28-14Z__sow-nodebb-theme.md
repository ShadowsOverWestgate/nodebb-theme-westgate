---
target: SoW NodeBB theme visual pass
total_score: 27
p0_count: 1
p1_count: 3
timestamp: 2026-07-11T12-28-14Z
slug: sow-nodebb-theme
---
# Critique: nodebb-theme-westgate (visual pass)

Method: dual-agent (A: design-review sub-agent · B: detector-evidence sub-agent), live forum at http://localhost:4567 (NodeBB dev stack, theme rebuilt from working tree @ branch `impeccable`, commit 950f3ba).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Unread counts, watching chips, draft badge all present; icon-only topbar gives weak "where am I" feedback |
| 2 | Match System / Real World | 3 | Ledger metaphor fits; "World", "Crosspost Topic", "Manage Open Social Web Handles" are opaque jargon |
| 3 | User Control and Freedom | 3 | Discard-with-confirm, Escape closes drawer, breadcrumbs, skip-link |
| 4 | Consistency and Standards | 2 | Two primary-button styles; post tables unthemed while notification/flags tables are themed; pink default avatars |
| 5 | Error Prevention | 3 | Password rules shown upfront on register; discard confirmation |
| 6 | Recognition Rather Than Recall | 2 | 9+ icon-only topbar destinations, tooltip-only labels |
| 7 | Flexibility and Efficiency | 3 | Good search filters and sorts; no keyboard-shortcut affordance anywhere |
| 8 | Aesthetic and Minimalist Design | 3 | Strong restrained system; noise from zero-count stat boxes and 15 zero-count notification filters |
| 9 | Error Recovery | 3 | Themed 404 with home link |
| 10 | Help and Documentation | 2 | Wiki landing leaks admin setup copy to guests; no member onboarding |
| **Total** | | **27/40** | **Acceptable — solid base, specific fixes needed** |

## Anti-Patterns Verdict

**Not AI slop, not a default skin.** The velvet gradients, stepped gold borders, Cinzel/Jost pairing, and custom footer are genuinely art-directed. No gradient text, no glassmorphism, no hero-metric template, no eyebrow scaffolding.

Two ban-level violations and a set of "default NodeBB" tells:

- **Side-stripe ban violated (and the theme's own Gilt Edge Rule):** topic rows carry a 2px gold `border-left` accent — `scss/westgate/_topics.scss:64` (with state variants at 76–182) and `_widgets.scss:108–148`. Detector confirmed (`side-tab` ×3 on /topic/2). The rule says gold lives in 1px edges.
- **Display font on data:** profile email in Cinzel wraps mid-token ("ADMIN@WESTGATE.LOCA / L"); timestamps as 11.5px uppercase tracked text ("5 MINUTES AGO") — DESIGN.md's Engraving Rule says timestamps keep letter-spacing 0.
- **Default-skin tells:** bright magenta auto-generated avatars, Harmony's grey-triangle profile cover, the near-white "Powered by NodeBB / TipTap" footer pills — the loudest pixels on every page are not the theme's.

**Deterministic scan:** CLI detector cannot read `.tpl` files, so the shipped templates got zero static coverage; 1786 CLI findings all come from `custom_pages/` mockup artifacts (mostly duplicates/dead files — treat as noise, or delete the stale mockups). The real evidence came from injecting the detector into the live pages: recurring cross-page hits were footer meta text at 4.4:1 contrast (6 of 7 pages), gold glow on footer pills and category cards (`dark-glow`), 1px-border + 16–18px-shadow on the brand mark and avatars, tight line-height 1.25 on card teasers, and ~107–155 characters per line in post/search/wiki prose (aim < 80). Detector's extreme claims (1.1:1 text on gold) are sampling artifacts — visually checked, false positives.

**Overlays:** the detector ran in a headless browser (Playwright MCP could not launch Chrome on NixOS), so there is no user-visible overlay tab; console findings above are the signal.

## Overall Impression

The Velvet Ledger system is real and consistently executed — screenshots are unmistakably this forum, and body text (9.2:1) proves atmosphere is not taxing reading. The biggest opportunity is finishing the last 5%: the places where inherited NodeBB/Bootstrap defaults poke through the velvet (invisible post tables, pink avatars, near-white footer pills, dim focus ring). Each one individually is small; together they are the difference between "themed forum" and "in-world artifact."

## What's Working

1. **A real material system, applied everywhere.** The 100° velvet gradient + 1px gold borders at stepped alphas + three panel tones appear identically on cards, composer, search, 404, empty states. Hierarchy comes from tone and border strength, not decoration — the Candlelight Rule holds.
2. **Accessibility bones are genuinely built in.** Skip-link first in tab order, consistent outline token on all tabbed controls, aria states on the burger, Escape closes the drawer, wiki tables get focusable scroll wrappers with labels. Only the focus token's alpha is wrong (see P1).
3. **Thematic parity ~95%.** Login, register, 404, search, composer, notification empty states all stay in-world; zero horizontal scroll on mobile across tested pages.

## Priority Issues

1. **[P0] Markdown tables in posts are invisible.** Computed 1.02:1 — near-black text on near-black panel (`rgb(9,8,11)` on `rgb(15,13,18)`). The merchant-price table that is the whole point of the seeded feedback thread cannot be read; any player table (loot splits, event schedules) will hit this. Root cause: `--bs-table-*` overrides exist only for notification tables (`_controls.scss:211`) and flags (`_surfaces.scss:361`); post-content tables fall through to Bootstrap's dark default. Fix: hoist the already-duplicated table-variable block into one shared rule that also covers `[component="post/content"] table`. Both assessments found this independently. → `/impeccable polish`
2. **[P1] Focus ring fails non-text contrast.** `--wg-focus: rgba(194,163,90,0.28)` (`_tokens.scss:98`) ≈ 1.7:1 over crypt black (WCAG wants ≥3:1 for focus indicators). Confirmed visually: barely perceptible on the topbar icons. PRODUCT.md demands visible focus; DESIGN.md itself specifies the failing value, so the spec needs the fix too. Fix: solid `#c2a35a` (≈6:1) for outlines; keep the soft token for input glows. → `/impeccable polish`
3. **[P1] Mobile drawer shows duplicate navigation.** Categories/Recent/Unread/Tags appear twice: `templates/partials/header/topbar.tpl:99–111` loops `{{{ each navigation }}}` then unconditionally appends four hardcoded links. Reads as a glitch on every mobile visit. Fix: delete or guard the hardcoded block. → `/impeccable polish`
4. **[P1] The wiki surface is the weakest page, and it's the front door.** (a) Guests see "Set the Wiki Homepage… You do not have permission" — admin plumbing shown to the visitor most likely arriving from out-of-game links. (b) Console error on every load: `error loading forum/wiki — Cannot find module './wiki'` — the wiki's client-side module is missing from the build (plugin/build issue, worth confirming against production). (c) Wiki card prose runs ~155 chars/line. → `/impeccable harden` (empty/guest states) + a code fix in the wiki plugin or build
5. **[P2] Inherited defaults break the palette on every page.** Bright magenta generated avatars, grey-triangle default profile cover, near-white "Powered by NodeBB / TipTap" pills (`templates/partials/footer/westgate-global.tpl:47–50`), footer meta at 4.4:1 (`#7f756f` on `#09080b` — fails AA by a hair). Fix: constrain generated avatar background colors to a plum/gold/dried-blood set, ship a themed default cover, restyle the powered-by pills to ghost-button treatment, bump footer meta one step toward ash. → `/impeccable polish`

## Persona Red Flags

**Alex (power user):** 9 icon-only topbar destinations with tooltip-only labels (flame=Popular, globe=World, inbox=Unread) demand memorization; no keyboard-shortcut affordance anywhere; /notifications makes him scan 15 zero-count filter rows. Positive: search dropdown autofocuses its input.

**Sam (keyboard/screen-reader):** the ~1.7:1 focus ring makes complete keyboard support practically invisible; the 1.02:1 post tables fail WCAG 1.4.3 catastrophically; 11.5px uppercase tracked metadata is the hardest-to-read treatment applied to the most-repeated text. Positives: skip-link, aria states, Escape handling, focusable table scroll wrappers.

**Returning SoW roleplayer on mobile:** duplicate drawer nav reads as a glitch every visit; the price table they came to check is invisible; "WATCHING" chips stamped on every topic row tax the list they skim most. Positives: no horizontal scroll at 390px; thumb-friendly bottom pager.

## Minor Observations

- Core i18n grammar leaks: "1 pages", "2 result(s)", "1 posts".
- 404 keeps Harmony's playful otter — mildly off the "nothing playful" anti-reference; an in-world line was free. Same for the notification empty state ("wind" icon).
- `public/client.js:140` adds mobile scroll wrappers only to `.westgate-wiki` tables; post-content tables get none.
- Card teaser line-height 1.25 (detector `tight-leading` ×3 on home/recent) — bump to ≥1.3.
- Two primary-button vocabularies: bright gold gradient (topbar Register, composer Submit) vs the spec'd dark gold plate (Login, "Mark all read"). Gilt Edge Rule says the dark plate is the only gold fill — pick one or amend DESIGN.md.
- Post prose ~107 chars/line at desktop width; cap the content column nearer 80ch.
- `custom_pages/` carries stale duplicate mockups (`Westgate v1…`, `uploads/Westgate.dc.html`) that dominate any static scan — consider pruning.
- Sitewide brand text reads "NODEBB" — dev config value, but verify production siteTitle.

## Questions to Consider

1. If gold "marks what can be touched," why is the widest gold on the site a decorative 2px stripe on topic rows — while the most touchable thing, the focus ring, is the dimmest gold in the system?
2. The ledger is the court's own book — so why does a guest opening /wiki read the clerk's setup notes, and why are the only near-white surfaces in the theme third-party credits?
3. Should user data (emails, timestamps, usernames) ever wear the Cinzel engraving, or only the court's own inscriptions — and what enforces that when the next plugin ships a table?
