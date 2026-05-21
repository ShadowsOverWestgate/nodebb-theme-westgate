'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(
	path.join(__dirname, '..', 'public', 'client.js'),
	'utf8'
);

const readyCallbacks = [];
const eventHandlers = [];
const fakeApi = {
	get: function () {},
};
const fakeDocument = {
	querySelectorAll: function () {
		return [];
	},
	createElement: function () {
		throw new Error('createElement should not be called during initialisation');
	},
};

function fakeJquery() {
	return {
		ready: function (callback) {
			readyCallbacks.push(callback);
		},
		on: function (eventName, callback) {
			eventHandlers.push({ eventName, callback });
		},
	};
}

const context = {
	console,
	document: fakeDocument,
	require: function (deps, callback) {
		assert.equal(deps.length, 1);
		assert.equal(deps[0], 'api');
		callback(fakeApi);
	},
	window: {},
	$: fakeJquery,
};

vm.runInNewContext(source, context, { filename: 'public/client.js' });
readyCallbacks.forEach(callback => callback());

assert.equal(
	typeof (context.window.westgateTheme && context.window.westgateTheme.wrapWikiTables),
	'function',
	'client should expose a testable wiki table wrapper helper'
);

assert(
	eventHandlers.some(handler => handler.eventName === 'action:ajaxify.end'),
	'client should rerun wiki table wrapping after ajaxify navigation'
);

let createdWrapper;
let insertedNode;
const parent = {
	insertBefore: function (node, before) {
		insertedNode = { node, before };
		node.parentNode = this;
	},
};
const table = {
	style: {},
	parentNode: parent,
	closest: function (selector) {
		assert(
			selector.includes('wg-mobile-table-scroll') ||
				selector.includes('tableWrapper') ||
				selector.includes('wiki-infobox'),
			`unexpected closest selector: ${selector}`
		);
		return null;
	},
	getAttribute: function (name) {
		return name === 'style' ? 'width:100%' : null;
	},
	getBoundingClientRect: function () {
		return { width: 320 };
	},
	querySelectorAll: function (selector) {
		if (selector === 'colgroup col') {
			return [
				{ style: { width: '61px' }, getAttribute: function () { return 'width:61px'; } },
				{ style: { width: '80px' }, getAttribute: function () { return 'width:80px'; } },
			];
		}

		if (selector === 'tr') {
			return [
				{
					children: Array.from({ length: 10 }, () => ({
						getAttribute: function () {
							return null;
						},
					})),
				},
			];
		}

		return [];
	},
};
const root = {
	querySelectorAll: function (selector) {
		assert.equal(
			selector,
			'.westgate-wiki .wiki-page-content.wiki-article-prose > .card-body table'
		);
		return [table];
	},
};

context.document.createElement = function (tagName) {
	assert.equal(tagName, 'div');
	createdWrapper = {
		className: '',
		child: null,
		attributes: {},
		style: {
			values: {},
			setProperty: function (name, value) {
				this.values[name] = value;
			},
		},
		appendChild: function (child) {
			this.child = child;
			child.parentNode = this;
		},
		setAttribute: function (name, value) {
			this.attributes[name] = value;
		},
	};
	return createdWrapper;
};

context.window.westgateTheme.wrapWikiTables(root);

assert.equal(createdWrapper.className, 'wg-mobile-table-scroll');
assert.equal(createdWrapper.attributes.tabindex, '0');
assert.equal(insertedNode.node, createdWrapper);
assert.equal(insertedNode.before, table);
assert.equal(createdWrapper.child, table);
assert.equal(createdWrapper.style.values['--wg-mobile-table-min-width'], '720px');
