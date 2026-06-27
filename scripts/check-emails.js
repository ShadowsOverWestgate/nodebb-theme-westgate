#!/usr/bin/env node
// ponytail: 30-line structural guard, not a render test. Catches drift, not pixels.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'email');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html'));

const failures = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const trimmed = src.trim();
  const checks = [
    [
      trimmed.startsWith('<!-- IMPORT emails/partials/header.html -->'),
      'header IMPORT must be first',
    ],
    [
      trimmed.endsWith('<!-- IMPORT emails/partials/footer.html -->'),
      'footer IMPORT must be last',
    ],
    [/<!-- preheader -->/, 'missing preheader marker'],
  ];
  for (const [check, msg] of checks) {
    if (check instanceof RegExp ? !check.test(src) : !check) failures.push(`${f}: ${msg}`);
  }
}

if (failures.length) {
  console.error('Email template check FAILED:\n' + failures.join('\n'));
  process.exit(1);
}

console.log(`Email template check passed (${files.length} templates).`);
