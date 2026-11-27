'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MoveRight } from 'lucide-react';
import { itChapters, itTracks, type ITTrack } from '../data/curriculum';
import { IT_PROBLEM_COUNT } from '../data/mcq/counts';
import { useITBasePath } from '../components/ITShell';

const STACK = [
  { number: '05', label: 'People & process', detail: 'ERP · CRM · e-commerce', key: 'Where work happens' },
  { number: '04', label: 'Data', detail: 'records · files · media', key: 'What the system remembers' },
  { number: '03', label: 'Applications', detail: 'browser · office · web', key: 'What people use' },
  { number: '02', label: 'Operating system', detail: 'Windows · Linux · Android', key: 'What manages the machine' },
  { number: '01', label: 'Hardware & network', detail: 'CPU · memory · Wi-Fi', key: 'The physical machine' },
];

const LABS = [
  { number: '01', title: 'Build the machine', text: 'Choose a CPU, memory, storage, and GPU. See which component becomes the bottleneck.', href: '/lab?lab=system' },
  { number: '02', title: 'Flip the bits', text: 'Toggle eight switches and watch binary, hexadecimal, and ASCII change together.', href: '/lab?lab=binary' },
  { number: '03', title: 'Trace the request', text: 'Follow a URL through DNS, TCP, HTTP, the server, and back to the browser.', href: '/lab?lab=network' },
];

export function Home() {
  const basePath = useITBasePath();
  const firstChapter = itChapters[0];
  const tracks = itTracks.map((track: ITTrack) => {
    const chapters = itChapters.filter((chapter) => chapter.track === track);
    return {
      track,
      count: chapters.length,
      range: `${String(chapters[0].number).padStart(2, '0')}–${String(chapters[chapters.length - 1].number).padStart(2, '0')}`,
      start: chapters[0].id,
    };
  });

  return (
    <div className="it-frame mx-auto w-full max-w-[1240px]">
      <section className="border-b" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
          <span className="it-kicker" style={{ color: 'var(--it-muted)' }}>Vol. 01 · A systems atlas · Fundamentals of IT</span>
          <span className="it-mono text-[10px]" style={{ color: 'var(--it-muted)' }}>CSCOSMOS / CORE CS</span>
        </div>

        <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
          <div className="px-5 py-10 sm:px-8 sm:py-16 lg:py-20">
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>The machine · the data · the network · the business</p>
            <h1 className="it-display mt-5 max-w-[760px]">
              From bits
              <br />
              to business.
            </h1>
            <p className="mt-7 max-w-[570px] text-[15px] leading-[1.8] sm:text-base" style={{ color: 'var(--it-muted)' }}>
              A field guide to the five layers under every app and every click. Twenty-four focused
              chapters, three instruments, and a five-hundred-question bank that starts with the
              physical machine and ends with the decisions it enables.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`${basePath}/learn`} className="it-btn it-btn-accent">
                Open the atlas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href={`${basePath}/lab`} className="it-btn it-btn-quiet">
                Try an instrument <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="it-stats mt-12 max-w-[620px]">
              {[
                { value: itChapters.length, label: 'Chapters' },
                { value: itTracks.length, label: 'Tracks' },
                { value: 3, label: 'Instruments' },
                { value: IT_PROBLEM_COUNT, label: 'Drills' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="it-num text-3xl">{String(stat.value).padStart(2, '0')}</div>
                  <div className="it-kicker mt-2 text-[8px]" style={{ color: 'var(--it-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t px-5 py-10 sm:px-8 sm:py-14 lg:border-l lg:border-t-0" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>The stack</p>
                <h2 className="it-display-sm mt-2 text-3xl">Read it from the bottom up.</h2>
              </div>
              <span className="it-mono border px-2 py-1 text-[9px]" style={{ borderColor: 'var(--it-border-strong)', color: 'var(--it-muted)' }}>5 layers</span>
            </div>

            <div className="it-stack mt-8">
              {STACK.map((layer) => (
                <div key={layer.number} className="it-stack-layer">
                  <span className="it-mono text-[9px] font-bold" style={{ color: 'var(--it-primary)' }}>{layer.number}</span>
                  <div>
                    <div className="text-sm font-bold">{layer.label}</div>
                    <div className="it-mono mt-0.5 text-[9px]" style={{ color: 'var(--it-muted)' }}>{layer.detail}</div>
                  </div>
                  <span className="hidden text-right text-[10px] sm:block" style={{ color: 'var(--it-muted)' }}>{layer.key}</span>
                </div>
              ))}
            </div>

            <p className="mt-5 border-t pt-4 text-[11px] leading-relaxed" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }}>
              A problem in one layer is often caused by another. The atlas teaches you to look down
              before you guess.
            </p>
          </div>
        </div>
      </section>

      <section className="grid border-b md:grid-cols-3" style={{ borderColor: 'var(--it-border)' }}>
        {[
          { number: 'I', title: 'See the stack', text: 'Hardware, data, software, networks, and business as one system — not five disconnected subjects.' },
          { number: 'II', title: 'Name the bottleneck', text: 'Every system has a limiting layer. Learn to find it before you buy, rebuild, or blame the user.' },
          { number: 'III', title: 'Make it usable', text: 'A working system is not enough. Accessibility, privacy, security, and cost decide whether it survives.' },
        ].map((item, index) => (
          <div key={item.number} className={`px-5 py-7 sm:px-7 ${index < 2 ? 'border-b md:border-b-0 md:border-r' : ''}`} style={{ borderColor: 'var(--it-border)' }}>
            <div className="it-num text-2xl" style={{ color: 'var(--it-primary)' }}>{item.number}</div>
            <h2 className="it-display-sm mt-4 text-2xl">{item.title}</h2>
            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{item.text}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b px-5 py-10 sm:px-8 sm:py-14 lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--it-border)' }}>
          <div className="flex items-end justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--it-border)' }}>
            <div>
              <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>The six tracks</p>
              <h2 className="it-display-sm mt-2 text-4xl">One system, six views.</h2>
            </div>
            <span className="it-mono hidden text-[10px] sm:block" style={{ color: 'var(--it-muted)' }}>24 chapters</span>
          </div>

          <div>
            {tracks.map((track, index) => (
              <Link
                key={track.track}
                href={`${basePath}/learn/${track.start}`}
                className="it-index-row grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b px-1 py-4 sm:grid-cols-[44px_1fr_100px_auto]"
                style={{ borderColor: 'var(--it-border)' }}
              >
                <span className="it-num text-xl" style={{ color: 'var(--it-muted)' }}>{String(index + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block text-sm font-semibold">{track.track}</span>
                  <span className="it-mono mt-0.5 block text-[9px] sm:hidden" style={{ color: 'var(--it-muted)' }}>{track.range}</span>
                </span>
                <span className="it-mono hidden text-[10px] sm:block" style={{ color: 'var(--it-muted)' }}>{track.range}</span>
                <span className="flex items-center gap-2">
                  <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{track.count} ch</span>
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--it-primary)' }} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-5 py-10 sm:px-8 sm:py-14">
          <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>The instruments</p>
          <h2 className="it-display-sm mt-2 text-4xl">Do not just read it.</h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--it-muted)' }}>
            Three ways to make the invisible visible: a machine, a byte, and a request.
          </p>

          <div className="mt-7 border-t" style={{ borderColor: 'var(--it-border-strong)' }}>
            {LABS.map((lab) => (
              <Link key={lab.number} href={`${basePath}${lab.href}`} className="it-index-row grid grid-cols-[40px_1fr_auto] gap-3 border-b py-4" style={{ borderColor: 'var(--it-border)' }}>
                <span className="it-num text-xl" style={{ color: 'var(--it-primary)' }}>{lab.number}</span>
                <span>
                  <span className="block text-sm font-semibold">{lab.title}</span>
                  <span className="mt-1 block text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{lab.text}</span>
                </span>
                <ArrowUpRight className="mt-1 h-3.5 w-3.5" style={{ color: 'var(--it-muted)' }} />
              </Link>
            ))}
          </div>

          <div className="mt-8 border p-4" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-muted)' }}>The first question</p>
            <p className="mt-2 text-xl font-bold leading-snug">“Which layer is actually failing?”</p>
          </div>
        </div>
      </section>

      <section className="border-t px-5 py-10 sm:px-8 sm:py-12" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Start here</p>
            <h2 className="it-display-sm mt-2 max-w-xl text-4xl">Before the tools, learn the system.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--it-muted)' }}>
              Chapter 01 separates IT from computer science and shows the five-layer model the rest of
              the atlas will use.
            </p>
          </div>
          <Link href={`${basePath}/learn/${firstChapter.id}`} className="it-btn it-btn-solid shrink-0">
            Chapter 01 · {firstChapter.title} <MoveRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
