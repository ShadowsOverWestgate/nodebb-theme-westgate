const assert = require("assert");
const fs = require("fs");
const path = require("path");

const stylesheet = fs.readFileSync(
	path.join(__dirname, "..", "scss", "westgate", "_wiki-prose.scss"),
	"utf8"
);

const mobileMediaMatch = stylesheet.match(/@media\s*\(max-width:\s*767\.98px\)\s*\{[\s\S]*\n\}/);
assert(mobileMediaMatch, "Expected a mobile-width table rendering media query");

const mobileStyles = mobileMediaMatch[0];

[
	".westgate-wiki .wiki-article-prose .wg-mobile-table-scroll",
	".westgate-wiki .wiki-article-prose .wg-mobile-table-scroll > table",
	".westgate-wiki .wiki-article-prose .wg-mobile-table-scroll > table.wiki-table-layout-fixed[style*=\"width:100%\"]",
].forEach(selector => {
	assert(
		mobileStyles.includes(selector),
		`${selector} should receive mobile table handling without changing article HTML`
	);
});

[
	"overflow-x: auto",
	"-webkit-overflow-scrolling: touch",
	"max-inline-size: 100%",
	"max-inline-size: none",
	"min-inline-size: var(--wg-mobile-table-min-width, max-content)",
	"min-width: var(--wg-mobile-table-min-width, max-content)",
].forEach(declaration => {
	assert(
		mobileStyles.includes(declaration),
		`Mobile wiki tables should include ${declaration}`
	);
});

[
	"attr(data-label)",
	"wiki-mobile-table",
	".wiki-article-prose tr {\n\t\tdisplay: block",
	".wiki-article-prose td::before",
	".wiki-article-prose th::before",
].forEach(fragment => {
	assert(
	!mobileStyles.includes(fragment),
		`Mobile table rendering must not use stacked/card conversion: ${fragment}`
	);
});

assert(
	!mobileStyles.includes(".westgate-wiki .wiki-page-content.wiki-article-prose > .card-body {\n\t\tmax-inline-size: 100%;\n\t\toverflow-x: auto"),
	"Mobile table scrolling should be scoped to table wrappers, not the whole article body"
);
