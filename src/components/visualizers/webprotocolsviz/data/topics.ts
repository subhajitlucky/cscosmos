export interface DetailedSection {
  title: string;
  content?: string;
  code?: string;
  subItems?: { label: string; description: string }[];
}

export interface Topic {
  id: string;
  name: string;
  path: string;
  lessonStructure: string[];
  content: {
    definition: string;
    analogy?: string;
    syntax?: string;
    detailedSections?: DetailedSection[];
    example?: {
      request?: string;
      response?: string;
      explanation?: string;
      highlights?: string[];
    };
    visualizationType: 'flow' | 'cycle' | 'methods' | 'headers' | 'status' | 'caching' | 'validation' | 'cdn' | 'performance' | 'tls';
  };
}

export const topics: Topic[] = [
  {
    id: 'http-intro',
    name: 'What is HTTP?',
    path: '/topics/http-intro',
    lessonStructure: ['definition', 'simple analogy', 'basic syntax', 'real example', 'visualization'],
    content: {
      definition: 'HTTP (Hypertext Transfer Protocol) is the standardized language of the web. It is the "glue" that allows your browser to talk to servers anywhere in the world.',
      analogy: 'Imagine ordering a pizza. You (the client) call the shop (the server) and say "I want a Pepperoni" (the request). The shop makes it and brings it to your door (the response). The "Protocol" is the agreed-upon way you talk: you use a phone, speak a shared language, and follow a specific order.',
      syntax: 'METHOD /path HTTP/VERSION',
      detailedSections: [
        {
          title: 'How it works',
          content: 'HTTP follows a classic client-server model. A client (like your phone or laptop) opens a connection to a server, sends a message, and waits for a response. Once the response is received, the connection is usually closed (though modern versions like HTTP/2 and HTTP/3 keep it open for speed).'
        },
        {
          title: 'Statelessness',
          content: 'By default, HTTP is "stateless". This means the server doesn\'t remember you from your last request. To "remember" you (like staying logged in), we use things like Cookies or Tokens, which are sent inside HTTP Headers.'
        }
      ],
      example: {
        request: 'GET /index.html HTTP/1.1\nHost: example.com',
        response: 'HTTP/1.1 200 OK\nContent-Type: text/html\n\n<html>...</html>',
        explanation: 'This is the simplest possible exchange. The browser asks for the homepage, and the server says "OK" and hands over the HTML code.'
      },
      visualizationType: 'cycle'
    }
  },
  {
    id: 'request-response',
    name: 'Request–Response Cycle',
    path: '/topics/request-response',
    lessonStructure: ['step-by-step', 'request breakdown', 'response breakdown', 'visualization'],
    content: {
      definition: 'Communication in HTTP is always a two-way street consisting of a Request and a Response. A server never talks unless spoken to first.',
      detailedSections: [
        {
          title: 'The Request Breakdown',
          content: 'Every request contains three main parts:',
          subItems: [
            { label: 'Request Line', description: 'The method (GET), the path (/about), and the version (HTTP/1.1).' },
            { label: 'Headers', description: 'Metadata about the client (e.g., "I am a Chrome browser").' },
            { label: 'Body', description: 'Optional data being sent (used in POST/PUT).' }
          ]
        },
        {
          title: 'The Response Breakdown',
          content: 'The server answers with a similar structure:',
          subItems: [
            { label: 'Status Line', description: 'The version and the status code (e.g., 200 OK).' },
            { label: 'Headers', description: 'Metadata about the server and the data (e.g., "This is an image").' },
            { label: 'Body', description: 'The actual content (HTML, Image, JSON).' }
          ]
        }
      ],
      example: {
        request: 'GET /api/user HTTP/1.1\nAccept: application/json',
        response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"id": 1, "name": "John"}',
        explanation: 'The client uses the "Accept" header to say "I only want JSON". The server looks at this and decides if it can provide that format.'
      },
      visualizationType: 'flow'
    }
  },
  {
    id: 'methods',
    name: 'HTTP Methods',
    path: '/topics/methods',
    lessonStructure: ['definition', 'common methods', 'examples', 'comparison'],
    content: {
      definition: 'HTTP Methods (also called "Verbs") tell the server exactly what you want to do with a resource. Using the right method is critical for building predictable web apps.',
      detailedSections: [
        {
          title: 'Primary Methods',
          content: 'There are several methods, but these four handle 99% of web traffic:',
          subItems: [
            { label: 'GET', description: 'Fetch data. It should NEVER change anything on the server. It\'s like reading a book.' },
            { label: 'POST', description: 'Create data. Used when submitting forms or signing up. It\'s like writing a new page in a book.' },
            { label: 'PUT', description: 'Update data. Replaces an existing resource entirely. It\'s like replacing a whole page.' },
            { label: 'DELETE', description: 'Remove data. Deletes the resource from the server. It\'s like ripping a page out.' }
          ]
        },
        {
          title: 'Safe vs Unsafe Methods',
          content: 'Methods like GET and HEAD are "Safe" because they don\'t modify anything. POST, PUT, and DELETE are "Unsafe" because they change the state of the server.'
        },
        {
          title: 'Idempotency (Master Concept)',
          content: 'An operation is "Idempotent" if performing it multiple times has the same result as performing it once. GET, PUT, and DELETE are idempotent. POST is NOT idempotent because sending it twice might create two users!',
        }
      ],
      example: {
        request: 'POST /users HTTP/1.1\nContent-Type: application/json\n\n{"name": "Alice"}',
        explanation: 'Notice that POST has a "Body" (the JSON data). GET requests do not have bodies.',
        highlights: ['GET', 'POST', 'PUT', 'DELETE']
      },
      visualizationType: 'methods'
    }
  },
  {
    id: 'headers-intro',
    name: 'HTTP Headers (Overview)',
    path: '/topics/headers-intro',
    lessonStructure: ['what they are', 'why they exist', 'format', 'visualization'],
    content: {
      definition: 'Headers are the "Settings" of an HTTP message. They allow the client and server to share extra information without putting it in the main content.',
      syntax: 'Header-Name: Value',
      detailedSections: [
        {
          title: 'The Purpose of Headers',
          content: 'Headers handle everything from security and caching to language preferences and cookie management. They are key-value pairs separated by a colon.'
        },
        {
          title: 'Four Categories',
          content: 'Headers are generally grouped into four types:',
          subItems: [
            { label: 'General Headers', description: 'Apply to both requests and responses (e.g., Date).' },
            { label: 'Request Headers', description: 'Client info (e.g., User-Agent).' },
            { label: 'Response Headers', description: 'Server info (e.g., Server).' },
            { label: 'Entity Headers', description: 'Info about the body content (e.g., Content-Length).' }
          ]
        }
      ],
      example: {
        request: 'User-Agent: Mozilla/5.0\nAccept-Language: en-US',
        explanation: 'The User-Agent header tells the server which browser you are using, so it can serve the best version of the site for your device.'
      },
      visualizationType: 'headers'
    }
  },
  {
    id: 'request-headers',
    name: 'Request Headers',
    path: '/topics/request-headers',
    lessonStructure: ['definition', 'common headers', 'example', 'visualization'],
    content: {
      definition: 'Request headers are sent by the client to give the server context about the user or the environment.',
      detailedSections: [
        {
          title: 'Must-Know Request Headers',
          content: 'These headers are found in almost every request:',
          subItems: [
            { label: 'Host', description: 'MANDATORY. The domain name of the server (e.g., google.com).' },
            { label: 'Accept', description: 'The content types the client understands (e.g., text/html).' },
            { label: 'Authorization', description: 'Used to send credentials like a password or token.' },
            { label: 'Cookie', description: 'Sends previously stored small data back to the server.' }
          ]
        }
      ],
      example: {
        request: 'Host: developer.mozilla.org\nUser-Agent: Mozilla/5.0\nAccept: text/html',
        explanation: 'Without the "Host" header, a modern server hosting multiple websites wouldn\'t know which one you want to visit!'
      },
      visualizationType: 'headers'
    }
  },
  {
    id: 'response-headers',
    name: 'Response Headers',
    path: '/topics/response-headers',
    lessonStructure: ['definition', 'common headers', 'example', 'visualization'],
    content: {
      definition: 'Response headers are sent by the server to describe itself or the data it is returning.',
      detailedSections: [
        {
          title: 'Must-Know Response Headers',
          content: 'These headers help the browser handle the data correctly:',
          subItems: [
            { label: 'Content-Type', description: 'Tells the browser if the data is HTML, CSS, JSON, or an Image.' },
            { label: 'Set-Cookie', description: 'Asks the browser to store a piece of data for the next visit.' },
            { label: 'Location', description: 'Used in redirects to tell the browser "Go to this other URL instead".' },
            { label: 'Server', description: 'Lists the software used by the server (e.g., Nginx, Apache).' }
          ]
        }
      ],
      example: {
        response: 'Server: Apache\nDate: Sat, 20 Dec 2025\nContent-Type: text/html',
        explanation: 'The "Content-Type" is the most critical header for rendering. Without it, your browser might display a raw code file instead of a beautiful webpage.'
      },
      visualizationType: 'headers'
    }
  },
  {
    id: 'status-codes',
    name: 'Status Codes',
    path: '/topics/status-codes',
    lessonStructure: ['status code categories', 'examples', 'decision-tree visualization'],
    content: {
      definition: 'Status codes are the server\'s way of telling the client: "Here is how your request went". They are 3-digit numbers grouped into five classes.',
      detailedSections: [
        {
          title: 'The Five Classes',
          content: 'The first digit of the code defines its general category:',
          subItems: [
            { label: '1xx (Informational)', description: 'Request received, continuing process.' },
            { label: '2xx (Success)', description: 'The action was successfully received and accepted (e.g., 200 OK).' },
            { label: '3xx (Redirection)', description: 'Further action must be taken (e.g., 301 Moved Permanently).' },
            { label: '4xx (Client Error)', description: 'The request contains bad syntax or cannot be fulfilled (e.g., 404 Not Found).' },
            { label: '5xx (Server Error)', description: 'The server failed to fulfill a valid request (e.g., 500 Internal Server Error).' }
          ]
        }
      ],
      example: {
        response: 'HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\nResource not found',
        explanation: 'A 404 doesn\'t mean the server is broken; it means the server is working perfectly but you asked for a page that doesn\'t exist.'
      },
      visualizationType: 'status'
    }
  },
  {
    id: 'caching-basics',
    name: 'Caching Fundamentals',
    path: '/topics/caching-basics',
    lessonStructure: ['what caching is', 'why caching matters', 'basic flow', 'cache hit vs miss animation'],
    content: {
      definition: 'Caching is the act of storing a copy of a resource to serve it faster later. It is the single most effective way to make websites feel "instant".',
      analogy: 'Imagine you need a hammer from the hardware store (the server) which is 30 mins away. After you use it, you put it in your toolbox (the cache). Next time you need it, you just reach into the toolbox in 1 second instead of driving for 30 mins.',
      detailedSections: [
        {
          title: 'The Benefits',
          content: 'Caching reduces bandwidth costs, lowers server load, and dramatically improves the user experience by eliminating network latency.'
        },
        {
          title: 'Cache Hit vs Miss',
          content: 'When the browser finds a valid copy in its storage, it\'s a "Cache Hit". If it doesn\'t find it or the copy is too old, it\'s a "Cache Miss" and it must go to the server.',
        }
      ],
      visualizationType: 'caching'
    }
  },
  {
    id: 'cache-control',
    name: 'Cache-Control Header',
    path: '/topics/cache-control',
    lessonStructure: ['directives explanation', 'syntax', 'examples', 'cache behavior visualization'],
    content: {
      definition: 'The Cache-Control header is the "Remote Control" for caching. The server uses it to tell the browser exactly how long to keep a file and when to throw it away.',
      syntax: 'Cache-Control: directive, max-age=seconds',
      detailedSections: [
        {
          title: 'Common Directives',
          content: 'You can combine multiple directives to get the exact behavior you want:',
          subItems: [
            { label: 'max-age', description: 'The time in seconds the file is considered "fresh" (e.g., 3600 for one hour).' },
            { label: 'no-store', description: 'Do not save this file EVER. Use for sensitive data like bank info.' },
            { label: 'no-cache', description: 'You can save it, but you MUST ask the server if it changed before using it.' },
            { label: 'public / private', description: 'Tells shared caches (CDNs) if they are allowed to store it or if it\'s just for the user.' }
          ]
        }
      ],
      example: {
        response: 'Cache-Control: public, max-age=31536000',
        explanation: 'The value 31536000 is one year in seconds. This is common for files that never change, like a specific version of a logo or CSS file.'
      },
      visualizationType: 'caching'
    }
  },
  {
    id: 'etag-last-modified',
    name: 'ETag & Last-Modified',
    path: '/topics/etag-last-modified',
    lessonStructure: ['conditional requests', 'validation flow', '304 response visualization'],
    content: {
      definition: 'Validation headers allow the client to say: "I have an old copy of this file. Has it changed?". This saves bandwidth by not downloading the same data twice.',
      detailedSections: [
        {
          title: 'ETag (Entity Tag)',
          content: 'An ETag is a unique fingerprint (hash) of a file. If the file content changes, the fingerprint changes.'
        },
        {
          title: 'The Validation Flow',
          content: '1. Server sends file with ETag: "v1".\n2. Browser saves file and ETag.\n3. Next time, Browser sends If-None-Match: "v1".\n4. Server compares ETags. If they match, it sends "304 Not Modified" (no body!).'
        }
      ],
      example: {
        request: 'If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"',
        response: 'HTTP/1.1 304 Not Modified',
        explanation: 'A 304 response is tiny because it contains no body. It simply tells the browser "Your old copy is still perfect, keep using it".'
      },
      visualizationType: 'validation'
    }
  },
  {
    id: 'browser-vs-cdn',
    name: 'Browser Cache vs CDN Cache',
    path: '/topics/browser-vs-cdn',
    lessonStructure: ['differences', 'request routing', 'multi-layer cache visualization'],
    content: {
      definition: 'Caching happens at multiple layers between you and the origin server. Understanding where your data is coming from is key to debugging performance.',
      detailedSections: [
        {
          title: 'Browser Cache (Private)',
          content: 'This is on your personal device. Only you can access it. It\'s the fastest layer because no network is required.'
        },
        {
          title: 'CDN Cache (Shared)',
          content: 'A CDN (Content Delivery Network) is a network of servers around the world. It stores copies of the origin server\'s data so that a user in Tokyo doesn\'t have to wait for a server in New York.'
        }
      ],
      visualizationType: 'cdn'
    }
  },
  {
    id: 'https',
    name: 'HTTPS & SSL/TLS',
    path: '/topics/https',
    lessonStructure: ['definition', 'encryption', 'handshake', 'visualization'],
    content: {
      definition: 'HTTPS is the secure version of HTTP. It uses SSL/TLS to encrypt the data so that hackers cannot read your passwords or credit card numbers while they travel across the internet.',
      analogy: 'HTTP is like sending a postcard—anyone who touches it can read it. HTTPS is like putting that postcard in a titanium safe that only you and the recipient have the key to.',
      detailedSections: [
        {
          title: 'The Handshake',
          content: 'Before any data is sent, the client and server perform a "Handshake". They agree on a secret code (encryption key) to use for the rest of the session.'
        },
        {
          title: 'Certificates',
          content: 'How do you know google.com is actually Google? They provide a Digital Certificate issued by a trusted third party (Certificate Authority).'
        }
      ],
      visualizationType: 'tls'
    }
  },
  {
    id: 'cookies',
    name: 'Cookies & State',
    path: '/topics/cookies',
    lessonStructure: ['statelessness', 'how cookies work', 'sessions', 'visualization'],
    content: {
      definition: 'By itself, HTTP has no memory. Cookies are small pieces of data that the server asks the browser to "hold onto" so it can recognize the user later.',
      detailedSections: [
        {
          title: 'The "Stateless" Problem',
          content: 'Stateless means the server treats every request as if it’s from a total stranger. To fix this, we use the "Set-Cookie" header.'
        },
        {
          title: 'Cookie Workflow',
          subItems: [
            { label: 'Step 1', description: 'User logs in.' },
            { label: 'Step 2', description: 'Server sends a response with "Set-Cookie: session_id=abc".' },
            { label: 'Step 3', description: 'Browser saves that cookie.' },
            { label: 'Step 4', description: 'On the next visit, the browser automatically sends "Cookie: session_id=abc".' }
          ]
        }
      ],
      example: {
        request: 'GET /profile HTTP/1.1\nCookie: user_id=123; theme=dark',
        response: 'HTTP/1.1 200 OK\nSet-Cookie: last_visit=2025-12-20',
        explanation: 'The browser "remembers" the user_id from a previous visit and sends it back automatically. The server then updates the last_visit time.'
      },
      visualizationType: 'headers'
    }
  },
  {
    id: 'cors-security',
    name: 'CORS & Web Security Headers',
    path: '/topics/cors-security',
    lessonStructure: ['same-origin policy', 'preflight OPTIONS', 'CORS headers', 'security headers'],
    content: {
      definition: 'CORS (Cross-Origin Resource Sharing) is a browser security mechanism that governs whether client-side JavaScript from one origin is permitted to access resources from a different origin.',
      analogy: 'Like passport control at an international border: when your JavaScript tries to access another domain’s private data, the browser asks the destination server: "Do you explicitly authorize visitors from this origin?"',
      syntax: 'Origin: https://app.example.com\nAccess-Control-Allow-Origin: https://app.example.com',
      detailedSections: [
        {
          title: 'Same-Origin Policy (SOP) vs CORS',
          content: 'The browser Same-Origin Policy forbids scripts from reading responses from a differing scheme, host, or port. CORS provides the HTTP headers that allow servers to declare safe exceptions.'
        },
        {
          title: 'Preflight OPTIONS Requests',
          subItems: [
            { label: 'Trigger', description: 'Non-simple requests (methods like PUT/DELETE or custom headers like Authorization) trigger an automated preflight.' },
            { label: 'OPTIONS check', description: 'The browser sends OPTIONS with Access-Control-Request-Method and Access-Control-Request-Headers.' },
            { label: 'Server Response', description: 'The server returns Access-Control-Allow-Origin, Allow-Methods, Allow-Headers, and Max-Age cache duration.' }
          ]
        },
        {
          title: 'Essential Web Security Headers',
          subItems: [
            { label: 'CSP (Content-Security-Policy)', description: 'Prevents XSS and data injection attacks by restricting allowed sources for scripts, images, and styles.' },
            { label: 'HSTS (Strict-Transport-Security)', description: 'Directs browsers to automatically upgrade all future requests to HTTPS for a declared time.' },
            { label: 'X-Content-Type-Options: nosniff', description: 'Stops browsers from MIME-sniffing responses away from the declared Content-Type.' }
          ]
        }
      ],
      example: {
        request: 'OPTIONS /api/data HTTP/1.1\nOrigin: https://app.client.com\nAccess-Control-Request-Method: DELETE',
        response: 'HTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://app.client.com\nAccess-Control-Allow-Methods: GET, POST, DELETE\nAccess-Control-Max-Age: 86400',
        explanation: 'The browser pre-clears authorization before executing the destructive DELETE method. The server grants permission and caches the verdict for 24 hours.'
      },
      visualizationType: 'headers'
    }
  },
  {
    id: 'http2-http3',
    name: 'HTTP/2, HTTP/3 & QUIC',
    path: '/topics/http2-http3',
    lessonStructure: ['binary framing', 'multiplexing', 'head-of-line blocking', 'QUIC over UDP'],
    content: {
      definition: 'HTTP/2 introduced binary framing and multiplexed streams over a single TCP connection. HTTP/3 transitions transport to UDP-based QUIC, eliminating TCP Head-of-Line blocking and enabling 0-RTT handshakes.',
      analogy: 'HTTP/1.1 is single-lane road traffic with red lights. HTTP/2 is a high-speed multi-car train on a single railway track (if one train car derails, all cars halt). HTTP/3 is a fleet of independent drones over UDP—if one drone encounters turbulence, every other drone flies uninterrupted.',
      detailedSections: [
        {
          title: 'HTTP/2 Core Capabilities',
          subItems: [
            { label: 'Binary Framing', description: 'Plaintext lines are replaced by structured binary frames (HEADERS, DATA, SETTINGS, RST_STREAM).' },
            { label: 'Multiplexing', description: 'Multiple bidirectional request and response streams interleave simultaneously over a single TCP connection.' },
            { label: 'HPACK Compression', description: 'Static and dynamic tables compress repetitive headers, dramatically reducing metadata byte overhead.' }
          ]
        },
        {
          title: 'HTTP/3 & QUIC Innovations',
          subItems: [
            { label: 'UDP-Based QUIC', description: 'Eliminates TCP transport-layer Head-of-Line blocking; packet loss on stream A never stalls stream B.' },
            { label: '0-RTT Handshakes', description: 'Returning clients transmit encrypted request payloads within the very first packet flight.' },
            { label: 'Connection Migration', description: 'Connections are tracked with 64-bit Connection IDs, allowing seamless roaming between Wi-Fi and 5G cellular without reconnecting.' }
          ]
        }
      ],
      visualizationType: 'performance'
    }
  },
  {
    id: 'websockets-sse',
    name: 'WebSockets & Server-Sent Events',
    path: '/topics/websockets-sse',
    lessonStructure: ['http upgrade', 'full-duplex framing', 'server-sent events', 'protocol comparison'],
    content: {
      definition: 'WebSockets provide full-duplex, bidirectional communication over a single persistent TCP socket. Server-Sent Events (SSE) offer lightweight, unidirectional push streaming over standard HTTP.',
      analogy: 'HTTP is mailing letters back and forth. Server-Sent Events is tuning into an ongoing FM radio transmission. WebSockets is an open telephone call where both parties can talk and listen simultaneously with zero delay.',
      syntax: 'GET /chat HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==',
      detailedSections: [
        {
          title: 'The WebSocket Protocol Upgrade',
          content: 'Clients initiate an HTTP handshake with "Connection: Upgrade" and "Upgrade: websocket". Upon receiving "101 Switching Protocols", both sides switch to low-overhead binary/text framing.'
        },
        {
          title: 'WebSockets vs Server-Sent Events (SSE)',
          subItems: [
            { label: 'Directionality', description: 'WebSockets is full-duplex (two-way); SSE is unidirectional (server-to-client only).' },
            { label: 'Reconnection & Proxying', description: 'SSE uses standard HTTP text/event-stream with native auto-reconnection and standard proxy support; WebSockets requires custom reconnection logic.' },
            { label: 'Ideal Workloads', description: 'Use SSE for LLM AI token streaming and news tickers; use WebSockets for real-time multiplayer gaming and collaborative editors.' }
          ]
        }
      ],
      example: {
        request: 'GET /feed HTTP/1.1\nAccept: text/event-stream',
        response: 'HTTP/1.1 200 OK\nContent-Type: text/event-stream\nCache-Control: no-cache\n\nevent: update\ndata: {"price": 105.4}',
        explanation: 'Server-Sent Events streaming real-time JSON payload updates to the browser over a persistent HTTP response stream.'
      },
      visualizationType: 'flow'
    }
  },
  {
    id: 'dns-connection-lifecycle',
    name: 'DNS, TCP & TLS Lifecycle',
    path: '/topics/dns-connection-lifecycle',
    lessonStructure: ['dns lookup', 'tcp 3-way handshake', 'tls 1.3 negotiation', 'connection pooling'],
    content: {
      definition: 'Before HTTP bytes can flow, client and server execute three sequential network phases: DNS IP resolution, TCP connection establishment, and TLS cryptographic key exchange.',
      analogy: 'Like making an overseas delivery: look up the recipient warehouse coordinates in a registry (DNS), establish an open shipping corridor (TCP 3-way handshake), verify customs credentials and seal containers with cryptographic locks (TLS), then exchange cargo (HTTP).',
      detailedSections: [
        {
          title: 'DNS Resolution Chain',
          content: 'Browser cache &rarr; OS resolver &rarr; Recursive DNS server (ISP/1.1.1.1) &rarr; Root (.) &rarr; TLD (.com) &rarr; Authoritative nameserver &rarr; IP Address returned with a Time-To-Live (TTL).'
        },
        {
          title: 'TCP 3-Way Handshake & Keep-Alive',
          subItems: [
            { label: 'SYN', description: 'Client sends SYN packet with Initial Sequence Number (ISN).' },
            { label: 'SYN-ACK', description: 'Server responds with SYN-ACK, acknowledging client ISN and sending its own.' },
            { label: 'ACK', description: 'Client acknowledges server ISN. The reliable bidirectional socket is established.' },
            { label: 'Keep-Alive Pooling', description: 'Persistent sockets reuse open connections across requests, eliminating repeated 3-way handshake overhead.' }
          ]
        },
        {
          title: 'TLS 1.3 1-RTT Handshake',
          content: 'Client transmits ClientHello with supported ciphers and an ephemeral KeyShare in the very first flight. The server returns its KeyShare, certificate chain, and Finished message in 1 roundtrip (1-RTT), initiating forward-secret symmetric encryption.'
        }
      ],
      visualizationType: 'tls'
    }
  },
  {
    id: 'performance',
    name: 'Performance & Best Practices',
    path: '/topics/performance',
    lessonStructure: ['common mistakes', 'optimization strategies', 'before/after performance visualization'],
    content: {
      definition: 'Building high-performance web apps requires balancing freshness with speed. Here are the industry-standard strategies.',
      detailedSections: [
        {
          title: 'The "Golden Rule"',
          content: 'Cache static assets (CSS, JS, Images) for a long time (1 year) using versioned filenames (e.g., style.a1b2c3.css).'
        },
        {
          title: 'Common Mistakes',
          subItems: [
            { label: 'Cache-Busting', description: 'Not using unique names for files, causing users to see old versions.' },
            { label: 'Under-Caching', description: 'Forcing a download on every visit for files that rarely change.' },
            { label: 'Over-Caching', description: 'Caching sensitive or frequently changing data for too long.' }
          ]
        }
      ],
      visualizationType: 'performance'
    }
  }
];
