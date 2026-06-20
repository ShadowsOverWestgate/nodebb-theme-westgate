const assert = require("assert");
const fs = require("fs");
const path = require("path");

const stylesheet = fs.readFileSync(
	path.join(__dirname, "..", "scss", "westgate", "_wiki-prose.scss"),
	"utf8"
);

function readBlock(source, openingPattern) {
	const opening = openingPattern.exec(source);
	assert(opening, "Expected a mobile-width rendering media query");

	const blockStart = opening.index + opening[0].length;
	let depth = 1;
	for (let index = blockStart; index < source.length; index += 1) {
		if (source[index] === "{") {
			depth += 1;
		} else if (source[index] === "}") {
			depth -= 1;
			if (depth === 0) {
				return source.slice(blockStart, index);
			}
		}
	}

	assert.fail("Mobile-width rendering media query is not closed");
}

const mobileStyles = readBlock(stylesheet, /@media\s*\(max-width:[^)]+\)\s*\{/g);
assert.match(
	mobileStyles,
	/wiki[\s\S]*table[\s\S]*overflow-x:\s*auto/i,
	"Wide wiki tables should scroll horizontally at mobile widths"
);

[
	"attr(data-label)",
	"wiki-mobile-table",
].forEach(fragment => {
	assert(
		!mobileStyles.includes(fragment),
		`Mobile table rendering must not use stacked/card conversion: ${fragment}`
	);
});

assert.doesNotMatch(
	Array.from(mobileStyles.matchAll(/([^{}]+)\{([^{}]*)\}/g))
		.filter(([, selectors]) => /(^|[\s,>+~])(?:tr|td|th)(?=[:.#\[\s,>+~]|$)/i.test(selectors))
		.map(([, selectors, declarations]) => `${selectors}{${declarations}}`)
		.join("\n"),
	/display:\s*(?:block|grid)/i,
	"Mobile rendering must preserve native table rows and cells"
);
