# AGENTS.md

## Project

This repository is `nodebb-theme-westgate`, a NodeBB theme for the Shadows Over Westgate forum and website.

It is forked from `nodebb-theme-quickstart` and should remain a small, focused NodeBB child theme rather than a full replacement for NodeBB or Harmony.

Shadows Over Westgate (SoW) is a Neverwinter Nights persistent-world project.
Its community forum and wiki run on NodeBB (a Node.js forum platform). This
theme is the visual layer for that forum. It is consumed by sow-nodebb
(https://git.westgate.pw/ShadowsOverWestgate/sow-nodebb), which pins this repo
by exact commit in `plugins.lock` and compiles it into the production forum
image at image-build time. Switching themes in the Admin Control Panel does
nothing in production; only the theme pinned and activated in sow-nodebb is
compiled in.

## How It Is Used

There is no build step in this repo; NodeBB compiles the SCSS. To see changes
live, use the `docker-compose.dev.yml` dev loop in sow-nodebb (see How To Test
below). Release: merge here, re-pin the commit SHA in sow-nodebb's
`plugins.lock`, rebuild and publish the image there.

## How To Test

Fast checks, no forum needed:

- `node tests/<name>.test.js` — contract tests (topbar, footer, icons, wiki
  tables). There is no `npm test` script; run each file directly.
- `node scripts/check-emails.js` — when working on email templates.

Live visual check against a real forum, using the sibling checkout at
`../sow-nodebb`:

1. `cd ../sow-nodebb && cp .env.example .env` (if not done already), then set
   `PLUGIN_PATH=../sow-nodebb-theme` and `PLUGIN_ID=nodebb-theme-westgate` so
   the compose file mounts this working tree.
2. `docker compose -f docker-compose.dev.yml up`
3. Open `http://localhost:4567` (or `HTTP_PORT` from `.env`). Dev admin login:
   `admin` / `Admin12345!` (defaults; dev-only).
4. If Westgate is not the active theme yet, switch to it once in
   ACP → Appearance → Themes; the choice persists in the redis volume.
5. NodeBB compiles this theme's SCSS and templates at build time, so a browser
   reload alone is not enough after editing them. Rebuild, then reload:
   `docker compose -f docker-compose.dev.yml exec nodebb ./nodebb build --config=/opt/config/config.json`
   (restart the `nodebb` service if changes still don't show).
6. Full reset (also required after changing `PLUGIN_*` in `.env`):
   `docker compose -f docker-compose.dev.yml down -v`

Agents with browser tooling (e.g. Playwright) should point it at
`http://localhost:4567` to load pages, take screenshots, and verify theme
changes on the live forum.

## Design Context

- `PRODUCT.md`: strategic design context — register, users, purpose,
  positioning, brand personality, anti-references, design principles,
  accessibility target (WCAG AA). Read it before design work.
- `DESIGN.md`: the visual system — palette ("The Velvet Ledger"), typography,
  elevation, components, and do's/don'ts, with machine-readable tokens in its
  frontmatter and `.impeccable/design.json`.

## Guidance Map

- `README.md` and `GAME_ICONS.md`: repo intro and icon usage notes.
- `theme.json`, `plugin.json`: theme metadata, hooks, static dirs.
- `theme.scss` (imports-only) and `scss/`: all styling; `scss/overrides.scss`
  holds pre-Bootstrap variable overrides.
- `templates/`: Harmony template overrides (same relative paths as Harmony).
- `custom_pages/`: source content and mockups for custom-pages surfaces.
- `lib/`, `public/client.js`: server hooks and client behavior.
- `tests/`: contract tests for topbar, footer, icons, and wiki table
  rendering. Plain assert scripts: run each with
  `node tests/<name>.test.js`; there is no `npm test` script.

## Theme Direction

The visual target is black velvet silk, darkness, vampirism, decadence, and decay.

Use this palette direction:

- Plum and near-black as the dominant base.
- Muted gold for accents, borders, small highlights, and important affordances.
- Red only sparingly, preferably as a subtle detail or state color.
- Avoid bright, playful, clinical, or flat SaaS-style treatment.
- Favor depth, restraint, texture, and rich contrast over loud ornament.

## NodeBB Theme Rules

Follow the current NodeBB theme model:

- `theme.json` defines theme metadata and the base theme.
- This project uses `baseTheme: "nodebb-theme-harmony"`.
- Keep this as a child theme unless the user explicitly asks for a larger rewrite.
- `theme.scss` is the theme entry point and must stay imports-only.
- Do not append substantive CSS/SCSS directly to `theme.scss`.
- Do not add new root-level theme styling files.
- Put substantive Westgate-specific style overrides under focused files in `scss/`.
- Keep `scss/overrides.scss` focused on Bootstrap/Harmony variable overrides that must load before Bootstrap.
- Template overrides belong under `templates/` and must preserve the same relative path as the Harmony template they replace.
- Do not copy or redefine Harmony templates unless an actual override is needed.
- If a template does not exist here, NodeBB inherits it from the configured base theme.
- In the Westgate topbar, notification, chat, draft, and navigation count bubbles must honor NodeBB/Harmony's `hidden` class and only display when there is an actual count to check.

NodeBB theme documentation: https://docs.nodebb.org/development/themes/

## Current Files Of Interest

- `theme.json`: theme metadata and `baseTheme`.
- `plugin.json`: hooks, scripts, modules, template path, and static dirs.
- `theme.scss`: NodeBB SCSS entry point.
- `scss/overrides.scss`: current Westgate override layer.
- `lib/theme.js` and `lib/controllers.js`: server-side theme hooks/controllers.
- `public/client.js`: client-side theme behavior.
- `templates/`: local template overrides and admin templates.

## Working Practices

- Keep edits scoped to the theme package unless the task explicitly names the NodeBB install.
- Prefer existing NodeBB, Harmony, Bootstrap, and local theme patterns over introducing new frameworks.
- Keep selectors maintainable and avoid broad global overrides unless they are intentional theme-wide tokens or resets.
- Avoid unrelated formatting churn.
- Before overriding a template, inspect the corresponding Harmony template and copy only what is necessary.
- Preserve accessibility: readable contrast, visible focus states, usable hover/active states, and no text hidden purely for visual effect unless there is an accessible alternative.

## Tests

Tests must survive harmless changes to constants, defaults, wording, ordering, fixture data, and internal implementation details. A test that fails merely because a basic value changed is usually a bad test. Only assert exact values when the value is part of a documented public contract, external protocol, compatibility requirement, security rule, migration, or business rule.
