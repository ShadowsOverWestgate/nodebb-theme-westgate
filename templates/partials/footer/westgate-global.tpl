<footer class="wg-footer" aria-label="Shadows Over Westgate footer">
	<div class="wg-footer__inner">
		<section class="wg-footer__brand" aria-labelledby="wg-footer-title">
			<div class="wg-footer__brand-row">
				<span class="wg-footer__mark" aria-hidden="true"><span></span></span>
				<h2 class="wg-footer__title" id="wg-footer-title">{config.siteTitle}</h2>
			</div>
			<p class="wg-footer__description">
				[[westgate:footer.description]]
			</p>
			<p class="wg-footer__motto">[[westgate:footer.motto]]</p>
		</section>

		<nav class="wg-footer__nav" aria-label="[[westgate:footer.explore]]">
			<h2 class="wg-footer__heading">[[westgate:footer.explore]]</h2>
			<ul class="wg-footer__links">
				<li><a href="{relative_path}/">[[westgate:footer.home]]</a></li>
				<li><a href="{relative_path}/category/1/news">[[westgate:footer.news]]</a></li>
				<li><a href="{relative_path}/gallery">[[westgate:footer.gallery]]</a></li>
				<li><a href="{relative_path}/category/84/developer-blog">[[westgate:footer.dev-blog]]</a></li>
				<li><a href="{relative_path}/recruitment">[[westgate:footer.join-team]]</a></li>
			</ul>
		</nav>

		<nav class="wg-footer__nav" aria-label="[[westgate:footer.community]]">
			<h2 class="wg-footer__heading">[[westgate:footer.community]]</h2>
			<ul class="wg-footer__links">
				<li><a href="{relative_path}/categories">[[westgate:footer.forums]]</a></li>
				<li><a href="{relative_path}/wiki">[[westgate:footer.wiki]]</a></li>
				<li><a href="{relative_path}/register">[[westgate:footer.register]]</a></li>
				<li><a href="{relative_path}/wiki">[[westgate:footer.how-to-join]]</a></li>
			</ul>
		</nav>
	</div>

	<div class="wg-footer__meta">
		<p>[[westgate:footer.copyright, {currentYear}]]</p>
		<p>[[westgate:footer.setting]]</p>
	</div>

	<div class="wg-footer__powered-by" aria-label="Platform credits">
		<a
			class="wg-footer__powered-pill"
			href="https://nodebb.org"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Powered by NodeBB"
		>
			<span class="wg-footer__powered-label">[[westgate:footer.powered-by]]</span>
			<span class="wg-footer__powered-name">NodeBB</span>
		</a>
		<a
			class="wg-footer__powered-pill"
			href="https://tiptap.dev"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Powered by Tiptap"
		>
			<span class="wg-footer__powered-label">[[westgate:footer.powered-by]]</span>
			<span class="wg-footer__powered-name">Tiptap</span>
		</a>
	</div>
</footer>
