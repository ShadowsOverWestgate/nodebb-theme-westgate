# Global Topbar Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the post-review global topbar refinements from `docs/superpowers/specs/2026-06-26-global-topbar-design.md`.

**Architecture:** Keep the implementation inside the existing NodeBB child theme topbar partial, topbar SCSS partial, and theme client bundle. Extend the existing static topbar contract test only for durable behavior and public contracts, without adding a new test harness.

**Tech Stack:** Node.js built-in test runner, NodeBB templates, SCSS.

## Global Constraints

- Keep this as a child theme over `nodebb-theme-harmony`.
- Keep `theme.scss` imports-only.
- Put substantive Westgate-specific topbar CSS under `scss/westgate/`.
- Preserve real NodeBB/Harmony live partials and component hooks for search, notifications, chat, drafts, user menu, and ACP navigation.
- Do not commit secrets or token material.

---

### Task 1: Topbar Contract Refinements

**Files:**
- Modify: `tests/global-topbar-contract.test.js`
- Modify: `templates/partials/header/topbar.tpl`
- Modify: `scss/westgate/_topbar.scss`
- Modify: `public/client.js`

**Interfaces:**
- Consumes: Existing `topbar.tpl` markup, `_topbar.scss` selectors, and `initWestgateTopbar`.
- Produces: A single desktop navigation model, a one-line brand lockup, and opaque topbar menu surfaces.

- [ ] **Step 1: Write the failing test**

Add static contract assertions to `tests/global-topbar-contract.test.js` that check durable behavior rather than incidental wording or implementation details:

```js
assertMatches(
	topbar,
	/<a\b(?=[^>]*class="[^"]*\bwg-topbar__brand\b[^"]*")(?=[^>]*aria-label="{config\.siteTitle}")/,
	'Topbar brand link should use the configured site title as its accessible name'
);
assertMatches(
	topbar,
	/<span\b(?=[^>]*class="[^"]*\bwg-topbar__brand-name\b[^"]*")[^>]*>{config\.siteTitle}<\/span>/,
	'Topbar brand text should render the configured site title'
);
assertExcludes(topbar, 'data-wg-menu', 'Topbar should rely on Bootstrap and NodeBB navigation instead of custom menu triggers');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/global-topbar-contract.test.js`

Expected: FAIL because the current topbar still hard-codes the brand label and visible brand text.

- [ ] **Step 3: Write minimal implementation**

Change the template so the brand is only the mark plus the configured site title, remove the custom desktop Forums dropdown block, and keep mobile drawer forum entry links. Change `_topbar.scss` so dropdown/drawer surfaces use an opaque panel base, remove custom Forums panel rules, and remove desktop brand ellipsis. Remove now-unused custom topbar panel toggle handling from `public/client.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/global-topbar-contract.test.js`

Expected: PASS.

- [ ] **Step 5: Run the full available test set**

Run: `node --test tests/*.test.js`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/plans/2026-06-26-global-topbar-refinements.md tests/global-topbar-contract.test.js templates/partials/header/topbar.tpl scss/westgate/_topbar.scss public/client.js
git commit -m "fix: refine global topbar integration"
```
