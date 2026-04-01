// Cloudflare Pages Function: /api/auth
// Redirects user to GitHub OAuth authorization
export async function onRequestGet(context) {
  const { env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const redirectUri = `https://jsk-website.pages.dev/api/auth/callback`;
  const scope = 'repo,user';
  const state = crypto.randomUUID();

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', scope);
  githubAuthUrl.searchParams.set('state', state);

  return Response.redirect(githubAuthUrl.toString(), 302);
}
