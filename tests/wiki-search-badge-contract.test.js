'use strict';

// Contract: search results tagged by nodebb-plugin-westgate-wiki
// (isWikiArticle + wikiPath) render with a wiki badge and link to /wiki/...,
// while untagged forum results keep the stock /post/... link.

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

[
	['templates/partials/posts_list_item.tpl', './isWikiArticle', '{./wikiPath}', '/post/{encodeURIComponent(./pid)}'],
	['templates/partials/search-results.tpl', './isWikiArticle', '{./wikiPath}', '/post/{encodeURIComponent(./pid)}'],
	['templates/partials/quick-search-results.tpl', 'posts.isWikiArticle', '{posts.wikiPath}', '/post/{encodeURIComponent(posts.pid)}'],
].forEach(([templatePath, flag, wikiHref, forumHref]) => {
	const template = read(templatePath);
	assertIncludes(template, flag, `${templatePath} should branch on the wiki result flag`);
	assertIncludes(template, wikiHref, `${templatePath} should link wiki results to their wikiPath`);
	assertIncludes(template, forumHref, `${templatePath} should keep the stock post link for forum results`);
	assertIncludes(template, 'westgate-wiki-badge', `${templatePath} should render the wiki badge`);
});

assertIncludes(read('theme.scss'), 'westgate/search', 'theme.scss should import the search styles');
assertIncludes(read('scss/westgate/_search.scss'), '.westgate-wiki-badge', 'search styles should define the wiki badge');

const languageKeys = JSON.parse(read('languages/en-GB/westgate.json'));
assert(languageKeys['wiki-badge'], 'westgate language file should define the wiki-badge label');

console.log('wiki search badge contract tests passed');
