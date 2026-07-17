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
	client.includes("'/api/unread'"),
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
