<p><strong>[[post-queue:category]]</strong></p>
<p><a href="{category.url}" style="color: #a8893f;">{category.name}</a></p>
<p>
  <strong
    >{{{ if topic.tid }}}[[post-queue:topic]]{{{ else }}}[[post-queue:title]]{{{
    end }}}</strong
  >
</p>
<p>
  {{{ if topic.url }}}<a href="{topic.url}" style="color: #a8893f;">{topic.title}</a>{{{ else
  }}}{topic.title}{{{ end }}}
</p>
<p><strong>[[post-queue:user]]</strong></p>
<p>
  {{{ if user.url }}}<a href="{user.url}" style="color: #a8893f;">{user.username}</a>{{{ else
  }}}{user.username}{{{ end }}}
</p>
<p style="color: #3a3340;">{content}</p>
