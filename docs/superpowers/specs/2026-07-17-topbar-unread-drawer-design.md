# Topbar Unread Drawer — Design

Date: 2026-07-17

## Goal

Add an "Unread" item to the topbar utilities, next to notifications. It shows
a live badge with the number of unread topics. Clicking it opens a dropdown
that lists recent unread topics.

## Template

New partial `templates/partials/header/unread-drawer.tpl`, imported in
`templates/partials/header/topbar.tpl` just before the notifications `<li>`
(logged-in menu only). It follows the structure of the neighboring utility
dropdowns:

- Toggle button: `fa-inbox` icon, `title="[[unread:title]]"`, badge
  `<span component="unread/count" class="badge ... {{{ if !unreadCount.topic }}}hidden{{{ end }}}">{unreadCount.topic}</span>`.
  NodeBB core sends `unreadCount.topic` in header data and live-updates any
  `component="unread/count"` badge over sockets, so the count needs no theme JS.
- Dropdown body: an empty `<ul class="dropdown-menu wg-topbar__dropdown">`
  shell with a loading placeholder item.

## Client JS

Small addition to `public/client.js` (inside the existing topbar init):

- On `show.bs.dropdown` for the unread item, call `api.get('/unread', ...)`
  (same data the `/unread` page uses).
- Render up to 10 topics as plain links: topic title, category name,
  unread-post count. Footer link "See all unread" → `/unread`.
- Re-fetch on every open (always fresh, no caching). Errors show a short
  "could not load" item — never a blank menu.

Skipped: mark-all-read, pagination, watched-filter tabs — the `/unread` page
already has all of those.

## SCSS

Reuse the existing `.wg-topbar__dropdown` styles. Only a few lines for the
topic rows (truncation, spacing).

## Mobile drawer

Add a plain "Unread" link with the same `component="unread/count"` badge to
the burger-drawer actions block in `topbar.tpl`, matching the existing
notifications/chats rows.

## Accessibility

- Toggle is a real `<a role="button">`/dropdown like the other utility items,
  with `aria-label` and Bootstrap's dropdown keyboard handling.
- Badge count also appears in the accessible name (matching how the
  notifications item does it).

## Verification

Manual + Playwright checks run against the **sow-nodebb dev container**
(`../sow-nodebb`):

1. In `../sow-nodebb`, set `.env` for theme work
   (`PLUGIN_PATH=../sow-nodebb-theme`, `PLUGIN_ID=nodebb-theme-westgate`,
   `EXTRA_PLUGINS=nodebb-plugin-westgate-wiki`), then `make dev` →
   forum at http://localhost:4567.
2. After template/JS/SCSS edits: `make dev-build` in `../sow-nodebb`, then
   reload the browser.
3. Playwright (playwright-skill / MCP browser tools) against
   http://localhost:4567: log in, confirm the Unread button exists next to
   notifications, badge shows the unread count, opening the dropdown lists
   unread topics with working links, and the footer link lands on `/unread`.
   Also check the mobile burger drawer shows the Unread row.

Existing template contract test `tests/global-topbar-contract.test.js` is
updated if it asserts the utility-list structure.
