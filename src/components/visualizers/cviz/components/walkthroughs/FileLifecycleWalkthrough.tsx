'use client';

import React, { useMemo } from 'react';
import { StepPlayer, type CWalkthroughStep } from './StepPlayer';

export function FileLifecycleWalkthrough({
  filename,
  line,
}: {
  filename: string;
  line: string;
}) {
  const steps = useMemo<CWalkthroughStep[]>(() => {
    const diagram = (state: 'write' | 'read' | 'eof' | 'closed', buffer: string, disk: string) => (
      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border p-2.5" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
            <div className="font-mono text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              FILE stream
            </div>
            <div className="mt-1 font-mono text-xs font-bold" style={{ color: 'var(--c-primary)' }}>
              {state === 'closed' ? 'closed' : state === 'write' ? '"w"' : '"r"'}
            </div>
          </div>
          <div className="rounded-lg border p-2.5" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
            <div className="font-mono text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              buffer
            </div>
            <div className="mt-1 break-all font-mono text-[10px]">{buffer || 'empty'}</div>
          </div>
          <div className="rounded-lg border p-2.5" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
            <div className="font-mono text-[8px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
              disk · {filename}
            </div>
            <div className="mt-1 break-all font-mono text-[10px]">{disk || 'empty'}</div>
          </div>
        </div>
      </div>
    );

    return [
      {
        title: 'Open for writing',
        description: `fopen("${filename}", "w") creates a stream. Mode "w" truncates any existing file.`,
        content: diagram('write', '', ''),
      },
      {
        title: 'Write to the stream',
        description: 'fprintf writes into the stream buffer. The bytes are not necessarily on disk yet.',
        content: diagram('write', line, ''),
      },
      {
        title: 'Close flushes the buffer',
        description: 'fclose flushes buffered output to disk and releases the stream.',
        content: diagram('closed', '', line),
      },
      {
        title: 'Open for reading',
        description: `fopen("${filename}", "r") creates a new stream positioned at the start of the file.`,
        content: diagram('read', '', line),
      },
      {
        title: 'Read a line',
        description: 'fgets copies the next line into the buffer. The read advances the stream position.',
        content: diagram('read', line, line),
      },
      {
        title: 'Detect end of file',
        description: 'After the last line, the next read returns NULL and feof becomes true. Test the read result, not feof, to control the loop.',
        content: diagram('eof', line, line),
      },
      {
        title: 'Close the read stream',
        description: 'fclose releases the stream. The file remains on disk.',
        content: diagram('closed', '', line),
      },
    ];
  }, [filename, line]);

  return <StepPlayer steps={steps} />;
}
