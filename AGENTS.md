# AGENTS.md

## Project

This repository is `nodebb-theme-westgate`, a NodeBB theme for the Shadows Over Westgate forum and website.

It is forked from `nodebb-theme-quickstart` and should remain a small, focused NodeBB child theme rather than a full replacement for NodeBB or Harmony.

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
