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

[
	".westgate-wiki .wiki-article-prose .wiki-callout::after",
	".westgate-wiki-compose .wiki-editor__content .wiki-callout::after",
].forEach(selector => {
	assert(
		ruleHasDeclaration(selector, "mask-mode: alpha"),
		`${selector} should force alpha mask rendering without changing the plugin's icon color`
	);
	assert(
		ruleHasDeclaration(selector, "-webkit-mask-mode: alpha"),
		`${selector} should force alpha mask rendering on WebKit/Blink mobile browsers`
	);
});

assert(
	!stylesheet.includes("--wiki-callout-icon-color"),
	"The theme should not introduce new callout icon colors for this mobile rendering fix"
);

assert(
	!stylesheet.includes(".wiki-callout::before"),
	"The theme should not restyle the callout icon tile for this mobile rendering fix"
);
