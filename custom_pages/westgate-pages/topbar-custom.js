/* ============================================================================
   SHADOWS OVER WESTGATE — top bar controller
   ----------------------------------------------------------------------------
   Paste into ACP -> Settings -> Custom Content -> "Custom JavaScript".
   (In the live theme this can instead live in the theme's client-side bundle.)

   WHY THIS FILE EXISTS
   - The static page (join-the-team.html) needs NO JavaScript; it is pure
     HTML/CSS (the only inline bit is an <img onerror> fallback). Home lives
     in the westgate-pages plugin now (templates/home.tpl).
   - The TOP BAR needs this small controller for: Forums mega-menu, inline
     search, the mobile burger/drawer, and the drawer's Forums accordion.

   NODEBB-SPECIFIC NOTES
   - NodeBB is a single-page app: it swaps #content on navigation instead of
     reloading. So we DON'T bind to specific nodes on DOMContentLoaded — we use
     event delegation on `document`, which keeps working across page changes and
     even if the header is re-rendered.
   - Inline <script> inside an HTML widget is sanitised/unreliable, which is the
     other reason the logic lives here rather than in the pasted markup.
   - The live notification / chat / user dropdowns come from Harmony and carry
     their OWN JavaScript. If you keep those, you do NOT need this script to open
     them — only the Forums menu, search, and mobile drawer below.
   - The preview-only member/guest switch from top-bar.html is intentionally
     omitted; in production the cluster is chosen server-side ({{{ if loggedIn }}}).
   ========================================================================== */
(function () {
  'use strict';

  function bar() { return document.querySelector('.wg-topbar'); }

  function closeMenus(exceptKey) {
    var b = bar();
    if (!b) return;
    b.querySelectorAll('[data-wg-panel]').forEach(function (p) {
      if (p.getAttribute('data-wg-panel') !== exceptKey) p.classList.remove('is-open');
    });
    b.querySelectorAll('[data-wg-menu]').forEach(function (t) {
      if (t.getAttribute('data-wg-menu') !== exceptKey) t.setAttribute('aria-expanded', 'false');
    });
  }

  function closeSearch() {
    var b = bar();
    if (!b) return;
    var input = b.querySelector('[data-wg-search-input]');
    if (input && input.value.trim() !== '') return; // keep open if the user typed
    b.classList.remove('is-searching');
  }

  var CHECK_SVG = '<svg class="chk" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 7l3 3 5-6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function applyPresence(key) {
    var b = bar();
    if (!b) return;
    var row = b.querySelector('[data-presence="' + key + '"]');
    if (!row) return;
    b.setAttribute('data-presence', key); // switches the --tb-presence avatar ring
    b.querySelectorAll('[data-presence]').forEach(function (x) {
      x.classList.remove('is-active');
      var c = x.querySelector('.chk'); if (c) c.remove();
    });
    row.classList.add('is-active');
    if (!row.querySelector('.chk')) row.insertAdjacentHTML('beforeend', CHECK_SVG);
  }
  function restorePresence() {
    try {
      var saved = localStorage.getItem('wg-topbar-presence');
      if (saved) applyPresence(saved);
    } catch (_) {}
  }

  // ---- one delegated click handler for the whole bar ----
  document.addEventListener('click', function (e) {
    var b = bar();
    if (!b) return;

    // dropdown trigger (Forums / and any future data-wg-menu)
    var trigger = e.target.closest && e.target.closest('[data-wg-menu]');
    if (trigger && b.contains(trigger)) {
      e.stopPropagation();
      var key = trigger.getAttribute('data-wg-menu');
      var panel = b.querySelector('[data-wg-panel="' + key + '"]');
      var open = panel && panel.classList.contains('is-open');
      closeMenus(open ? null : key);
      if (panel) panel.classList.toggle('is-open', !open);
      trigger.setAttribute('aria-expanded', String(!open));
      return;
    }

    // clicks inside an open panel shouldn't close it
    if (e.target.closest && e.target.closest('[data-wg-panel]')) {
      e.stopPropagation();
      return;
    }

    // search toggle
    var searchBtn = e.target.closest && e.target.closest('[data-wg-search]');
    if (searchBtn && b.contains(searchBtn)) {
      e.stopPropagation();
      b.classList.add('is-searching');
      closeMenus(null);
      var input = b.querySelector('[data-wg-search-input]');
      if (input) setTimeout(function () { input.focus(); }, 60);
      return;
    }

    // mobile burger
    var burger = e.target.closest && e.target.closest('[data-wg-burger]');
    if (burger && b.contains(burger)) {
      e.stopPropagation();
      var drawerOpen = b.classList.toggle('is-drawer');
      burger.setAttribute('aria-expanded', String(drawerOpen));
      return;
    }

    // drawer Forums accordion
    var sub = e.target.closest && e.target.closest('[data-wg-drawer-sub]');
    if (sub && b.contains(sub)) {
      var subOpen = sub.getAttribute('aria-expanded') === 'true';
      sub.setAttribute('aria-expanded', String(!subOpen));
      return;
    }

    // presence / status selector (drives the avatar ring). LIVE: also POST the
    // new status to NodeBB (e.g. socket.emit('user.setStatus', ...)) so it
    // persists server-side; here it persists in localStorage so it sticks.
    var presence = e.target.closest && e.target.closest('[data-presence]');
    if (presence && b.contains(presence)) {
      e.stopPropagation();
      var key = presence.getAttribute('data-presence');
      applyPresence(key);
      try { localStorage.setItem('wg-topbar-presence', key); } catch (_) {}
      return;
    }

    // ----- pop-out actions -----
    // NOTE: in the LIVE theme the pop-outs ARE Harmony's partials
    // (drafts.tpl / notifications.tpl / chats.tpl), and these actions are
    // handled by NodeBB core JS (component="notifications/list", drafts/delete,
    // chats/mark-all-read, etc). The handlers below only drive THIS preview's
    // static rows — drop them when wiring the real includes.

    // notification filter tabs
    var tab = e.target.closest && e.target.closest('.wg-pop__tab');
    if (tab && b.contains(tab)) {
      e.stopPropagation();
      tab.parentElement.querySelectorAll('.wg-pop__tab').forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var unreadOnly = tab.getAttribute('data-filter') === 'unread';
      var nlist = tab.closest('[data-wg-panel]').querySelector('[data-component="notifications/list"]');
      nlist.querySelectorAll('.wg-notif').forEach(function (row) {
        var hide = unreadOnly && !row.classList.contains('unread');
        row.style.display = hide ? 'none' : '';
        var sep = row.nextElementSibling;
        if (sep && sep.classList.contains('wg-pop__sep')) sep.style.display = hide ? 'none' : '';
      });
      return;
    }

    // mark-all-read
    var markBtn = e.target.closest && e.target.closest('.wg-pop__btn:not(.wg-pop__btn--primary)');
    if (markBtn && b.contains(markBtn)) {
      e.stopPropagation();
      var mPanel = markBtn.closest('[data-wg-panel]');
      mPanel.querySelectorAll('.unread').forEach(function (r) { r.classList.remove('unread'); });
      mPanel.querySelectorAll('.wg-notif__dot').forEach(function (d) { d.remove(); });
      var mKey = mPanel.getAttribute('data-wg-panel');
      var mBadge = b.querySelector('.wg-topbar__badge[data-count="' + mKey + '"]');
      if (mBadge) mBadge.style.display = 'none';
      var tc = mPanel.querySelector('.wg-pop__tabcount'); if (tc) tc.textContent = '0';
      return;
    }

    // draft delete
    var del = e.target.closest && e.target.closest('.wg-draft__del');
    if (del && b.contains(del)) {
      e.preventDefault(); e.stopPropagation();
      var dRow = del.closest('.wg-draft');
      var dSep = dRow.nextElementSibling || dRow.previousElementSibling;
      if (dSep && dSep.classList && dSep.classList.contains('wg-pop__sep')) dSep.remove();
      dRow.remove();
      var dList = b.querySelector('[data-component="drafts/list"]');
      var dBadge = b.querySelector('.wg-topbar__badge[data-count="drafts"]');
      var left = dList.querySelectorAll('.wg-draft').length;
      if (dBadge) dBadge.textContent = left;
      if (left === 0) {
        if (dBadge) dBadge.style.display = 'none';
        var empty = dList.querySelector('.wg-pop__empty'); if (empty) empty.hidden = false;
      }
      return;
    }

    // outside click: close everything that floats
    closeMenus(null);
    closeSearch();
  });

  // ---- Escape closes everything ----
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var b = bar();
    if (!b) return;
    closeMenus(null);
    b.classList.remove('is-searching');
    b.classList.remove('is-drawer');
    var burger = b.querySelector('[data-wg-burger]');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  });

  // ---- close the mobile drawer after an in-app navigation ----
  if (window.$ && typeof $.fn === 'object') {
    $(window).on('action:ajaxify.end', function () {
      var b = bar();
      if (!b) return;
      b.classList.remove('is-drawer', 'is-searching');
      closeMenus(null);
      restorePresence();
    });
  }

  // ---- restore the saved status on first load ----
  if (document.readyState !== 'loading') restorePresence();
  else document.addEventListener('DOMContentLoaded', restorePresence);
})();
