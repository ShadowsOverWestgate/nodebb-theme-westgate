# Topbar Unread Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Unread" dropdown to the topbar utilities (next to notifications) with a live unread-topic count badge and a fetched list of unread topics.

**Architecture:** A new template partial imported by `topbar.tpl` gives the button + badge (core's `component="unread/count"` socket updates make the badge live for free). A small addition to `public/client.js` fetches `/api/unread` on dropdown open and renders topic links with plain DOM building. SCSS reuses the existing `.wg-topbar__dropdown` vocabulary.

**Tech Stack:** NodeBB templates (benchpress `.tpl`), jQuery/Bootstrap 5 dropdown events, NodeBB client `api` module, SCSS. Tests are plain-Node assert scripts in `tests/` (run with `node tests/<file>.test.js`).

## Global Constraints

- NixOS host: no global installs; run tests with plain `node`.
- One branch, one PR: all commits go on the existing `feat/topbar-unread-drawer` branch.
- Verification against the dev container in `../sow-nodebb` (`make dev`, `make dev-build`), forum at http://localhost:4567. Theme edits need `make dev-build` before they show up.
- Titles from the API must be inserted with `textContent` (never HTML strings) — trust boundary.

---

### Task 1: Unread drawer template + mobile drawer link

**Files:**
- Create: `templates/partials/header/unread-drawer.tpl`
- Modify: `templates/partials/header/topbar.tpl` (logged-in utility list, before the notifications `<li>`; and the drawer-actions block)
- Test: `tests/global-topbar-contract.test.js` (append assertions)

**Interfaces:**
- Produces: `<li component="unread" ...>` containing a dropdown toggle and `<ul ... data-wg-unread-menu>`; Task 2's JS binds to `.wg-topbar [component="unread"]` and renders into `[data-wg-unread-menu]`.

- [ ] **Step 1: Write the failing test** — append to `tests/global-topbar-contract.test.js`:

```js
const unreadDrawer = read('templates/partials/header/unread-drawer.tpl');
assertIncludes(
	topbar,
	'<!-- IMPORT partials/header/unread-drawer.tpl -->',
	'Topbar should mount the unread drawer before notifications'
);
assert(
	topbar.indexOf('partials/header/unread-drawer.tpl') < topbar.indexOf('partials/sidebar/notifications.tpl'),
	'Unread drawer should sit before the notifications item'
);
assertIncludes(
	unreadDrawer,
	'component="unread/count"',
	'Unread toggle should carry the live core count badge'
);
assertIncludes(
	unreadDrawer,
	'data-wg-unread-menu',
	'Unread dropdown menu should expose the JS mount hook'
);
assertMatches(
	topbar,
	/href="\{relative_path\}\/unread"[^>]*>[\s\S]*?component="unread\/count"/,
	'Mobile drawer actions should include an Unread link with count badge'
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/global-topbar-contract.test.js`
Expected: FAIL with `templates/partials/header/unread-drawer.tpl should exist`

- [ ] **Step 3: Create `templates/partials/header/unread-drawer.tpl`**

```html
<a class="nav-link dropdown-toggle d-flex gap-2 align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="[[unread:title]]">
	<i class="fa fa-fw fa-inbox" aria-hidden="true"></i>
	<span component="unread/count" class="badge rounded-1 bg-primary {{{ if !unreadCount.topic }}}hidden{{{ end }}}">{unreadCount.topic}</span>
</a>
<ul class="dropdown-menu wg-topbar__dropdown unread-dropdown p-1 shadow" role="menu" data-wg-unread-menu>
	<li class="dropdown-item disabled"><i class="fa fa-fw fa-spinner fa-spin" aria-hidden="true"></i> [[unread:title]]</li>
</ul>
```

- [ ] **Step 4: Mount it in `topbar.tpl`** — insert before the notifications `<li>` (line 40):

```html
				<li component="unread" class="nav-item unread dropdown" title="[[unread:title]]">
					<!-- IMPORT partials/header/unread-drawer.tpl -->
				</li>

```

And in the drawer-actions block, insert before the notifications `<a>` (line 112):

```html
				<a href="{relative_path}/unread"><i class="fa fa-fw fa-inbox" aria-hidden="true"></i><span>[[unread:title]]</span><span component="unread/count" class="badge rounded-1 bg-primary {{{ if !unreadCount.topic }}}hidden{{{ end }}}">{unreadCount.topic}</span></a>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node tests/global-topbar-contract.test.js`
Expected: exits 0, no output

- [ ] **Step 6: Commit**

```bash
git add templates/partials/header/unread-drawer.tpl templates/partials/header/topbar.tpl tests/global-topbar-contract.test.js
git commit -m "feat: add unread drawer button to topbar"
```

---

### Task 2: Client JS — fetch and render unread topics on open

**Files:**
- Modify: `public/client.js` (inside `initWestgateTopbar()`, next to the existing `shown.bs.dropdown.westgateTopbar` handler)
- Test: `tests/unread-drawer-client.test.js` (new)

**Interfaces:**
- Consumes: `[component="unread"]` / `[data-wg-unread-menu]` markup from Task 1; NodeBB client `api.get('/unread', {}, cb)` whose payload has `topics: [{ title, slug, category: { name } }, ...]`.
- Produces: `window.westgateTheme.renderUnreadMenu(menuEl, topics)` (exported for the test): clears `menuEl`, appends up to 10 `<li><a class="dropdown-item" href="<relative_path>/topic/<slug>">` items with title text and a category `<small>`, then a footer link to `/unread`. Empty list → single disabled item `[[unread:no-unread-topics]]`.

- [ ] **Step 1: Write the failing test** — create `tests/unread-drawer-client.test.js`:

```js
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const client = fs.readFileSync(path.join(__dirname, '..', 'public', 'client.js'), 'utf8');

assert(
	client.includes("'show.bs.dropdown.westgateUnread'"),
	'client.js should fetch unread topics when the unread dropdown opens'
);
assert(
	client.includes("api.get('/unread'"),
	'client.js should load the unread list from the /unread API'
);
assert(
	client.includes('renderUnreadMenu'),
	'client.js should expose the unread menu renderer'
);
assert(
	/textContent/.test(client) && !/innerHTML\s*=[^=]*title/.test(client),
	'Topic titles must be inserted via textContent, never innerHTML'
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/unread-drawer-client.test.js`
Expected: FAIL with "client.js should fetch unread topics when the unread dropdown opens"

- [ ] **Step 3: Implement.** In `public/client.js`, add above `initWestgateTopbar()`:

```js
	function renderUnreadMenu(menuEl, topics) {
		if (!menuEl) {
			return;
		}

		menuEl.textContent = '';
		const relativePath = (window.config && window.config.relative_path) || '';

		function addItem(node) {
			const li = document.createElement('li');
			li.appendChild(node);
			menuEl.appendChild(li);
		}

		const list = (topics || []).slice(0, 10);
		if (!list.length) {
			const empty = document.createElement('span');
			empty.className = 'dropdown-item disabled';
			empty.textContent = '[[unread:no-unread-topics]]';
			addItem(empty);
		}

		list.forEach((topic) => {
			const link = document.createElement('a');
			link.className = 'dropdown-item wg-unread-item text-truncate';
			link.href = `${relativePath}/topic/${topic.slug}`;
			link.textContent = topic.title;
			if (topic.category && topic.category.name) {
				const category = document.createElement('small');
				category.className = 'wg-unread-item__category';
				category.textContent = topic.category.name;
				link.appendChild(category);
			}
			addItem(link);
		});

		const divider = document.createElement('hr');
		divider.className = 'dropdown-divider';
		addItem(divider);

		const seeAll = document.createElement('a');
		seeAll.className = 'dropdown-item wg-unread-item--all';
		seeAll.href = `${relativePath}/unread`;
		seeAll.textContent = '[[unread:title]]';
		addItem(seeAll);

		if (window.require) {
			window.require(['translator'], function (translator) {
				translator.translate(menuEl.innerHTML, (translated) => {
					menuEl.innerHTML = translated;
				});
			});
		}
	}
```

And inside `initWestgateTopbar()`, next to the existing search-focus handler:

```js
		$(document)
			.off('show.bs.dropdown.westgateUnread')
			.on('show.bs.dropdown.westgateUnread', '.wg-topbar [component="unread"]', function () {
				const menuEl = this.querySelector('[data-wg-unread-menu]');
				require(['api'], function (api) {
					api.get('/unread', {}, function (err, data) {
						if (err) {
							renderUnreadMenu(menuEl, []);
							return;
						}
						renderUnreadMenu(menuEl, data && data.topics);
					});
				});
			});
```

And with the other exports near the bottom:

```js
	window.westgateTheme.renderUnreadMenu = renderUnreadMenu;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/unread-drawer-client.test.js && node tests/global-topbar-contract.test.js`
Expected: exits 0, no output

- [ ] **Step 5: Commit**

```bash
git add public/client.js tests/unread-drawer-client.test.js
git commit -m "feat: load unread topics into topbar drawer on open"
```

---

### Task 3: SCSS for unread rows

**Files:**
- Modify: `scss/westgate/_topbar.scss` (append after the `.notifications-dropdown` width block, ~line 177)
- Test: `tests/global-topbar-contract.test.js` (append)

**Interfaces:**
- Consumes: `.unread-dropdown`, `.wg-unread-item`, `.wg-unread-item__category` class names from Tasks 1–2.

- [ ] **Step 1: Write the failing test** — append to `tests/global-topbar-contract.test.js`:

```js
assertIncludes(
	stylesheet,
	'.unread-dropdown',
	'Topbar styles should cover the unread dropdown'
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/global-topbar-contract.test.js`
Expected: FAIL with "Topbar styles should cover the unread dropdown"

- [ ] **Step 3: Implement** — in `scss/westgate/_topbar.scss`, extend the existing width rule so it reads:

```scss
.wg-topbar .notifications-dropdown,
.wg-topbar .chats-dropdown,
.wg-topbar .drafts-dropdown,
.wg-topbar .unread-dropdown {
  width: min(24rem, calc(100vw - 1.5rem));
}
```

and append:

```scss
.wg-topbar .wg-unread-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.wg-topbar .wg-unread-item__category {
  margin-left: auto;
  flex-shrink: 0;
  opacity: 0.7;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/global-topbar-contract.test.js`
Expected: exits 0, no output

- [ ] **Step 5: Commit**

```bash
git add scss/westgate/_topbar.scss tests/global-topbar-contract.test.js
git commit -m "feat: style topbar unread dropdown rows"
```

---

### Task 4: Verify in the sow-nodebb dev container (Playwright)

**Files:** none (verification only)

**Interfaces:**
- Consumes: the running dev forum at http://localhost:4567 (`../sow-nodebb`).

- [ ] **Step 1: Build and start the dev forum.** In `../sow-nodebb`: confirm `.env` has `PLUGIN_PATH=../sow-nodebb-theme`, `PLUGIN_ID=nodebb-theme-westgate`, `EXTRA_PLUGINS=nodebb-plugin-westgate-wiki`, then:

```bash
make dev
make dev-build
```

Expected: NodeBB build succeeds; http://localhost:4567 responds.

- [ ] **Step 2: Playwright checks** (playwright-skill / MCP browser tools) against http://localhost:4567, logged in with the admin creds from `../sow-nodebb/.env`:
  - The topbar utility list shows the unread item (`li[component="unread"]`) immediately before the notifications item.
  - With unread topics present (create a topic from a second account or incognito post), the badge `[component="unread/count"]` is visible with a number.
  - Clicking the toggle opens the dropdown and lists unread topic links; clicking one lands on that topic.
  - The dropdown footer link lands on `/unread`.
  - At mobile width (~390px), the burger drawer shows the Unread row with badge.

Expected: all checks pass; screenshot the open dropdown for the PR.

- [ ] **Step 3: Run the full local test suite**

```bash
for t in tests/*.test.js; do node "$t" || exit 1; done
```

Expected: exits 0.

- [ ] **Step 4: Commit any fixes made during verification, then push and open the PR** on the existing `feat/topbar-unread-drawer` branch.
