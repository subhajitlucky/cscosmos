'use client';
import { TopicLayout } from "../components/TopicLayout";
import { CsrfFlow } from "../components/visuals/CsrfFlow";

export default function Csrf() {
  return (
    <TopicLayout
      stepNumber={4}
      title="Cross-Site Request Forgery (CSRF)"
      description="CSRF is an attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated."
      nextPath="/websecurity/csp"
    >
      <CsrfFlow />
    </TopicLayout>
  );
}
