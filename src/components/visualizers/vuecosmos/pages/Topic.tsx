'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, ChevronRight, Play, RotateCcw, X } from 'lucide-react';
import { allTopics, getTopic, slugify, topicDetails, TopicItem } from '../data/topics';

export function Topic({ slug }: { slug: string }) {
  const topic = getTopic(slug) || allTopics[0];
  const detail = topicDetails[slug] || makeDetail(topic);

  const titleParts = topic.title.split(' ');
  const firstWord = titleParts.slice(0, -1).join(' ');
  const lastWord = titleParts.slice(-1).join(' ');

  return (
    <div className="page topic-page">
      <section className="topic-hero">
        <div className="topic-hero-copy">
          <Link href="/vuecosmos/learn" className="back-link">
            <ChevronRight size={14} className="back-chevron" /> Back to the map
          </Link>
          <div className="eyebrow">
            <span className={`eyebrow-dot ${topic.color}`} /> {detail.kicker} <span className="eyebrow-line" />
          </div>
          <h1>
            {firstWord ? <>{firstWord}<br /></> : null}
            <em>{lastWord}</em>
          </h1>
          <p>{detail.definition}</p>
          <div className="topic-tags">
            <span>{topic.group}</span>
            <span>{topic.difficulty}</span>
          </div>
        </div>
        <TopicVisualizer topic={topic} />
      </section>

      <section className="topic-body">
        <div className="body-index">01 / GET THE FEEL</div>
        <div className="analogy-block">
          <p className="section-kicker">The real-world analogy</p>
          <h2>{detail.analogy}</h2>
        </div>

        <TopicCodeLab topic={topic} />

        <div className="topic-columns">
          <div>
            <p className="section-kicker">The sequence</p>
            <div className="step-list">
              {detail.steps.map((step, index) => (
                <div className="step" key={step}>
                  <span>0{index + 1}</span>
                  <b>{step}</b>
                  <i />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="section-kicker">Watch for these</p>
            <div className="mistake-list">
              {detail.mistakes.map((mistake) => (
                <div key={mistake}>
                  <X size={14} />
                  {mistake}
                </div>
              ))}
            </div>
            <p className="section-kicker perf-label">Performance note</p>
            <p className="perf-copy">{detail.performance}</p>
          </div>
        </div>
      </section>

      <section className="related-section">
        <div className="body-index">02 / KEEP GOING</div>
        <h2>Related <em>signals.</em></h2>
        <div className="related-links">
          {detail.related.map((related) => (
            <Link key={related} href={`/vuecosmos/topic/${slugify(related)}`}>
              <span>{related}</span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function makeDetail(topic: TopicItem) {
  return {
    kicker: `${topic.group} / visual guide`,
    definition: `${topic.title} is one piece of the larger Vue system. Explore the moving parts and see how a small idea scales into a reliable interface.`,
    analogy: `${topic.title} works like a well-organized studio: each tool has one job, and the handoff between tools is what makes the result feel effortless.`,
    steps: [
      'Name the intent',
      'Connect the reactive input',
      'Let Vue schedule the work',
      'Apply the smallest update',
      'Return to a stable UI',
    ],
    mistakes: [
      'Treating an internal step as magic',
      'Making one signal do every job',
      'Skipping the visual feedback loop',
    ],
    performance:
      'The clearest architecture usually has the smallest surface area for change. Keep responsibilities local and measure before optimizing.',
    related: ['What is Vue', 'Rendering Pipeline', 'Performance Optimization'],
  };
}

const topicCodeTemplates: Record<string, string> = {
  'Dependency Tracking': `<script setup>\nimport { effect, reactive } from 'vue'\n\nconst state = reactive({ count: 0 })\n\neffect(() => {\n  console.log('render needs', state.count)\n})\n\nstate.count++\n</script>`,
  'Virtual DOM': `<script setup>\nimport { h, ref } from 'vue'\n\nconst label = ref('Vue')\n\nconst vnode = h('button', {\n  onClick: () => label.value = 'Updated',\n}, label.value)\n</script>`,
  'Computed Properties': `<script setup>\nimport { computed, ref } from 'vue'\n\nconst price = ref(24)\nconst quantity = ref(2)\n\nconst total = computed(() =>\n  price.value * quantity.value\n)\n</script>`,
  'Props': `<script setup>\nconst props = defineProps({\n  title: {\n    type: String,\n    required: true,\n  },\n})\n</script>`,
  'Custom Events': `<script setup>\nconst emit = defineEmits(['save'])\n\nfunction save() {\n  emit('save', { source: 'button' })\n}\n</script>`,
  reactivity: `<script setup>\nimport { computed, ref } from 'vue'\n\nconst count = ref(0)\nconst doubled = computed(() => count.value * 2)\n\nfunction increment() {\n  count.value++\n}\n</script>`,
  templates: `<template>\n  <button @click="count++">\n    Clicked {{ count }} times\n  </button>\n\n  <p v-if="count > 2">Vue is watching.</p>\n</template>\n\n<script setup>\nimport { ref } from 'vue'\nconst count = ref(0)\n</script>`,
  components: `<script setup>\nconst props = defineProps({\n  label: String,\n})\n\nconst emit = defineEmits(['select'])\n</script>\n\n<template>\n  <button @click="emit('select')">\n    {{ label }}\n  </button>\n</template>`,
  runtime: `<script setup>\nimport { onMounted, onUnmounted, ref } from 'vue'\n\nconst ready = ref(false)\n\nonMounted(() => {\n  ready.value = true\n})\n\nonUnmounted(() => {\n  // clean up subscriptions here\n})\n</script>`,
  scale: `import { createRouter, createWebHistory } from 'vue-router'\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    {\n      path: '/learn',\n      component: () => import('./Learn.vue'),\n    },\n  ],\n})\n\nexport default router`,
};

const getTopicTemplate = (topic: TopicItem) =>
  topicCodeTemplates[topic.title] ||
  topicCodeTemplates[topic.group.toLowerCase()] ||
  topicCodeTemplates.reactivity;

function TopicCodeLab({ topic }: { topic: TopicItem }) {
  const [code, setCode] = useState(() => getTopicTemplate(topic));
  const [previewCount, setPreviewCount] = useState(0);

  useEffect(() => {
    setCode(getTopicTemplate(topic));
  }, [topic]);

  const lines = code.split('\n');
  const isTemplate = topic.group === 'Templates' || code.includes('v-if') || code.includes('@click');
  const isComponent = topic.group === 'Components';

  return (
    <section className="code-lab">
      <div className="code-lab-heading">
        <div>
          <p className="section-kicker">The editable example</p>
          <h2>Move the code.<br /><em>Watch the idea.</em></h2>
        </div>
        <p>Start with the smallest useful shape. Change a line, then compare it with the visual model above.</p>
      </div>
      <div className="code-lab-grid">
        <div className="template-editor">
          <div className="panel-head">
            <span className="panel-title">{topic.title.replaceAll(' ', '')}.vue</span>
            <span className="panel-lang">EDITABLE</span>
          </div>
          <div className="template-code">
            <div className="line-numbers">
              {lines.map((_, index) => (
                <span key={index}>{String(index + 1).padStart(2, '0')}</span>
              ))}
            </div>
            <textarea
              aria-label={`${topic.title} code template`}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck="false"
            />
          </div>
          <div className="editor-foot">
            <span><Check size={12} /> client-side example</span>
            <button type="button" onClick={() => setCode(getTopicTemplate(topic))}>
              <RotateCcw size={12} /> Reset template
            </button>
          </div>
        </div>
        <div className="template-preview">
          <div className="panel-head">
            <span className="panel-title">What this teaches</span>
            <span className="preview-url">LIVE MODEL</span>
          </div>
          <div className="template-preview-body">
            <span className="preview-kicker">
              {isComponent ? 'parent → child' : isTemplate ? 'template → state' : 'state → effect'}
            </span>
            {isComponent ? (
              <div className="mini-component-tree">
                <div className="mini-box parent-box">
                  Parent <small>props ↓</small>
                </div>
                <div className="mini-branch" />
                <div className="mini-box child-box">
                  Child <small>emit ↑</small>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="mini-counter"
                  onClick={() => setPreviewCount((value) => value + 1)}
                >
                  <span>{previewCount}</span>
                  <small>{isTemplate ? 'click me' : 'ref( )'}</small>
                </button>
                <div className="mini-result">
                  {isTemplate ? (
                    <>{previewCount > 2 ? <><b>v-if</b> rendered</> : <>waiting for a condition</>}</>
                  ) : (
                    <><b>computed</b> {previewCount * 2}</>
                  )}
                </div>
              </>
            )}
            <p>Edit the starter on the left. This preview is intentionally tiny so the relationship stays clear.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopicVisualizer({ topic }: { topic: TopicItem }) {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setTimeout(() => setRunning(false), 1700);
    return () => window.clearTimeout(timer);
  }, [running]);

  return (
    <div className={`topic-visualizer ${topic.color}`}>
      <div className="visual-label">
        INTERACTIVE MODEL <span>{running ? '● RUNNING' : '● READY'}</span>
      </div>
      <div className="topic-model">
        <div className={`model-node model-input ${running ? 'model-active' : ''}`}>
          <small>input</small>
          <strong>{topic.title === 'Virtual DOM' ? 'template' : 'state'}</strong>
        </div>
        <div className="model-wire wire-one" />
        <div className={`model-node model-process ${running ? 'model-active delay-one' : ''}`}>
          <small>process</small>
          <strong>{topic.title === 'Virtual DOM' ? 'diff' : 'track'}</strong>
        </div>
        <div className="model-wire wire-two" />
        <div className={`model-node model-output ${running ? 'model-active delay-two' : ''}`}>
          <small>output</small>
          <strong>{topic.title === 'Virtual DOM' ? 'DOM' : 'effect'}</strong>
        </div>
      </div>
      <div className="model-status">
        <span><i /> simulator idle</span>
        <button onClick={() => setRunning(true)}>
          <Play size={12} fill="currentColor" /> Run sequence
        </button>
      </div>
    </div>
  );
}
