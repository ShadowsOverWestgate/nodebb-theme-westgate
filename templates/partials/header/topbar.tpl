<header class="wg-topbar sticky-top" data-wg-topbar>
	<div class="wg-topbar__inner">
		<a class="wg-topbar__brand" href="{relative_path}/" aria-label="{config.siteTitle}">
			<span class="wg-topbar__brand-mark" aria-hidden="true">W</span>
			<span class="wg-topbar__brand-text">
				<span class="wg-topbar__brand-name">{config.siteTitle}</span>
				<span class="wg-topbar__brand-subtitle">Shadows Over Westgate</span>
			</span>
		</a>

		<nav class="wg-topbar__nav" aria-label="[[global:navigation]]">
			<ul id="main-nav" class="wg-topbar__nav-list list-unstyled d-flex align-items-center mb-0">
				{{{ each navigation }}}
				{{{ if displayMenuItem(@root, @index) }}}
				<li class="nav-item {./class}{{{ if ./dropdown }}} dropdown{{{ end }}}" title="{./title}">
					<a class="nav-link navigation-link wg-topbar__nav-link d-flex gap-2 align-items-center {{{ if ./dropdown }}}dropdown-toggle{{{ end }}}" {{{ if ./dropdown }}} href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" {{{ else }}} href="{./route}"{{{ end }}} {{{ if ./id }}}id="{./id}"{{{ end }}}{{{ if ./targetBlank }}} target="_blank"{{{ end }}} {{{ if ./text }}}aria-label="{./text}"{{{ end }}}>
						{{{ if ./iconClass }}}
						<i class="fa fa-fw {./iconClass}" data-content="{./content}"></i>
						{{{ end }}}
						{{{ if ./text }}}<span class="nav-text text-truncate {./textClass}">{./text}</span>{{{ end }}}
						<span component="navigation/count" class="badge rounded-1 bg-primary {{{ if !./content }}}hidden{{{ end }}}">{./content}</span>
					</a>
					{{{ if ./dropdown }}}
					<ul class="dropdown-menu wg-topbar__dropdown p-1 shadow" role="menu">
						{./dropdownContent}
					</ul>
					{{{ end }}}
				</li>
				{{{ end }}}
				{{{ end }}}
			</ul>
		</nav>

		<div class="wg-topbar__forums dropdown">
			<button class="wg-topbar__nav-link wg-topbar__forums-toggle" type="button" data-wg-menu="forums" aria-expanded="false" aria-haspopup="true">
				<span>Forums</span>
				<i class="fa fa-fw fa-chevron-down" aria-hidden="true"></i>
			</button>
			<div class="wg-topbar__panel wg-topbar__panel--forums" data-wg-panel="forums" role="menu">
				<a href="{relative_path}/categories" role="menuitem">[[pages:categories]]</a>
				<a href="{relative_path}/recent" role="menuitem">[[recent:title]]</a>
				<a href="{relative_path}/unread" role="menuitem">[[unread:title]]</a>
				<a href="{relative_path}/popular" role="menuitem">[[pages:popular]]</a>
				<a href="{relative_path}/tags" role="menuitem">[[tags:tags]]</a>
			</div>
		</div>

		<div class="wg-topbar__utilities">
			{{{ if config.loggedIn }}}
			<ul id="wg-topbar-logged-in-menu" class="wg-topbar__utility-list list-unstyled d-flex align-items-center mb-0">
				{{{ if (config.searchEnabled && user.privileges.search:content) }}}
				<li component="sidebar/search" class="nav-item search dropdown position-relative" title="[[global:header.search]]" role="menuitem">
					<!-- IMPORT partials/sidebar/search.tpl -->
				</li>
				{{{ end }}}

				<li component="notifications" class="nav-item notifications dropdown" title="[[global:header.notifications]]" role="menuitem">
					<!-- IMPORT partials/sidebar/notifications.tpl -->
				</li>

				{{{ if canChat }}}
				<li class="nav-item chats dropdown" title="[[global:header.chats]]" role="menuitem">
					<!-- IMPORT partials/sidebar/chats.tpl -->
				</li>
				{{{ end }}}

				<li component="sidebar/drafts" class="nav-item drafts dropdown" title="[[global:header.drafts]]" role="menuitem">
					<!-- IMPORT partials/sidebar/drafts.tpl -->
				</li>

				{{{ if !config.disableCustomUserSkins }}}
				<li class="nav-item wg-topbar__skin">
					<!-- IMPORT partials/skin-switcher.tpl -->
				</li>
				{{{ end }}}

				<li id="user_label" class="nav-item usermenu dropdown" title="{user.username}" role="menuitem">
					<!-- IMPORT partials/sidebar/user-menu.tpl -->
				</li>
			</ul>
			{{{ else }}}
			<ul id="wg-topbar-logged-out-menu" class="wg-topbar__utility-list wg-topbar__utility-list--guest list-unstyled d-flex align-items-center mb-0">
				{{{ if (config.searchEnabled && user.privileges.search:content) }}}
				<li component="sidebar/search" class="nav-item search dropdown position-relative" title="[[global:header.search]]" role="menuitem">
					<!-- IMPORT partials/sidebar/search.tpl -->
				</li>
				{{{ end }}}

				<li class="nav-item">
					<a class="wg-topbar__login" href="{relative_path}/login">[[global:login]]</a>
				</li>
				{{{ if allowRegistration }}}
				<li class="nav-item">
					<a class="wg-topbar__register" href="{relative_path}/register">[[global:register]]</a>
				</li>
				{{{ end }}}
			</ul>
			{{{ end }}}
		</div>

		<button class="wg-topbar__burger" type="button" data-wg-burger aria-expanded="false" aria-controls="wg-topbar-drawer" aria-label="[[global:menu]]">
			<i class="fa fa-fw fa-bars" aria-hidden="true"></i>
		</button>
	</div>

	<div id="wg-topbar-drawer" class="wg-topbar__drawer">
		<div class="wg-topbar__drawer-inner">
			{{{ if (config.searchEnabled && user.privileges.search:content) }}}
			<form class="wg-topbar__drawer-search" action="{relative_path}/search" method="GET" role="search">
				<i class="fa fa-fw fa-search" aria-hidden="true"></i>
				<input autocomplete="off" type="text" name="query" placeholder="[[global:search]]" aria-label="[[search:type-to-search]]">
			</form>
			{{{ end }}}

			<nav class="wg-topbar__drawer-nav" aria-label="[[global:navigation]]">
				{{{ each navigation }}}
				{{{ if displayMenuItem(@root, @index) }}}
				<a class="wg-topbar__drawer-link {./class}" href="{./route}" {{{ if ./targetBlank }}}target="_blank"{{{ end }}}>
					{{{ if ./iconClass }}}<i class="fa fa-fw {./iconClass}" aria-hidden="true"></i>{{{ end }}}
					{{{ if ./text }}}<span class="{./textClass}">{./text}</span>{{{ end }}}
					<span component="navigation/count" class="badge rounded-1 bg-primary {{{ if !./content }}}hidden{{{ end }}}">{./content}</span>
				</a>
				{{{ end }}}
				{{{ end }}}
				<a class="wg-topbar__drawer-link" href="{relative_path}/categories"><i class="fa fa-fw fa-layer-group" aria-hidden="true"></i><span>[[pages:categories]]</span></a>
				<a class="wg-topbar__drawer-link" href="{relative_path}/recent"><i class="fa fa-fw fa-clock" aria-hidden="true"></i><span>[[recent:title]]</span></a>
				<a class="wg-topbar__drawer-link" href="{relative_path}/unread"><i class="fa fa-fw fa-inbox" aria-hidden="true"></i><span>[[unread:title]]</span></a>
				<a class="wg-topbar__drawer-link" href="{relative_path}/tags"><i class="fa fa-fw fa-tags" aria-hidden="true"></i><span>[[tags:tags]]</span></a>
			</nav>

			{{{ if config.loggedIn }}}
			<div class="wg-topbar__drawer-actions">
				<a href="{relative_path}/notifications"><i class="fa fa-fw fa-bell" aria-hidden="true"></i><span>[[global:header.notifications]]</span><span component="notifications/count" class="badge rounded-1 bg-primary {{{ if !unreadCount.notification }}}hidden{{{ end }}}">{unreadCount.notification}</span></a>
				{{{ if canChat }}}
				<a href="{relative_path}/user/{user.userslug}/chats{{{ if user.lastRoomId }}}/{user.lastRoomId}{{{ end }}}"><i class="fa fa-fw fa-comment" aria-hidden="true"></i><span>[[global:header.chats]]</span><span component="chat/count" class="badge rounded-1 bg-primary {{{ if !unreadCount.chat }}}hidden{{{ end }}}">{unreadCount.chat}</span></a>
				{{{ end }}}
				<a href="{relative_path}/user/{user.userslug}"><i class="fa fa-fw fa-user" aria-hidden="true"></i><span>[[user:profile]]</span></a>
				<a href="{relative_path}/user/{user.userslug}/settings"><i class="fa fa-fw fa-gear" aria-hidden="true"></i><span>[[user:settings]]</span></a>
			</div>
			{{{ else }}}
			<div class="wg-topbar__drawer-auth">
				<a class="wg-topbar__login" href="{relative_path}/login">[[global:login]]</a>
				{{{ if allowRegistration }}}
				<a class="wg-topbar__register" href="{relative_path}/register">[[global:register]]</a>
				{{{ end }}}
			</div>
			{{{ end }}}
		</div>
	</div>
</header>
