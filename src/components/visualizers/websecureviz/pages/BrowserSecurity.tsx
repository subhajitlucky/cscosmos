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

      {/* Explicit typography rather than `prose dark:prose-invert`: the
          @tailwindcss/typography plugin is not installed (tailwind.config.js has
          `plugins: []`), so those classes emitted no CSS and this block rendered
          with no heading or paragraph spacing at all. */}
      <div className="max-w-none space-y-3">
        <h3 className="text-lg font-bold text-foreground">The Same-Origin Policy (SOP)</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The SOP restricts how a document or script loaded from one origin can interact with a resource from another origin. 
          An origin is defined by the protocol, port (if specified), and host.
        </p>
      </div>
    </TopicLayout>
  );
}
