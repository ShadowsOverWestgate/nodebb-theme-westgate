<div class="flex-fill d-flex flex-column justify-content-center">
	<h2 class="fw-semibold tracking-tight text-center">[[westgate:404.title]]</h2>

	<div class="mx-auto">
		<div class="d-flex flex-column gap-3 justify-content-center text-center">
			<div class="mx-auto p-4">
				<i class="text-secondary fa fa-fw fa-4x {{{ if icon }}}{icon}{{{ else }}}fa-mask{{{ end }}}"></i>
			</div>
			<p class="mb-0">{{{ if error }}}{tx(error)}{{{ else }}}[[westgate:404.message, {config.relative_path}]]{{{ end }}}</p>
		</div>
	</div>
</div>
