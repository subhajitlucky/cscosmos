'use client';
/* global window, document, performance, setTimeout, clearTimeout, Worker, Blob, URL */

/**
 * Isolated JavaScript Sandbox Runner
 * 
 * Executes user-provided JavaScript in an isolated environment.
 * 
 * Architecture & Guarantees:
 * 1. Off-Thread Web Worker Execution:
 *    Executes user code in a background Web Worker created via a Blob URL.
 *    Because the worker runs on an independent thread, synchronous infinite loops
 *    (e.g., while(true)) NEVER freeze the browser UI thread.
 * 2. Strict Timeout Separation:
 *    - Synchronous Execution Watchdog: If the synchronous evaluation does not finish
 *      within syncTimeoutMs (default 1500ms), worker.terminate() forcibly kills the worker
 *      and reports an infinite loop error.
 *    - Asynchronous Execution Watchdog: If asynchronous callbacks (setTimeout, Promises)
 *      exceed the total timeoutMs (default 2500ms), execution terminates and reports an
 *      asynchronous timeout.
 * 3. Race Condition & Overwrite Protection:
 *    Tracks active executions with a monotonic run ID. Dispatching a new execution
 *    immediately aborts and terminates any prior in-flight run, guaranteeing that stale
 *    execution results can never overwrite newer runs.
 * 4. Error & Unhandled Rejection Capture:
 *    Captures runtime exceptions, syntax errors, and unhandled promise rejections.
 * 5. Complete Resource Cleanup:
 *    Terminates workers, clears all watchdog timers, revokes Blob object URLs,
 *    and unbinds event listeners in all outcomes (completion, error, timeout, or abort).
 * 6. Fallback Protection:
 *    Gracefully falls back to a sandboxed <iframe> (sandbox="allow-scripts") if Web Workers
 *    are unavailable in the host environment.
 */

let activeExecution = null;
let runSequence = 0;

export function runInSandbox(code, options = {}) {
  const syncTimeoutMs = options.syncTimeoutMs || 1500;
  const timeoutMs = options.timeoutMs || 2500;

  // Abort any prior in-flight execution immediately
  if (activeExecution) {
    activeExecution.abort();
    activeExecution = null;
  }

  const currentRunId = ++runSequence;

  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({
        logs: [],
        error: 'Execution environment unavailable on server.',
        executionTimeMs: 0,
        runId: currentRunId
      });
      return;
    }

    const startTime = performance.now();
    let isSettled = false;
    let syncDone = false;
    let syncTimerId = null;
    let totalTimerId = null;

    // Helper to settle promise safely once
    const finish = (result) => {
      if (isSettled) return;
      isSettled = true;

      if (activeExecution && activeExecution.id === currentRunId) {
        activeExecution = null;
      }

      cleanup();

      const executionTimeMs = Math.round(performance.now() - startTime);
      resolve({
        logs: result.logs || [],
        error: result.error || null,
        executionTimeMs,
        runId: currentRunId,
        superseded: result.superseded || false
      });
    };

    let cleanup = () => {};

    // ---------------------------------------------------------------------------
    // STRATEGY A: Web Worker (Off-thread, non-blocking UI)
    // ---------------------------------------------------------------------------
    const tryRunInWorker = () => {
      try {
        if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') {
          return false;
        }

        const workerScript = `
(function() {
  var logs = [];

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
    var text = Array.from(args).map(formatValue).join(' ');
    logs.push({ type: type, text: text });
  }

  console.log = function() { pushLog('log', arguments); };
  console.warn = function() { pushLog('warn', arguments); };
  console.info = function() { pushLog('info', arguments); };
  console.error = function() { pushLog('error', arguments); };

  self.onerror = function(message, source, lineno, colno, error) {
    var errText = (error && error.message) ? error.message : String(message);
    pushLog('error', [errText]);
    self.postMessage({ type: 'COMPLETE', logs: logs, error: errText });
    return true;
  };

  self.addEventListener('unhandledrejection', function(event) {
    var reason = event.reason;
    var errText = (reason instanceof Error) 
      ? (reason.name + ': ' + reason.message) 
      : String(reason);
    pushLog('error', ['Unhandled Promise Rejection: ' + errText]);
    self.postMessage({ type: 'COMPLETE', logs: logs, error: 'Unhandled Promise Rejection: ' + errText });
  });

  try {
    (function() {
      "use strict";
      ${code}
    })();

    // Synchronous execution completed without thread-locking infinite loop
    self.postMessage({ type: 'SYNC_DONE', logs: logs.slice() });

    // Allow pending microtasks and immediate macrotasks to flush
    setTimeout(function() {
      self.postMessage({ type: 'COMPLETE', logs: logs, error: null });
    }, 40);
  } catch(err) {
    var errText = (err && err.name ? err.name + ': ' : '') + ((err && err.message) ? err.message : String(err));
    pushLog('error', [errText]);
    self.postMessage({ type: 'COMPLETE', logs: logs, error: errText });
  }
})();
`;

        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        const worker = new Worker(blobUrl);

        cleanup = () => {
          if (syncTimerId) {
            clearTimeout(syncTimerId);
            syncTimerId = null;
          }
          if (totalTimerId) {
            clearTimeout(totalTimerId);
            totalTimerId = null;
          }
          try {
            worker.terminate();
          } catch {
            // Worker already terminated
          }
          worker.onmessage = null;
          worker.onerror = null;
          try {
            URL.revokeObjectURL(blobUrl);
          } catch {
            // URL already revoked
          }
        };

        // 1. Synchronous watchdog timer
        syncTimerId = setTimeout(() => {
          if (!syncDone && !isSettled) {
            finish({
              logs: [],
              error: `Synchronous execution timed out (${syncTimeoutMs}ms limit). Infinite loop or CPU lockup detected.`
            });
          }
        }, syncTimeoutMs);

        // 2. Asynchronous total watchdog timer
        totalTimerId = setTimeout(() => {
          if (!isSettled) {
            finish({
              logs: [],
              error: `Asynchronous execution timed out (${timeoutMs}ms limit). Unresolved promise or continuous asynchronous operations detected.`
            });
          }
        }, timeoutMs);

        worker.onmessage = (event) => {
          if (isSettled) return;
          const data = event.data;
          if (!data || typeof data !== 'object') return;

          if (data.type === 'SYNC_DONE') {
            syncDone = true;
            if (syncTimerId) {
              clearTimeout(syncTimerId);
              syncTimerId = null;
            }
          } else if (data.type === 'COMPLETE') {
            finish({
              logs: data.logs || [],
              error: data.error || null
            });
          }
        };

        worker.onerror = (errEvent) => {
          if (isSettled) return;
          const errMessage = errEvent?.message || 'Worker runtime execution error';
          finish({
            logs: [{ type: 'error', text: errMessage }],
            error: errMessage
          });
        };

        return true;
      } catch {
        return false;
      }
    };

    // ---------------------------------------------------------------------------
    // STRATEGY B: Fallback Sandboxed <iframe>
    // ---------------------------------------------------------------------------
    const runInIframeFallback = () => {
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

      const iframeRunToken = 'sb_' + currentRunId + '_' + Date.now();

      const messageHandler = (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.data.runToken !== iframeRunToken) return;

        if (event.data.type === 'SYNC_DONE') {
          syncDone = true;
          if (syncTimerId) {
            clearTimeout(syncTimerId);
            syncTimerId = null;
          }
        } else if (event.data.type === 'COMPLETE') {
          finish({
            logs: event.data.logs || [],
            error: event.data.error || null
          });
        }
      };

      cleanup = () => {
        if (syncTimerId) {
          clearTimeout(syncTimerId);
          syncTimerId = null;
        }
        if (totalTimerId) {
          clearTimeout(totalTimerId);
          totalTimerId = null;
        }
        window.removeEventListener('message', messageHandler);
        try {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        } catch {
          // Ignore removal error
        }
      };

      syncTimerId = setTimeout(() => {
        if (!syncDone && !isSettled) {
          finish({
            logs: [],
            error: `Synchronous execution timed out (${syncTimeoutMs}ms limit). Infinite loop detected.`
          });
        }
      }, syncTimeoutMs);

      totalTimerId = setTimeout(() => {
        if (!isSettled) {
          finish({
            logs: [],
            error: `Asynchronous execution timed out (${timeoutMs}ms limit). Unresolved promise or continuous async tasks detected.`
          });
        }
      }, timeoutMs);

      window.addEventListener('message', messageHandler);

      const sanitizedCode = code.replace(/<\/script>/gi, '<\\/script>');
      const iframeHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
(function() {
  var runToken = "${iframeRunToken}";
  var logs = [];

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
    var text = Array.from(args).map(formatValue).join(' ');
    logs.push({ type: type, text: text });
  }

  console.log = function() { pushLog('log', arguments); };
  console.warn = function() { pushLog('warn', arguments); };
  console.info = function() { pushLog('info', arguments); };
  console.error = function() { pushLog('error', arguments); };

  function sendResult(type, errText) {
    try {
      window.parent.postMessage({
        runToken: runToken,
        type: type,
        logs: logs,
        error: errText || null
      }, '*');
    } catch(e) {}
  }

  window.onerror = function(message, source, lineno, colno, error) {
    var errText = (error && error.message) ? error.message : String(message);
    pushLog('error', [errText]);
    sendResult('COMPLETE', errText);
    return true;
  };

  window.onunhandledrejection = function(event) {
    var reason = event.reason;
    var errText = (reason instanceof Error) ? (reason.name + ': ' + reason.message) : String(reason);
    pushLog('error', ['Unhandled Promise Rejection: ' + errText]);
    sendResult('COMPLETE', 'Unhandled Promise Rejection: ' + errText);
  };

  try {
    (function() {
      "use strict";
      ${sanitizedCode}
    })();

    sendResult('SYNC_DONE', null);

    setTimeout(function() {
      sendResult('COMPLETE', null);
    }, 40);
  } catch(err) {
    var errText = (err && err.name ? err.name + ': ' : '') + ((err && err.message) ? err.message : String(err));
    pushLog('error', [errText]);
    sendResult('COMPLETE', errText);
  }
})();
<\/script>
</body>
</html>`;

      document.body.appendChild(iframe);
      iframe.srcdoc = iframeHtml;
    };

    // Store active execution record for potential abort
    activeExecution = {
      id: currentRunId,
      abort: () => {
        finish({
          logs: [],
          error: 'Execution cancelled: superseded by a newer run.',
          superseded: true
        });
      }
    };

    // Execute via Web Worker or fallback to iframe
    const launchedWorker = tryRunInWorker();
    if (!launchedWorker) {
      runInIframeFallback();
    }
  });
}
