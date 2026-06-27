# Email Templates: Brand + Hygiene Pass — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin all 10 `email/` templates to the Westgate brand, eliminate ~390 lines/file of duplication by wiring up real shared `header.html`/`footer.html` partials via Benchpress `IMPORT`, and close template-level inbox-hygiene gaps (non-empty `<title>`, preheader preview text).

**Architecture:** Each template collapses from ~400 lines to ~40: `IMPORT emails/partials/header.html` → preheader + body → `IMPORT emails/partials/footer.html`. The shared head/letterhead/footer carry the brand. The body keeps only this template's content and loops. Palette is applied as literal inline hex (no `var()` — Outlook/Gmail strip it); `scss/westgate/_tokens.scss` is the value source, copied as literals.

**Tech Stack:** Benchpress templating (`{var}`, `{{{ if }}}`, `[[ns:key]]`, `<!-- IMPORT … -->`), HTML email (table layout, inline CSS, MSO conditional comments), NodeBB language JSON files, a tiny dependency-free Node assertion script for regression.

## Global Constraints

Copied verbatim from the spec — every task implicitly includes these:

- **No CSS custom properties.** `var(--…)` is stripped by Outlook/Gmail. All brand color/spacing is **literal hex, inline on each element**.
- **Keep table layout, inline CSS, MSO conditional comments.** No flex/grid/modern CSS refactor. The shared `<style>` block holds only what *must* be in a stylesheet: `:hover` states and `@media` queries.
- **No hardcoded user-facing copy.** Every visible string stays a `[[email:…]]` key. Strings with no existing key (preheaders) get a new key added to the theme language file.
- **Web fonts barely load in email** (Cinzel/Jost only in Apple/iOS Mail). The serif/sans *fallback* stacks carry the look everywhere else.
- **Markup must stay balanced and build cleanly** (`./nodebb build` from the NodeBB root where this theme is installed).
- Reuse the current feature branch (`email-brand-hygiene-spec`). Never commit to `main`.

### Brand palette — literal hex (the single source of truth for every task)

| Slot | Old value | New value | Token |
|------|-----------|-----------|-------|
| Page background | `#f6f6f6` | `#ece6da` | adapted neutral |
| Letterhead band | — | `#18141d` | `--wg-panel` |
| Header/footer hairline | — | `#c2a35a` | `--wg-gold` |
| Card background | `#ffffff` | `#fbf7ef` | adapted parchment |
| H1 / greeting | `#333333` | `#1a1418` | ink |
| Sub-heading | `#aaaaaa` | `#9a9086` | `--wg-text-muted` |
| Body text | `#555555` | `#3a3340` | ink |
| Button bg | `#222222` | `#2a1222` | `--wg-plum` |
| Button border | — | `#c2a35a` | `--wg-gold` |
| Button text | `#ffffff` | `#f4ecd8` | parchment |
| Button hover | `#555555` | `#3a1830` | `--wg-plum-soft` |
| Links | default | `#a8893f` | `--wg-gold-soft` |
| Footer text | `#888888` | `#9a9086` | `--wg-text-muted` |

### Font stacks — literal, inline

- **Headings:** `Cinzel, Georgia, 'Times New Roman', serif`
- **Body / UI:** `Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif`

Every existing `-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol` stack becomes the **Body** stack, except `<h1>` greeting/heading elements which become the **Headings** stack.

---

## Decisions & deviations from the spec (review before executing)

Two points the spec leaves open; resolved here, flag to the user if either is wrong:

1. **`<title>` is `{site_title}`, not per-email.** Benchpress `IMPORT` is a static include with no argument passing, so a *shared* `header.html` cannot receive a per-template title. Using `{site_title}` makes the title **non-empty and graceful everywhere** (the actual hygiene gap), with zero fragile per-template wiring. Per-message specificity lives in the **preheader**, which *is* per-template and trivial. This satisfies the spec's "populate per email / falls back gracefully" intent without a brittle mechanism. If true per-email titles are required, the alternative is keeping `<head>` out of the partial — reject unless asked.
2. **Preheaders need a theme language file.** The theme currently ships no `languages/` dir and no `languages` key in `plugin.json`. New preheader copy can't be hardcoded (Global Constraint), so Task 5 creates `languages/en-GB/email.json` and registers it. Titles need no key (decision 1).

---

## File structure

```
email/
  partials/
    header.html          # MODIFY: doctype, <head>, brand <style>, letterhead band, open container, title={site_title}
    footer.html          # MODIFY: gold hairline, reskinned unsubscribe block, closing tags
    post-queue-body.html # MODIFY: reskinned (links/text colors)
  reset.html             # MODIFY: thin body — IMPORT header + body + IMPORT footer + preheader  (worked example)
  welcome.html           # MODIFY: same transform
  verify-email.html      # MODIFY
  reset_notify.html      # MODIFY
  registration_accepted.html # MODIFY
  invitation.html        # MODIFY
  banned.html            # MODIFY
  test.html              # MODIFY
  notification.html      # MODIFY: keeps {body}; post queue flow supplies rendered post-queue body
  digest.html            # MODIFY: keeps loops; reskinned
  README.md              # MODIFY: partials now real; document IMPORT + literal-hex constraint
languages/
  en-GB/email.json       # CREATE: preheader keys
plugin.json              # MODIFY: add "languages": "languages"
scripts/check-emails.js  # CREATE: dependency-free regression guard
```

---

### Task 1: Reskin shared `header.html` (letterhead band, palette, title, styles)

**Files:**
- Modify: `email/partials/header.html`

**Interfaces:**
- Produces: an `IMPORT`-able partial that opens `<html><head>…</head><body>…<center>…<div class="email-container">` and renders the dark letterhead band with `{logo.src}`. Every template `IMPORT`s it first. It does **not** open the body content table — templates do that.
- Consumes (Benchpress params, already provided by NodeBB): `{site_title}`, `{logo.src}`, `{logo.width}`, `{{{ if rtl }}}`, `{{{ if logo.src }}}`.

- [x] **Step 1: Replace the empty title with `{site_title}`**

In `email/partials/header.html`, change line 17 from:

```html
    <title></title>
```

to:

```html
    <title>{site_title}</title>
```

- [x] **Step 2: Add the guarded webfont link** (low-risk progressive enhancement)

Replace the empty webfont placeholder block (currently lines 30–32):

```html
    <!--[if !mso]><!-->
    <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
    <!--<![endif]-->
```

with:

```html
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Jost:wght@400;600&display=swap" rel="stylesheet" />
    <!--<![endif]-->
```

- [x] **Step 3: Update the button hover color in the progressive-enhancement `<style>`**

In the `.button-td:hover, .button-a:hover` rule (currently lines 118–122), change both `#555555` to the brand hover `#3a1830`:

```css
      .button-td:hover,
      .button-a:hover {
        background: #3a1830 !important;
        border-color: #3a1830 !important;
      }
```

- [x] **Step 4: Recolor the page background on `<body>` and `<center>`**

Change `<body … bgcolor="#f6f6f6">` (line 148) to `bgcolor="#ece6da"`, and the `<center style="width: 100%; background: #f6f6f6; …">` (line 151) to `background: #ece6da`.

- [x] **Step 5: Replace the light logo header with the dark letterhead band + gold hairline**

Replace the entire `<!-- Email Header : BEGIN -->` … `<!-- Email Header : END -->` table (currently lines 166–191) with:

```html
        <!-- Letterhead Band : BEGIN -->
        <table
          role="presentation"
          cellspacing="0"
          cellpadding="0"
          border="0"
          align="center"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td bgcolor="#18141d" style="padding: 24px 0; text-align: center; background: #18141d;">
              {{{ if logo.src }}}
              <img
                src="{logo.src}"
                height="auto"
                width="{logo.width}"
                alt="{site_title}"
                border="0"
                style="height: auto; width: {logo.width}px; background: #18141d; font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 20px; color: #c2a35a;"
              />
              {{{ else }}}
              <span style="font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 22px; color: #c2a35a;">{site_title}</span>
              {{{ end }}}
            </td>
          </tr>
          <tr>
            <td height="2" bgcolor="#c2a35a" style="height: 2px; line-height: 2px; font-size: 2px; background: #c2a35a;">&nbsp;</td>
          </tr>
        </table>
        <!-- Letterhead Band : END -->
```

> Note: the partial intentionally ends with the container still open (the existing file already closes `</div></center></body></html>` at the end — **delete those closing tags**, see Step 6). Templates supply the body table; `footer.html` supplies the closing tags.

- [x] **Step 6: Remove the stray closing tags so the partial leaves the container open**

Delete the final `</div>`, `</center>`, `</body>`, `</html>` (currently lines 192–195). The file must end right after `<!-- Letterhead Band : END -->`. (`footer.html` owns these closing tags.)

- [x] **Step 7: Verify the file is well-formed manually**

Read `email/partials/header.html` end-to-end. Confirm: one `<html>`/`<head>`/`<body>` opened and **not** closed; `email-container` div opened and **not** closed; letterhead `bgcolor="#18141d"` and hairline `bgcolor="#c2a35a"` present; `<title>{site_title}</title>`.

- [x] **Step 8: Commit**

```bash
git add email/partials/header.html
git commit -m "feat(email): brand letterhead band + palette in shared header partial"
```

---

### Task 2: Reskin shared `footer.html` (gold hairline, muted unsubscribe, closing tags)

**Files:**
- Modify: `email/partials/footer.html`

**Interfaces:**
- Consumes: `{{{ if showUnsubscribe }}}`, `{url}`, `{uid}`, `{unsubUrl}` (NodeBB params).
- Produces: the gold hairline + footer text + the closing `</div></center></body></html>` and MSO close. Every template `IMPORT`s it last.

- [ ] **Step 1: Add a gold hairline above the footer and recolor the footer text**

Replace the entire current `email/partials/footer.html` with:

```html
<!-- Email Footer : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;">
<tr>
<td height="1" bgcolor="#c2a35a" style="height: 1px; line-height: 1px; font-size: 1px; background: #c2a35a;">&nbsp;</td>
</tr>
<tr>
<td style="padding: 28px 10px 40px 10px; width: 100%; font-size: 12px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 18px; text-align: center; color: #9a9086;">
{{{ if showUnsubscribe }}}
[[email:notif.post.unsub.info]] <a href="{url}/uid/{uid}/settings" style="color: #a8893f;">[[email:unsub.cta]]</a>.
<br />[[email:notif.post.unsub.one-click]] <a href="{unsubUrl}" style="color: #a8893f;">[[email:unsubscribe]]</a>.
{{{ end }}}
</td>
</tr>
</table>
<!-- Email Footer : END -->
<!--[if mso]>
</td>
</tr>
</table>
<![endif]-->
</div>
</center>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add email/partials/footer.html
git commit -m "feat(email): gold hairline + muted unsubscribe in shared footer partial"
```

---

### Task 3: Convert `reset.html` to the thin-body pattern + verify `IMPORT` resolves (worked example)

This task establishes the exact transform and **confirms the import path** before the others copy it. `reset.html` is the simplest template.

**Files:**
- Modify: `email/reset.html`

**Interfaces:**
- Consumes from Tasks 1–2: `emails/partials/header.html`, `emails/partials/footer.html`.
- Produces: the canonical `IMPORT header → preheader → body → IMPORT footer` shape that Tasks 6–9 replicate. The preheader pattern and the `<!-- preheader -->` marker comment (asserted by Task 4's script) are defined here.

- [ ] **Step 1: Replace the entire `reset.html` with the thin body**

Replace the full contents of `email/reset.html` (all 446 lines) with:

```html
<!-- IMPORT emails/partials/header.html -->
<!-- preheader -->
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">[[email:reset.preheader]]</div>
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<!-- Email Body : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
<tr>
<td bgcolor="#fbf7ef">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
<tr>
<td style="padding: 40px 40px 6px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<h1 style="margin: 0; font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 24px; line-height: 27px; color: #1a1418; font-weight: normal;">[[email:greeting-no-name]]</h1>
</td>
</tr>
<tr>
<td style="padding: 0px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<h1 style="margin: 0 0 10px 0; font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 21px; color: #9a9086; font-weight: normal;">[[email:reset.text1]]</h1>
</td>
</tr>
<tr>
<td style="padding: 20px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<p style="margin: 0">[[email:reset.text2]]</p>
</td>
</tr>
<tr>
<td style="padding: 32px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<!-- Button : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto">
<tr>
<td style="border-radius: 3px; background: #2a1222; text-align: center;" class="button-td">
<a href="{reset_link}" style="background: #2a1222; border: 15px solid #2a1222; border-color: #c2a35a; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a">
<span style="color: #f4ecd8" class="button-link">[[email:reset.cta]] &rarr;</span>
</a>
</td>
</tr>
</table>
<!-- Button : END -->
</td>
</tr>
</table>
</td>
</tr>
</table>
<!-- Email Body : END -->
<!-- IMPORT emails/partials/footer.html -->
```

- [ ] **Step 2: Build NodeBB and confirm the import path resolves**

From the NodeBB root where this theme is installed:

Run: `./nodebb build`
Expected: build completes with no template/IMPORT error. If it errors with an unresolved import, retry the import lines with `.tpl`:
`<!-- IMPORT emails/partials/header.tpl -->` / `footer.tpl`, rebuild, and **use whichever extension resolves** for every subsequent template. Record the working form in a one-line note at the top of `email/README.md`.

> If neither extension resolves (import genuinely unsupported for theme emails — not expected, core uses it): fall back to self-contained templates and delete the dead partials. Stop and raise this with the user before proceeding — it changes the whole plan.

- [ ] **Step 3: Send a test reset email and eyeball it**

ACP → Settings → Email → "Send test email" won't trigger `reset`; instead trigger a real password reset for a test account, or temporarily point the test button at `reset`. Confirm: dark letterhead renders, plum button with gold border and readable parchment text, gold hairline above footer, preheader text shows in the inbox list, body card is cream not white.

- [ ] **Step 4: Commit**

```bash
git add email/reset.html email/README.md
git commit -m "feat(email): convert reset.html to shared-partial thin body + preheader"
```

---

### Task 4: Regression guard script (dependency-free)

Cheap catch for future drift, and the **gate** for Tasks 6–9. No test framework.

**Files:**
- Create: `scripts/check-emails.js`

**Interfaces:**
- Produces: a script that exits non-zero if any `email/*.html` (excluding `partials/`) is missing a header IMPORT, footer IMPORT, or `<!-- preheader -->` marker. Run after every template conversion.

- [x] **Step 1: Write the script**

```js
#!/usr/bin/env node
// ponytail: 30-line structural guard, not a render test. Catches drift, not pixels.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'email');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));

const failures = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const checks = [
    [/IMPORT emails\/partials\/header\.(html|tpl)/, 'missing header IMPORT'],
    [/IMPORT emails\/partials\/footer\.(html|tpl)/, 'missing footer IMPORT'],
    [/<!-- preheader -->/, 'missing preheader marker'],
  ];
  for (const [re, msg] of checks) {
    if (!re.test(src)) failures.push(`${f}: ${msg}`);
  }
}

if (failures.length) {
  console.error('Email template check FAILED:\n' + failures.join('\n'));
  process.exit(1);
}
console.log(`Email template check passed (${files.length} templates).`);
```

- [x] **Step 2: Run it — expect failures for every not-yet-converted template, pass for `reset.html`**

Run: `node scripts/check-emails.js`
Expected: FAIL, listing `welcome.html`, `verify-email.html`, `reset_notify.html`, `registration_accepted.html`, `invitation.html`, `banned.html`, `test.html`, `notification.html`, `digest.html` (reset.html absent from the list). This proves the guard discriminates.

- [x] **Step 3: Commit**

```bash
git add scripts/check-emails.js
git commit -m "test(email): structural regression guard for partial imports + preheader"
```

---

### Task 5: Theme language file for preheader copy

**Files:**
- Create: `languages/en-GB/email.json`
- Modify: `plugin.json`

**Interfaces:**
- Produces: the `[[email:<name>.preheader]]` keys referenced by every template's preheader. Tasks 3, 6–9 reference these.

- [x] **Step 1: Create the language file with one preheader key per template**

```json
{
  "reset.preheader": "Reset your Shadows Over Westgate password",
  "welcome.preheader": "Confirm your email to enter Shadows Over Westgate",
  "verify-email.preheader": "Confirm your new email address",
  "reset_notify.preheader": "Your Shadows Over Westgate password was changed",
  "registration_accepted.preheader": "Your Shadows Over Westgate account is approved",
  "invitation.preheader": "You have been invited to Shadows Over Westgate",
  "banned.preheader": "Your Shadows Over Westgate account status has changed",
  "test.preheader": "Test email from Shadows Over Westgate",
  "notification.preheader": "You have a new notification on Shadows Over Westgate",
  "digest.preheader": "Your Shadows Over Westgate activity digest"
}
```

- [x] **Step 2: Register the languages directory in `plugin.json`**

Add a `"languages"` key alongside the existing `"templates": "templates"` key:

```json
  "templates": "templates",
  "languages": "languages",
```

- [ ] **Step 3: Build and confirm keys resolve (no raw `[[email:reset.preheader]]` in output)**

Run: `./nodebb build` then re-send the `reset` test email.
Expected: build clean; the inbox preview shows "Reset your Shadows Over Westgate password", not the raw key.

Task 5 note: not run from this theme repo; there is no `./nodebb` executable here. JSON syntax was validated locally and `node scripts/check-emails.js` was run.

- [x] **Step 4: Commit**

```bash
git add languages/en-GB/email.json plugin.json
git commit -m "feat(email): add theme language file with preheader copy"
```

---

### Task 6: Convert the six single-column "text + button/link" templates

`welcome.html`, `verify-email.html`, `reset_notify.html`, `registration_accepted.html`, `invitation.html`, `test.html`. These share `reset.html`'s structure; apply the **same transform**, changing only the per-template keys/links below.

**Files:**
- Modify: `email/welcome.html`, `email/verify-email.html`, `email/reset_notify.html`, `email/registration_accepted.html`, `email/invitation.html`, `email/test.html`

**Interfaces:**
- Consumes: the Task 3 thin-body shape (copy it), Task 5 preheader keys.
- Produces: six converted templates that pass `scripts/check-emails.js`.

**The transform (apply to each file):**
1. Delete everything from `<!doctype html>` through `<!-- Email Header : END -->` and replace with `<!-- IMPORT emails/partials/header.html -->` + the two-line preheader block from Task 3, using that template's preheader key (e.g. `[[email:welcome.preheader]]`).
2. Keep only the `<!-- Email Body : BEGIN -->` … `<!-- Email Body : END -->` table.
3. Delete the original footer table and trailing `</div></center></body></html>`/MSO close; replace with `<!-- IMPORT emails/partials/footer.html -->`.
4. Apply the **palette + font find/replace** across the retained body (uniform for all templates):

| Find | Replace |
|------|---------|
| `bgcolor="#ffffff"` | `bgcolor="#fbf7ef"` |
| `color: #333333` (on `<h1>`) | `color: #1a1418` |
| `color: #aaaaaa` | `color: #9a9086` |
| `color: #555555` | `color: #3a3340` |
| `background: #222222` and `border: 15px solid #222222` | `background: #2a1222` / `border: 15px solid #2a1222; border-color: #c2a35a` |
| `color: #ffffff` (button span) | `color: #f4ecd8` |
| any link `color:` default / `#333333` | `color: #a8893f` |
| `-apple-system,…,Segoe UI Symbol` stack on `<h1>` | `Cinzel, Georgia, 'Times New Roman', serif` |
| `-apple-system,…,Segoe UI Symbol` stack elsewhere | `Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif` |

**Per-template specifics** (button/link href and any existing keys are already correct — do not change copy keys):

| File | Preheader key | Button/link href var |
|------|---------------|----------------------|
| `welcome.html` | `welcome.preheader` | confirmation link (existing `{confirm_link}` / as present) |
| `verify-email.html` | `verify-email.preheader` | confirmation link (as present) |
| `reset_notify.html` | `reset_notify.preheader` | none (informational — no button table; skip button rows) |
| `registration_accepted.html` | `registration_accepted.preheader` | `{url}` login link (as present) |
| `invitation.html` | `invitation.preheader` | invite link (existing var, as present) |
| `test.html` | `test.preheader` | none (skip button rows) |

- [x] **Step 1: Convert `welcome.html`** per the transform + its row above.
- [x] **Step 2: Convert `verify-email.html`.**
- [x] **Step 3: Convert `reset_notify.html`** (no button — keep only the text rows).
- [x] **Step 4: Convert `registration_accepted.html`.**
- [x] **Step 5: Convert `invitation.html`.**
- [x] **Step 6: Convert `test.html`** (no button).

- [x] **Step 7: Run the regression guard — expect only `banned`, `notification`, `digest` failing**

Run: `node scripts/check-emails.js`
Expected: FAIL listing exactly `banned.html`, `notification.html`, `digest.html`.

- [x] **Step 8: Build + commit**

```bash
./nodebb build
git add email/welcome.html email/verify-email.html email/reset_notify.html email/registration_accepted.html email/invitation.html email/test.html
git commit -m "feat(email): convert single-column templates to shared partials + brand"
```

---

### Task 7: Convert `banned.html`

Separated because the ban template carries a reason/expiry block, not the standard button.

**Files:**
- Modify: `email/banned.html`

- [x] **Step 1: Read `email/banned.html`** to see its body rows (greeting, ban reason, expiry).

- [x] **Step 2: Apply the Task 6 transform** — IMPORT header + `[[email:banned.preheader]]` preheader + retained body (with the palette/font find/replace) + IMPORT footer. Keep all existing `[[email:ban.*]]` / reason / expiry keys and `{{{ if }}}` conditionals unchanged. Recolor any reason/quote block: card `bgcolor` → `#fbf7ef`, body text → `#3a3340`, any muted text → `#9a9086`.

- [ ] **Step 3: Guard + build**

Run: `node scripts/check-emails.js` → expect only `notification.html`, `digest.html` failing.
Task 7 note: guard ran with only the expected remaining `notification.html` and `digest.html` failures. `./nodebb build` was not run because no executable `./nodebb` / NodeBB root is available in this theme repo.

- [x] **Step 4: Commit**

```bash
git add email/banned.html
git commit -m "feat(email): convert banned.html to shared partials + brand"
```

---

### Task 8: Convert `notification.html` + reskin `post-queue-body.html`

`notification.html` keeps `{body}`. NodeBB's post queue flow renders `post-queue-body.html` server-side into that notification body before the email template renders.

**Files:**
- Modify: `email/notification.html`, `email/partials/post-queue-body.html`

**Interfaces:**
- Consumes: `{{{ if showUnsubscribe }}}` (footer handles it), notification body params (`{notification.bodyLong}` / as present).
- Produces: converted `notification.html` passing the guard; reskinned post-queue partial.

- [x] **Step 1: Reskin `post-queue-body.html`** — add link/text color to its `<a>` and `<p>` tags so it matches the card: links `style="color: #a8893f;"`, body `<p>` `style="color: #3a3340;"`, labels keep `<strong>`. Structure unchanged.

```html
<p><strong>[[post-queue:category]]</strong></p>
<p><a href="{category.url}" style="color: #a8893f;">{category.name}</a></p>
<p>
  <strong
    >{{{ if topic.tid }}}[[post-queue:topic]]{{{ else }}}[[post-queue:title]]{{{
    end }}}</strong
  >
</p>
<p>
  {{{ if topic.url }}}<a href="{topic.url}" style="color: #a8893f;">{topic.title}</a>{{{ else
  }}}{topic.title}{{{ end }}}
</p>
<p><strong>[[post-queue:user]]</strong></p>
<p>
  {{{ if user.url }}}<a href="{user.url}" style="color: #a8893f;">{user.username}</a>{{{ else
  }}}{user.username}{{{ end }}}
</p>
<p style="color: #3a3340;">{content}</p>
```

- [x] **Step 2: Read `email/notification.html`** (lines ~166–417 are the header/body/footer). Note where it renders `{body}`; post-queue content is supplied by NodeBB before template render.

- [x] **Step 3: Apply the Task 6 transform to `notification.html`** — IMPORT header + `[[email:notification.preheader]]` preheader + retained body table (palette/font find/replace) + IMPORT footer. Preserve the `.notification-body` content that renders `{body}`; post-queue content is already rendered into that value by NodeBB before this template runs. Add `style="color: #a8893f;"` to notification body links.

- [ ] **Step 4: Guard + build**

Run: `node scripts/check-emails.js` → expect only `digest.html` failing.
Run: `./nodebb build` → clean.
Task 8 note: guard ran with only the expected remaining `digest.html` failure. `./nodebb build` was not run because no executable `./nodebb` / NodeBB root is available in this theme repo.

- [x] **Step 5: Commit**

```bash
git add email/notification.html email/partials/post-queue-body.html
git commit -m "feat(email): convert notification.html + reskin post-queue partial"
```

---

### Task 9: Convert `digest.html` (preserve all loops)

The largest template — keeps `{{{ each notifications }}}`, `publicRooms`, `topTopics`, `popularTopics` loops and the `digest.title.{interval}` heading.

**Files:**
- Modify: `email/digest.html`

- [x] **Step 1: Replace the head/header (lines ~1–160) with IMPORT header + preheader**

Prepend `<!-- IMPORT emails/partials/header.html -->` + the two-line preheader block using `[[email:digest.preheader]]`, deleting everything through `<!-- Email Header : END -->`.

- [x] **Step 2: Apply the palette/font find/replace across the body and every loop row**

Same find/replace as Task 6, applied to all loop iterations. Specifically:
- card `bgcolor="#ffffff"` → `#fbf7ef`
- greeting `<h1>` `#333333` → `#1a1418`, font → Cinzel stack
- section headings `#aaaaaa` → `#9a9086`, font → Cinzel stack
- list-item link/text `#333333` → body `#3a3340`, links `#a8893f`
- teaser text `#666666` → `#3a3340`; secondary `#aaaaaa` → `#9a9086`
- the `border-bottom: 1px solid #dddddd` separator → `#e2d8c4`
- all `-apple-system,…` stacks → Jost stack (non-`<h1>`), Cinzel stack on `<h1>`

Leave every `{{{ each }}}`, `{{{ if }}}`, `{var}`, `[[email:digest.*]]`, and `{renderDigestAvatar(@value)}` untouched.

- [x] **Step 3: Replace the original footer with IMPORT footer**

Delete the digest's own footer table + trailing `</div></center></body></html>`/MSO close; replace with `<!-- IMPORT emails/partials/footer.html -->`.

- [x] **Step 4: Guard passes for all templates**

Run: `node scripts/check-emails.js`
Expected: PASS (`Email template check passed (10 templates).`).

- [ ] **Step 5: Build + test-send the digest**

Run: `./nodebb build`. Trigger a digest (ACP → manually run digest, or test account). Confirm loops render, headings are serif/gold-muted, separators visible, button-free.

Task 9 note: `node scripts/check-emails.js` passed with `Email template check passed (10 templates).` Lightweight marker checks confirmed the digest loops and `{renderDigestAvatar(@value)}` remain present. `./nodebb build` and digest test-send were not run because no executable `./nodebb` / NodeBB root is available in this standalone theme repo.

- [x] **Step 6: Commit**

```bash
git add email/digest.html
git commit -m "feat(email): convert digest.html to shared partials + brand, loops intact"
```

---

### Task 10: Update `email/README.md`

**Files:**
- Modify: `email/README.md`

- [x] **Step 1: Fix the Partials section** — it currently says the partials are "included by the templates above" (was false, now true). State that every non-partial template `IMPORT`s `header.html` first and `footer.html` last, using the form confirmed in Task 3 (`emails/partials/header.html`), and document `post-queue-body.html` as the queued-post notification body fragment without claiming the current `notification.html` imports it.

- [x] **Step 2: Add a brand/constraint note to Editing notes** — add a bullet: brand colors are **literal inline hex** (Outlook/Gmail strip `var()`); `scss/westgate/_tokens.scss` holds the source values but cannot be referenced at runtime. Note the dark letterhead band + light cream card pattern, and that preheader copy lives in `languages/en-GB/email.json`.

- [x] **Step 3: Commit**

```bash
git add email/README.md
git commit -m "docs(email): document IMPORT structure + literal-hex brand constraint"
```

---

### Task 11: Out-of-scope deliverability note for ops

The reskin is not an anti-spam fix; record what templates can't touch so it isn't mistaken for one.

**Files:**
- Modify: `email/README.md` (append a short "Deliverability — out of scope (ops)" section)

- [x] **Step 1: Append the ops section**

```markdown
## Deliverability — out of scope for these templates (ops/mail layer)

Templates cannot affect these; they are flagged so the brand reskin is not
mistaken for a complete anti-spam fix:

- **SPF / DKIM / DMARC** records + alignment for the sending domain.
- A From-address on a domain with sending reputation (not a bare/shared host).
- `List-Unsubscribe` / `List-Unsubscribe-Post` (one-click) **headers** — set by
  the mail layer, distinct from the in-body unsubscribe link the footer renders.
- A dedicated sending domain/subdomain and IP warm-up if volume grows.
```

- [x] **Step 2: Commit**

```bash
git add email/README.md
git commit -m "docs(email): flag out-of-scope deliverability work for ops"
```

---

### Task 12: Final cross-client verification pass

**Files:** none (verification only).

- [ ] **Step 1: Build clean + guard green**

Run: `./nodebb build` (clean) and `node scripts/check-emails.js` (`passed (10 templates)`).

- [ ] **Step 2: Test-send every template type** via ACP "Send test email" and real triggers (reset, verify, digest).

- [ ] **Step 3: Eyeball across clients** — Gmail web, Outlook desktop (MSO), Apple Mail, and one dark-mode client (iOS Mail dark or Gmail dark). For each confirm: letterhead band renders with logo/hairline; plum button has gold border + readable parchment text; no broken Outlook layout; preheader shows in the inbox list; dark mode does not destroy legibility (cream card + dark band should survive auto-inversion better than a full-dark design).

- [ ] **Step 4: If issues found**, fix inline and re-run Steps 1–3; otherwise the branch is ready for the finishing-a-development-branch skill.

Task 12 note: `node scripts/check-emails.js` passed with `Email template check passed (10 templates).` `./nodebb` is not executable in this standalone theme repo, so `./nodebb build` was unavailable and is not marked complete. ACP test-sends, real trigger sends, and Gmail/Outlook/Apple Mail/dark-mode eyeball checks were not run because this repo has no NodeBB runtime/client access.

---

## Self-review

**Spec coverage:**
- Reskin all 10 to brand (light treatment) → Tasks 1–3, 6–9. ✓
- Eliminate duplication via real `IMPORT` partials → Tasks 1–3. ✓
- Hygiene: non-empty `<title>` → Task 1 (`{site_title}`, deviation flagged); preheader → Tasks 3, 5, 6–9. ✓
- No hardcoded copy / new keys in language files → Task 5. ✓
- Document deliverability templates can't fix → Task 11. ✓
- Letterhead band, palette table, font stacks → Task 1 + Global Constraints. ✓
- Import-path verification → Task 3 Step 2. ✓
- `notification` + `post-queue-body`, `digest` loops preserved → Tasks 8–9. ✓
- README correction → Task 10. ✓
- Optional regression guard → Task 4. ✓
- Implementation order matches spec's suggested order. ✓

**Placeholder scan:** Color/font changes given as a concrete find/replace table; `header.html`/`footer.html`/`reset.html`/`post-queue-body.html` given as complete markup; per-template specifics tabulated. Tasks 6–9 reference complete bodies that already exist in the repo (transform, not author-from-scratch) — the engineer reads the existing file and applies the listed mechanical changes. No "TBD"/"handle edge cases".

**Type/name consistency:** Import paths (`emails/partials/header.html`/`footer.html`), preheader keys (`[[email:<name>.preheader]]`), the `<!-- preheader -->` marker, and the guard script's regexes all agree across tasks. `post-queue-body.html` is rendered by NodeBB's post queue flow into notification body content.
