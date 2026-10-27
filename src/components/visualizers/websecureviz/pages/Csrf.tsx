'use client';
import { TopicLayout } from "../components/TopicLayout";
import { CsrfFlow } from "../components/visuals/CsrfFlow";
import { LoginCsrfFlow } from "../components/visuals/LoginCsrfFlow";

export default function Csrf() {
  return (
    <TopicLayout
      stepNumber={4}
      title="Cross-Site Request Forgery (CSRF)"
      description="CSRF is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated."
      nextPath="/websecurity/csp"
    >
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Classic CSRF: the browser attaches the cookie
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The victim is already logged in. A malicious page makes the browser send a
            request to the bank, and the browser automatically attaches the bank&apos;s
            session cookie. The attacker never reads the cookie; the side effect on the
            server is the payload.
          </p>
        </div>
        <CsrfFlow />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Login CSRF: the callback trusts the wrong session
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            OAuth login has the same shape, but the &quot;cookie&quot; is a signed session
            ID in the callback URL. An attacker can get a valid login link for their own
            session and send it to a victim. When the victim logs in, the victim&apos;s
            access token is attached to the attacker&apos;s session. A signature proves the
            server made the link — not that the browser completing the login is the one
            that asked for it.
          </p>
        </div>
        <LoginCsrfFlow />
      </section>

      <div className="rounded-xl border border-border/80 bg-muted/30 p-5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">The key difference</p>
        <p className="mt-1 leading-relaxed">
          Classic CSRF abuses a cookie the browser attaches automatically. Login CSRF
          abuses a session identifier the <em>attacker</em> already knows. In both cases
          the server must verify intent independently: a CSRF token for cookie-based
          requests, and a browser-bound, single-use <code className="rounded bg-muted px-1 py-0.5 text-xs">state</code> for
          OAuth callbacks. PKCE alone does not fix login CSRF.
        </p>
      </div>
    </TopicLayout>
  );
}
