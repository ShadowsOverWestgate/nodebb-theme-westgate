<!-- IMPORT emails/partials/header.tpl -->
<!-- preheader -->
<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">[[email:welcome.preheader]]</div>
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
<h1 style="margin: 0 0 10px 0; font-family: Cinzel, Georgia, 'Times New Roman', serif; font-size: 18px; line-height: 21px; color: #9a9086; font-weight: normal;">[[email:email.verify.text1]]</h1>
</td>
</tr>
<tr>
<td style="padding: 20px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<p style="margin: 0">[[email:email.verify.text2]]</p>
</td>
</tr>
<tr>
<td style="padding: 20px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<p style="margin: 0">[[email:email.verify.text3, {email}]]</p>
</td>
</tr>
<tr>
<td style="padding: 32px 40px; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 20px; color: #3a3340;">
<!-- Button : BEGIN -->
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto">
<tr>
<td style="border-radius: 3px; background: #2a1222; text-align: center;" class="button-td">
<a href="{confirm_link}" style="background: #2a1222; border: 15px solid #2a1222; border-color: #c2a35a; font-family: Jost, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;" class="button-a">
<span style="color: #f4ecd8" class="button-link">[[email:welcome.cta]] &rarr;</span>
</a>
</td>
</tr>
</table>
<!-- Button : END -->
</td>
</tr>
</table>
</td>
</tr>
</table>
<!-- Email Body : END -->
<!-- IMPORT emails/partials/footer.tpl -->
