'use client';
import { TopicLayout } from "../components/TopicLayout";
import { OriginIsolation } from "../components/visuals/OriginIsolation";

export default function BrowserSecurity() {
  return (
    <TopicLayout
      stepNumber={1}
      title="Browser Security Foundations"
      description="Before diving into attacks, we must understand the trust boundaries that the web is built upon. The Same-Origin Policy (SOP) is the cornerstone of this model."
      nextPath="/websecurity/cors"
    >
      <OriginIsolation />

      <div className="prose dark:prose-invert max-w-none">
        <h3>The Same-Origin Policy (SOP)</h3>
        <p>
          The SOP restricts how a document or script loaded from one origin can interact with a resource from another origin. 
          An origin is defined by the protocol, port (if specified), and host.
        </p>
      </div>
    </TopicLayout>
  );
}
