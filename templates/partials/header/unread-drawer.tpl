<a class="nav-link dropdown-toggle d-flex gap-2 align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="[[unread:title]]">
	<i class="fa fa-fw fa-inbox" aria-hidden="true"></i>
	<span component="unread/count" class="badge rounded-1 bg-primary {{{ if !unreadCount.topic }}}hidden{{{ end }}}">{unreadCount.topic}</span>
</a>
<ul class="dropdown-menu wg-topbar__dropdown unread-dropdown p-1 shadow" role="menu" data-wg-unread-menu>
	<li data-wg-unread-loading class="dropdown-item disabled"><i class="fa fa-fw fa-spinner fa-spin" aria-hidden="true"></i> [[unread:title]]</li>
	<li data-wg-unread-empty class="hidden"><span class="dropdown-item disabled">[[unread:no-unread-topics]]</span></li>
	<li data-wg-unread-footer><hr class="dropdown-divider"><a class="dropdown-item wg-unread-item--all" href="{relative_path}/unread">[[unread:title]]</a></li>
</ul>
