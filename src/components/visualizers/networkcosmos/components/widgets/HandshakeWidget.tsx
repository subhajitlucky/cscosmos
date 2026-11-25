'use client';

import { useState } from 'react';
import { WidgetButton, WidgetPanel, WidgetSlider, WidgetStat, WidgetToggle, type WidgetProps } from './shared';

interface Message {
  from: string;
  to: string;
  label: string;
  detail: string;
}

function messagesFor(slug: string): Message[] {
  if (slug.includes('dhcp')) {
    return [
      { from: 'client', to: 'broadcast', label: 'DHCPDISCOVER', detail: 'Source 0.0.0.0:68, no address yet' },
      { from: 'server', to: 'broadcast', label: 'DHCPOFFER', detail: 'Offers 203.0.113.42 plus mask, gateway, DNS' },
      { from: 'client', to: 'broadcast', label: 'DHCPREQUEST', detail: 'Accepts the chosen offer' },
      { from: 'server', to: 'client', label: 'DHCPACK', detail: 'Commits the address with a lease time' },
    ];
  }
  if (slug.includes('quic')) {
    return [
      { from: 'client', to: 'server', label: 'Initial', detail: 'ClientHello + TLS key share in one UDP datagram' },
      { from: 'server', to: 'client', label: 'Initial', detail: 'ServerHello, certificate and transport parameters' },
      { from: 'client', to: 'server', label: 'Handshake', detail: 'Finished: keys verified, stream data can flow' },
      { from: 'client', to: 'server', label: '1-RTT', detail: 'Application data on an encrypted stream' },
    ];
  }
  if (slug.includes('dns-resolution')) {
    return [
      { from: 'resolver', to: 'root', label: 'Query', detail: 'QNAME=example.com, recursion desired' },
      { from: 'root', to: 'resolver', label: 'Referral', detail: 'NS records for .com' },
      { from: 'resolver', to: 'TLD', label: 'Query', detail: 'QNAME=example.com to the .com servers' },
      { from: 'TLD', to: 'resolver', label: 'Referral', detail: 'Authoritative NS for example.com' },
      { from: 'authority', to: 'resolver', label: 'Answer', detail: 'A 93.184.216.34, TTL 300' },
    ];
  }
  if (slug.includes('tls-handshake')) {
    return [
      { from: 'client', to: 'server', label: 'ClientHello', detail: 'Versions, cipher suites, SNI, key share' },
      { from: 'server', to: 'client', label: 'ServerHello', detail: 'Chosen suite and key share; later messages encrypted' },
      { from: 'server', to: 'client', label: 'Certificate', detail: 'Chain checked against the client trust store' },
      { from: 'client', to: 'server', label: 'Finished', detail: 'Handshake 1-RTT completes' },
      { from: 'client', to: 'server', label: 'Application data', detail: 'Encrypted HTTP request bytes' },
    ];
  }
  if (slug.includes('smtp')) {
    return [
      { from: 'server', to: 'client', label: '220 ready', detail: 'SMTP greeting' },
      { from: 'client', to: 'server', label: 'EHLO', detail: 'Capabilities and extensions' },
      { from: 'client', to: 'server', label: 'MAIL FROM / RCPT TO', detail: 'Envelope sender and recipient' },
      { from: 'client', to: 'server', label: 'DATA', detail: 'Dot-terminated message content' },
      { from: 'client', to: 'server', label: 'QUIT', detail: 'Session closed' },
    ];
  }
  return [
    { from: 'client', to: 'server', label: 'SYN', detail: 'seq=0, ISN chosen by the client' },
    { from: 'server', to: 'client', label: 'SYN-ACK', detail: 'seq=0, ack=1, ISN chosen by the server' },
    { from: 'client', to: 'server', label: 'ACK', detail: 'ack=1: connection is established' },
    { from: 'client', to: 'server', label: 'DATA', detail: 'First bytes of the request' },
    { from: 'client', to: 'server', label: 'FIN', detail: 'Active closer has no more data' },
    { from: 'server', to: 'client', label: 'ACK + FIN', detail: 'Passive side acknowledges and closes' },
    { from: 'client', to: 'server', label: 'ACK', detail: 'Active closer waits in TIME_WAIT' },
  ];
}

export function HandshakeWidget({ concept }: WidgetProps) {
  const list = messagesFor(concept.slug);
  const [step, setStep] = useState(0);
  const [dropNext, setDropNext] = useState(concept.defaultFault === 'loss');
  const [lostStep, setLostStep] = useState<number | null>(null);
  const [retransmits, setRetransmits] = useState(0);
  const [rttMs, setRttMs] = useState(60);

  const elapsed = step * rttMs + retransmits * 2 * rttMs;

  const send = (): void => {
    if (step >= list.length) return;
    if (lostStep === step) {
      setLostStep(null);
      setStep((value) => value + 1);
      setRetransmits((value) => value + 1);
      return;
    }
    if (dropNext) {
      setLostStep(step);
      return;
    }
    setStep((value) => value + 1);
  };

  return (
    <WidgetPanel
      title="Handshake stepper"
      subtitle="Send each message in order; drop one to see a timeout-driven retransmission."
      badge="Sessions"
    >
      <div role="list" aria-label="Handshake messages" className="space-y-1">
        {list.map((message, index) => {
          const status = index === lostStep ? 'lost' : index < step ? 'sent' : index === step ? 'next' : 'pending';
          const tone =
            status === 'sent'
              ? 'border-emerald-500 bg-emerald-100 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100'
              : status === 'lost'
                ? 'border-rose-500 bg-rose-100 text-rose-950 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-100'
                : status === 'next'
                  ? 'border-sky-500 bg-sky-100 text-sky-950 dark:border-sky-400 dark:bg-sky-950 dark:text-sky-50'
                  : 'border-slate-300 bg-white text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400';
          return (
            <div key={`${message.label}-${index}`} role="listitem" aria-label={`Step ${index + 1}: ${message.label}, ${status}`} className={`flex flex-wrap items-baseline gap-2 rounded-md border px-2 py-1.5 ${tone}`}>
              <span className="w-5 font-mono text-[11px] font-bold">{index + 1}</span>
              <span className="font-mono text-xs font-bold">{message.label}</span>
              <span className="text-[11px] opacity-90">{message.from} → {message.to}: {message.detail}</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wide">{status}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <WidgetButton label="Send the next handshake message" onClick={send} disabled={step >= list.length}>
          {lostStep === step ? 'Retransmit after timeout →' : 'Send next message →'}
        </WidgetButton>
        <WidgetButton
          label="Reset the handshake to the first step"
          onClick={() => {
            setStep(0);
            setLostStep(null);
            setRetransmits(0);
          }}
        >
          Reset ↺
        </WidgetButton>
        <WidgetToggle label="Drop the next message" checked={dropNext} onChange={setDropNext} hint="Forces a retransmission with backoff" />
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <WidgetSlider label="One-way delay" value={rttMs} min={10} max={250} suffix=" ms" onChange={setRttMs} hint="Each message costs roughly one delay" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WidgetStat label="Messages sent" value={`${step} / ${list.length}`} />
        <WidgetStat label="Retransmissions" value={String(retransmits)} tone={retransmits > 0 ? 'warn' : 'neutral'} />
        <WidgetStat label="Elapsed" value={`${elapsed} ms`} />
        <WidgetStat label="Session" value={step >= list.length ? 'Ready' : 'Negotiating'} tone={step >= list.length ? 'good' : 'neutral'} />
      </div>
      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300" aria-live="polite">
        {lostStep !== null
          ? `Message ${lostStep + 1} never arrived. No ACK comes back, so the sender waits for a timeout and tries again.`
          : step >= list.length
            ? 'The exchange is complete; both sides can now proceed with application data.'
            : 'Each step carries state the next one depends on, so ordering matters.'}
      </p>
    </WidgetPanel>
  );
}
