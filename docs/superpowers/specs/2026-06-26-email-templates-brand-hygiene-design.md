# Email templates: brand + hygiene pass

**Date:** 2026-06-26
**Status:** Design (spec only — no implementation)
**Scope:** `email/` directory of `nodebb-theme-westgate`.

## Problem

The 10 templates under `email/` are NodeBB core's Cerberus boilerplate copied
verbatim. Three issues:

1. **No brand.** All colors are generic greys — `#f6f6f6` page, `#ffffff`
   card, `#222222` button, `#333/#555/#888/#aaa` text. None of the Westgate
   palette (plum, gold, red, parchment) appears anywhere. Emails do not look
   like they came from the same product as the forum.
2. **Massive duplication.** Each template inlines the full `<head>` (reset CSS,
   media queries), header, and footer — ~400 lines per file, ~390 of them
   identical across all 10. `partials/header.html` and `partials/footer.html`
   exist but **nothing imports them** — they are dead code, and the README
   wrongly claims they are included. `partials/post-queue-body.html` is rendered
   by NodeBB's post queue flow into notification body content.
3. **Inbox hygiene gaps.** Every template has an empty `<title>` and no
   preheader (inbox preview text). These make messages look unfinished in the
   inbox list and are easy wins under deliverability heuristics.

## Goals

- Reskin all 10 templates to the Westgate brand using a **light, client-robust**
  treatment (not full dark — see Rejected alternatives).
- Eliminate the duplication by wiring up real shared partials with Benchpress
  `IMPORT`, mirroring how NodeBB core structures its own email templates.
- Close the template-level hygiene gaps (real `<title>`, preheader, valid HTML,
  no hardcoded copy).
- Document the deliverability work that templates **cannot** fix, so the reskin
  is not mistaken for a complete anti-spam fix.

## Non-goals

- Full dark-background email design (rejected — see below).
- Rewriting user-facing copy / in-world tone. Copy stays in the existing
  `[[email:…]]` keys; this pass only adds keys that are missing. A copy/voice
  pass is a separate language-file task.
- Any change to SPF/DKIM/DMARC, sending domain, or mail-server config (out of
  template scope; flagged below for ops).

## Constraints (email rendering)

These shape every decision and must be respected in implementation:

- **No CSS custom properties.** Outlook and Gmail strip `var(--…)`. The brand
  palette is therefore applied as **literal hex, inline on each element**. The
  `--wg-*` tokens in `scss/westgate/_tokens.scss` are the source of truth for
  the values, but cannot be referenced at runtime — they are copied as literals.
- **Table layout, inline CSS, MSO conditional comments stay.** Do not refactor
  into modern/flex/grid CSS. The shared `<style>` block may only hold things
  that must be in a stylesheet: `:hover` states and `@media` queries. Per-element
  color/spacing stays inline.
- **Web fonts barely load in email.** Cinzel/Jost render only in Apple Mail and
  iOS Mail. The serif fallback carries the brand look everywhere else.

## Architecture

Adopt NodeBB core's email structure: each template is a thin body that imports a
shared head/header and a shared footer.

```
email/
  partials/
    header.html          # doctype, <head>, brand <style>, letterhead band, open container
    footer.html          # gold hairline, unsubscribe block, closing tags
    post-queue-body.html  # NodeBB post queue flow renders this into notification body; reskinned
  welcome.html           # IMPORT header + body block + IMPORT footer
  verify-email.html
  reset.html
  reset_notify.html
  registration_accepted.html
  banned.html
  invitation.html
  notification.html      # renders {body}; post queue flow supplies rendered post-queue body
  digest.html            # keeps its loops; reskinned
  test.html
```

Each non-partial template collapses from ~400 lines to ~40:

```
<!-- IMPORT emails/partials/header.html -->
<!-- preheader (hidden preview text) for this email -->
<!-- Email Body : BEGIN -->  … this template's content …  <!-- Email Body : END -->
<!-- IMPORT emails/partials/footer.html -->
```

**Import-path verification (implementation must confirm):** NodeBB core uses
`<!-- IMPORT emails/partials/header.tpl -->`. The theme ships `.html` files
compiled into the `emails/` view namespace. Confirm after `./nodebb build`
whether the resolved path is `emails/partials/header.html` (or `.tpl`); use
whichever the build resolves. If `IMPORT` cannot resolve the theme's partials,
fall back to keeping templates self-contained and delete the dead partials —
but the expectation, based on core, is that `IMPORT` works.

### header.html (shared) responsibilities

- Doctype, `<html>`, `<head>` with the existing reset CSS and MSO blocks
  (carried over unchanged).
- Shared `<style>`: button `:hover`, the small-screen `@media` typography
  block, `.notification-body img` rule. Update the hover color to the brand
  hover (`#3a1830`).
- Optional, guarded webfont link for non-MSO clients:
  `<!--[if !mso]><!--> <link href="…Cinzel…Jost…" rel="stylesheet"> <!--<![endif]-->`
  Low risk, upgrades supporting clients, safe to omit if it complicates review.
- **Letterhead band:** a full-width dark plum bar (`#18141d`) holding the
  `{logo.src}` logo, with a gold hairline (`#c2a35a`, 1–2px) beneath it. This
  fixes the logo-on-light problem (the site logo is gold-on-dark) and reads as
  brand letterhead. Preserve the existing `{{{ if logo.src }}} … {{{ else }}}`
  fallback.
- Open the `email-container` div, preserving the existing `{{{ if rtl }}}`
  direction handling.

### footer.html (shared) responsibilities

- Gold hairline above the footer.
- The existing `{{{ if showUnsubscribe }}}` unsubscribe block, reskinned to
  muted footer text (`#9a9086`).
- Close container / center / body / html and the MSO closing block.

## Visual design

Light card + dark letterhead band. Palette is a deliverability-safe adaptation
of the gothic theme. All values literal-inline.

| Slot | Current | New | Source token |
|------|---------|-----|--------------|
| Page background | `#f6f6f6` | `#ece6da` (warm neutral) | adapted from `--wg-text-soft` family |
| Letterhead band | — (none) | `#18141d` | `--wg-panel` |
| Header hairline | — | `#c2a35a` | `--wg-gold` |
| Card background | `#ffffff` | `#fbf7ef` (cream) | adapted parchment |
| H1 / greeting | `#333333`, sans | `#1a1418`, serif stack | ink |
| Sub-heading | `#aaaaaa` | `#9a9086` | `--wg-text-muted` |
| Body text | `#555555` | `#3a3340` | ink |
| Button bg / text | `#222222` / `#fff` | `#2a1222` / `#f4ecd8`, gold `#c2a35a` border | `--wg-plum` / parchment / `--wg-gold` |
| Button hover | `#555555` | `#3a1830` | `--wg-plum-soft` |
| Links | default | `#a8893f` | `--wg-gold-soft` |
| Footer text | `#888888` | `#9a9086` | `--wg-text-muted` |
| Footer hairline | — | `#c2a35a` | `--wg-gold` |

**Font stacks** (literal, inline):

- Headings: `Cinzel, Georgia, 'Times New Roman', serif` — Cinzel where it
  loads, Georgia serif everywhere else carries the engraved look.
- Body / UI: `Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif`.

Rationale for light over dark: chosen in design review. Dark-background HTML
email is fragile — Outlook ignores `bgcolor` on many elements, dark-mode clients
re-invert colors unpredictably, and heavy dark blocks raise some spam scores.
The dark letterhead band gives brand recognition at the top while the light body
stays robust.

## Hygiene / anti-spam (template-level — in scope)

- **`<title>`:** populate per email (currently empty in all). Use an existing or
  new `[[email:…]]` key describing the message; falls back gracefully.
- **Preheader:** add one hidden preview-text block at the top of each template's
  body — the standard hidden-`<div>` + spacing-hack pattern. Per-template text
  (e.g. reset → "Reset your Shadows Over Westgate password"). This is the inbox
  list snippet; currently blank/garbage.
- **Copy:** keep all visible strings as `[[email:…]]` keys. Where the new
  structure needs a string that has no key (preheader, title), add the key to
  the language files. No hardcoded user-facing copy.
- **Valid HTML:** consolidation into partials removes the per-file drift risk;
  resulting markup must be balanced and pass `./nodebb build`.

## Out of scope — deliverability (flag for ops)

Templates cannot affect these; list them so the reskin is not mistaken for a
spam fix:

- **SPF / DKIM / DMARC** records and alignment for the sending domain.
- From-address on a domain with sending reputation (not a bare/shared host).
- `List-Unsubscribe` and `List-Unsubscribe-Post` (one-click) **headers** — set
  by the mail layer, distinct from the in-body unsubscribe link the footer
  already renders.
- Dedicated sending domain/subdomain and IP warm-up if volume grows.

## Testing / verification

- `./nodebb build`, then ACP **"Send test email"** for each template type.
- Visual check across Gmail (web), Outlook (desktop/MSO), Apple Mail, and one
  dark-mode client (iOS Mail dark or Gmail dark). Confirm: letterhead renders,
  button is plum with readable text, no broken layout in Outlook, preheader
  shows in the inbox list, dark mode does not destroy legibility.
- **Optional regression guard:** a small script asserting that every
  `email/*.html` (excluding partials) imports header and footer, has a
  non-empty `<title>` (via partial), and includes a preheader block. Cheap
  catch for future drift; no test framework needed.

## README correction

`email/README.md` currently states the partials "are included by the templates
above" — false today. After this work it becomes true. Update the Partials and
Editing-notes sections to describe the IMPORT-based structure and the literal-hex
palette constraint.

## Implementation order (suggested)

1. Build `partials/header.html` + `partials/footer.html` with the new band,
   palette, `<title>` hook, and confirm `IMPORT` resolves on one template
   (`reset.html`, the simplest).
2. Add preheader + convert the remaining single-column templates
   (welcome, verify-email, reset_notify, registration_accepted, invitation,
   test, banned).
3. Convert the complex templates (`notification.html` + `post-queue-body.html`,
   `digest.html`), preserving their loops/conditionals.
4. Add missing language keys (titles, preheaders).
5. Update README; optional regression script.
6. Build + ACP test-send all; cross-client visual pass.
