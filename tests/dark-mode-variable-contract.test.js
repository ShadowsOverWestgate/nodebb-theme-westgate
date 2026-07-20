// Westgate repaints Bootstrap's LIGHT colour mode dark, so every Bootstrap
// variable that defaults to a near-black ink must be re-pointed at a light
// token. Missing one is invisible until some component chains to it — that is
// how /wiki/manage ended up with near-black table text on a near-black page.
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const overrides = fs.readFileSync(
	path.join(__dirname, "..", "scss", "overrides.scss"),
	"utf8"
);

// Bootstrap's defaults for these are $black / $body-color-ish inks.
["$body-color", "$body-bg", "$body-emphasis-color"].forEach(variable => {
	const declaration = new RegExp(`\\${variable}:\\s*([^;]+);`).exec(overrides);
	assert(declaration, `${variable} must be overridden for the dark repaint`);
	assert.match(
		declaration[1],
		/\$wg-/,
		`${variable} must resolve to a Westgate palette token, got: ${declaration[1].trim()}`
	);
});
