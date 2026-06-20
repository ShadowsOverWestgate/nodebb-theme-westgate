'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(
	path.join(__dirname, '..', 'public', 'client.js'),
	'utf8'
);
const stylesheet = fs.readFileSync(
	path.join(__dirname, '..', 'scss', 'westgate', '_wiki-prose.scss'),
	'utf8'
);

const readyCallbacks = [];
const eventHandlers = [];
const wrappers = [];
const fakeApi = {
	get: function () {},
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

function createParent() {
	return {
		children: [],
		insertBefore: function (node, before) {
			const index = this.children.indexOf(before);
			assert.notEqual(index, -1, 'table fixture should belong to its parent');
			this.children.splice(index, 0, node);
			node.parentNode = this;
		},
	};
}

function createTable(parent, options = {}) {
	const cells = [{ marker: 'first' }, { marker: 'second' }];
	const table = {
		parentNode: parent,
		style: {},
		rows: [{ children: cells }],
		closest: function () {
			return options.existingWrapper || null;
		},
		getAttribute: function () {
			return null;
		},
		getBoundingClientRect: function () {
			return { width: 320 };
		},
		querySelectorAll: function (selector) {
			if (selector === 'tr') {
				return this.rows;
			}
			return [];
		},
	};
	parent.children.push(table);
	return table;
}

function createWrapper() {
	const wrapper = {
		attributes: {},
		children: [],
		style: {
			setProperty: function () {},
		},
		appendChild: function (child) {
			const oldParent = child.parentNode;
			const oldIndex = oldParent.children.indexOf(child);
			oldParent.children.splice(oldIndex, 1);
			this.children.push(child);
			child.parentNode = this;
		},
		setAttribute: function (name, value) {
			this.attributes[name] = value;
		},
	};
	wrappers.push(wrapper);
	return wrapper;
}

const firstParent = createParent();
const firstTable = createTable(firstParent);
let queriedTables = [firstTable];
const fakeDocument = {
	querySelectorAll: function () {
		return queriedTables;
	},
	createElement: function () {
		return createWrapper();
	},
};

const context = {
	console,
	document: fakeDocument,
	require: function (deps, callback) {
		assert(Array.isArray(deps));
		callback(fakeApi);
	},
	window: {},
	$: fakeJquery,
};

vm.runInNewContext(source, context, { filename: 'public/client.js' });
readyCallbacks.forEach(callback => callback());

assert.equal(wrappers.length, 1, 'plain rendered wiki tables should gain a scroll container');
assert.equal(wrappers[0].children[0], firstTable, 'wrapping must preserve the original table node');
assert(
	wrappers[0].className && stylesheet.includes(`.${wrappers[0].className}`),
	'the generated scroll container should be handled by the theme stylesheet'
);
assert.deepEqual(
	firstTable.rows[0].children.map(cell => cell.marker),
	['first', 'second'],
	'wrapping must preserve table cell order and semantics'
);
assert.equal(wrappers[0].attributes.tabindex, '0', 'the scroll container should be keyboard focusable');
assert(wrappers[0].attributes['aria-label'], 'the scroll container should have an accessible name');

const ajaxifyHandler = eventHandlers.find(handler => handler.eventName === 'action:ajaxify.end');
assert(ajaxifyHandler, 'client should rerun wiki table wrapping after NodeBB ajaxify navigation');

const secondParent = createParent();
const secondTable = createTable(secondParent);
queriedTables = [secondTable];
ajaxifyHandler.callback();
assert.equal(wrappers.length, 2, 'tables loaded by ajaxify navigation should also be wrapped');
assert.equal(wrappers[1].children[0], secondTable);

const existingWrapper = {};
const wrappedParent = createParent();
const alreadyWrappedTable = createTable(wrappedParent, { existingWrapper });
queriedTables = [alreadyWrappedTable];
ajaxifyHandler.callback();
assert.equal(wrappers.length, 2, 'tables already handled by a compatible wrapper should not be nested again');
