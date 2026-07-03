# Wiki Badge in Global Search Results — Theme Design

Date: 2026-07-02
Status: Approved for planning
Scope: theme-only slice of the cross-repo "wiki in global search" work.

Companion spec (drives this): `sow-nodebb-plugin-wiki` →
`docs/superpowers/specs/2026-07-02-wiki-global-search-design.md`. The wiki
plugin makes wiki articles searchable and tags each wiki result with
`isWikiArticle: true` and `wikiPath` (`/wiki/...`). **This spec covers only the
rendering of those tagged results in the theme.**

## Problem

The theme currently ships no search-result overrides — global search
(quick-search dropdown + `/search` page) renders with stock NodeBB templates.
Once the wiki plugin surfaces wiki articles in search, those results need to be
visually marked as wiki and to link to `/wiki/...` instead of `/topic/...`.

## Input contract (from the wiki plugin)

Each search result object may carry:

- `isWikiArticle` — `true` for wiki article hits.
- `wikiPath` — the `/wiki/...` URL for the article.

Forum results do not carry these; they render unchanged.

## Design

Mark wiki result rows and point them at the wiki URL, in **both** surfaces:

1. **`/search` page** — the full results list.
2. **Quick-search dropdown** — the navbar type-ahead results.

For each row where `isWikiArticle` is set:

- show a wiki icon/badge (e.g. a book/wiki icon plus a small "Wiki" label),
  consistent with existing theme iconography (see `GAME_ICONS.md`);
- set the result's link `href` to `wikiPath`.

Rows stay in the single relevance-ranked list returned by search; no grouping or
reordering.

### Approach — decide during planning

Two ways to inject this; pick the smaller one that works against the pinned
NodeBB version:

- **Template override (preferred if a small partial isolates the row):** add a
  theme override of the NodeBB search result partial(s) — the quick-search
  results partial and the `/search` results partial — with a conditional badge
  and `wikiPath` link. Keeps logic declarative and server-rendered.
- **Client-side decoration (fallback):** in `public/client.js`, after results
  render, decorate rows flagged `isWikiArticle` (badge + rewrite href). Smaller
  surface if the stock partials are awkward to override cleanly, but relies on
  the data being present in the client payload.

Planning resolves which, based on the actual stock partials in the pinned
NodeBB/theme base.

**Resolved (2026-07-03): template override.** Harmony's row markup is small and
self-contained, so the theme overrides `partials/posts_list_item.tpl` (`/search`
posts view — shared with account/groups pages, where the wiki flags are never
set and the conditional no-ops), `partials/search-results.tpl` (`/search` topics
view), and `partials/quick-search-results.tpl` (dropdown). No client-side
decoration needed.

## Styling

Add badge styles in the theme SCSS (`scss/`, wired via `theme.scss`), matching
existing badge/pill conventions. No new dependencies.

## Non-goals

- No search *behavior* changes — indexing, matching, ranking, and result tagging
  all live in the wiki plugin.
- No grouping/separate section — inline badge only.
- No changes to non-search surfaces.

## Testing / verification

- Visual: run the dev stack (`docker-compose.dev.yml` in `sow-nodebb`), search a
  term matching a wiki article, confirm the result shows the wiki badge and its
  link goes to `/wiki/...`; confirm forum results are unchanged. Check both the
  dropdown and the `/search` page.
- Snapshot/DOM assertions only if the theme's existing test setup (`tests/`)
  makes them cheap; otherwise rely on the visual check (badge/link is not
  complex logic).

## Dependencies / sequencing

Depends on the wiki plugin emitting `isWikiArticle` + `wikiPath` on results.
Theme work can be built against a stubbed result but is only end-to-end
verifiable once the plugin side lands.
