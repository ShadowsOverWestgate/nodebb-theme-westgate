# Build note: the email templates import `emails/partials/header.html` and `emails/partials/footer.html` through NodeBB's `emails/` view namespace.

# Email templates

HTML email templates for the Westgate theme. NodeBB renders these and mails
them to users on various events (password reset, digest, ban, etc.).

## How NodeBB uses them

- **Discovery.** NodeBB looks for email templates under a theme/plugin's
  templates directory. Core ships them in `src/views/emails/*.tpl`; a theme
  overrides one by shipping a file of the same name. The `email/` directory
  here is built into NodeBB's `emails/` view namespace, so `email/reset.html`
  overrides the core `reset` template. Run `./nodebb build` after editing so
  the changes are compiled into `build/`.
- **Template engine.** [Benchpress](https://github.com/benchpressjs/benchpressjs),
  the same engine as the rest of the theme's `.tpl` files. Syntax:
  - `{var}` / `{obj.field}` — interpolate a value from the params object.
  - `{{{ if cond }}} … {{{ else }}} … {{{ end }}}` — conditionals
    (e.g. `{{{ if logo.src }}}`, `{{{ if showUnsubscribe }}}`, `{{{ if rtl }}}`).
  - `[[namespace:key]]` — i18n translation key, resolved server-side after
    render (e.g. `[[email:reset.cta]]`, `[[email:greeting-no-name]]`). Strings
    live in NodeBB's language files, not here.
- **Send path.** `Emailer.send(template, uid, params)` →
  `sendToEmail` → `renderAndTranslate('emails/<name>', params)`. `<name>` is
  the filename without extension (`reset.html` → template name `reset`).
- **Default params** available in every template: `url`, `site_title`,
  `logo.{src,width,height}`, `uid`, `username`, `displayname`, `rtl`, plus
  `showUnsubscribe` / `unsubUrl` for digest- and notification-type mails.
  Each template also gets its own event-specific params (see table).

## Templates and what triggers them

| File | NodeBB event | Notable params |
|------|--------------|----------------|
| `welcome.html` | New registration needing email confirmation | confirmation link |
| `verify-email.html` | User adds/changes an email and must confirm it | confirmation link |
| `reset.html` | User requests a password reset | `{reset_link}` |
| `reset_notify.html` | Confirmation that the password was changed | — |
| `registration_accepted.html` | Admin approves a queued registration | — |
| `banned.html` | User is banned | ban reason / expiry |
| `invitation.html` | A user is invited to the forum | invite link |
| `notification.html` | Per-event notification (reply, mention, etc.); also post-queue items | `showUnsubscribe`, `unsubUrl` |
| `digest.html` | Scheduled activity digest (daily/weekly/monthly) | unread topics, `showUnsubscribe` |
| `test.html` | "Send test email" button in the ACP | — |

## Partials

`partials/` holds fragments imported by the templates above. Every
non-partial template starts with `<!-- IMPORT emails/partials/header.html -->`
and ends with `<!-- IMPORT emails/partials/footer.html -->`.

- `header.html` — shared email head/header markup.
- `footer.html` — shared footer with the unsubscribe block
  (`{{{ if showUnsubscribe }}}`).
- `post-queue-body.html` — queued-post notification body fragment (category,
  topic, author, content), maintained for use by a notification branch/template.

## Editing notes

- These are emails: inline CSS, table layout, MSO/Outlook conditional
  comments. Keep that structure — don't refactor into modern CSS.
- Brand colors are literal inline hex because Outlook/Gmail strip `var()`.
  `scss/westgate/_tokens.scss` holds the source values but is not available at
  runtime; keep the dark letterhead band + light cream card pattern. Preheader
  copy lives in `languages/en-GB/email.json`.
- Don't hardcode user-facing copy; add/replace `[[email:…]]` keys and define
  them in the language files.
- Run `node scripts/check-emails.js` after converting templates. It enforces
  the shared-partial structure by requiring a header import, footer import,
  and `<!-- preheader -->` marker in each `email/*.html` file.
- Rebuild (`./nodebb build`) and use the ACP test-email button to verify.

## Deliverability — out of scope for these templates (ops/mail layer)

Templates cannot affect these; they are flagged so the brand reskin is not
mistaken for a complete anti-spam fix:

- **SPF / DKIM / DMARC** records + alignment for the sending domain.
- A From-address on a domain with sending reputation (not a bare/shared host).
- `List-Unsubscribe` / `List-Unsubscribe-Post` (one-click) **headers** — set by
  the mail layer, distinct from the in-body unsubscribe link the footer renders.
- A dedicated sending domain/subdomain and IP warm-up if volume grows.

## References

- [NodeBB themes](https://docs.nodebb.org/development/themes/)
- [NodeBB templating](https://docs.nodebb.org/development/themes/templates/)
- [Email templating discussion](https://community.nodebb.org/topic/1502/email-templating)
