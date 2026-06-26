# Westgate Website Pages Design Spec

Date: 2026-06-26
Status: draft, investigation only

## Goal

Build the public website pages for Shadows Over Westgate inside NodeBB. The site
uses NodeBB as the application platform, the Custom Pages plugin for website
routes/pages, the Westgate theme for shared visual language and global chrome,
and local plugins where Custom Pages needs dynamic data or behavior.

The site should feel like one Westgate experience rather than a forum with
separate pasted pages. The visual target remains black velvet, near-black plum,
muted gold, restraint, decay, and rich contrast. Red is reserved for state or
danger details. Color changes should happen through existing `--wg-*` theme
tokens where possible.

The custom pages to design are:

- Home
- Gallery
- News
- Blog / Developer Blog
- Recruitment

Everything built for these pages belongs under a tracked `custom/` folder.
Everything currently in `custom_pages/` is reference material from the design
extraction and should be pulled from selectively, not treated as production
source.

The major structural goal is that Harmony's left and right sidebar functions are
owned by a global Westgate topbar. Website pages, wiki pages, and forum pages
should share the same navigation, account actions, search, notifications, chat,
drafts, and authentication entry points.

## Evidence Checked

- `theme.json` declares `baseTheme: "nodebb-theme-harmony"`.
- `theme.scss` imports Harmony first, then focused Westgate partials under
  `scss/westgate/`.
- `templates/header.tpl` currently matches the Harmony layout pattern: a
  `layout-container`, `partials/sidebar-left.tpl`, `#panel`, and
  `partials/header/brand.tpl`.
- Harmony's `footer.tpl` imports `partials/sidebar-right.tpl`.
- Harmony's sidebar partials under
  `/home/vicky/Repositories/nodebb-theme-harmony/templates/partials/sidebar/`
  own the live controls for navigation, user menu, search, notifications, chat,
  and drafts.
- Harmony's `public/harmony.js` binds behavior to sidebar-oriented selectors,
  especially `[component="sidebar/search"]`, `[component="sidebar/drafts"]`,
  `[component="sidebar/toggle"]`, `nav.sidebar [component="notifications/count"]`,
  and `nav.sidebar [component="chat/count"]`.
- The wiki plugin at
  `/home/vicky/Projects/westgate/repositories/migration/sow-nodebb-plugin-wiki`
  is a NodeBB plugin that treats selected categories as wiki namespaces and
  topics as wiki pages. Its README says the active theme supplies brand colors,
  typography, and panel chrome through CSS custom properties.
- `custom_pages/` contains raw Claude Design exports, screenshots, preview
  harnesses, and cleaned paste-ready modules.
- `custom_pages/westgate-pages/THEME-INTEGRATION.md` already sketches a theme
  integration path for News, Dev Blog, Gallery, and Topbar.

## Artifact Inventory

### Raw Claude Design Exports

These are reference artifacts, not direct production inputs:

- `custom_pages/Westgate.dc.html`
- `custom_pages/Westgate v1 (approx palette).dc.html`
- `custom_pages/Westgate Top Bar.dc.html`
- `custom_pages/support.js`
- `custom_pages/image-slot.js`

The `.dc.html` files use Claude Design/Omelette style markup such as `<x-dc>`,
`<sc-if>`, inline preview handlers, and runtime helpers. They establish layout,
states, palette exploration, and interaction ideas. They should not be pasted
directly into NodeBB Custom Pages as production page content.

### Reference Custom Pages-Compatible Page Modules

These are cleaned design extraction files that may be used as references while
building tracked production files under `custom/`:

- `custom_pages/westgate-pages/home.html`
- `custom_pages/westgate-pages/join-the-team.html`
- `custom_pages/westgate-pages/top-bar.html`
- `custom_pages/westgate-pages/topbar-custom.js`

`home.html` and `join-the-team.html` are useful because they are already pure
HTML/CSS widgets scoped under `.wg-page`. The production versions should be
rebuilt as `custom/pages/home.html` and `custom/pages/recruitment.html`, with
content and links adjusted for the final routes.

`top-bar.html` is a faithful preview/reference for the global topbar, but it is
not the preferred long-term deployment form. The live topbar belongs in the
theme as a global partial and stylesheet, with client behavior in the theme
client bundle or ACP custom JavaScript only as a temporary bridge.

### Preview Harnesses And Screenshots

Preview harnesses:

- `custom_pages/westgate-pages/_preview-home.html`
- `custom_pages/westgate-pages/_preview-join.html`
- `custom_pages/westgate-pages/_preview-topbar.html`

Screenshots under `custom_pages/screenshots/` capture the visual target and
states. They are useful for QA and comparison, but should not be treated as
source assets for the live site unless explicitly selected.

## Repository Ownership Model

### `custom/` Is The Production Custom Pages Source

All custom-page artifacts we build should live under `custom/` in this
repository. The first layout should be:

```text
custom/
  pages/
    home.html
    gallery.html
    news.html
    blog.html
    recruitment.html
  shared/
  assets/
```

The `custom/pages/*.html` files are the source files intended to be installed
through NodeBB Custom Pages and Widgets. They may start as paste-ready HTML/CSS,
but they should be treated as source we own, not generated exports.

`custom/shared/` is reserved for shared snippets, notes, or small page fragments
that are intentionally reused across the five pages. It should stay small; if a
shared concern becomes real application behavior, move it into the theme or a
plugin instead.

`custom/assets/` is reserved for manifest notes and selected source assets for
custom-page use. It should not become a dumping ground for generated screenshots
or raw uploads. Actual public media should normally be uploaded through NodeBB or
served by the owning plugin/theme static directory.

### `custom_pages/` Is Reference Only

`custom_pages/` is an extraction/reference folder. It may contain Claude Design
exports, preview harnesses, uploads, screenshots, and exploratory files.

Rules:

- Do not install files directly from `custom_pages/` without first moving or
  rewriting the relevant element into `custom/`.
- Do not treat `.dc.html` files as production source.
- Do not track generated previews/screenshots as production assets unless they
  are explicitly chosen as QA references.
- When a useful element is pulled from `custom_pages/`, document that provenance
  in the relevant `custom/pages/*.html` comment or in this spec.

### Theme Owns Shared Visual Language

The theme remains responsible for the design system and global chrome:

- `--wg-*` design tokens
- fonts
- panel, button, form, card, prose, and widget styling
- topbar
- forum page styling
- wiki parity hooks through `--wiki-*` variables and shared classes

Custom pages should consume the theme's tokens and classes. They should not fork
the palette or create a second visual system.

### Plugins Own Dynamic Behavior When Custom Pages Is Not Enough

NodeBB should do everything, but not every page can be static HTML.

If Custom Pages cannot server-render or safely fetch the data a page needs, a
small local NodeBB plugin should provide the data/API/view-model layer while the
page remains a Custom Pages route. This applies especially to:

- News from forum category `1`
- Blog from forum category `84`
- Gallery if it needs a special upload directory, moderation flow, or asset API
- Future recruitment applications, because no application plugin exists yet

The rule is: Custom Pages owns the website route and page composition; forum
topics/categories remain canonical content where appropriate; plugins may expose
normalized data so the page does not look or behave like a raw forum view.

## Page Ownership

### Static Custom Pages

Use Custom Pages and widgets directly for pages whose content is mostly
editorial and does not require live NodeBB data:

- Home
- Recruitment

Rules:

- Scope page styles under `.wg-page` or a more specific page root such as
  `.wg-home` or `.wg-recruit`.
- Use existing `--wg-*` CSS variables for fonts, color, borders, shadows, and
  panels.
- Keep inline JavaScript out of static page widgets unless there is a strong
  reason. The current reference Home and Recruitment pages require no
  JavaScript.
- Treat placeholder upload paths such as `/assets/uploads/westgate/...` as
  install-time inputs.
- Leave per-page sidebar widget areas empty unless a page explicitly needs a
  sidebar module.

### Dynamic Custom Pages

Use Custom Pages plus plugin-provided data for pages that need live forum or
asset data:

- News
- Blog / Developer Blog
- Gallery

Rules:

- Custom Pages owns the public route.
- The page should present as a website page, not a category or topic template.
- The underlying NodeBB source should remain available for permissions,
  moderation, authorship, search, and discussion behavior.
- Data should be normalized before rendering: title, slug, category, author,
  date, teaser, body, optional banner image, and canonical discussion link.
- Forum affordances should be hidden from the main website presentation unless
  they are intentionally exposed as secondary actions.

### Forum And Wiki Parity

Forums and the wiki are not separate visual products. They must stay in parity
with custom pages:

- Same topbar and global navigation.
- Same `--wg-*` palette, typography, border, panel, and focus treatment.
- Same prose vocabulary for article-like content where practical.
- Same button and card language.
- Same mobile behavior expectations.
- Same accessibility bar: readable contrast, visible focus states, usable hover
  and active states.

The wiki plugin already exposes theme hooks through `--wiki-*` CSS variables and
uses `.westgate-wiki` / `.wiki-article-prose` classes. The Westgate theme should
remain the place where those variables are mapped to the `--wg-*` design system.

## Page Specifications

### Home

Production source: `custom/pages/home.html`
Reference source: `custom_pages/westgate-pages/home.html`

Deployment: Custom Pages route `home` or `/`, with the full file pasted into
an HTML widget in the main content area.

Current sections:

- Hero with title, setting line, key-art placeholder, and two CTAs.
- Server status strip with static placeholder data.
- Setting pitch with long-form atmosphere copy.
- Four "Enter the City" step cards.
- Latest News strip with three static card placeholders.

Open data decisions:

- Final route: `/`, `/home`, or both via redirect.
- Final art upload paths.
- Whether server status and player counts remain static at launch or come from a
  status widget/API.
- Whether the Latest News strip remains manually curated or is replaced by live
  category data later.

### Recruitment

Production source: `custom/pages/recruitment.html`
Reference source: `custom_pages/westgate-pages/join-the-team.html`

Deployment: Custom Pages route `recruitment`, with the full file pasted into
an HTML widget in the main content area.

Current sections:

- Recruitment hero with screenshot placeholder.
- Three contributor pillars.
- Team culture panel.
- CTA linking to an applications page and Discord.

Intent:

- Explain the benefits of building with Westgate.
- Keep the pitch brief.
- Link to an applications page when that exists.
- Link to Discord immediately.
- Do not imply a full application capability exists yet.

Open data decisions:

- Final application route or placeholder route.
- Final Discord invite URL.
- Final art upload paths.
- Whether role categories stay broad or become specific to current recruiting
  needs.
- Whether any old `join`, `join-the-team`, or recruitment-adjacent route should
  redirect to `recruitment`.

### News And Dev Blog

Production source:

- `custom/pages/news.html`
- `custom/pages/blog.html`

Reference source: `custom_pages/westgate-pages/THEME-INTEGRATION.md`

Deployment: Custom Pages routes backed by NodeBB topic/category data.

Intent:

- News and Blog should be live NodeBB content, not duplicated static pages.
- The page index should render article cards.
- Individual topics in those categories should receive article-style treatment:
  banner hero, metadata, title, author, and prose body.
- Users should not need to know the article came from a forum post.
- Discussion should remain available through a secondary link or article footer,
  not as the primary presentation.
- Each article can optionally use a banner image pulled from the topic.

Canonical source categories:

- News: `cid 1`
- Blog / Developer Blog: `cid 84`

Known Blog route: `https://westgate.pw/category/84/developer-blog`

Rendering requirements:

- Index pages show cards with title, date, teaser, category label, optional
  thumbnail/banner, and author.
- Article pages show an optional banner hero, title, metadata, author, and
  article body.
- Article body should reuse the wiki/article prose vocabulary where possible so
  News, Blog, Wiki, and forum article content stay visually aligned.
- Missing banners must degrade to a handsome text-led hero, not a broken or empty
  media slot.
- The implementation should avoid exposing raw forum chrome in the main article
  reading experience.

Open data decisions:

- Whether the route names are `/news` and `/blog`, or whether `/developer-blog`
  also exists as a canonical or redirect route.
- How a topic declares its banner image: topic thumbnail, first image, upload
  metadata, tag, or a small plugin-owned convention.
- Whether News and Blog share one rendering module with different category IDs.

### Gallery

Production source: `custom/pages/gallery.html`
Reference source: `custom_pages/westgate-pages/THEME-INTEGRATION.md`

Deployment: Custom Pages route backed by gallery asset/topic data.

Intent:

- Gallery showcases screenshots and/or art uploaded specifically for Gallery.
- The source may be forum topics, a special directory, NodeBB uploads, or a
  plugin-managed asset list.
- Each item should render as a visual tile with enough metadata to feel curated.
- Category view renders as a responsive masonry-style grid.
- Topic pages remain normal unless later design work requires a custom viewer.

Open data decisions:

- Whether Gallery uses a forum category, a special upload directory, or a
  plugin-owned asset registry.
- Upload and moderation workflow.
- Whether Gallery items link to topics, media lightboxes, or standalone custom
  pages.
- Required metadata: title, author, date, caption, tags, source topic, or
  approval state.

### Forums And Wiki

Forums should remain normal NodeBB/Harmony-derived forum pages styled by
Westgate theme overrides.

Wiki uses the custom Westgate wiki plugin, not Custom Pages. It still must stay
visually aligned with the custom pages and forums. The existing theme already
maps wiki styling through `scss/westgate/_wiki-prose.scss`, and the wiki plugin
ships layout defaults plus `--wiki-*` hooks.

Parity requirements:

- Custom page article prose and wiki article prose should converge where
  possible.
- News/Blog article bodies should be close enough to wiki article bodies that a
  reader sees one editorial system.
- Forum cards, wiki cards, and custom-page cards should share radius, border,
  shadow, type scale, and focus behavior.
- Topbar behavior must be uniform across Custom Pages, wiki routes, and forum
  routes.

## Topbar And Harmony Sidebar Migration

### Current Harmony Baseline

Harmony splits global chrome across:

- Left sidebar: ACP Navigation, dropdown navigation items, skin switcher, sidebar
  toggle.
- Right sidebar: logged-in user menu, search, notifications, chats, drafts.
- Mobile bottom/top bar: mobile access to related sidebar controls.

Westgate currently inherits this model because `templates/header.tpl` imports
`partials/sidebar-left.tpl` and Harmony `footer.tpl` imports
`partials/sidebar-right.tpl`.

### Required End State

The global topbar owns the functions users previously reached through Harmony's
sidebars:

- Brand link.
- ACP Navigation items.
- Forums menu / category entry points.
- Search.
- Notifications.
- Chats, when `canChat` is true.
- Drafts.
- User avatar menu.
- User status controls.
- Profile, bookmarks, edit profile, settings.
- Moderator tools when available.
- Logout.
- Guest login and register actions.
- Mobile drawer equivalents for the same primary actions.
- Skin switcher if custom skins remain enabled.

The global layout should no longer render Harmony's left or right desktop
sidebars for normal pages. `#panel` should run as the main content column under
the topbar.

### Implementation Principles For Later

This is not implemented in this spec pass, but the later implementation should
follow these principles:

- Add a theme partial such as `templates/partials/header/topbar.tpl`.
- Mount that partial from `templates/header.tpl`.
- Stop importing `partials/sidebar-left.tpl` and `partials/sidebar-right.tpl` in
  the global layout, either by overriding both header and footer or by another
  clean theme-level layout change.
- Move topbar SCSS into a focused Westgate partial such as
  `scss/westgate/_topbar.scss`; import it from `theme.scss`.
- Prefer topbar-specific local partials copied from Harmony sidebar partials only
  where the markup must change. Preserve NodeBB component hooks such as
  `component="notifications/list"`, `component="chat/list"`,
  `component="drafts/list"`, `component="drafts/open"`,
  `component="drafts/delete"`, `component="header/usercontrol"`, and
  `component="search/form"`.
- Keep Bootstrap dropdown behavior if reusing Harmony's existing client logic.
- If markup cannot preserve Harmony's selectors, update the theme client script
  intentionally instead of relying on accidental sidebar selectors.
- Do not duplicate live notification/chat/draft data with static mock rows in
  production.
- Ensure the topbar is present on Custom Pages, wiki plugin routes, and standard
  forum routes.

### Harmony JavaScript Compatibility Risks

`public/harmony.js` currently assumes sidebar selectors in several places:

- Composer sizing offsets from `.sidebar-left`.
- Sidebar toggle persistence via `[component="sidebar/toggle"]`.
- Search focus via `[component="sidebar/search"]`.
- Draft rendering via `[component="sidebar/drafts"]` and
  `[component="drafts/list"]`.
- Notification/chat placeholder cloning via `nav.sidebar`.
- Sidebar tooltip setup via `.sidebar`, `.sidebar-left`, and `.sidebar-right`.
- `#main-nav` overflow adjustment for left sidebar dropdowns.

The implementation must either keep compatible hooks in the topbar or replace
these assumptions with topbar-aware behavior. This is the main technical risk in
the topbar migration.

## Acceptance Criteria

For this design to be ready for implementation planning:

- The repository has a clear source-of-truth distinction between raw Claude
  Design exports, reference Custom Pages modules, and tracked `custom/`
  production sources.
- The five required custom pages have named production files under `custom/`.
- Static Custom Pages can be installed without relying on Harmony sidebars.
- Dynamic Custom Pages have a documented data ownership path through NodeBB
  forum content and/or local plugins.
- The global topbar spec accounts for every current Harmony sidebar user
  function, including logged-out and logged-in states.
- News and Blog use forum categories `1` and `84` as canonical content while
  presenting as website articles.
- Gallery is explicitly left open where its source model is not yet thoroughly
  specced.
- Recruitment is renamed from Join the Team to `recruitment.html` and does not
  pretend application functionality exists yet.
- Wiki and forums are covered by the same parity requirements as Custom Pages.
- Routes, asset paths, and live-data integrations are listed as decisions instead
  of being silently assumed.
- No generated files are promoted to tracked production assets without an
  explicit decision.

## Open Decisions

- Should `custom_pages/` remain untracked reference material, or should selected
  QA screenshots be tracked separately?
- Should the global topbar first ship as a theme partial, or temporarily as
  Custom Content HTML/JavaScript for faster visual validation?
- Should the skin switcher remain available? If yes, it needs a topbar/user-menu
  home.
- Should `sidebar-footer` widget content be deprecated, moved to a real footer,
  or exposed somewhere else?
- Should Harmony's mobile bottom/top bar remain enabled after the Westgate
  topbar mobile drawer exists?
- What are the final route names and redirects for Home, Recruitment, News,
  Gallery, Wiki, Forums, Blog, and Developer Blog?
- What is the canonical Gallery source model?
- What data convention marks a News/Blog topic banner image?
- Which plugin, if any, owns applications when recruitment needs an application
  flow?
- Which page screenshots should become QA references, and which are obsolete?

## Non-Goals For This Pass

- No template overrides are implemented here.
- No SCSS is moved or added.
- No Custom Pages content is installed.
- No category IDs are changed.
- No `custom/` production files are created in this investigation-only pass.
- No generated image or screenshot assets are promoted.
- No commits or pushes are made by this draft.
