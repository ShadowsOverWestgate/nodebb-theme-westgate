# Westgate live pages — theme integration spec

This covers the parts that live in the **theme repo** (`nodebb-theme-westgate`),
not in ACP widgets:

- **News** (`/category/1/...`) and **Dev Blog** (`/category/84/...`) — rendered as
  banner-led article lists + article pages, pulled live from the forum.
- **Gallery** — a player-upload screenshot category rendered as a masonry grid.
- **Top bar** — global header partial that replaces the left sidebar.

The two static pages (Home, Join the Team) are NOT here — they ship as
paste-ready HTML widgets in `westgate-pages/home.html` and
`westgate-pages/join-the-team.html`.

---

## 0. One SCSS partial for all live pages

Create `scss/westgate/_pages.scss` and add it to `theme.scss`:

```scss
// theme.scss (add after _widgets, before _responsive)
@import "./scss/westgate/pages";
```

All page styles use the existing `--wg-*` tokens — no new colours. Scope every
rule under a body/template class so forum chrome is untouched. Suggested top-level
hooks (added in the template overrides below):

- `body.wg-cat-news`, `body.wg-cat-blog` — the News / Dev Blog category index
- `body.wg-article-news`, `body.wg-article-blog` — an individual post
- `body.wg-gallery` — the Gallery category index

---

## 1. Category index re-skin (News / Dev Blog)

NodeBB renders a category at `categories/category.tpl` (we already override
`category.tpl`). Rather than fork the whole template, branch on the category id
and render a "cards" layout for cid 1 & 84, falling back to the normal list
otherwise.

### 1a. Tag the body (lib/theme.js → filterMiddlewareRenderHeader or a new hook)

Add a body class so SCSS can target these categories. In `lib/theme.js`, extend
the existing `filterMiddlewareRenderHeader` (or add `filter:category.build`):

```js
// lib/theme.js
const NEWS_CIDS = { 1: 'news', 84: 'blog' };

library.filterCategoryBuild = async function (hookData) {
    const cid = hookData.templateData && hookData.templateData.cid;
    if (NEWS_CIDS[cid]) {
        hookData.templateData.bodyClass =
            (hookData.templateData.bodyClass || '') + ' wg-cat-' + NEWS_CIDS[cid];
        hookData.templateData.wgArticleList = true; // template flag
    }
    return hookData;
};
```

Register it in `plugin.json` hooks:

```json
{ "hook": "filter:category.build", "method": "filterCategoryBuild" }
```

(If `filter:category.build` isn't available in your NodeBB version, set the flag
in the existing `filter:middleware.renderHeader` by inspecting `req.url`.)

### 1b. Template branch (templates/category.tpl)

At the top of the topic loop, wrap the Westgate card markup behind the flag.
Each topic already exposes `title`, `slug`, `timestamp`/`timestampISO`,
`teaser`, `user`, and `thumb` (topic thumbnail) — that's everything the card needs.

```html
{{{ if wgArticleList }}}
<ul class="wg-article-list list-unstyled">
  {{{ each topics }}}
  <li class="wg-article-card">
    <a class="wg-article-card__media" href="{config.relative_path}/topic/{./slug}">
      {{{ if ./thumb }}}<img src="{./thumb}" alt="" loading="lazy">{{{ end }}}
    </a>
    <div class="wg-article-card__body">
      <div class="wg-article-card__meta">
        <span class="wg-tag">{./category.name}</span>
        <time datetime="{./timestampISO}">{function.humanReadableDate, ./timestamp}</time>
      </div>
      <h2 class="wg-article-card__title">
        <a href="{config.relative_path}/topic/{./slug}">{./title}</a>
      </h2>
      <p class="wg-article-card__teaser">{./teaser.content}</p>
      <div class="wg-article-card__byline">
        by {./user.username}
      </div>
    </div>
  </li>
  {{{ end }}}
</ul>
{{{ else }}}
<!-- existing default category list markup -->
{{{ end }}}
```

Mirror the visual target from the mockup (Westgate.dc.html → News view):
featured first card larger, the rest in a grid. The SCSS below handles that with
`:first-child`.

### 1c. SCSS (in _pages.scss)

```scss
body.wg-cat-news,
body.wg-cat-blog {
  .wg-article-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }
  .wg-article-card {
    background: var(--wg-velvet-panel);
    border: 1px solid var(--wg-border);
    border-radius: 8px;
    box-shadow: var(--wg-velvet-shadow);
    overflow: hidden;
    transition: border-color .25s;
    &:hover { border-color: rgba(194, 163, 90, .4); }
    // featured first post spans the row
    &:first-child {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1.15fr 1fr;
    }
  }
  .wg-article-card__media img {
    width: 100%; height: 160px; object-fit: cover; display: block;
    border-bottom: 1px solid rgba(194, 163, 90, .12);
  }
  .wg-article-card:first-child .wg-article-card__media img {
    height: 100%; min-height: 300px; border-bottom: 0;
  }
  .wg-article-card__body { padding: 22px 24px; }
  .wg-article-card__meta {
    font-family: var(--wg-font-code);
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    color: var(--wg-text-muted);
    display: flex; gap: 10px; align-items: center; margin-bottom: 10px;
  }
  .wg-tag {
    color: #150f08; background: var(--wg-gold);
    padding: 3px 9px; border-radius: 2px; font-weight: 600;
  }
  .wg-article-card__title {
    font-family: var(--wg-font-display); font-size: 19px; line-height: 1.35;
    color: var(--wg-text); margin: 0 0 10px;
    a { color: inherit; }
  }
  .wg-article-card:first-child .wg-article-card__title { font-size: 28px; }
  .wg-article-card__teaser {
    font-family: var(--wg-font-text); font-size: 14px; line-height: 1.7;
    color: var(--wg-text-muted); margin: 0;
  }
  .wg-article-card__byline {
    font-family: var(--wg-font-text); font-size: 12.5px;
    color: var(--wg-text-muted); margin-top: 14px;
  }
}
@media (max-width: 900px) {
  body.wg-cat-news .wg-article-list,
  body.wg-cat-blog .wg-article-list { grid-template-columns: 1fr; }
  body.wg-cat-news .wg-article-card:first-child,
  body.wg-cat-blog .wg-article-card:first-child { grid-template-columns: 1fr; }
}
```

---

## 2. Article page re-skin (an individual News / Dev Blog topic)

Override `topic.tpl` (or just its main-post partial) conditionally for cid 1 & 84.
Tag the body the same way (`filter:topic.build` → `wg-article-news/blog`), then:

1. **Banner hero** — use `topic.thumb`, or the first image in the opening post,
   as a full-width bordered banner; overlay the category tag + date + Cinzel
   title + author byline. (Visual target: Westgate.dc.html → article view.)
2. **Prose body** — add the wiki's prose class to the first post's content
   container so it inherits the magazine typography you already ship:
   `class="... wiki-article-prose"`. That single class gives gold H2 rules,
   blockquotes, drop-in image framing, etc. — no new CSS.
3. **Replies** — leave the normal topic reply list below the article untouched.

```html
{{{ if wgArticle }}}
<header class="wg-article-hero" {{{ if topic.thumb }}}style="--wg-hero-img:url('{topic.thumb}')"{{{ end }}}>
  <div class="wg-article-hero__veil"></div>
  <div class="wg-article-hero__in">
    <div class="wg-article-hero__meta">
      <span class="wg-tag">{topic.category.name}</span>
      <time datetime="{topic.timestampISO}">{function.humanReadableDate, topic.timestamp}</time>
    </div>
    <h1 class="wg-article-hero__title">{topic.titleRaw}</h1>
    <div class="wg-article-hero__byline">by {topic.author.username}</div>
  </div>
</header>
{{{ end }}}
```

```scss
body.wg-article-news, body.wg-article-blog {
  .wg-article-hero {
    position: relative; min-height: 420px; border-radius: 10px;
    border: 1px solid rgba(194, 163, 90, .22);
    display: flex; align-items: flex-end; overflow: hidden;
    background: var(--wg-hero-img) center/cover no-repeat, var(--wg-panel-2);
  }
  .wg-article-hero__veil {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(9,8,11,.2), rgba(9,8,11,.55) 55%, rgba(9,8,11,.94));
  }
  .wg-article-hero__in { position: relative; padding: 46px 50px; }
  .wg-article-hero__meta {
    font-family: var(--wg-font-code); font-size: 12px; color: var(--wg-text-soft);
    display: flex; gap: 12px; align-items: center; margin-bottom: 16px;
  }
  .wg-article-hero__title {
    font-family: var(--wg-font-display); font-weight: 700;
    font-size: clamp(34px, 4.4vw, 52px); line-height: 1.08;
    color: #f3ede4; margin: 0; max-width: 18em;
    text-shadow: 0 4px 30px rgba(0,0,0,.7);
  }
  // article body inherits .wiki-article-prose — no extra rules needed
  // constrain measure:
  [component="post/content"].wiki-article-prose { max-width: 760px; margin-inline: auto; }
}
```

---

## 3. Gallery (player-upload category → masonry)

Make a new forum category "Gallery" (note its cid). Players post a topic with a
screenshot; the topic thumbnail / first image is the tile. Re-skin its category
view as masonry (CSS columns), same pattern as §1:

```scss
body.wg-gallery {
  .wg-gallery-grid { column-count: 3; column-gap: 18px; }
  .wg-gallery-tile {
    break-inside: avoid; margin-bottom: 18px; position: relative;
    border: 1px solid var(--wg-border); border-radius: 5px; overflow: hidden;
    img { width: 100%; display: block; }
  }
  .wg-gallery-tile__cap {
    position: absolute; inset: auto 0 0 0; padding: 16px;
    background: linear-gradient(180deg, transparent, rgba(8,7,10,.9));
    .t { font-family: var(--wg-font-display); font-size: 15px; color: #ece2d2; }
    .u { font-family: var(--wg-font-text); font-size: 11px; color: var(--wg-text-muted); }
  }
}
@media (max-width: 900px) { body.wg-gallery .wg-gallery-grid { column-count: 2; } }
@media (max-width: 560px) { body.wg-gallery .wg-gallery-grid { column-count: 1; } }
```

Template: in `category.tpl`, add a `wgGallery` branch that loops topics into
`.wg-gallery-tile` using each topic's image + title + poster.

---

## 4. Top bar (global header partial — replaces the sidebar)

Visual spec: `Westgate Top Bar.dc.html` (member / guest / Forums menu / user menu /
mobile). Implementation outline:

1. **New partial** `templates/partials/header/topbar.tpl` containing brand +
   primary nav + the right cluster (search toggle, notifications, chat, user menu).
   Reuse Harmony's existing live components so they keep working — pull the
   notification/chat/user dropdown includes from `nodebb-theme-harmony`'s
   `partials/header/` rather than rebuilding them.
2. **Mount it** in `templates/header.tpl`: replace the
   `<!-- IMPORT partials/sidebar-left.tpl -->` line with
   `<!-- IMPORT partials/header/topbar.tpl -->`, and drop the `layout-container`
   left-column so `#panel` is full-width.
3. **Nav items** come from ACP → Navigation: News, Gallery, Wiki, Forums, Dev Blog.
   The "Forums" item is a dropdown whose panel lists categories + Recent/Unread/
   Tags/All-categories (sample markup in the mockup; wire to your real category
   list later).
4. **Turn off sidebars**: set `openSidebars` off (already the default) and, since
   the left column is removed, the forum content goes full width. Keep the
   per-template `sidebar` widget areas empty.
5. SCSS for the bar goes in `_pages.scss` (or a dedicated `_topbar.scss`), all
   `--wg-*` based — lift the literals from the mockup.

---

## Build / preview

After adding `_pages.scss` and the template branches:

```
./nodebb build       # or: ./nodebb dev  for live rebuilds
```

Visual targets to match pixel-for-pixel live in this project:
- `Westgate.dc.html` — News index, article view, Gallery, Home, Join the Team
- `Westgate Top Bar.dc.html` — the global bar and all its states
