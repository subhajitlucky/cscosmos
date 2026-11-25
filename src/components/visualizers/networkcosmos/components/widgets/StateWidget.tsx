'use client';

import { useState } from 'react';
import { WidgetButton, WidgetPanel, WidgetStat, type WidgetProps } from './shared';

interface Transition {
  event: string;
  to: string;
  note: string;
}

type Machine = Record<string, Transition[]>;

const TCP: Machine = {
  CLOSED: [
    { event: 'Passive open', to: 'LISTEN', note: 'Server waits for a SYN.' },
    { event: 'Active open (send SYN)', to: 'SYN-SENT', note: 'Client records an initial sequence number.' },
  ],
  LISTEN: [
    { event: 'Receive SYN', to: 'SYN-RECV', note: 'Server replies with SYN-ACK.' },
    { event: 'Close', to: 'CLOSED', note: 'Listener removed.' },
  ],
  'SYN-SENT': [
    { event: 'Receive SYN-ACK', to: 'ESTABLISHED', note: 'Three-way handshake completes.' },
    { event: 'Receive RST', to: 'CLOSED', note: 'Connection refused or reset.' },
  ],
  'SYN-RECV': [
    { event: 'Receive ACK', to: 'ESTABLISHED', note: 'Both sides now have sequence numbers.' },
    { event: 'Receive RST', to: 'CLOSED', note: 'Handshake aborted.' },
  ],
  ESTABLISHED: [
    { event: 'Send FIN', to: 'FIN-WAIT-1', note: 'Active close starts.' },
    { event: 'Receive FIN', to: 'CLOSE-WAIT', note: 'Passive close starts.' },
    { event: 'Receive RST', to: 'CLOSED', note: 'Connection torn down abruptly.' },
  ],
  'FIN-WAIT-1': [
    { event: 'Receive ACK', to: 'FIN-WAIT-2', note: 'Our FIN was acknowledged.' },
    { event: 'Receive FIN+ACK', to: 'TIME-WAIT', note: 'Both directions closed.' },
  ],
  'FIN-WAIT-2': [{ event: 'Receive FIN', to: 'TIME-WAIT', note: 'Wait 2 MSL before closing.' }],
  'CLOSE-WAIT': [{ event: 'Send FIN', to: 'LAST-ACK', note: 'Waiting for the final ACK.' }],
  'LAST-ACK': [{ event: 'Receive ACK', to: 'CLOSED', note: 'Teardown complete.' }],
  'TIME-WAIT': [{ event: '2 MSL timeout', to: 'CLOSED', note: 'Late duplicates can no longer be confused.' }],
};

const WEBSOCKET: Machine = {
  CLOSED: [{ event: 'Send HTTP Upgrade', to: 'UPGRADING', note: 'Carries Sec-WebSocket-Key.' }],
  UPGRADING: [
    { event: 'Receive 101 Switching Protocols', to: 'OPEN', note: 'The TCP connection changes protocol.' },
    { event: 'Proxy drops connection', to: 'CLOSED', note: 'Upgrade was not understood.' },
  ],
  OPEN: [
    { event: 'Send masked data frame', to: 'OPEN', note: 'Client frames must be masked.' },
    { event: 'Receive close frame', to: 'CLOSING', note: 'Close handshake begins.' },
  ],
  CLOSING: [{ event: 'Close handshake done', to: 'CLOSED', note: 'Underlying TCP connection closes.' }],
};

const TCP_STATES = [
  'CLOSED', 'LISTEN', 'SYN-SENT', 'SYN-RECV', 'ESTABLISHED',
  'FIN-WAIT-1', 'FIN-WAIT-2', 'CLOSE-WAIT', 'LAST-ACK', 'TIME-WAIT',
];
const WS_STATES = ['CLOSED', 'UPGRADING', 'OPEN', 'CLOSING'];

export function StateWidget({ concept }: WidgetProps) {
  const isWebSocket = concept.slug.includes('websockets');
  const machine = isWebSocket ? WEBSOCKET : TCP;
  const states = isWebSocket ? WS_STATES : TCP_STATES;
  const seed = concept.defaultFault === 'loss'
    ? 'A lost SYN-ACK keeps the client in SYN-SENT until retransmission.'
    : 'Choose an event to drive the connection forward.';

  const [current, setCurrent] = useState('CLOSED');
  const [history, setHistory] = useState<string[]>([]);
  const transitions = machine[current] ?? [];

  const apply = (transition: Transition): void => {
    setCurrent(transition.to);
    setHistory((entries) => [...entries, `${transition.event} → ${transition.to}: ${transition.note}`]);
  };

  return (
    <WidgetPanel
      title={isWebSocket ? 'WebSocket lifecycle' : 'TCP state machine'}
      subtitle="Send protocol events one at a time; only events valid in the current state are offered."
      badge="Transport"
    >
      <div role="group" aria-label="Connection states" className="flex flex-wrap gap-1.5">
        {states.map((state) => (
          <span
            key={state}
            aria-current={state === current ? 'step' : undefined}
            className={`rounded-md border px-2 py-1 font-mono text-[11px] font-semibold ${
              state === current
                ? 'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50'
                : 'border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {state}
          </span>
        ))}
      </div>

      <div className="mt-3">
        <p className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">Available events in {current}</p>
        <div role="group" aria-label="Protocol events" className="flex flex-wrap gap-1.5">
          {transitions.map((transition) => (
            <WidgetButton
              key={transition.event}
              label={`${transition.event}: move to ${transition.to}`}
              onClick={() => apply(transition)}
            >
              {transition.event}
            </WidgetButton>
          ))}
          <WidgetButton
            label="Reset the connection to CLOSED"
            onClick={() => {
              setCurrent('CLOSED');
              setHistory([]);
            }}
          >
            Reset ↺
          </WidgetButton>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <WidgetStat label="Current state" value={current} />
        <WidgetStat label="Transitions" value={String(history.length)} />
        <WidgetStat label="Valid events" value={String(transitions.length)} />
      </div>

      <div aria-live="polite" className="mt-2 rounded-md border border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60">
        {history.length === 0 ? (
          <p className="text-xs text-slate-700 dark:text-slate-300">{seed}</p>
        ) : (
          <ol className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
            {history.slice(-4).map((entry, index) => (
              <li key={`${entry}-${index}`} className="font-mono text-[11px]">{entry}</li>
            ))}
          </ol>
        )}
      </div>
    </WidgetPanel>
  );
}
