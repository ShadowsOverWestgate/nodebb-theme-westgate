# Global Topbar Design Spec

Date: 2026-06-26
Status: draft, goal definition

## Goal

Complete the Westgate global topbar as the theme-owned replacement for
Harmony's NodeBB sidebars.

The current `custom_pages/westgate-pages/top-bar.html` and
`custom_pages/westgate-pages/topbar-custom.js` files are reference material from
the design extraction. They show the intended visual language and rough
interaction shape, but they are not production behavior. The finished topbar
belongs in this theme as global chrome, not as ACP Custom Content pasted onto
individual pages.

The topbar must make website pages, wiki pages, and forum pages feel like one
Westgate application while preserving real NodeBB account, navigation, search,
notification, chat, draft, and status behavior.

## Evidence Checked

- `docs/superpowers/specs/2026-06-26-website-pages-design.md` already defines
  the topbar as the owner of Harmony sidebar functions.
- `custom_pages/westgate-pages/THEME-INTEGRATION.md` recommends a
  `templates/partials/header/topbar.tpl` theme partial and reuse of Harmony live
  components.
- `custom_pages/westgate-pages/top-bar.html` is a visual/reference draft with
  placeholder avatar, notification, chat, and draft data.
- `custom_pages/westgate-pages/topbar-custom.js` is a paste-ready preview
  controller for ACP Custom JavaScript, with comments noting where live NodeBB
  behavior still needs to replace preview behavior.
- `templates/header.tpl` currently imports `partials/sidebar-left.tpl` and lays
  out `#panel` beside the sidebar.
- Harmony still supplies the inherited right sidebar through its footer unless
  Westgate overrides that path.
- `theme.scss` is imports-only and already imports focused files from
  `scss/westgate/`.

## Required Behavior

The Westgate topbar replaces the NodeBB sidebar experience. It must own every
user-facing button or action that currently lives in Harmony's desktop sidebars
or duplicate mobile bars:

- Brand/home entry.
- ACP Navigation links and active states.
- Forum/category entry points.
- Search, including NodeBB quick search behavior.
- Notifications, with real unread counts and notification list behavior.
- Chats when chat is available to the user.
- Drafts, with real draft count, open, and delete behavior.
- User avatar menu using the logged-in user's real avatar.
- User status controls that set the user's actual NodeBB status, including
  online, away, and invisible when supported by the running NodeBB version.
- Profile, bookmarks, edit profile, settings, moderator/admin affordances, and
  logout.
- Guest login and register actions.
- Mobile equivalents for the same primary actions.

The topbar is not allowed to pretend that live data exists. If the current user
has no notifications, chats, or drafts, the topbar must show the real empty or
hidden state. Counts must come from NodeBB data, not hard-coded badge text.

## Visual Direction

Use the draft topbar as a visual target, not as final source. The production
topbar should keep the black velvet, near-black plum, muted gold, restrained
contrast, and small red state detail direction already established by the
Westgate theme.

All substantive styling belongs in a focused SCSS partial such as
`scss/westgate/_topbar.scss`, imported from `theme.scss`. The partial should use
existing `--wg-*` tokens where possible and should not introduce a second visual
system.

Harmony sidebar buttons should be restyled as topbar controls. They should feel
native to the topbar, not like sidebar markup awkwardly placed in a horizontal
row.

## Post-Review Refinements

Screenshots captured on 2026-06-26 show the topbar working visually, but with
three refinements needed before the topbar feels fully integrated.

Drawer and dropdown menus must be opaque. The current translucent treatment lets
page content show through account, forum, and drawer surfaces, which weakens
readability and makes the controls feel less deliberate. Keep the near-black and
plum surface direction, but use an opaque panel base; decorative highlights,
borders, and shadows may remain subtle.

The brand lockup should be simplified to one identity line: the circular mark
followed by `SHADOWS OVER WESTGATE`. Do not repeat `Shadows Over Westgate` as a
subtitle in the topbar, and do not allow the primary brand name to truncate in
normal desktop layouts. Longer project context such as `An NWN:EE Roleplaying
Experience` belongs on larger page surfaces, not in the dense global chrome.

The custom right-side `Forums` dropdown is redundant when ACP Navigation already
contains a Forums entry. Prefer one seamless navigation model: remove the
separate desktop Forums dropdown and let forum entry points live in ACP
Navigation or in the mobile drawer as direct links. If ACP-managed navigation
needs to drop text bubbles or helper labels to make this feel clean, that is
acceptable.

## Implementation Direction

The production implementation should be theme-first:

- Add a focused topbar partial, likely
  `templates/partials/header/topbar.tpl`.
- Mount the topbar from `templates/header.tpl`.
- Remove the global Harmony left sidebar from the main layout.
- Override the Harmony footer path if needed so the right sidebar no longer
  renders as a separate global sidebar.
- Let `#panel` become the normal main content column under the topbar.
- Keep `theme.scss` imports-only.
- Put topbar CSS under `scss/westgate/`.
- Put topbar client behavior in the theme client bundle unless an ACP bridge is
  explicitly chosen as a temporary deployment step.

Where possible, reuse Harmony or NodeBB partials and component hooks for live
behavior instead of rebuilding dynamic systems. Important hooks include search,
notifications, chat, drafts, user controls, and status controls. If preserving
Harmony selectors would produce brittle markup, update the theme JavaScript
intentionally and document the changed selector contract.

## Reference Files

The reference files may be copied from selectively, but they should not be
treated as production source:

- `custom_pages/westgate-pages/top-bar.html`: visual structure, states, and
  scoped CSS ideas.
- `custom_pages/westgate-pages/topbar-custom.js`: preview interaction patterns
  for menus, search expansion, mobile drawer, and escape/outside-click handling.
- `custom_pages/Westgate Top Bar.dc.html`: original visual design export.

Preview-only behavior to remove or replace includes hard-coded notifications,
hard-coded chats, hard-coded drafts, fake status persistence in `localStorage`,
demo member/guest switching, and placeholder avatar rendering.

## Risks

Harmony JavaScript currently assumes sidebar-oriented selectors for search,
drafts, notification/chat counts, sidebar toggles, tooltips, and layout offsets.
The topbar implementation must account for those assumptions directly. A
visually correct topbar is not complete if NodeBB's live sidebar behavior stops
working.

The mobile experience also needs an explicit decision during implementation:
once the Westgate topbar drawer owns the same actions, Harmony's inherited
mobile bars should not duplicate those controls.

## Acceptance Criteria

- No Harmony left or right global sidebar is visible on normal Westgate pages.
- All former sidebar actions remain reachable from the topbar or its mobile
  drawer.
- Logged-out users see real login/register actions.
- Logged-in users see their real avatar and the correct account menu.
- Notifications, chats, and drafts use real NodeBB counts and lists.
- Empty notification, chat, and draft states are real states, not mock rows.
- User status buttons call the real NodeBB status behavior and reflect the
  resulting state.
- Search uses NodeBB search behavior rather than a visual-only input.
- The topbar appears consistently on Custom Pages, wiki routes, and normal forum
  routes.
- Drawer, dropdown, account, and notification surfaces are opaque enough that
  underlying page content does not show through.
- The brand appears once as the mark plus `SHADOWS OVER WESTGATE`; no duplicate
  topbar subtitle repeats the site name.
- Desktop navigation has one Forums entry model, not both ACP Navigation Forums
  and a separate right-side Forums dropdown.
- The topbar styling follows Westgate theme tokens and lives under
  `scss/westgate/`.
- The implementation remains a child theme over `nodebb-theme-harmony`.

## Decisions For Implementation Planning

- Whether to temporarily ship any part of the topbar through ACP Custom Content
  for visual validation before moving it fully into the theme.
- Whether the skin switcher remains exposed, and if so where it belongs in the
  topbar or account menu.
- Whether legacy `sidebar-footer` widget content is deprecated, moved to a real
  footer, or exposed through another intentional surface.
- Which Harmony selectors are preserved for compatibility and which are replaced
  with Westgate topbar selectors.
