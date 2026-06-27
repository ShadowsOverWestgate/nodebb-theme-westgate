<!-- IMPORT emails/partials/header.tpl -->
<!-- preheader -->
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">[[email:banned.preheader]]</div>
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<!-- Email Body : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
<tr>
<td bgcolor="#fbf7ef">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
<tr>
<td style="padding: 40px 40px 6px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<h1 style="margin: 0; font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 24px; line-height: 27px; color: #1a1418; font-weight: normal;">[[email:greeting-with-name, {username}]]</h1>
</td>
</tr>
<tr>
<td style="padding: 0px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<h1 style="margin: 0 0 10px 0; font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 21px; color: #9a9086; font-weight: normal;">[[email:banned.text1, {username}, {site_title}]]</h1>
</td>
</tr>
{{{ if reason }}}
<tr>
<td style="padding: 20px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<p style="margin: 0">[[email:banned.text3]]</p>
<div style="margin: 0; padding: 6px 0px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; line-height: 26px; color: #3a3340;">
{reason}
</div>
</td>
</tr>
{{{ end }}} {{{ if until }}}
<tr>
<td style="padding: 20px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<p style="margin: 0">[[email:banned.text2, {until}]]</p>
</td>
</tr>
{{{ end }}}
</table>
</td>
</tr>
</table>
<!-- Email Body : END -->
<!-- IMPORT emails/partials/footer.tpl -->
