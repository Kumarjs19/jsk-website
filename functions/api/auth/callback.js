// Cloudflare Pages Function: /api/auth/callback
// Exchanges GitHub OAuth code for access token and returns it to Decap CMS
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  // Return HTML that posts the token back to Decap CMS opener window
  const html = `<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      console.log('receiveMessage %o', e);
      window.opener.postMessage(
        'authorization:github:success:{\"token\":\"' + ${JSON.stringify(accessToken)} + '\",\"provider\":\"github\"}',
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })()
<\/script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
