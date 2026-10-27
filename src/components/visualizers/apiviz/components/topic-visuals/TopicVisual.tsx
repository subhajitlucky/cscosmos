'use client';

import type { Topic } from '../../data/learning-path';
import { Micro } from './chrome';
import { AuthGateVisual } from './AuthGateVisual';
import { CacheFlowVisual } from './CacheFlowVisual';
import { HttpMessageAnatomyVisual } from './HttpMessageAnatomyVisual';
import { InterfaceContractVisual } from './InterfaceContractVisual';
import { ResourceVerbsVisual } from './ResourceVerbsVisual';
import { RoundTripVisual } from './RoundTripVisual';
import { SchemaResolutionVisual } from './SchemaResolutionVisual';

/**
 * FS-27c — the dispatcher. The *subject* chooses the visualization: the authored
 * `render.kind` is a discriminated union, so a topic cannot accidentally be shown a
 * visualization its data does not describe.
 *
 * Seven visualizations exist, one per `active` topic:
 *   interface-contract  what-is-api
 *   round-trip          client-server
 *   http-message        http-basics
 *   resource-verbs      rest-constraints
 *   schema-resolution   graphql-schema
 *   auth-gate           auth-models
 *   cache-flow          caching-flow
 */
export function TopicVisual({ topic }: { topic: Topic }) {
  const render = topic.render;

  if (!render) {
    // Only reachable if the data drifts: an `active` topic with no authored render
    // data. Say so instead of falling back to some other subject's visualization.
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="max-w-md space-y-3 border-2 border-dashed border-cyan-400/20 p-8 text-center">
          <Micro className="text-cyan-400/60">TRACE::NOT_AUTHORED</Micro>
          <p className="font-mono text-[11px] leading-relaxed text-cyan-400/40">
            this topic is marked active but carries no render data, so there is nothing
            honest to draw yet
          </p>
        </div>
      </div>
    );
  }

  switch (render.kind) {
    case 'interface-contract':
      return <InterfaceContractVisual topic={topic} data={render} />;
    case 'round-trip':
      return <RoundTripVisual topic={topic} data={render} />;
    case 'http-message':
      return <HttpMessageAnatomyVisual topic={topic} data={render} />;
    case 'resource-verbs':
      return <ResourceVerbsVisual topic={topic} data={render} />;
    case 'schema-resolution':
      return <SchemaResolutionVisual topic={topic} data={render} />;
    case 'auth-gate':
      return <AuthGateVisual topic={topic} data={render} />;
    case 'cache-flow':
      return <CacheFlowVisual topic={topic} data={render} />;
  }
}
