'use client';
import { TopicLayout } from "../components/TopicLayout";
import { Quiz } from "../components/Quiz";

const questions = [
  {
    id: 1,
    question: "Which of the following headers prevents a browser from interpreting files as a different MIME type (MIME sniffing)?",
    options: [
      "X-Content-Type-Options: nosniff",
      "Access-Control-Allow-Origin: *",
      "Content-Security-Policy: default-src 'self'",
      "X-Frame-Options: DENY"
    ],
    correctIndex: 0,
    explanation: "X-Content-Type-Options: nosniff is designed to stop the browser from guessing the MIME type of a file, which can prevent script execution from non-script file types."
  },
  {
    id: 2,
    question: "If a bank website (bank.com) wants to allow a specific partner (partner.com) to access its API via JavaScript, which CORS header should it send?",
    options: [
      "Access-Control-Allow-Origin: *",
      "Access-Control-Allow-Origin: https://partner.com",
      "Origin: https://bank.com",
      "Referer: https://partner.com"
    ],
    correctIndex: 1,
    explanation: "It is best practice to specify the exact origin (https://partner.com) rather than using the wildcard '*', especially for requests involving credentials."
  },
  {
    id: 3,
    question: "Which type of XSS involves the malicious script being permanently stored on the target server (e.g., in a database)?",
    options: [
      "Reflected XSS",
      "DOM-based XSS",
      "Stored (Persistent) XSS",
      "Self-XSS"
    ],
    correctIndex: 2,
    explanation: "Stored XSS occurs when the payload is saved by the server and then served to other users later (e.g., in a forum post)."
  },
  {
    id: 4,
    question: "How does a Double Submit Cookie pattern help prevent CSRF?",
    options: [
      "It encrypts all cookies.",
      "It requires the same token to be sent in both a cookie and a request header/parameter.",
      "It blocks all cross-origin requests.",
      "It deletes cookies after every request."
    ],
    correctIndex: 1,
    explanation: "The attacker cannot read the cookie from the victim's browser (due to SOP), so they cannot reproduce the value in the header/parameter, causing the check to fail."
  },
  {
    id: 5,
    question: "An OAuth callback completes the session named by a signed session_id in the URL. Why is that signature not a CSRF defense?",
    options: [
      "The signature proves the server generated the URL, but the attacker can legitimately obtain a signed URL for their own session.",
      "The signature is too short to be secure.",
      "The callback uses HTTPS, so CSRF is impossible.",
      "The session_id is stored in a cookie, so the browser protects it."
    ],
    correctIndex: 0,
    explanation: "A signature proves integrity, not intent. The attacker asks the server for a signed login URL for their own session and sends it to a victim; when the victim logs in, the callback attaches the victim's token to the attacker's session. The fix is a browser-bound state cookie/nonce, single-use state, and session rotation after login."
  }
];

export default function Exercises() {
  return (
    <TopicLayout
      stepNumber={6}
      title="Conceptual Exercises"
      description="Apply what you've learned. Analyze request flows, identify vulnerabilities, and predict browser behaviors."
      nextPath="/websecurity/simulations"
    >
      <Quiz questions={questions} />
    </TopicLayout>
  );
}
