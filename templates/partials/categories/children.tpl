<ul class="list-unstyled category-children row row-cols-1 row-cols-md-2 g-2 my-1 w-100">
	{{{ each ./children }}}
	{{{ if !./isSection }}}
	<li data-cid="{./cid}" class="category-children-item small {./class}">
		<div class="westgate-category-child d-flex gap-1">
			{{buildCategoryIcon(@value, "18px", "westgate-child-icon rounded-1")}}
			<a href="{{{ if ./link }}}{./link}{{{ else }}}{config.relative_path}/category/{./slug}{{{ end }}}" class="text-reset fw-semibold flex-1">{./name}</a>
		</div>
	</li>
	{{{ end }}}
	{{{ end }}}
</ul>
