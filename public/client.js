'use strict';

/*
	Hey there!

	This is the client file for your theme. If you need to do any client-side work in javascript,
	this is where it needs to go.

	You can listen for page changes by writing something like this:

	  $(window).on('action:ajaxify.end', function(ev, data) {
		var url = data.url;
		console.log('I am now at: ' + url);
	  });
*/

(function () {
	const WG_TABLE_SCROLL_CLASS = 'wg-mobile-table-scroll';
	const WIKI_TABLE_SELECTOR = '.westgate-wiki .wiki-page-content.wiki-article-prose > .card-body table';
	const WIKI_TABLE_MIN_COLUMN_WIDTH = 40;
	const WIKI_TABLE_DESKTOP_MIN_WIDTH = 720;
	const SKIP_TABLE_SELECTOR = [
		`.${WG_TABLE_SCROLL_CLASS}`,
		'.tableWrapper',
		'.table-responsive',
		'.table-responsive-sm',
		'.table-responsive-md',
		'figure.table',
		'.wiki-infobox',
		'.wiki-alignment-table',
	].join(', ');

	function toArray(list) {
		return Array.prototype.slice.call(list || []);
	}

	function parsePixelLength(value) {
		if (!value) {
			return 0;
		}

		const match = String(value).trim().match(/^([0-9]+(?:\.[0-9]+)?)px$/i);
		return match ? parseFloat(match[1]) : 0;
	}

	function getInlinePixelWidth(element) {
		const styledWidth = element && element.style ? parsePixelLength(element.style.width) : 0;
		if (styledWidth) {
			return styledWidth;
		}

		if (!element || typeof element.getAttribute !== 'function') {
			return 0;
		}

		const styleAttribute = element.getAttribute('style') || '';
		const widthMatch = styleAttribute.match(/(?:^|;)\s*width\s*:\s*([0-9]+(?:\.[0-9]+)?)px(?:\s*;|$)/i);
		return widthMatch ? parseFloat(widthMatch[1]) : 0;
	}

	function tableUsesFluidWidth(table) {
		const styledWidth = table && table.style ? String(table.style.width || '') : '';
		if (/%$/.test(styledWidth.trim())) {
			return true;
		}

		if (!table || typeof table.getAttribute !== 'function') {
			return false;
		}

		const styleAttribute = table.getAttribute('style') || '';
		return /(?:^|;)\s*width\s*:\s*[0-9]+(?:\.[0-9]+)?%(?:\s*;|$)/i.test(styleAttribute);
	}

	function getTableColumnCount(table) {
		let columnCount = 0;

		if (table && typeof table.querySelectorAll === 'function') {
			columnCount = Math.max(columnCount, table.querySelectorAll('colgroup col').length);

			toArray(table.querySelectorAll('tr')).forEach((row) => {
				const rowColumnCount = toArray(row.children).reduce((count, cell) => {
					const span = parseInt(cell.getAttribute && cell.getAttribute('colspan'), 10) || cell.colSpan || 1;
					return count + Math.max(1, span);
				}, 0);
				columnCount = Math.max(columnCount, rowColumnCount);
			});
		}

		return columnCount;
	}

	function getTableColumnWidthFloor(table, columnCount) {
		if (!table || typeof table.querySelectorAll !== 'function' || !columnCount) {
			return 0;
		}

		const explicitColumns = toArray(table.querySelectorAll('colgroup col'))
			.map(getInlinePixelWidth)
			.filter(width => width > 0);
		const explicitWidth = explicitColumns.reduce((total, width) => total + width, 0);
		const inferredColumns = Math.max(0, columnCount - explicitColumns.length);

		return explicitWidth + (inferredColumns * WIKI_TABLE_MIN_COLUMN_WIDTH);
	}

	function getRenderedWidth(element) {
		if (element && typeof element.getBoundingClientRect === 'function') {
			return element.getBoundingClientRect().width || 0;
		}

		return element && element.offsetWidth ? element.offsetWidth : 0;
	}

	function setMobileTableMinWidth(table, wrapper) {
		const columnCount = getTableColumnCount(table);
		const measuredWidth = getRenderedWidth(table);
		const columnWidthFloor = getTableColumnWidthFloor(table, columnCount);
		const desktopWidthFloor = tableUsesFluidWidth(table) && columnCount >= 8 ? WIKI_TABLE_DESKTOP_MIN_WIDTH : 0;
		const minWidth = Math.ceil(Math.max(measuredWidth, columnWidthFloor, desktopWidthFloor));

		if (minWidth > 0 && wrapper && wrapper.style && typeof wrapper.style.setProperty === 'function') {
			wrapper.style.setProperty('--wg-mobile-table-min-width', `${minWidth}px`);
		}
	}

	function wrapWestgateWikiTables(root) {
		const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
		if (!scope || typeof scope.querySelectorAll !== 'function') {
			return;
		}

		toArray(scope.querySelectorAll(WIKI_TABLE_SELECTOR)).forEach((table) => {
			if (!table || !table.parentNode || table.closest(SKIP_TABLE_SELECTOR)) {
				return;
			}

			const wrapper = document.createElement('div');
			wrapper.className = WG_TABLE_SCROLL_CLASS;
			wrapper.setAttribute('tabindex', '0');
			wrapper.setAttribute('aria-label', 'Scrollable table');
			table.parentNode.insertBefore(wrapper, table);
			wrapper.appendChild(table);
			setMobileTableMinWidth(table, wrapper);
		});
	}

	window.westgateTheme = window.westgateTheme || {};
	window.westgateTheme.wrapWikiTables = wrapWestgateWikiTables;

	$(document).ready(function () {
		wrapWestgateWikiTables(document);
		$(window).on('action:ajaxify.end', function () {
			wrapWestgateWikiTables(document);
		});

		require(['api'], function (api) {
			const originalGet = api.get.bind(api);
			let categoryClassMapPromise;

			function getCategoryClassMap() {
				if (!categoryClassMapPromise) {
					categoryClassMapPromise = new Promise((resolve) => {
						originalGet('/categories', {}, function (err, data) {
							if (err || !data || !Array.isArray(data.categories)) {
								return resolve({});
							}

							const classMap = data.categories.reduce((memo, category) => {
								if (category && category.cid !== undefined) {
									memo[String(category.cid)] = category.class || '';
								}
								return memo;
							}, {});

							resolve(classMap);
						});
					});
				}

				return categoryClassMapPromise;
			}

			api.get = function (url, data, callback) {
				if (url !== '/search/categories' || typeof callback !== 'function') {
					return originalGet(url, data, callback);
				}

				return originalGet(url, data, function (err, payload) {
					if (err || !payload || !Array.isArray(payload.categories)) {
						return callback(err, payload);
					}

					getCategoryClassMap().then((classMap) => {
						payload.categories = payload.categories.map(category => ({
							...category,
							class: category.class || classMap[String(category.cid)] || '',
						}));
						callback(null, payload);
					});
				});
			};
		});
	});
}());
