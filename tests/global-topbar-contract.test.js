'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

function read(relativePath) {
	const filePath = path.join(__dirname, '..', relativePath);
	assert(fs.existsSync(filePath), `${relativePath} should exist`);
	return fs.readFileSync(filePath, 'utf8');
}

function assertMissing(relativePath, message) {
	const filePath = path.join(__dirname, '..', relativePath);
	assert(!fs.existsSync(filePath), message || `${relativePath} should not exist`);
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

const header = read('templates/header.tpl');
const footer = read('templates/footer.tpl');
const topbar = read('templates/partials/header/topbar.tpl');
const theme = read('theme.scss');
const stylesheet = read('scss/westgate/_topbar.scss');
const client = read('public/client.js');
const themeHooks = read('lib/theme.js');

assertIncludes(
	header,
	'<!-- IMPORT partials/header/topbar.tpl -->',
	'Header should mount the Westgate topbar partial'
);
assertExcludes(
	header,
	'<!-- IMPORT partials/sidebar-left.tpl -->',
	"Header should no longer render Harmony's left global sidebar"
);
assertExcludes(
	footer,
	'<!-- IMPORT partials/sidebar-right.tpl -->',
	"Footer should no longer render Harmony's right global sidebar"
);
assertIncludes(
	theme,
	'@import "./scss/westgate/topbar";',
	'theme.scss should import the focused topbar partial'
);
assertExcludes(
	theme,
	'@import "./scss/westgate/header";',
	'theme.scss should not import the removed brand banner stylesheet'
);
assertIncludes(
	stylesheet,
	'.wg-topbar',
	'Topbar styles should be scoped to .wg-topbar'
);
assertIncludes(
	client,
	'initWestgateTopbar',
	'Client bundle should initialize Westgate topbar behavior'
);

[
	'component="sidebar/search"',
	'component="notifications"',
	'component="sidebar/drafts"',
].forEach((component) => {
	assertIncludes(topbar, component, `Topbar should preserve live NodeBB hook ${component}`);
});

[
	'<!-- IMPORT partials/sidebar/search.tpl -->',
	'<!-- IMPORT partials/sidebar/notifications.tpl -->',
	'<!-- IMPORT partials/sidebar/chats.tpl -->',
	'<!-- IMPORT partials/sidebar/drafts.tpl -->',
	'<!-- IMPORT partials/sidebar/user-menu.tpl -->',
].forEach((templateImport) => {
	assertIncludes(topbar, templateImport, `Topbar should reuse Harmony live partial ${templateImport}`);
});

[
	'Velessa Thorne',
	'Guildmaster Orin',
	'A letter left at the Undergate',
	'wg-topbar-demo',
	"localStorage.setItem('wg-topbar-presence'",
].forEach((fixture) => {
	assertExcludes(topbar, fixture, `Topbar should not ship preview fixture ${fixture}`);
});

assertIncludes(topbar, '{{{ if config.loggedIn }}}', 'Topbar should branch on the real logged-in state');
assertIncludes(topbar, '{{{ if canChat }}}', 'Chat controls should remain permission-gated');
assertIncludes(topbar, '{{{ if allowRegistration }}}', 'Registration should remain server-gated');
assertIncludes(topbar, '{{{ each navigation }}}', 'Topbar should render ACP Navigation items');
assertIncludes(topbar, '{./textClass}', 'Topbar should honor ACP Navigation text visibility classes');
assertExcludes(topbar, 'href="{relative_path}/admin"', 'Topbar should not hard-code the administrator link');

assertMissing(
	'templates/partials/header/brand.tpl',
	'Theme should inherit Harmony brand markup instead of shipping the removed Westgate brand banner override'
);
assertMissing(
	'scss/westgate/_header.scss',
	'Removed brand banner styles should not remain in the theme'
);
assertMissing(
	'public/images/plum-header-bg.png',
	'Removed brand banner background should not remain in static assets'
);
assertExcludes(
	themeHooks,
	'brand-header',
	'Removed brand banner widget area should not remain registered'
);
