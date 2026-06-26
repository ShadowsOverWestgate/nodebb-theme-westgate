'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(relativePath) {
	const filePath = path.join(__dirname, '..', relativePath);
	assert(fs.existsSync(filePath), `${relativePath} should exist`);
	return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(haystack, needle, message) {
	assert(
		haystack.includes(needle),
		message || `Expected file to include ${needle}`
	);
}

function assertExcludes(haystack, needle, message) {
	assert(
		!haystack.includes(needle),
		message || `Expected file not to include ${needle}`
	);
}

const footer = read('templates/footer.tpl');
const theme = read('theme.scss');
const partial = read('templates/partials/footer/westgate-global.tpl');

assertIncludes(
	footer,
	'<!-- IMPORT partials/footer/westgate-global.tpl -->',
	'Footer layout should mount the Westgate global footer partial'
);
assertExcludes(
	footer,
	'<!-- IMPORT partials/sidebar-right.tpl -->',
	"Footer should not reintroduce Harmony's right global sidebar"
);
assertIncludes(
	theme,
	'@import "./scss/westgate/footer";',
	'theme.scss should import the focused footer partial'
);
assertIncludes(partial, '<footer class="wg-footer"', 'Footer partial should use semantic footer markup');
assertIncludes(partial, 'href="https://nodebb.org"', 'Footer should credit NodeBB');
assertIncludes(partial, 'href="https://tiptap.dev"', 'Footer should credit Tiptap');
assertIncludes(partial, 'aria-label="Powered by NodeBB"', 'NodeBB credit should have an accessible name');
assertIncludes(partial, 'aria-label="Powered by Tiptap"', 'Tiptap credit should have an accessible name');

[
	'{relative_path}/category/1/news',
	'{relative_path}/gallery',
	'{relative_path}/category/84/developer-blog',
	'{relative_path}/join-the-team',
	'{relative_path}/categories',
	'{relative_path}/wiki',
	'{relative_path}/register',
].forEach((href) => {
	assertIncludes(partial, `href="${href}"`, `Footer should include internal link ${href}`);
});

assertExcludes(partial, 'onClick="{{', 'Footer should use real anchors, not Claude Design preview handlers');
assertExcludes(partial, 'https://westgate.pw', 'Footer should use relative internal links');
