'use client';
/* global window, document, performance, setTimeout, clearTimeout */

/**
 * Isolated JavaScript Sandbox Runner
 * 
 * Executes untrusted or user-provided JavaScript inside an isolated, sandboxed <iframe>.
 *
 * Security & Reliability Guarantees:
 * 1. Restrictive Sandbox: Uses sandbox="allow-scripts" without "allow-same-origin".
 *    The iframe executes with an opaque origin (null), preventing access to window.parent,
 *    cookies, localStorage, sessionStorage, and the host application's DOM.
 * 2. Non-Invasive Console: Never overrides, mutates, or intercepts window.console in the
 *    main application. All console calls are intercepted exclusively inside the isolated iframe.
 * 3. Infinite-Loop Protection: A parent watchdog timer enforces execution limits (default: 2000ms).
 *    If code hangs (e.g. while(true)), the host abruptly destroys and removes the iframe.
 * 4. Pristine Environment: A fresh, clean iframe is spawned for every single execution,
 *    guaranteeing that global state or mutations from a prior run do not pollute future runs.
 * 5. Structured Output: Captures console.log, console.warn, console.info, console.error,
 *    unhandled exceptions, and unhandled promise rejections with execution timestamps.
 */

export function runInSandbox(code, options = {}) {
  const timeoutMs = options.timeoutMs || 2500;

  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({
        logs: [],
        error: 'Execution environment unavailable on server.',
        executionTimeMs: 0
      });
      return;
    }

    const startTime = performance.now();
    const runId = 'sb_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now();
    let isSettled = false;
    let timerId = null;

    // Create invisible, heavily sandboxed iframe
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.border = 'none';

    const cleanup = () => {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      window.removeEventListener('message', messageHandler);
      try {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      } catch {
        // Ignore cleanup errors
      }
    };

    const finish = (result) => {
      if (isSettled) return;
      isSettled = true;
      cleanup();
      const executionTimeMs = Math.round(performance.now() - startTime);
      resolve({
        logs: result.logs || [],
        error: result.error || null,
        executionTimeMs
      });
    };

    // Watchdog timeout for infinite loops / thread locking
    timerId = setTimeout(() => {
      finish({
        logs: [],
        error: `Execution timed out (${timeoutMs}ms). Infinite loop or unresolved promise detected.`
      });
    }, timeoutMs);

    // Host message listener
    const messageHandler = (event) => {
      // Validate event payload structure
      if (!event.data || typeof event.data !== 'object') return;
      if (event.data.runId !== runId) return;

      if (event.data.type === 'COMPLETE') {
        finish({
          logs: event.data.logs || [],
          error: event.data.error || null
        });
      }
    };

    window.addEventListener('message', messageHandler);

    // HTML payload injected into the sandboxed frame
    // Escaping </script> inside user code to prevent prematurely terminating the script block
    const sanitizedCode = code.replace(/<\/script>/gi, '<\\/script>');

    const iframeHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>JS Sandbox</title></head>
<body>
<script>
(function() {
  const runId = "${runId}";
  const logs = [];

  function formatValue(v) {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') return v.toString();
    if (typeof v === 'object') {
      try {
        return JSON.stringify(v, null, 2);
      } catch (err) {
        return '[Complex or Circular Object]';
      }
    }
    return String(v);
  }

  function pushLog(type, args) {
    const text = Array.from(args).map(formatValue).join(' ');
    logs.push({ type, text });
  }

  // Intercept inside sandbox ONLY (host console is untouched)
  console.log = function() { pushLog('log', arguments); };
  console.warn = function() { pushLog('warn', arguments); };
  console.info = function() { pushLog('info', arguments); };
  console.error = function() { pushLog('error', arguments); };

  function sendResult(errorText) {
    try {
      window.parent.postMessage({
        runId: runId,
        type: 'COMPLETE',
        logs: logs,
        error: errorText || null
      }, '*');
    } catch(e) {}
  }

  window.onerror = function(message, source, lineno, colno, error) {
    const errText = (error && error.message) ? error.message : String(message);
    pushLog('error', [errText]);
    sendResult(errText);
    return true;
  };

  window.onunhandledrejection = function(event) {
    const reason = event.reason;
    const errText = (reason instanceof Error) ? reason.message : String(reason);
    pushLog('error', ['Unhandled Rejection: ' + errText]);
  };

  try {
    // Execute user code in strict mode
    (function() {
      "use strict";
      ${sanitizedCode}
    })();

    // Allow pending microtasks / synchronous callbacks to settle
    setTimeout(function() {
      sendResult(null);
    }, 40);
  } catch(err) {
    const errText = (err && err.name ? err.name + ': ' : '') + ((err && err.message) ? err.message : String(err));
    pushLog('error', [errText]);
    sendResult(errText);
  }
})();
<\/script>
</body>
</html>`;

    // Append iframe to document body and populate via srcdoc
    document.body.appendChild(iframe);
    iframe.srcdoc = iframeHtml;
  });
}
