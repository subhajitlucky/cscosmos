'use client';

import Link from 'next/link';
import '../styles.css';
import { computerOrganizationChapters } from '../data/chapters';

export interface ComputerOrganizationHomeProps {
  basePath?: string;
}

// Landing view: a schematic you can take apart. The hero is the classic
// block diagram; the chapter index is the legend that zooms into each block.
export function ComputerOrganizationHome({
  basePath = '/corecs/computer-organization',
}: ComputerOrganizationHomeProps) {
  return (
    <div className="co-root min-h-screen px-6 py-12">
      <section className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
          <div>
            <p className="co-chip">Core Computer Science · Concept site</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Computer Organization &amp; Block Diagram
            </h1>
            <p className="co-muted mt-4 max-w-2xl text-lg">
              Start with one diagram, then take it apart: functional units, buses,
              the instruction cycle, memory, I/O and the performance maths behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="co-card co-cta text-sm" href={`${basePath}/learn`}>
                Open the 8 chapters →
              </Link>
              <Link className="co-card co-cta text-sm" href={`${basePath}/lab`}>
                Enter the workbench →
              </Link>
            </div>
            <p className="co-muted mt-6 text-xs">
              8 chapters · 8 interactive tools · one diagram, revisited
            </p>
          </div>

          <div className="co-schematic p-4 sm:p-6">
            <svg
              viewBox="0 0 720 270"
              className="h-auto w-full"
              role="img"
              aria-labelledby="co-diagram-title co-diagram-desc"
            >
              <title id="co-diagram-title">Digital computer block diagram</title>
              <desc id="co-diagram-desc">
                Data flows from input to the CPU, the CPU exchanges instructions and
                data with memory over three shared buses, and results flow to output.
                Secondary storage exchanges copies of both with memory in both directions.
              </desc>

              {/* Wires drawn before blocks so joins sit behind the rectangles. */}
              <path className="co-wire" d="M 118 120 L 168 120" />
              <path className="co-arrow-head" d="M 172 120 L 164 115 L 164 125 Z" />
              <path className="co-wire" d="M 352 100 L 428 100" />
              <path className="co-wire" d="M 352 120 L 428 120" />
              <path className="co-wire" d="M 352 140 L 428 140" />
              <path className="co-arrow-head" d="M 432 120 L 424 115 L 424 125 Z" />
              <path className="co-arrow-head" d="M 348 140 L 356 135 L 356 145 Z" />
              <path className="co-wire" d="M 572 120 L 608 120" />
              <path className="co-arrow-head" d="M 612 120 L 604 115 L 604 125 Z" />
              {/* Two-way path: copies move to storage and back into memory. */}
              <path className="co-wire" d="M 380 212 L 380 188 L 490 188 L 490 178" />
              <path className="co-arrow-head" d="M 490 174 L 486 182 L 494 182 Z" />
              <path className="co-wire" d="M 512 178 L 512 202 L 400 202 L 400 212" />
              <path className="co-arrow-head" d="M 400 216 L 396 208 L 404 208 Z" />

              <rect className="co-block" x="8" y="92" width="110" height="56" rx="8" />
              <text className="co-diagram-label" x="63" y="114" textAnchor="middle">
                INPUT
              </text>
              <text className="co-diagram-sub" x="63" y="134" textAnchor="middle">
                keyboard · mouse
              </text>

              <rect className="co-block" x="172" y="62" width="180" height="116" rx="8" />
              <text className="co-diagram-label" x="262" y="114" textAnchor="middle">
                CPU
              </text>
              <text className="co-diagram-sub" x="262" y="138" textAnchor="middle">
                ALU · CU · registers
              </text>

              <rect className="co-block" x="432" y="62" width="140" height="116" rx="8" />
              <text className="co-diagram-label" x="502" y="114" textAnchor="middle">
                MEMORY
              </text>
              <text className="co-diagram-sub" x="502" y="138" textAnchor="middle">
                instructions + data
              </text>

              <rect className="co-block" x="612" y="92" width="100" height="56" rx="8" />
              <text className="co-diagram-label" x="662" y="114" textAnchor="middle">
                OUTPUT
              </text>
              <text className="co-diagram-sub" x="662" y="134" textAnchor="middle">
                display
              </text>

              <rect className="co-block" x="270" y="212" width="240" height="38" rx="8" />
              <text className="co-diagram-sub" x="390" y="236" textAnchor="middle">
                SECONDARY STORAGE · disk / SSD
              </text>

              <text className="co-bus-label" x="390" y="34" textAnchor="middle">
                address · data · control
              </text>
            </svg>
            <p className="co-muted mt-2 text-center text-xs">
              One stored-program loop — every chapter zooms into one wire or one box.
            </p>
          </div>
        </div>

        <h2 className="mt-14 text-2xl font-bold">The eight chapters</h2>
        <p className="co-muted mt-1 text-sm">
          Read them in order, or jump straight to the block you want to understand.
        </p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {computerOrganizationChapters.map((chapter) => (
            <li key={chapter.id} className="co-card co-chapter">
              <span className="co-chip">
                <span className="co-num">
                  {String(chapter.number).padStart(2, '0')}
                </span>{' '}
                · {chapter.category}
              </span>
              <h3 className="mt-2 font-semibold">{chapter.title}</h3>
              <p className="co-muted mt-1 text-sm">{chapter.summary}</p>
              <Link
                className="mt-3 inline-block text-sm font-semibold"
                href={`${basePath}/learn/${chapter.id}`}
              >
                Read chapter →
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
