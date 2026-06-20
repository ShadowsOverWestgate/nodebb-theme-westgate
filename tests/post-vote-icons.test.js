const assert = require("assert");
const fs = require("fs");
const path = require("path");

const stylesheet = fs.readFileSync(
	path.join(__dirname, "..", "scss", "westgate", "_posts.scss"),
	"utf8"
);

assert(
	!stylesheet.includes("Font Awesome 6 Free"),
	"Post vote icons must not hard-code the retired Font Awesome 6 family"
);

assert.match(
	stylesheet,
	/i\.fa-chevron-up\s*\{[^}]*--fa:\s*"\\f[0-9a-f]+"/s,
	"The upvote button should reuse Harmony's Font Awesome element"
);

assert.match(
	stylesheet,
	/i\.fa-chevron-down\s*\{[^}]*--fa:\s*"\\f[0-9a-f]+"/s,
	"The downvote button should reuse Harmony's Font Awesome element"
);

assert.doesNotMatch(
	stylesheet,
	/\[component="post\/(?:upvote|downvote)"\][\s\S]*?&::before\s*\{/,
	"Vote icons should not bypass Font Awesome's element and family handling with custom pseudo-elements"
);
