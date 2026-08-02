'use client';
import { TopicLayout } from "../components/TopicLayout";
import { XssInjection } from "../components/visuals/XssInjection";

export default function Xss() {
  return (
    <TopicLayout
      stepNumber={3}
      title="Cross-Site Scripting (XSS)"
      description="XSS attacks occur when an attacker uses a web application to send malicious code, generally in the form of a browser side script, to a different end user."
      nextPath="/websecurity/csrf"
    >
      <XssInjection />
    </TopicLayout>
  );
}
