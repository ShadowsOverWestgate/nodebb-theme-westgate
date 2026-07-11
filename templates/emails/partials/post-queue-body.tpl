<p><strong>[[post-queue:category]]</strong></p>
<p><a href="{notification.category.url}" style="color: #a8893f;">{{tx(notification.category.name)}}</a></p>
<p>
  <strong
    >{{{ if notification.topic.tid }}}[[post-queue:topic]]{{{ else }}}[[post-queue:title]]{{{
    end }}}</strong
  >
</p>
<p>
  {{{ if notification.topic.url }}}<a href="{notification.topic.url}" style="color: #a8893f;">{notification.topic.title}</a>{{{ else
  }}}{notification.topic.title}{{{ end }}}
</p>
<p><strong>[[post-queue:user]]</strong></p>
<p>
  {{{ if notification.user.url }}}<a href="{notification.user.url}" style="color: #a8893f;">{notification.user.username}</a>{{{ else
  }}}{notification.user.username}{{{ end }}}
</p>
<p style="color: #3a3340;">{{txEscape(notification.content)}}</p>
