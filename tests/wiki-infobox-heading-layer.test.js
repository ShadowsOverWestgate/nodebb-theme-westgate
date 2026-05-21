const assert = require("assert");
const fs = require("fs");
const path = require("path");

const stylesheet = fs.readFileSync(
	path.join(__dirname, "..", "scss", "westgate", "_wiki-prose.scss"),
	"utf8"
);

function ruleHasDeclaration(selector, declaration) {
	const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
	let match;
	while ((match = rulePattern.exec(stylesheet)) !== null) {
		const selectors = match[1].split(",").map(value => value.trim());
		const body = match[2];
		if (selectors.includes(selector) && body.includes(declaration)) {
			return true;
		}
	}
	return false;
}

function matchingRuleHasDeclaration(selectorPattern, declaration) {
	const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
	let match;
	while ((match = rulePattern.exec(stylesheet)) !== null) {
		const selectors = match[1].split(",").map(value => value.trim());
		const body = match[2];
		if (selectors.some(selector => selectorPattern.test(selector)) && body.includes(declaration)) {
			return true;
		}
	}
	return false;
}

[
	".westgate-wiki .wiki-article-prose .wiki-infobox",
	".westgate-wiki-compose .wiki-editor__content .wiki-infobox",
].forEach(selector => {
	assert(
		ruleHasDeclaration(selector, "position: relative"),
		`${selector} should establish a positioned layer above overlapping prose headings`
	);
	assert(
		ruleHasDeclaration(selector, "z-index: var(--wiki-infobox-layer, 1)"),
		`${selector} should stay selectable when a positioned heading's full block box overlaps it`
	);
});

assert(
	!matchingRuleHasDeclaration(/\bh[1-6]\b/, "pointer-events: none"),
	"Infobox/heading selection should not be fixed by disabling pointer events on prose content"
);
