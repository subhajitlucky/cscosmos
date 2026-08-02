'use client';
import { TopicLayout } from "../components/TopicLayout";
import { CspBuilder } from "../components/visuals/CspBuilder";

export default function Csp() {
  return (
    <TopicLayout
      stepNumber={5}
      title="Content Security Policy (CSP)"
      description="CSP is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks."
      nextPath="/websecurity/exercises"
    >
      <CspBuilder />
    </TopicLayout>
  );
}
