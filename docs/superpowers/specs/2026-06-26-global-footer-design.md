# Global Footer Design

## Summary

Add a Westgate-owned global footer to the NodeBB theme. The footer is permanent
theme chrome, not widget or Custom Pages content. It renders on every normal
NodeBB page that uses the theme layout, sits below the main page content, and
includes both Westgate navigation and the platform credit pills for NodeBB and
Tiptap.

## Decision

Use a hardcoded theme partial.

The footer links are intentionally different from the topbar. The topbar remains
broad, task-oriented navigation for moving through the site and forum. The
footer carries more specific, secondary, and contextual links. This matches the
usual website pattern and avoids forcing one navigation model to serve two
different jobs.

The "Powered by NodeBB" and "Powered by Tiptap" pills should be folded into the
same global footer as the final credit row. They should not remain as a separate
global footer fragment unless an upstream plugin forces them outside theme
control.

## Source References

- `custom_pages/Westgate.dc.html`: extracted Claude Design footer layout,
  content, palette, and spacing direction.
- `docs/superpowers/specs/global-footer-powered-by.html`: supplied powered-by
  markup reference.
- `docs/superpowers/specs/global-footer-powered-by.css`: supplied powered-by
  style reference.
- `templates/footer.tpl`: current local footer override and integration point.
- `theme.scss`: imports-only SCSS entry point.

The deposited powered-by files are reference material. Production markup and
styles should live in the theme partial and focused SCSS file, not in
`docs/superpowers/specs/`.

## Architecture

Add:

- `templates/partials/footer/westgate-global.tpl`
- `scss/westgate/_footer.scss`

Modify:

- `templates/footer.tpl`
- `theme.scss`
- a focused contract test, either a new `tests/global-footer-contract.test.js`
  or a small extension of the existing global topbar contract test.

Do not add JavaScript, dependencies, widget areas, admin settings, or root-level
theme styling files.

## Template Integration

Mount the footer partial from `templates/footer.tpl` after `</main>` and before
the closing `.layout-container` wrapper:

```tpl
		</main>

		<!-- IMPORT partials/footer/westgate-global.tpl -->
	</div>
```

Keep the existing mobile topic navigator, toaster tray, reconnect alert, and
footer JS import in place. Do not reintroduce Harmony's right sidebar import.

The partial should use semantic footer markup:

```html
<footer class="wg-footer" aria-label="Shadows Over Westgate footer">
	...
</footer>
```

## Content

The footer has three main content areas plus a final low-credit row.

### Brand Area

Include:

- Westgate diamond mark.
- Site name from `{config.siteTitle}` so the footer follows the configured
  NodeBB site title.
- Short description:
  "A Neverwinter Nights: Enhanced Edition persistent world of gothic intrigue,
  set in the Forgotten Realms port city of Westgate."
- Flavor line:
  "Mind the shadows."

### Explore Links

Hardcode these as footer-specific links:

- Home
- News
- Gallery
- Dev Blog
- Join the Team

Use real anchors. Prefer `{relative_path}` for internal routes. Do not use
Claude Design preview handlers such as `onClick="{{ goHome }}"`.

Hardcode the final `href` values in the footer partial after confirming the
existing production routes. Do not read these links dynamically from ACP
Navigation.

### Community Links

Hardcode these as footer-specific links:

- Forums
- Wiki
- Register
- How to Join

Use confirmed internal routes where they exist:

```html
<a href="{relative_path}/categories">Forums</a>
<a href="{relative_path}/wiki">Wiki</a>
<a href="{relative_path}/register">Register</a>
```

If a destination route is not confirmed at implementation time, use the closest
existing route rather than creating new routing behavior as part of this task.

### Legal And Setting Line

Include the existing Claude Design bottom text:

- `© 2026 Shadows Over Westgate · A NWN:EE Persistent World`
- `Forgotten Realms · Westgate · Sea of Fallen Stars`

This is display content, not a dynamic copyright system.

### Powered-By Row

Fold the NodeBB and Tiptap credit pills into the global footer as the final row.
Use the supplied reference files for structure and visual treatment.

Requirements:

- Link NodeBB to `https://nodebb.org`.
- Link Tiptap to `https://tiptap.dev`.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- Each pill has an accessible name such as `aria-label="Powered by NodeBB"`.
- The row is visually subordinate to the Westgate content.
- The row remains inside `.wg-footer` so the footer is one component.

If an upstream plugin also renders an unavoidable Tiptap credit elsewhere, do
not hide it blindly in this task. First confirm whether that credit is required
by the plugin license or only redundant UI.

## Styling

Add footer styles to `scss/westgate/_footer.scss` and import that file from
`theme.scss`:

```scss
@import "./scss/westgate/footer";
```

Style scope must be `.wg-footer` and descendants.

Visual direction:

- near-black and plum base
- muted gold borders and focus accents
- restrained depth, not bright SaaS treatment
- max-width content container matching the extracted design, roughly `1240px`
- three-column desktop layout
- stacked mobile layout
- powered-by pills centered in the final footer row

Prefer existing theme tokens and SCSS variables where available. The deposited
powered-by CSS uses custom properties that may not exist in the theme; translate
those values into the theme's existing SCSS/token language rather than copying
non-theme variables verbatim.

## Accessibility

The footer must:

- use semantic `<footer>` markup
- use real `<a>` links
- provide visible hover and focus states
- preserve readable contrast on the dark background
- avoid icon-only links without accessible names
- keep link text understandable out of context
- remain usable with the fixed mobile bottom navigator present

## Testing

Add a small contract test that verifies:

- `templates/footer.tpl` imports `partials/footer/westgate-global.tpl`.
- `theme.scss` imports `./scss/westgate/footer`.
- `templates/partials/footer/westgate-global.tpl` exists.
- the partial contains `.wg-footer`.
- the partial contains the NodeBB and Tiptap powered-by links.
- internal footer links use anchors rather than Claude Design preview handlers.
- internal links do not hardcode `https://westgate.pw`.
- Harmony's right sidebar import remains absent from `templates/footer.tpl`.

Run the relevant Node test script directly, matching the existing contract test
style.

## Non-Goals

Do not:

- create a new widget area
- add admin configuration
- add JavaScript
- create or change routes
- copy the entire Claude Design export
- modify topbar behavior
- alter unrelated templates
- hide upstream powered-by content without confirming whether it is required

## Acceptance Criteria

- Every normal theme page renders one Westgate global footer.
- Footer links are hardcoded and footer-specific.
- The powered-by pills are visually part of the footer, not a separate orphan
  fragment.
- NodeBB mobile navigation, reconnect alerts, toaster tray, and footer JS still
  work.
- The theme remains a small child theme over Harmony.
- Focused contract tests pass.
