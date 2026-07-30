export const learningPath = {
  description: "A recommended step-by-step learning path. Progress is tracked locally for user guidance, but navigation remains flexible and non-blocking.",
  steps: [
    {
      step: 1,
      title: "Browser Security Foundations",
      path: "/websecurity/browser-security",
      masteryGoal: "Understand Same-Origin Policy, cookies, storage boundaries, and trust models",
      estimatedTime: "15–20 minutes",
      topics: [
        "Same-Origin Policy",
        "cookies and storage scope",
        "trusted vs untrusted input"
      ]
    },
    {
      step: 2,
      title: "Cross-Origin Resource Sharing (CORS)",
      path: "/websecurity/cors",
      masteryGoal: "Predict browser behavior for cross-origin requests",
      estimatedTime: "20–25 minutes",
      topics: [
        "same-origin vs cross-origin",
        "preflight requests",
        "CORS headers"
      ]
    },
    {
      step: 3,
      title: "Cross-Site Scripting (XSS)",
      path: "/websecurity/xss",
      masteryGoal: "Identify and prevent reflected, stored, and DOM-based XSS",
      estimatedTime: "25–30 minutes",
      topics: [
        "Reflected XSS",
        "Stored XSS",
        "DOM-based XSS",
        "output encoding vs input validation"
      ]
    },
    {
      step: 4,
      title: "Cross-Site Request Forgery (CSRF)",
      path: "/websecurity/csrf",
      masteryGoal: "Understand cookie-based authentication risks and CSRF defenses",
      estimatedTime: "20–25 minutes",
      topics: [
        "cookie attachment behavior",
        "forged requests",
        "CSRF tokens",
        "SameSite cookies"
      ]
    },
    {
      step: 5,
      title: "Content Security Policy (CSP)",
      path: "/websecurity/csp",
      masteryGoal: "Write CSP policies that mitigate XSS and injection risks",
      estimatedTime: "20–25 minutes",
      topics: [
        "script-src and style-src",
        "inline script blocking",
        "nonce and hash-based policies"
      ]
    },
    {
      step: 6,
      title: "Conceptual Exercises",
      path: "/websecurity/exercises",
      masteryGoal: "Apply concepts to analyze request/response security flows",
      estimatedTime: "30–40 minutes",
      topics: [
        "Identify vulnerabilities in a flow diagram",
        "Predict browser behavior",
        "Complete a CSP policy visually"
      ]
    },
    {
      step: 7,
      title: "Security Flow Simulations",
      path: "/websecurity/simulations",
      masteryGoal: "Visually simulate attacks and defenses in a safe, conceptual environment",
      estimatedTime: "30+ minutes",
      topics: [
        "Attack and defense simulations"
      ]
    }
  ]
};
