# Mobile Wiki Table Rendering Design

## Goal

Improve wiki table readability on mobile while preserving WYSIWYG expectations. A table authored in the wiki editor should still render as the same table on a phone, with the same rows, columns, cell order, and visual structure.

## Decision

Use an improved horizontal-scroll table treatment for mobile. Do not transform tables into row cards, do not generate mobile-only cell labels, and do not require wiki authors to add classes or alternate markup.

This keeps the rendered article close to the author's original table. Mobile styling may add scroll affordances, spacing, clipping, shadows, and overflow handling, but it must not reinterpret table semantics or visually replace the table with a different component.

## Scope

The change belongs in the theme's wiki prose layer, `scss/westgate/_wiki-prose.scss`. The theme should layer over the wiki plugin's existing table CSS rather than changing plugin templates or the saved article HTML.

The mobile treatment should cover:

- Plain rendered wiki article tables inside `.westgate-wiki .wiki-article-prose`.
- Common wrappers emitted by the editor/plugin, including `figure.table`, `.tableWrapper`, and Bootstrap table-responsive wrappers.
- Tiptap compose/editor prose where the same mobile readability problem appears, without breaking table authoring controls.

## Behavior

On desktop, table rendering should remain materially unchanged.

On mobile-width viewports, wide tables should:

- Keep native table layout and cell relationships.
- Scroll horizontally when wider than the content column.
- Show a subtle visual cue that horizontal content continues.
- Use readable cell padding, borders, text color, and header color consistent with the Westgate palette.
- Avoid layout shifts or text overlap in the article column.

Tables that already fit the viewport should still look like normal tables. Complex tables with merged cells, custom widths, captions, or author-applied table styles should preserve their structure and styling as much as possible.

## Non-Goals

- No row-card or stacked mobile rendering.
- No JavaScript-generated `data-label` attributes.
- No author-facing table classes required for mobile.
- No template overrides.
- No changes to wiki post content serialization or sanitization.

## Testing

Add a focused regression test for the theme stylesheet that verifies the mobile table treatment exists and remains WYSIWYG-preserving. The test should assert mobile overflow styling and should explicitly guard against card/stacked-table implementation markers such as generated cell-label rules.

Run the existing Node-based theme tests. If the local forum is available, rebuild assets and check a rendered wiki page at desktop and mobile widths.
