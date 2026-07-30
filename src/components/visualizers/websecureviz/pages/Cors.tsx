'use client';
import { TopicLayout } from "../components/TopicLayout";
import { CorsPreflight } from "../components/visuals/CorsPreflight";

export default function Cors() {
  return (
    <TopicLayout
      stepNumber={2}
      title="Cross-Origin Resource Sharing (CORS)"
      description="CORS is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served."
      nextPath="/xss"
    >
      <CorsPreflight />
    </TopicLayout>
  );
}
