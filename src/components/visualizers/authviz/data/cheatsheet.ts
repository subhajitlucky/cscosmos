export interface AuthCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const AUTH_CHEATSHEET: AuthCheatSheetSection[] = [
  {
    id: 'oauth-patterns',
    title: 'OAuth 2.0 PKCE & Token Patterns',
    category: 'OAuth & OIDC',
    snippets: [
      {
        title: 'PKCE Code Verifier & Challenge Generator (Browser Web Crypto)',
        description: 'Generates cryptographic S256 challenge for OAuth 2.0 PKCE in standard browser environments',
        code: `async function generatePKCE() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const verifier = btoa(String.fromCharCode(...array))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
    
  return { verifier, challenge };
}`,
        tip: 'Store the verifier in sessionStorage or memory until the callback returns.'
      }
    ]
  },
  {
    id: 'jwt-security',
    title: 'JWT Verification & RS256 JWKS',
    category: 'JWT & Security',
    snippets: [
      {
        title: 'Express.js RS256 JWT Middleware with JWKS Client',
        description: 'Verifies RS256 JWT tokens using dynamic public keys from Auth0/Okta JWKS',
        code: `import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://auth.corp.io/.well-known/jwks.json'
  }) as any,
  audience: 'https://api.corp.io',
  issuer: 'https://auth.corp.io/',
  algorithms: ['RS256']
});`,
        tip: 'Always enable JWKS caching to avoid calling the IdP on every API request.'
      }
    ]
  }
];
