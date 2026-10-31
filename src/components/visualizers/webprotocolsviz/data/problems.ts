// 100 Comprehensive Practice Questions for HTTP & Web Protocols
// Ordered pedagogically from Easy (Beginner) to Advanced.
// Covers all 18 core chapters in the Web Protocols curriculum.

export interface WebProtocolProblem {
  id: number;
  topicId: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface WebProtocolCategory {
  id: string;
  name: string;
  count: number;
}

export const WEB_PROTOCOL_CATEGORIES: { id: string; name: string }[] = [
  { id: 'http-intro', name: 'What is HTTP?' },
  { id: 'request-response', name: 'Request–Response Cycle' },
  { id: 'methods', name: 'HTTP Methods' },
  { id: 'headers-intro', name: 'Headers (Overview)' },
  { id: 'request-headers', name: 'Request Headers' },
  { id: 'response-headers', name: 'Response Headers' },
  { id: 'status-codes', name: 'Status Codes' },
  { id: 'caching-basics', name: 'Caching Fundamentals' },
  { id: 'cache-control', name: 'Cache-Control' },
  { id: 'etag-last-modified', name: 'ETag & Last-Modified' },
  { id: 'browser-vs-cdn', name: 'Browser vs CDN Cache' },
  { id: 'https', name: 'HTTPS & SSL/TLS' },
  { id: 'cookies', name: 'Cookies & State' },
  { id: 'cors-security', name: 'CORS & Security Headers' },
  { id: 'http2-http3', name: 'HTTP/2, HTTP/3 & QUIC' },
  { id: 'websockets-sse', name: 'WebSockets & SSE' },
  { id: 'dns-connection-lifecycle', name: 'DNS & Connection Lifecycle' },
  { id: 'performance', name: 'Performance & Best Practices' },
];

export const WEB_PROTOCOL_PROBLEMS: WebProtocolProblem[] = [
  {
    "id": 1,
    "topicId": "http-intro",
    "category": "What is HTTP?",
    "difficulty": "Beginner",
    "question": "What does the acronym HTTP stand for in computer networking?",
    "options": [
      "Hypertext Transfer Protocol",
      "High Transmission Telecommunications Port",
      "Host Terminal Tracking Process",
      "Hybrid Text Transport Pipe"
    ],
    "correctIndex": 0,
    "explanation": "HTTP stands for Hypertext Transfer Protocol. It is an application-layer protocol designed to transfer hypermedia documents (like HTML, CSS, JavaScript, and JSON) between web clients and servers."
  },
  {
    "id": 2,
    "topicId": "http-intro",
    "category": "What is HTTP?",
    "difficulty": "Beginner",
    "question": "What does it mean that HTTP is fundamentally a 'stateless' protocol?",
    "options": [
      "The server does not remember anything about previous requests from the same client by default.",
      "The server operates without an operating system kernel.",
      "The client is not allowed to store cached files on disk.",
      "HTTP connections cannot cross state or country borders."
    ],
    "correctIndex": 0,
    "explanation": "Statelessness means each HTTP request-response cycle is completely independent. The server retains no session state about previous transactions unless state mechanisms (like Cookies, Sessions, or Authorization tokens) are explicitly introduced."
  },
  {
    "id": 3,
    "topicId": "http-intro",
    "category": "What is HTTP?",
    "difficulty": "Beginner",
    "question": "What standard default TCP port is used for unencrypted HTTP, and what default port is used for encrypted HTTPS?",
    "options": [
      "Port 80 for HTTP, Port 443 for HTTPS",
      "Port 21 for HTTP, Port 22 for HTTPS",
      "Port 8080 for HTTP, Port 80 for HTTPS",
      "Port 25 for HTTP, Port 53 for HTTPS"
    ],
    "correctIndex": 0,
    "explanation": "By worldwide networking standards (IANA), unencrypted HTTP uses default TCP port 80, while encrypted HTTPS (HTTP over TLS) uses default TCP port 443."
  },
  {
    "id": 4,
    "topicId": "request-response",
    "category": "Request\u2013Response Cycle",
    "difficulty": "Beginner",
    "question": "In the classic HTTP client-server model, who always initiates the communication?",
    "options": [
      "The client (such as a web browser or mobile app)",
      "The database server",
      "The origin web server",
      "The internet service provider router"
    ],
    "correctIndex": 0,
    "explanation": "In standard HTTP/1.1, communication is strictly unidirectional-initiated: the client sends an HTTP request, and the server returns an HTTP response."
  },
  {
    "id": 5,
    "topicId": "request-response",
    "category": "Request\u2013Response Cycle",
    "difficulty": "Beginner",
    "question": "What are the three core components of an HTTP Request message?",
    "options": [
      "Request Line (Method, Path, Version), Headers, and an optional Body",
      "MAC address, IP packet, and DNS zone",
      "HTML markup, CSS stylesheet, and JavaScript bundle",
      "Username, Password, and Database Query"
    ],
    "correctIndex": 0,
    "explanation": "Every HTTP request starts with the Request Line (e.g., 'GET /index.html HTTP/1.1'), followed by zero or more key-value Headers, an empty line (CRLF), and an optional message Body (payload)."
  },
  {
    "id": 6,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Beginner",
    "question": "Which HTTP method is specifically intended to retrieve resource representations without altering server state?",
    "options": [
      "GET",
      "POST",
      "DELETE",
      "CONNECT"
    ],
    "correctIndex": 0,
    "explanation": "The GET method is used exclusively to retrieve data. Per the HTTP specification (RFC 7231), GET requests must be 'safe'\u2014meaning executing them produces no side-effects on server state."
  },
  {
    "id": 7,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Beginner",
    "question": "Which HTTP method is commonly used to submit form data or create a new resource on the server?",
    "options": [
      "POST",
      "GET",
      "HEAD",
      "OPTIONS"
    ],
    "correctIndex": 0,
    "explanation": "POST is used to submit an entity to the specified resource, often causing a change in state or side effects on the server, such as creating a new database record or submitting an order."
  },
  {
    "id": 8,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Beginner",
    "question": "What does the HTTP HEAD method do compared to a standard GET method?",
    "options": [
      "It requests identical response headers as a GET request, but the server must NOT return a response body.",
      "It deletes the head record in a database table.",
      "It transfers only the top 10 lines of HTML code.",
      "It reboots the web server header processes."
    ],
    "correctIndex": 0,
    "explanation": "The HEAD method is identical to GET, except the server returns only the status line and headers with zero body bytes. It is commonly used to inspect resource size (Content-Length), validity, or caching headers without downloading the actual content."
  },
  {
    "id": 9,
    "topicId": "headers-intro",
    "category": "HTTP Headers (Overview)",
    "difficulty": "Beginner",
    "question": "How are HTTP headers formatted syntactically in plain text HTTP messages?",
    "options": [
      "Case-insensitive Key, colon (:), optional whitespace, Value, followed by CRLF (\\r\\n)",
      "JSON key-value pairs enclosed in curly braces {}",
      "XML tags like <header>value</header>",
      "Comma-separated values ending with a semicolon"
    ],
    "correctIndex": 0,
    "explanation": "In HTTP/1.x, headers are plain text strings formatted as 'Header-Name: Header-Value\\r\\n'. Header names are case-insensitive according to RFC specifications."
  },
  {
    "id": 10,
    "topicId": "request-headers",
    "category": "Request Headers",
    "difficulty": "Beginner",
    "question": "Which request header is strictly MANDATORY in every HTTP/1.1 request?",
    "options": [
      "Host",
      "User-Agent",
      "Accept",
      "Cookie"
    ],
    "correctIndex": 0,
    "explanation": "In HTTP/1.1, the 'Host' header is mandatory. It specifies the domain name of the server being contacted, allowing virtual hosting where a single IP address hosts multiple distinct websites."
  },
  {
    "id": 11,
    "topicId": "request-headers",
    "category": "Request Headers",
    "difficulty": "Beginner",
    "question": "What does the 'User-Agent' request header tell the web server?",
    "options": [
      "Information about the client application, operating system, and browser engine making the request.",
      "The credit card number and legal identity of the computer owner.",
      "The exact physical GPS location of the user's desk.",
      "The CPU clock speed and cooling fan temperature of the client device."
    ],
    "correctIndex": 0,
    "explanation": "The User-Agent header identifies the client software (e.g. Chrome, Firefox, curl) and operating system making the request, enabling analytics, compatibility shims, and responsive rendering."
  },
  {
    "id": 12,
    "topicId": "response-headers",
    "category": "Response Headers",
    "difficulty": "Beginner",
    "question": "What is the purpose of the 'Content-Type' HTTP header?",
    "options": [
      "To inform the recipient of the MIME type (format) of the data payload in the body (e.g., text/html, application/json).",
      "To declare the copyright license of the website.",
      "To tell the user how many minutes the article takes to read.",
      "To dictate which font family must be used to render the page."
    ],
    "correctIndex": 0,
    "explanation": "Content-Type specifies the media type (MIME type) of the resource representation (e.g., text/html; charset=UTF-8 or application/json), instructing the client on how to parse and render the byte stream."
  },
  {
    "id": 13,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Beginner",
    "question": "What do HTTP status codes in the 2xx class (like 200 OK) indicate?",
    "options": [
      "Success: the client's request was successfully received, understood, and accepted.",
      "Informational: the server is still processing the request.",
      "Redirection: further action needs to be taken to complete the request.",
      "Server Error: the server crashed while handling the request."
    ],
    "correctIndex": 0,
    "explanation": "The 2xx class indicates that the client request was successfully processed by the server (e.g., 200 OK, 201 Created, 204 No Content)."
  },
  {
    "id": 14,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Beginner",
    "question": "What does the common HTTP status code 404 Not Found mean?",
    "options": [
      "The origin server cannot find a current representation for the target resource URL.",
      "The server's hard drive has been permanently unplugged.",
      "The client's internet cable is disconnected.",
      "The request succeeded but returned 404 lines of text."
    ],
    "correctIndex": 0,
    "explanation": "404 Not Found indicates that the server recognized the request, but could not locate the requested resource at the specified URI path."
  },
  {
    "id": 15,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Beginner",
    "question": "What does an HTTP status code in the 5xx class (such as 500 Internal Server Error) signify?",
    "options": [
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
      "The client made a typing mistake in the URL.",
      "The user entered an invalid password.",
      "The web page is cached and ready to view offline."
    ],
    "correctIndex": 0,
    "explanation": "5xx status codes indicate server-side failure. The client sent a valid request, but the server encountered an unhandled exception, crash, or gateway issue while trying to respond."
  },
  {
    "id": 16,
    "topicId": "caching-basics",
    "category": "Caching Fundamentals",
    "difficulty": "Beginner",
    "question": "What is the primary motivation for caching web resources in browsers and proxies?",
    "options": [
      "To reduce network latency, decrease bandwidth consumption, and lower server load by reusing previously fetched responses.",
      "To permanently lock users into viewing outdated news articles.",
      "To hide the real IP address of the client from the government.",
      "To prevent software developers from releasing new code."
    ],
    "correctIndex": 0,
    "explanation": "Web caching stores copies of responses locally so subsequent requests can be served instantly without traversing the network, improving page load speed and eliminating redundant backend computations."
  },
  {
    "id": 17,
    "topicId": "caching-basics",
    "category": "Caching Fundamentals",
    "difficulty": "Beginner",
    "question": "What is the difference between a 'Cache Hit' and a 'Cache Miss'?",
    "options": [
      "A Cache Hit finds a valid fresh copy in the cache; a Cache Miss requires fetching the resource from the origin server across the network.",
      "A Cache Hit crashes the browser; a Cache Miss succeeds silently.",
      "A Cache Hit is only possible on mobile phones; a Cache Miss happens on desktops.",
      "A Cache Hit means the server has run out of memory."
    ],
    "correctIndex": 0,
    "explanation": "A Cache Hit occurs when requested data is retrieved directly from local cache storage. A Cache Miss occurs when the data is missing or expired, requiring a roundtrip to the origin server."
  },
  {
    "id": 18,
    "topicId": "cache-control",
    "category": "Cache-Control Header",
    "difficulty": "Beginner",
    "question": "In the HTTP header 'Cache-Control: max-age=3600', what does the number 3600 specify?",
    "options": [
      "The response is considered fresh for 3600 seconds (1 hour).",
      "The file is 3600 kilobytes in size.",
      "The server will terminate the connection after 3600 milliseconds.",
      "The maximum number of visitors allowed to view the file is 3600."
    ],
    "correctIndex": 0,
    "explanation": "The 'max-age' directive specifies freshness lifetime in seconds. 'max-age=3600' tells the browser and intermediate caches that the response can be reused without contacting the server for 3,600 seconds (1 hour)."
  },
  {
    "id": 19,
    "topicId": "etag-last-modified",
    "category": "ETag & Last-Modified",
    "difficulty": "Beginner",
    "question": "What is an HTTP 'ETag' (Entity Tag)?",
    "options": [
      "An opaque fingerprint or hash string assigned by the server to represent a specific version of a resource.",
      "A price tag attached to commercial e-commerce websites.",
      "The legal registered trademark symbol of an online brand.",
      "The unique MAC address of the user's network card."
    ],
    "correctIndex": 0,
    "explanation": "An ETag is an opaque identifier (often an MD5/SHA hash of file contents or version string) assigned by a web server. If resource content changes, a new ETag is generated."
  },
  {
    "id": 20,
    "topicId": "etag-last-modified",
    "category": "ETag & Last-Modified",
    "difficulty": "Beginner",
    "question": "When a client sends a conditional request with 'If-None-Match: \"v1\"' and the resource on the server has not changed, what status code does the server return?",
    "options": [
      "304 Not Modified",
      "200 OK",
      "404 Not Found",
      "502 Bad Gateway"
    ],
    "correctIndex": 0,
    "explanation": "The server checks the ETag, confirms no changes occurred, and returns '304 Not Modified' with an empty body, instructing the client to reuse its locally cached copy."
  },
  {
    "id": 21,
    "topicId": "browser-vs-cdn",
    "category": "Browser Cache vs CDN Cache",
    "difficulty": "Beginner",
    "question": "What is a CDN (Content Delivery Network)?",
    "options": [
      "A globally distributed network of proxy servers that cache content close to end users to reduce geographic latency.",
      "A software program that automatically designs websites using CSS.",
      "A government regulatory body that monitors email spam.",
      "A type of physical Ethernet cable installed under office desks."
    ],
    "correctIndex": 0,
    "explanation": "CDNs place Edge Points of Presence (PoPs) worldwide. When a user in Tokyo requests assets from a California server, the Tokyo CDN edge node serves the cached copy with single-digit millisecond latency."
  },
  {
    "id": 22,
    "topicId": "https",
    "category": "HTTPS & SSL/TLS",
    "difficulty": "Beginner",
    "question": "What crucial security guarantees does HTTPS provide over plain HTTP?",
    "options": [
      "Encryption (confidentiality), Data Integrity (tamper-proofing), and Authentication (identity verification).",
      "Unlimited free bandwidth and zero website downtime.",
      "Automatic virus removal from the user's hard drive.",
      "Guaranteed top ranking on Google search results."
    ],
    "correctIndex": 0,
    "explanation": "HTTPS runs HTTP over a cryptographic TLS tunnel, preventing eavesdropping (encryption), ensuring data is not modified in transit (integrity), and verifying the server's real domain identity via certificates (authentication)."
  },
  {
    "id": 23,
    "topicId": "cookies",
    "category": "Cookies & State",
    "difficulty": "Beginner",
    "question": "Which response header does a web server use to instruct a browser to save a cookie?",
    "options": [
      "Set-Cookie",
      "Save-Data",
      "Cookie-Jar",
      "Store-State"
    ],
    "correctIndex": 0,
    "explanation": "The server sends 'Set-Cookie: name=value; [attributes]' in the response headers. The browser parses it, persists it in its cookie store, and sends it back in future 'Cookie' request headers."
  },
  {
    "id": 24,
    "topicId": "cookies",
    "category": "Cookies & State",
    "difficulty": "Beginner",
    "question": "What does the 'HttpOnly' attribute on a cookie do?",
    "options": [
      "It prevents client-side JavaScript (like document.cookie) from reading the cookie, mitigating XSS session theft.",
      "It forces the cookie to only work on internet explorer browsers.",
      "It deletes the cookie as soon as the user turns off the monitor.",
      "It converts the cookie into an MP3 audio file."
    ],
    "correctIndex": 0,
    "explanation": "The HttpOnly flag blocks client-side scripts from accessing the cookie via `document.cookie`. If an attacker executes a Cross-Site Scripting (XSS) attack, they cannot directly steal the user's session token."
  },
  {
    "id": 25,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Beginner",
    "question": "What does CORS stand for in web architecture?",
    "options": [
      "Cross-Origin Resource Sharing",
      "Central Operating Route Standard",
      "Cryptographic Online Response System",
      "Cascading Object Routing Schema"
    ],
    "correctIndex": 0,
    "explanation": "CORS stands for Cross-Origin Resource Sharing. It is an HTTP-header based mechanism that allows servers to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources."
  },
  {
    "id": 26,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Beginner",
    "question": "Under the browser's Same-Origin Policy (SOP), which three components must match for two URLs to share the same origin?",
    "options": [
      "Protocol (scheme), Hostname (domain), and Port",
      "Username, Password, and Email address",
      "Operating System, Browser Version, and Screen Resolution",
      "HTML version, CSS library, and Database engine"
    ],
    "correctIndex": 0,
    "explanation": "An origin is defined as the tuple of (Protocol, Host, Port). For example, `https://example.com:443` and `http://example.com:80` are different origins because their protocols and ports differ."
  },
  {
    "id": 27,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Beginner",
    "question": "What major framing format change was introduced in HTTP/2 compared to HTTP/1.1?",
    "options": [
      "HTTP/2 uses an efficient binary framing layer instead of human-readable plaintext text.",
      "HTTP/2 encodes all websites as PDF documents.",
      "HTTP/2 replaces URLs with IP numbers.",
      "HTTP/2 forces all images to be black and white."
    ],
    "correctIndex": 0,
    "explanation": "HTTP/1.1 relies on plaintext strings delimited by CRLF (\\r\\n). HTTP/2 splits all communication into standardized binary frames (HEADERS, DATA, SETTINGS, etc.), making parsing vastly faster, more robust, and less prone to parsing errors."
  },
  {
    "id": 28,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Beginner",
    "question": "What transport layer protocol does HTTP/3 use instead of TCP?",
    "options": [
      "QUIC over UDP",
      "ICMP ping packets",
      "Bluetooth RFCOMM",
      "AppleTalk"
    ],
    "correctIndex": 0,
    "explanation": "HTTP/3 completely replaces the traditional TCP + TLS transport stack with QUIC, an encrypted multiplexed transport protocol built on top of UDP."
  },
  {
    "id": 29,
    "topicId": "websockets-sse",
    "category": "WebSockets & Server-Sent Events",
    "difficulty": "Beginner",
    "question": "What status code does a server return when successfully upgrading an HTTP connection to a WebSocket?",
    "options": [
      "101 Switching Protocols",
      "200 OK",
      "301 Moved Permanently",
      "503 Service Unavailable"
    ],
    "correctIndex": 0,
    "explanation": "The server acknowledges the client's `Upgrade: websocket` request with `101 Switching Protocols`, transitioning the open TCP connection from HTTP semantics to the WebSocket frame protocol."
  },
  {
    "id": 30,
    "topicId": "websockets-sse",
    "category": "WebSockets & Server-Sent Events",
    "difficulty": "Beginner",
    "question": "What is the primary architectural difference between WebSockets and Server-Sent Events (SSE)?",
    "options": [
      "WebSockets is bidirectional (two-way); Server-Sent Events is unidirectional (server-to-client only).",
      "WebSockets only works over Wi-Fi, while SSE works over mobile data.",
      "SSE requires compiling C++ code in the browser.",
      "WebSockets can only transfer plain text, never binary data."
    ],
    "correctIndex": 0,
    "explanation": "WebSockets provides full-duplex two-way communication (client and server can send messages anytime). SSE provides a persistent one-way stream from server to client over standard HTTP."
  },
  {
    "id": 31,
    "topicId": "dns-connection-lifecycle",
    "category": "DNS, TCP & TLS Lifecycle",
    "difficulty": "Beginner",
    "question": "What is the primary role of the DNS (Domain Name System) in web browsing?",
    "options": [
      "Translating human-readable domain names (like example.com) into numerical IP addresses (like 93.184.216.34).",
      "Compressing JPEG image files so they load faster.",
      "Scanning web pages for spelling mistakes.",
      "Encrypting the user's hard drive."
    ],
    "correctIndex": 0,
    "explanation": "DNS acts as the phonebook of the Internet, resolving domain names that humans easily remember into numerical IP addresses required by routers to route IP packets."
  },
  {
    "id": 32,
    "topicId": "dns-connection-lifecycle",
    "category": "DNS, TCP & TLS Lifecycle",
    "difficulty": "Beginner",
    "question": "What are the three steps of the TCP 3-Way Handshake used to establish a reliable connection?",
    "options": [
      "SYN &rarr; SYN-ACK &rarr; ACK",
      "HELLO &rarr; VERIFY &rarr; OK",
      "PING &rarr; PONG &rarr; ECHO",
      "REQUEST &rarr; RESPONSE &rarr; CLOSE"
    ],
    "correctIndex": 0,
    "explanation": "The TCP handshake synchronizes initial sequence numbers (ISN) between client and server: Client sends SYN &rarr; Server replies with SYN-ACK &rarr; Client responds with ACK."
  },
  {
    "id": 33,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Beginner",
    "question": "What common compression algorithms are widely supported by browsers via the 'Accept-Encoding' header?",
    "options": [
      "Gzip and Brotli (br)",
      "MP3 and AAC",
      "H.264 and AV1",
      "RAR and 7-Zip"
    ],
    "correctIndex": 0,
    "explanation": "Modern browsers advertise 'Accept-Encoding: gzip, deflate, br'. Servers compress text assets (HTML/CSS/JS) using Gzip or the more efficient Brotli algorithm, reducing payload size by up to 70\u201380%."
  },
  {
    "id": 34,
    "topicId": "http-intro",
    "category": "What is HTTP?",
    "difficulty": "Intermediate",
    "question": "What is the difference between a URI, a URL, and a URN?",
    "options": [
      "URI is the generic identifier; URL identifies a resource by specifying its access location/protocol; URN identifies a resource by name in a namespace.",
      "URL is for web pages; URI is for mobile apps; URN is for printer cables.",
      "URI is only used on Linux servers; URL is only used on Windows servers.",
      "They are exact synonyms with zero technical distinction in RFC specifications."
    ],
    "correctIndex": 0,
    "explanation": "Per RFC 3986, URI (Uniform Resource Identifier) is the overarching umbrella. A URL (Locator) specifies *how* and *where* to retrieve the resource (e.g. https://...). A URN (Name) identifies a resource persistently by name independent of location (e.g. urn:isbn:0451450523)."
  },
  {
    "id": 35,
    "topicId": "request-response",
    "category": "Request\u2013Response Cycle",
    "difficulty": "Intermediate",
    "question": "In HTTP/1.1, what character sequence separates HTTP headers from the message body?",
    "options": [
      "A double carriage-return line-feed: CRLF CRLF (\\r\\n\\r\\n)",
      "A null terminator byte (\\0)",
      "Three consecutive hyphens (---)",
      "A closing semicolon (;)"
    ],
    "correctIndex": 0,
    "explanation": "The HTTP/1.1 message boundary between headers and body is strictly defined by an empty line: a carriage return followed by line feed (\\r\\n) following the final header's \\r\\n."
  },
  {
    "id": 36,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Intermediate",
    "question": "What is the formal definition of an 'Idempotent' HTTP method?",
    "options": [
      "Making multiple identical requests produces the exact same intended server state as making a single request.",
      "The request executes in less than 1 millisecond.",
      "The response is guaranteed to be encrypted with 256-bit AES.",
      "The method cannot accept request headers."
    ],
    "correctIndex": 0,
    "explanation": "Idempotency means `f(f(x)) = f(x)`. If a client sends an idempotent request (like PUT or DELETE) multiple times due to a network glitch, the final state of the resource on the server remains identical to issuing it once."
  },
  {
    "id": 37,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Intermediate",
    "question": "Which of the following HTTP methods is idempotent?",
    "options": [
      "PUT",
      "POST",
      "CONNECT",
      "PATCH (in general RFC specification)"
    ],
    "correctIndex": 0,
    "explanation": "PUT, GET, HEAD, DELETE, and OPTIONS are idempotent. POST is non-idempotent (sending it twice creates two records). PATCH is not inherently guaranteed to be idempotent because delta operations (e.g., 'increment count by 1') compound with each call."
  },
  {
    "id": 38,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Intermediate",
    "question": "What is the semantic distinction between the PUT method and the PATCH method in RESTful APIs?",
    "options": [
      "PUT replaces the entire resource representation with the payload; PATCH applies partial modifications to specific fields.",
      "PUT is only for file uploads; PATCH is only for text comments.",
      "PUT is deprecated in modern HTTP standards.",
      "PATCH creates a resource; PUT only reads a resource."
    ],
    "correctIndex": 0,
    "explanation": "PUT replaces the complete target resource state with the supplied body. PATCH (RFC 5789) describes a set of changes or deltas applied to modify specific attributes without overwriting unspecified fields."
  },
  {
    "id": 39,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Intermediate",
    "question": "What is the purpose of the HTTP OPTIONS method?",
    "options": [
      "It queries the target server to describe communication options and permitted HTTP methods available for the target URI.",
      "It allows the user to choose their preferred language in a drop-down menu.",
      "It checks the user's hard drive space before downloading a large file.",
      "It resets the web server configuration to factory defaults."
    ],
    "correctIndex": 0,
    "explanation": "OPTIONS permits clients to determine capabilities, permitted methods (via the 'Allow' header), and CORS policies supported by the server for a specific endpoint without initiating a resource action."
  },
  {
    "id": 40,
    "topicId": "headers-intro",
    "category": "HTTP Headers (Overview)",
    "difficulty": "Intermediate",
    "question": "Can multiple HTTP headers with the same name be combined into a single comma-separated header line?",
    "options": [
      "Yes, for any header whose field value is defined as a comma-separated list (e.g. Accept, Cache-Control), with the notable exception of Set-Cookie.",
      "No, repeating any header name causes a fatal protocol error.",
      "Yes, but only if the web server runs on macOS.",
      "Only if the request uses HTTP/0.9."
    ],
    "correctIndex": 0,
    "explanation": "Per RFC 7230, multiple header fields with the same name can be combined into one comma-separated line without altering semantics, provided the value is a list. `Set-Cookie` is the primary historic exception because cookie date strings contain commas."
  },
  {
    "id": 41,
    "topicId": "request-headers",
    "category": "Request Headers",
    "difficulty": "Intermediate",
    "question": "What is the purpose of the 'Accept' request header?",
    "options": [
      "It informs the server which MIME content types the client is able to understand (e.g., application/json, text/html).",
      "It signals that the user accepts the website's terms of service and cookie privacy policy.",
      "It authorizes credit card transactions automatically.",
      "It tells the server to accept the connection without an SSL certificate."
    ],
    "correctIndex": 0,
    "explanation": "The 'Accept' header drives HTTP content negotiation. For example, `Accept: application/json` requests JSON representations, while `Accept: text/html` requests rendered web page markups."
  },
  {
    "id": 42,
    "topicId": "request-headers",
    "category": "Request Headers",
    "difficulty": "Intermediate",
    "question": "What does the 'Range' request header (e.g. Range: bytes=500-999) enable?",
    "options": [
      "Partial content retrieval, allowing clients to resume interrupted downloads or stream specific chunks of video/audio.",
      "Filtering search results by price range.",
      "Specifying the minimum and maximum screen zoom levels.",
      "Limiting the geographic distance between the client and server."
    ],
    "correctIndex": 0,
    "explanation": "The Range header requests only a specified byte range of an entity. Servers supporting ranges respond with '206 Partial Content' and 'Content-Range', which powers video streaming and resumable downloads."
  },
  {
    "id": 43,
    "topicId": "request-headers",
    "category": "Request Headers",
    "difficulty": "Intermediate",
    "question": "What privacy vulnerability caused browsers to introduce strict Referrer-Policy controls for the 'Referer' header?",
    "options": [
      "The Referer header inadvertently leaked private query parameters, session tokens, and navigation paths to third-party domains.",
      "The Referer header exposed the client computer's root admin password.",
      "The header corrupted CSS styling rules on mobile screens.",
      "It forced third-party sites to download the user's browser history."
    ],
    "correctIndex": 0,
    "explanation": "Full URLs in the Referer header often contained sensitive query strings (e.g., `?token=secret` or user IDs). Modern browsers default to `strict-origin-when-cross-origin`, stripping paths on cross-origin requests."
  },
  {
    "id": 44,
    "topicId": "response-headers",
    "category": "Response Headers",
    "difficulty": "Intermediate",
    "question": "When a server sends 'Transfer-Encoding: chunked', how does the client know when the response body ends?",
    "options": [
      "The server streams chunks preceded by hexadecimal byte-length indicators, terminating with a final chunk of size 0.",
      "The server closes the TCP socket immediately.",
      "The client stops listening after precisely 60 seconds.",
      "The server sends a Content-Length header equal to infinity."
    ],
    "correctIndex": 0,
    "explanation": "Chunked transfer encoding is used when total payload length cannot be known in advance (e.g., dynamic streams). Each chunk is prefixed with its hex size; a terminating chunk of size 0 (`0\\r\\n\\r\\n`) signals completion."
  },
  {
    "id": 45,
    "topicId": "response-headers",
    "category": "Response Headers",
    "difficulty": "Intermediate",
    "question": "What is the role of the 'Location' response header?",
    "options": [
      "It provides the target redirection URL for 3xx responses or the newly created resource URI for 201 Created responses.",
      "It returns the GPS coordinates of the server's data center.",
      "It specifies the physical address of the company headquarters.",
      "It determines the language locale of the user interface."
    ],
    "correctIndex": 0,
    "explanation": "In 3xx redirects (301, 302, 307, 308), 'Location' points clients to the destination URL. In '201 Created', it points to the canonical URI of the newly created entity."
  },
  {
    "id": 46,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Intermediate",
    "question": "What is the crucial semantic difference between status codes 401 Unauthorized and 403 Forbidden?",
    "options": [
      "401 means authentication is required or credentials failed; 403 means the client's identity is authenticated, but they lack permission to access the resource.",
      "401 is for mobile devices; 403 is for desktop computers.",
      "401 means the server crashed; 403 means the database is full.",
      "There is no difference; they are interchangeable."
    ],
    "correctIndex": 0,
    "explanation": "401 (Unauthenticated) indicates that the request lacks valid authentication credentials (e.g. missing or invalid token). 403 (Forbidden) means the server knows who you are, but your account lacks authorization privileges."
  },
  {
    "id": 47,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Intermediate",
    "question": "What is the difference between a 301 Moved Permanently redirect and a 308 Permanent Redirect?",
    "options": [
      "308 prohibits clients from changing the request method (e.g. POST remains POST); historical implementations of 301 often improperly converted POST to GET.",
      "301 works on HTTPS; 308 only works on HTTP.",
      "308 expires after 24 hours; 301 lasts forever.",
      "301 is an error code; 308 is a success code."
    ],
    "correctIndex": 0,
    "explanation": "Historically, browsers rewritten POST requests to GET upon receiving 301 or 302. RFC 7538 created 307 (Temporary) and 308 (Permanent) to guarantee that the HTTP request method and body are preserved across the redirect."
  },
  {
    "id": 48,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Intermediate",
    "question": "What does the status code 204 No Content indicate?",
    "options": [
      "The server successfully fulfilled the request, and there is no additional content to send in the response body.",
      "The server could not find any files on disk.",
      "The user's internet connection was lost midway.",
      "The request failed because the form was empty."
    ],
    "correctIndex": 0,
    "explanation": "204 No Content indicates success without a response payload body. It is ideal for actions like deleting a record (DELETE) or saving settings in background AJAX calls where the UI requires no new data."
  },
  {
    "id": 49,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Intermediate",
    "question": "What does the status code 429 Too Many Requests signify, and which header typically accompanies it?",
    "options": [
      "Rate limiting has been triggered; accompanied by 'Retry-After' indicating how long to wait before trying again.",
      "The server's RAM is overloaded; accompanied by 'Server-Load'.",
      "The user opened too many browser tabs; accompanied by 'Close-Tab'.",
      "The request contained more than 100 headers; accompanied by 'Header-Count'."
    ],
    "correctIndex": 0,
    "explanation": "RFC 6585 defines 429 Too Many Requests for rate limiting. Servers often include `Retry-After: <seconds>` to inform clients when rate-limit quotas reset."
  },
  {
    "id": 50,
    "topicId": "status-codes",
    "category": "Status Codes",
    "difficulty": "Intermediate",
    "question": "What is the difference between a 502 Bad Gateway and a 504 Gateway Timeout error?",
    "options": [
      "502 means an intermediate proxy/reverse proxy received an invalid or crashed response from the upstream origin server; 504 means the upstream server failed to respond in time.",
      "502 is an issue with the client's router; 504 is an issue with the client's monitor.",
      "502 occurs on GET requests; 504 occurs on POST requests.",
      "502 means the server ran out of disk space; 504 means the domain expired."
    ],
    "correctIndex": 0,
    "explanation": "Both errors occur at reverse proxies (e.g. Nginx, Cloudflare). 502 Bad Gateway means the upstream server returned an invalid response or reset the connection. 504 Gateway Timeout means the upstream took too long and timed out."
  },
  {
    "id": 51,
    "topicId": "cache-control",
    "category": "Cache-Control Header",
    "difficulty": "Intermediate",
    "question": "What is the crucial difference between 'Cache-Control: no-cache' and 'Cache-Control: no-store'?",
    "options": [
      "no-cache allows caching but requires revalidating with the origin server before reuse; no-store forbids saving any copy to cache or persistent storage entirely.",
      "no-cache is for images; no-store is for HTML.",
      "no-store allows caching up to 10MB; no-cache has no limit.",
      "They mean the exact same thing in modern browsers."
    ],
    "correctIndex": 0,
    "explanation": "A common developer misconception! `no-cache` does NOT mean 'do not cache'. It means 'cache it, but ALWAYS validate with the server (via ETag/If-None-Match) before serving it'. `no-store` is what completely prohibits caching."
  },
  {
    "id": 52,
    "topicId": "cache-control",
    "category": "Cache-Control Header",
    "difficulty": "Intermediate",
    "question": "What does the Cache-Control directive 's-maxage=86400' do?",
    "options": [
      "It overrides max-age specifically for shared public caches (like CDNs and reverse proxies), leaving private browser caches unaffected.",
      "It limits download speed to 86400 bytes per second.",
      "It forces the browser to delete all cookies after 86400 seconds.",
      "It requires SSL certificates to renew every 86400 seconds."
    ],
    "correctIndex": 0,
    "explanation": "'s-maxage' stands for 'shared max-age'. It takes precedence over `max-age` for shared intermediate caches (like Cloudflare or Fastly), enabling a resource to cache on CDNs for 24 hours while browsers cache for 5 minutes."
  },
  {
    "id": 53,
    "topicId": "cache-control",
    "category": "Cache-Control Header",
    "difficulty": "Intermediate",
    "question": "What does the modern Cache-Control directive 'stale-while-revalidate=60' accomplish?",
    "options": [
      "It allows the client to immediately serve a stale cached response while asynchronously fetching a fresh version in the background.",
      "It slows down page loading to reduce server heat.",
      "It forces the browser to reload the page every 60 seconds automatically.",
      "It checks the freshness of the server's operating system kernel."
    ],
    "correctIndex": 0,
    "explanation": "stale-while-revalidate delivers instant response times: the browser immediately renders the existing cached response (zero network wait time) while kicking off a non-blocking background fetch to update the cache for next time."
  },
  {
    "id": 54,
    "topicId": "cache-control",
    "category": "Cache-Control Header",
    "difficulty": "Intermediate",
    "question": "What does the 'immutable' directive in 'Cache-Control: max-age=31536000, immutable' tell the browser?",
    "options": [
      "The resource body will never change during its freshness lifetime, so the browser should not send conditional revalidation requests even on user reload.",
      "The file cannot be edited by the server administrator.",
      "The JavaScript variables in the file are converted to const.",
      "The file is encrypted with an uncrackable cipher."
    ],
    "correctIndex": 0,
    "explanation": "When users press F5 / Reload, browsers traditionally send conditional requests (304 revalidation). The `immutable` directive tells the browser the file will never change (e.g. content-hashed bundles `main.7a8b9c.js`), eliminating unnecessary reload roundtrips."
  },
  {
    "id": 55,
    "topicId": "etag-last-modified",
    "category": "ETag & Last-Modified",
    "difficulty": "Intermediate",
    "question": "What does a prefix of 'W/' signify on an ETag (e.g., ETag: W/\"12345\")?",
    "options": [
      "A Weak ETag, indicating that the resource representations are semantically equivalent but not necessarily bit-for-bit byte identical.",
      "A Wildcard ETag that matches all versions.",
      "A Warning ETag indicating that the file is corrupted.",
      "A Write-only ETag for upload validations."
    ],
    "correctIndex": 0,
    "explanation": "A Weak ETag (`W/\"...\"`) guarantees semantic equivalence (e.g. two HTML documents with different whitespace or byte compression that render identical content). Strong ETags require exact byte-for-byte identity, which is required for byte-range requests."
  },
  {
    "id": 56,
    "topicId": "etag-last-modified",
    "category": "ETag & Last-Modified",
    "difficulty": "Intermediate",
    "question": "Why is ETag validation generally preferred over 'Last-Modified' timestamp validation?",
    "options": [
      "Last-Modified has only 1-second resolution, is vulnerable to clock skew across server clusters, and fails when files are rewritten without content changes.",
      "ETag is free, whereas Last-Modified requires a paid license.",
      "Last-Modified is incompatible with HTTPS.",
      "ETag automatically compresses images by 50%."
    ],
    "correctIndex": 0,
    "explanation": "Last-Modified dates only resolve to whole seconds; sub-second file updates are missed. Furthermore, distributed servers with slight clock drift give conflicting dates, and touching a file without modifying content invalidates timestamps, whereas ETags track content hashes."
  },
  {
    "id": 57,
    "topicId": "browser-vs-cdn",
    "category": "Browser Cache vs CDN Cache",
    "difficulty": "Intermediate",
    "question": "What is the purpose of the 'Vary' HTTP response header (e.g., Vary: Accept-Encoding, User-Agent)?",
    "options": [
      "It instructs caches that they must use the specified request headers as part of the cache lookup key to avoid serving mismatched formats.",
      "It tells the browser that the response size varies randomly.",
      "It indicates that the website has multiple visual theme options.",
      "It randomly routes requests to different server IP addresses."
    ],
    "correctIndex": 0,
    "explanation": "The Vary header prevents cache poisoning/mismatches. For example, `Vary: Accept-Encoding` ensures a client that does not support Brotli compression is never served a cached Brotli-compressed response meant for another client."
  },
  {
    "id": 58,
    "topicId": "browser-vs-cdn",
    "category": "Browser Cache vs CDN Cache",
    "difficulty": "Intermediate",
    "question": "What is 'Origin Shielding' in Content Delivery Networks?",
    "options": [
      "Designating a central CDN point-of-presence between edge edge nodes and the origin to consolidate cache misses and prevent origin traffic spikes.",
      "A firewall that blocks all search engine web crawlers.",
      "Encrypting the origin server's power cords.",
      "Hiding the domain name behind an anonymous VPN."
    ],
    "correctIndex": 0,
    "explanation": "Without origin shielding, thousands of distributed CDN edge nodes around the world could simultaneously hammer the origin server on a cache miss. An Origin Shield acts as a regional aggregator cache, protecting origin infrastructure."
  },
  {
    "id": 59,
    "topicId": "https",
    "category": "HTTPS & SSL/TLS",
    "difficulty": "Intermediate",
    "question": "What is the role of a Certificate Authority (CA) in the Public Key Infrastructure (PKI) of the web?",
    "options": [
      "A trusted third party that cryptographically signs SSL/TLS certificates, validating that a public key belongs to the verified domain owner.",
      "A government tax agency that audits internet sales transactions.",
      "A database that stores all internet passwords in plaintext.",
      "A web hosting provider that sells domain names."
    ],
    "correctIndex": 0,
    "explanation": "CAs (like Let's Encrypt, DigiCert) verify domain ownership and sign digital X.509 certificates. Operating systems and browsers maintain root CA stores to verify the cryptographic signature chain of visited websites."
  },
  {
    "id": 60,
    "topicId": "https",
    "category": "HTTPS & SSL/TLS",
    "difficulty": "Intermediate",
    "question": "What is Server Name Indication (SNI) in TLS negotiation?",
    "options": [
      "A TLS extension where the client indicates the hostname it is attempting to connect to during the initial ClientHello handshake.",
      "A DNS record that assigns a nickname to the web server.",
      "An HTTP header that announces the web developer's name.",
      "A hardware serial number etched onto server motherboards."
    ],
    "correctIndex": 0,
    "explanation": "Before SNI, the server could not know which domain the client wanted until after the TLS handshake, making it impossible to host multiple SSL certificates on a single IP address. SNI passes the hostname during TLS ClientHello so the server presents the right certificate."
  },
  {
    "id": 61,
    "topicId": "https",
    "category": "HTTPS & SSL/TLS",
    "difficulty": "Intermediate",
    "question": "What does the 'Strict-Transport-Security' (HSTS) response header enforce?",
    "options": [
      "It instructs the browser that the domain must strictly be accessed using HTTPS only, automatically upgrading any insecure HTTP attempts for the declared max-age.",
      "It forbids users from inspecting web source code.",
      "It blocks connections from computers older than 5 years.",
      "It enforces password complexity requirements."
    ],
    "correctIndex": 0,
    "explanation": "HSTS eliminates SSL-stripping attacks. Even if a user types `http://bank.com` or clicks an insecure link, the browser automatically translates the URL to `https://bank.com` internally before any network packet is dispatched."
  },
  {
    "id": 62,
    "topicId": "cookies",
    "category": "Cookies & State",
    "difficulty": "Intermediate",
    "question": "What does the 'SameSite=Lax' attribute on a cookie do compared to 'SameSite=Strict'?",
    "options": [
      "Lax blocks cookies on cross-origin subrequests (like images or iframes), but sends cookies when a user navigates to the site via top-level GET links; Strict blocks cookies on all cross-site requests unconditionally.",
      "Lax allows any website on the internet to read the cookie without restrictions.",
      "Lax only works on mobile devices; Strict works on laptops.",
      "Strict encrypts the cookie with AES-256; Lax uses plain text."
    ],
    "correctIndex": 0,
    "explanation": "SameSite prevents CSRF attacks. `Strict` never sends the cookie in cross-site contexts (even if clicking a link from an email). `Lax` provides a pragmatic balance: cookies are sent when following top-level GET links, but suppressed for cross-site POSTs, images, or iframes."
  },
  {
    "id": 63,
    "topicId": "cookies",
    "category": "Cookies & State",
    "difficulty": "Intermediate",
    "question": "What restriction does the 'Secure' cookie attribute apply?",
    "options": [
      "The cookie will only be transmitted over encrypted HTTPS connections, never over plaintext HTTP.",
      "The cookie can only be edited by an administrator.",
      "The cookie is encrypted with biometric fingerprinting.",
      "The cookie cannot be deleted by the user."
    ],
    "correctIndex": 0,
    "explanation": "The `Secure` attribute guarantees that the browser will never send the cookie over an unencrypted HTTP channel, preventing network eavesdroppers on public Wi-Fi from capturing session tokens."
  },
  {
    "id": 64,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Intermediate",
    "question": "What triggers a browser to execute an automated CORS Preflight (OPTIONS) request before making the actual request?",
    "options": [
      "Using non-simple HTTP methods (like PUT, PATCH, DELETE) or custom headers (like Authorization), or a Content-Type other than text/plain, multipart/form-data, or application/x-www-form-urlencoded.",
      "Visiting any website with an odd-numbered IP address.",
      "Using a mouse instead of a touchscreen.",
      "Downloading a file larger than 1 megabyte."
    ],
    "correctIndex": 0,
    "explanation": "Requests that could modify data with non-standard verbs or custom headers trigger an `OPTIONS` preflight. The browser checks with the server first to ensure the server understands CORS and authorizes the operation."
  },
  {
    "id": 65,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Intermediate",
    "question": "Why does a CORS response with 'Access-Control-Allow-Origin: *' fail when client-side fetch() sets 'credentials: \"include\"'?",
    "options": [
      "The CORS specification strictly forbids combining wildcard origin (*) with credentialed requests to prevent sensitive cookie/session leakage across random origins.",
      "The asterisk symbol is illegal in all HTTP headers.",
      "Wildcard origins only work on intranet networks.",
      "Browsers require cookies to be base64-encoded when using wildcards."
    ],
    "correctIndex": 0,
    "explanation": "For security reasons (preventing unauthorized sites from reading authenticated user data), if a request includes credentials (cookies/auth headers), the server MUST specify an explicit origin in `Access-Control-Allow-Origin` and include `Access-Control-Allow-Credentials: true`."
  },
  {
    "id": 66,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Intermediate",
    "question": "What attack vector does the 'Content-Security-Policy' (CSP) response header directly protect against?",
    "options": [
      "Cross-Site Scripting (XSS) and code injection attacks.",
      "Distributed Denial of Service (DDoS) bandwidth floods.",
      "Physical theft of server hard drives.",
      "Operating system kernel memory corruption."
    ],
    "correctIndex": 0,
    "explanation": "CSP restricts where executable scripts, stylesheets, fonts, and fetch requests can originate from, blocking unauthorized inline scripts and external malicious script injection (XSS)."
  },
  {
    "id": 67,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Intermediate",
    "question": "What does the response header 'X-Content-Type-Options: nosniff' prevent?",
    "options": [
      "It prevents browsers from MIME-sniffing a response away from the declared Content-Type, mitigating script execution disguised as images or text.",
      "It stops the browser from checking the spelling of words in an article.",
      "It hides the user's IP address from analytics trackers.",
      "It prevents audio files from playing automatically."
    ],
    "correctIndex": 0,
    "explanation": "Historically, browsers would 'sniff' files and execute scripts even if the server declared `Content-Type: text/plain` or `image/jpeg`. `nosniff` forces browsers to strictly respect the declared Content-Type."
  },
  {
    "id": 68,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Intermediate",
    "question": "How does HTTP/2 Multiplexing solve the HTTP/1.1 'Head-of-Line (HoL) Blocking' at the application layer?",
    "options": [
      "It interleaves multiple request and response messages as independent binary frames over a single TCP connection concurrently.",
      "It opens 100 simultaneous TCP sockets per domain.",
      "It compresses the internet router firmware.",
      "It forces the server to respond before receiving the request."
    ],
    "correctIndex": 0,
    "explanation": "In HTTP/1.1, a slow response on a TCP connection blocked all subsequent requests queued on that connection. HTTP/2 interleaves chunked binary frames tagged with Stream IDs over a single socket, allowing fast responses to bypass slow ones."
  },
  {
    "id": 69,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Intermediate",
    "question": "What header compression algorithm does HTTP/2 use to reduce metadata transmission overhead?",
    "options": [
      "HPACK",
      "Gzip",
      "Deflate",
      "Snappy"
    ],
    "correctIndex": 0,
    "explanation": "HTTP/2 uses HPACK (RFC 7541), which uses pre-defined static tables for common headers and dynamic tables for previously seen values, combined with Huffman coding, avoiding CRIME compression security exploits."
  },
  {
    "id": 70,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Intermediate",
    "question": "Why did HTTP/2 still suffer from Head-of-Line blocking at the transport layer, motivating the creation of HTTP/3?",
    "options": [
      "Because HTTP/2 relies on TCP: if a single TCP packet is dropped, the TCP stack halts delivery of ALL streams on that socket until the missing packet is retransmitted.",
      "Because HTTP/2 binary frames are too large for fiber optic cables.",
      "Because web servers can only process one stream at a time in RAM.",
      "Because TCP connections shut down after transferring 1 megabyte."
    ],
    "correctIndex": 0,
    "explanation": "TCP guarantees in-order byte stream delivery. If packet #3 is dropped on lossy Wi-Fi/cellular, TCP holds all subsequent packets in buffer until packet #3 is resent, stalling all multiplexed HTTP/2 streams regardless of their independence."
  },
  {
    "id": 71,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Intermediate",
    "question": "What is 'Connection Migration' in HTTP/3 QUIC?",
    "options": [
      "The ability of an ongoing QUIC connection to survive IP address changes (e.g. switching from Wi-Fi to 5G) without reconnecting, because connections are identified by a 64-bit Connection ID rather than the 4-tuple IP/port.",
      "Moving a website from AWS to Google Cloud without downtime.",
      "Migrating MySQL database tables to PostgreSQL automatically.",
      "Redirecting desktop users to mobile websites."
    ],
    "correctIndex": 0,
    "explanation": "Traditional TCP binds connections to (Client IP, Client Port, Server IP, Server Port). When your phone disconnects from Wi-Fi and connects to 5G, your IP changes and all TCP connections break. QUIC uses Connection IDs (CIDs), maintaining connections seamlessly."
  },
  {
    "id": 72,
    "topicId": "websockets-sse",
    "category": "WebSockets & Server-Sent Events",
    "difficulty": "Intermediate",
    "question": "Why do WebSocket clients mask their outgoing frames with a 4-byte masking key, while servers do not mask their frames?",
    "options": [
      "To prevent malicious scripts from poisoning intermediary HTTP proxy caches by crafting payloads that look like valid cached HTTP responses.",
      "To encrypt data against government surveillance.",
      "To compress text using gzip.",
      "To verify the client's GPU driver version."
    ],
    "correctIndex": 0,
    "explanation": "Masking (XORing client frame payloads with a random 4-byte key) was introduced to prevent cache poisoning attacks on legacy transparent HTTP proxies that misinterpret WebSocket frames as HTTP requests."
  },
  {
    "id": 73,
    "topicId": "websockets-sse",
    "category": "WebSockets & Server-Sent Events",
    "difficulty": "Intermediate",
    "question": "What is the content type used by Server-Sent Events (SSE)?",
    "options": [
      "text/event-stream",
      "application/websocket",
      "application/x-sse",
      "multipart/event-data"
    ],
    "correctIndex": 0,
    "explanation": "SSE streams are standard HTTP responses served with `Content-Type: text/event-stream; charset=utf-8` and `Cache-Control: no-cache`."
  },
  {
    "id": 74,
    "topicId": "websockets-sse",
    "category": "WebSockets & Server-Sent Events",
    "difficulty": "Intermediate",
    "question": "Why are Server-Sent Events (SSE) exceptionally popular for modern LLM AI applications (like streaming ChatGPT answers)?",
    "options": [
      "SSE operates over standard HTTP, natively supports streaming text tokens, reconnects automatically if dropped, and avoids complex WebSocket socket management.",
      "SSE can only transmit artificial intelligence algorithms.",
      "SSE does not consume any electrical power.",
      "SSE runs entirely inside the computer's CPU registers."
    ],
    "correctIndex": 0,
    "explanation": "LLM text generation is inherently unidirectional (server streams tokens to client). SSE works seamlessly through standard HTTP firewalls, CDNs, HTTP/2 multiplexing, and includes automatic reconnect logic via the browser's EventSource API."
  },
  {
    "id": 75,
    "topicId": "dns-connection-lifecycle",
    "category": "DNS, TCP & TLS Lifecycle",
    "difficulty": "Intermediate",
    "question": "What is the difference between a DNS 'A' record and an 'AAAA' record?",
    "options": [
      "An 'A' record maps a domain to a 32-bit IPv4 address; an 'AAAA' (quad-A) record maps to a 128-bit IPv6 address.",
      "An 'A' record is for American websites; 'AAAA' is for Asian websites.",
      "An 'A' record is for active servers; 'AAAA' is for archived servers.",
      "An 'A' record uses TCP; an 'AAAA' record uses UDP."
    ],
    "correctIndex": 0,
    "explanation": "Standard A records return 32-bit IPv4 addresses (e.g. 93.184.216.34). Quad-A (AAAA) records return 128-bit IPv6 addresses (e.g. 2606:2800:220:1:248:1893:25c8:1946)."
  },
  {
    "id": 76,
    "topicId": "dns-connection-lifecycle",
    "category": "DNS, TCP & TLS Lifecycle",
    "difficulty": "Intermediate",
    "question": "What is a DNS 'CNAME' record used for?",
    "options": [
      "Aliasing one domain name to another canonical domain name.",
      "Storing the SSL certificate private key.",
      "Routing incoming email to mail transfer agents.",
      "Configuring domain name server clock speeds."
    ],
    "correctIndex": 0,
    "explanation": "A Canonical Name (CNAME) record creates an alias pointing one name to another (e.g., `www.example.com` points to `example.com`), allowing administrators to manage IP address changes in a single record."
  },
  {
    "id": 77,
    "topicId": "dns-connection-lifecycle",
    "category": "DNS, TCP & TLS Lifecycle",
    "difficulty": "Intermediate",
    "question": "What does ALPN (Application-Layer Protocol Negotiation) do during the TLS handshake?",
    "options": [
      "It allows the client and server to negotiate which application protocol to use (such as HTTP/1.1, h2, or h3) within the TLS handshake, eliminating extra roundtrips.",
      "It negotiates the price of domain registration.",
      "It checks if the server has enough RAM to run Node.js.",
      "It translates English text into Chinese."
    ],
    "correctIndex": 0,
    "explanation": "ALPN is a TLS extension. During the initial TLS ClientHello, the client advertises supported protocols (e.g., `['h2', 'http/1.1']`). The server selects one in its ServerHello, allowing secure protocol upgrade without a separate roundtrip."
  },
  {
    "id": 78,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Intermediate",
    "question": "Why is 'Domain Sharding' (splitting assets across cdn1.example.com, cdn2.example.com) considered an anti-pattern in HTTP/2 and HTTP/3?",
    "options": [
      "It breaks HTTP/2 multiplexing by forcing the client to establish multiple separate TCP/TLS connections, incurring extra handshakes and losing connection congestion window benefits.",
      "Domain sharding is illegal under ICANN regulations.",
      "Web browsers can only save cookies for one subdomain.",
      "It causes CSS animations to stutter."
    ],
    "correctIndex": 0,
    "explanation": "In HTTP/1.1, browsers limited concurrent TCP connections to 6 per domain, so domain sharding was used to bypass this limit. In HTTP/2, all assets share a single multiplexed socket; sharding ruins multiplexing and wastes CPU on redundant handshakes."
  },
  {
    "id": 79,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Intermediate",
    "question": "What is the difference between resource hints '<link rel=\"preload\">' and '<link rel=\"prefetch\">'?",
    "options": [
      "Preload fetches high-priority critical resources needed for the current page immediately; Prefetch fetches low-priority resources likely needed for future navigations during idle time.",
      "Preload is for images; Prefetch is for fonts.",
      "Preload stores files in RAM; Prefetch writes files to USB drives.",
      "There is no difference; they are duplicate HTML tags."
    ],
    "correctIndex": 0,
    "explanation": "`preload` is mandatory and high-priority: it tells the browser to download a resource discovered late in the current page (like web fonts or hero images) right now. `prefetch` is low-priority: it fetches resources for the *next* page the user might visit."
  },
  {
    "id": 80,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Intermediate",
    "question": "What does '<link rel=\"preconnect\" href=\"https://api.example.com\">' do?",
    "options": [
      "It proactively performs DNS resolution, TCP handshake, and TLS negotiation with the third-party origin before the application actually dispatches a request.",
      "It immediately downloads all images hosted on that domain.",
      "It opens an infinite WebSocket loop.",
      "It blocks connections to that domain for security."
    ],
    "correctIndex": 0,
    "explanation": "`preconnect` eliminates 100\u2013300ms of connection setup latency by performing DNS lookup, TCP 3-way handshake, and TLS 1.3 key exchange ahead of time for origins the page knows it will need shortly."
  },
  {
    "id": 81,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Intermediate",
    "question": "Why is Brotli (br) compression typically chosen over Gzip for modern web production assets?",
    "options": [
      "Brotli achieves 15\u201325% higher compression ratios than Gzip on text assets (HTML/CSS/JS) due to a built-in static dictionary of common web keywords.",
      "Brotli is an uncompressed raw binary format.",
      "Gzip was banned by the W3C consortium.",
      "Brotli works without an operating system."
    ],
    "correctIndex": 0,
    "explanation": "Developed by Google, Brotli includes a 120KB static dictionary containing common HTML and web strings. It compresses web text files significantly smaller than Gzip at comparable decompression speeds."
  },
  {
    "id": 82,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Intermediate",
    "question": "What is the recommended caching strategy for static web bundles built with content hashes (e.g., app.8f2a1c.js)?",
    "options": [
      "Cache-Control: public, max-age=31536000, immutable",
      "Cache-Control: no-store",
      "Cache-Control: max-age=60",
      "Cache-Control: private, must-revalidate"
    ],
    "correctIndex": 0,
    "explanation": "Because the filename contains a cryptographic hash of its contents, the file will never change; when code updates, the HTML references a new hash. Thus, it can be cached forever (1 year / 31,536,000 seconds) with `immutable`."
  },
  {
    "id": 83,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Intermediate",
    "question": "What is the recommended caching header strategy for the root HTML document ('index.html') of a Single Page Application?",
    "options": [
      "Cache-Control: no-cache (or no-store), ensuring clients always validate with the server to receive the latest hashed asset references.",
      "Cache-Control: max-age=31536000, immutable",
      "Cache-Control: public, max-age=86400",
      "Expires: 1 year in the future"
    ],
    "correctIndex": 0,
    "explanation": "If `index.html` is cached for a long time, users will continue loading outdated HTML containing references to old script bundles, preventing them from seeing newly deployed features and bug fixes. It must be `no-cache`."
  },
  {
    "id": 84,
    "topicId": "request-response",
    "category": "Request\u2013Response Cycle",
    "difficulty": "Intermediate",
    "question": "What does the 'Connection: keep-alive' header do in HTTP/1.0 and HTTP/1.1?",
    "options": [
      "It signals that the underlying TCP connection should be kept open for subsequent requests rather than closing after a single response.",
      "It tests whether the user is physically moving their mouse.",
      "It reboots the router if packets are dropped.",
      "It prevents web servers from going to sleep during nighttime."
    ],
    "correctIndex": 0,
    "explanation": "In HTTP/1.0, connections closed after every request. HTTP/1.1 introduced persistent connections by default (`Connection: keep-alive`), allowing dozens of sequential requests to share one open TCP socket."
  },
  {
    "id": 85,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Intermediate",
    "question": "What is the primary function of the HTTP CONNECT method?",
    "options": [
      "It establishes a two-way transparent TCP tunnel through an HTTP proxy, typically used to initiate an encrypted HTTPS session through a proxy.",
      "It connects two database tables with a JOIN statement.",
      "It pairs a Bluetooth keyboard with a browser.",
      "It verifies user Wi-Fi signal strength."
    ],
    "correctIndex": 0,
    "explanation": "CONNECT asks a forward proxy server to create a blind TCP connection to the destination host and port (e.g. `CONNECT example.com:443 HTTP/1.1`). Once opened, the client tunnels TLS directly without the proxy inspecting payloads."
  },
  {
    "id": 86,
    "topicId": "http-intro",
    "category": "What is HTTP?",
    "difficulty": "Advanced",
    "question": "In the HTTP/1.1 specification, what is HTTP Request Smuggling (HRS)?",
    "options": [
      "A security exploit arising from discrepancies in how front-end reverse proxies and back-end servers interpret Content-Length vs Transfer-Encoding (chunked) request boundaries.",
      "Stealing credit card numbers over open Wi-Fi networks.",
      "Hiding secret messages inside JPEG image pixels.",
      "Bypassing firewalls by spoofing DNS root servers."
    ],
    "correctIndex": 0,
    "explanation": "When an attacker sends a request with both `Content-Length` and `Transfer-Encoding: chunked`, if the front-end proxy prioritizes Content-Length while the back-end prioritizes Transfer-Encoding (or vice-versa), part of the request 'smuggles' through to poison the next client's request pipeline."
  },
  {
    "id": 87,
    "topicId": "methods",
    "category": "HTTP Methods",
    "difficulty": "Advanced",
    "question": "Why is the HTTP TRACE method almost universally disabled on production web servers?",
    "options": [
      "It enables Cross-Site Tracing (XST) attacks, where malicious scripts can steal HttpOnly cookies by reflecting the client's request headers back in the response body.",
      "TRACE consumes 100% of the server's CPU capacity.",
      "TRACE is incompatible with modern 64-bit Linux kernels.",
      "TRACE deletes server access logs automatically."
    ],
    "correctIndex": 0,
    "explanation": "The TRACE method echoes the exact received request back to the client. In an XSS scenario, an attacker can use TRACE to force the browser to emit request headers\u2014including HttpOnly cookies\u2014and read them from the response body."
  },
  {
    "id": 88,
    "topicId": "caching-basics",
    "category": "Caching Fundamentals",
    "difficulty": "Advanced",
    "question": "What is 'Cache Poisoning' in web infrastructure?",
    "options": [
      "An attack where an adversary crafts unkeyed request inputs (e.g. headers like X-Forwarded-Host) causing a shared cache to store and serve a malicious response to other users.",
      "Injecting physical acid onto server solid-state storage chips.",
      "Corrupting the browser's local font rendering cache.",
      "Sending corrupted cookies that crash the operating system."
    ],
    "correctIndex": 0,
    "explanation": "Cache Poisoning exploits the difference between what the cache uses as its Cache Key (e.g. URL path) and unkeyed headers the backend processes (e.g. `X-Forwarded-Host`). If the backend reflects malicious script URLs into the response, the cache stores it and serves XSS to all subsequent visitors."
  },
  {
    "id": 89,
    "topicId": "browser-vs-cdn",
    "category": "Browser Cache vs CDN Cache",
    "difficulty": "Advanced",
    "question": "What is the purpose of 'Surrogate-Keys' (or Cache-Tags) in advanced CDN caching architectures?",
    "options": [
      "They tag cached responses with semantic entity identifiers, allowing fine-grained targeted cache invalidation of related pages without clearing the entire cache.",
      "They act as backup encryption keys if an SSL certificate expires.",
      "They identify the physical server rack holding the CDN blade.",
      "They allow database administrators to log in without passwords."
    ],
    "correctIndex": 0,
    "explanation": "Surrogate-Keys (e.g. `Surrogate-Key: product-42 user-99`) allow tagging responses with metadata. When product #42 is updated in the database, the server issues an API call to purge all cached pages tagged `product-42` globally in milliseconds."
  },
  {
    "id": 90,
    "topicId": "https",
    "category": "HTTPS & SSL/TLS",
    "difficulty": "Advanced",
    "question": "How did TLS 1.3 reduce handshake latency compared to TLS 1.2?",
    "options": [
      "TLS 1.3 reduced the standard handshake from 2 roundtrips (2-RTT) to 1 roundtrip (1-RTT) by sending Diffie-Hellman KeyShare parameters directly in the ClientHello message.",
      "TLS 1.3 eliminated encryption altogether.",
      "TLS 1.3 sends keys via SMS text messages.",
      "TLS 1.3 requires servers to be located in the same country as the user."
    ],
    "correctIndex": 0,
    "explanation": "In TLS 1.2, cipher negotiation and key exchange required two back-and-forth roundtrips before application data could flow. TLS 1.3 guesses client key-share algorithms up front and sends ephemeral keys in ClientHello, completing the handshake in just 1-RTT."
  },
  {
    "id": 91,
    "topicId": "https",
    "category": "HTTPS & SSL/TLS",
    "difficulty": "Advanced",
    "question": "What is '0-RTT' (Zero Round-Trip Time) data in TLS 1.3, and what critical security trade-off does it introduce?",
    "options": [
      "It allows returning clients to send early application data in the very first flight of packets, but early data is vulnerable to replay attacks.",
      "It runs without electricity, but limits websites to 10 visitors.",
      "It encrypts data with 4096-bit keys, but crashes Firefox browsers.",
      "It bypasses all corporate firewalls, but requires root access."
    ],
    "correctIndex": 0,
    "explanation": "In TLS 1.3 0-RTT resumption, clients encrypt early request data using a previously established pre-shared key (PSK). However, an eavesdropper can intercept and replay that first packet, so 0-RTT data must ONLY be used for safe, idempotent requests (like GET)."
  },
  {
    "id": 92,
    "topicId": "cookies",
    "category": "Cookies & State",
    "difficulty": "Advanced",
    "question": "What security guarantees do cookie prefixes '__Host-' and '__Secure-' provide?",
    "options": [
      "__Host- guarantees the cookie must have Secure, Path=/, and CANNOT have a Domain attribute (restricting it strictly to the host without subdomain shadowing).",
      "They allow cookies to be stored on blockchain networks.",
      "They prevent cookies from expiring for 100 years.",
      "They automatically translate cookie values into Spanish."
    ],
    "correctIndex": 0,
    "explanation": "Cookie prefixes are browser-enforced security policies (RFC 6265bis). If a cookie starts with `__Host-`, the browser rejects the cookie unless it is sent with `Secure`, `Path=/`, and no `Domain` attribute, preventing subdomain takeovers from overwriting parent cookies."
  },
  {
    "id": 93,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Advanced",
    "question": "Does a CORS preflight failure prevent a server from executing a request, or does it prevent the browser from exposing the response to JavaScript?",
    "options": [
      "For simple requests, the server executes the request, but the browser blocks JavaScript from reading the response; for preflighted requests, the browser aborts before the actual request is sent.",
      "The server firewall physically drops all incoming packets before TCP connects.",
      "CORS runs on the server operating system kernel exclusively.",
      "CORS errors disconnect the computer from the local router."
    ],
    "correctIndex": 0,
    "explanation": "A critical systems nuance: CORS is enforced by the *browser*, not the server! For simple GET/POST requests without preflight, the server actually processes the request, but the browser withholds the response body from JavaScript if CORS headers are absent."
  },
  {
    "id": 94,
    "topicId": "cors-security",
    "category": "CORS & Web Security Headers",
    "difficulty": "Advanced",
    "question": "What is the purpose of the 'Cross-Origin-Opener-Policy' (COOP) and 'Cross-Origin-Embedder-Policy' (COEP) headers?",
    "options": [
      "They isolate the browser process and execution context, enabling access to high-resolution timers and SharedArrayBuffer without Spectre side-channel attack vulnerabilities.",
      "They prevent users from embedding YouTube videos.",
      "They encrypt CSS styles so competitors cannot copy design tokens.",
      "They restrict website viewing to certified mobile phones."
    ],
    "correctIndex": 0,
    "explanation": "In the wake of Spectre hardware CPU cache side-channel attacks, browsers disabled `SharedArrayBuffer` and microsecond timers. Setting COOP (`same-origin`) and COEP (`require-corp`) places the page in a secure cross-origin isolated process."
  },
  {
    "id": 95,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Advanced",
    "question": "Why was 'HTTP/2 Server Push' officially deprecated and disabled by default in major browsers (Chrome/Firefox)?",
    "options": [
      "It suffered from poor cache awareness (often pushing resources already cached by the browser), high connection contention, and complexity compared to 103 Early Hints.",
      "Server push was outlawed by international copyright laws.",
      "It consumed all available memory on mobile phones.",
      "It was incompatible with modern CSS grid layouts."
    ],
    "correctIndex": 0,
    "explanation": "Server Push intended to send assets before the client asked. In practice, servers pushed megabytes of CSS/JS the browser already held in cache, wasting bandwidth. The modern replacement is `103 Early Hints`, which lets the browser decide what to fetch."
  },
  {
    "id": 96,
    "topicId": "http2-http3",
    "category": "HTTP/2, HTTP/3 & QUIC",
    "difficulty": "Advanced",
    "question": "What header compression scheme is used in HTTP/3, and why could HTTP/2's HPACK not be used?",
    "options": [
      "QPACK; HPACK required strict in-order delivery of frames across a single TCP stream, which would cause Head-of-Line blocking over out-of-order QUIC UDP datagrams.",
      "Brotli; HPACK was deleted from GitHub.",
      "LZMA; HPACK could only compress uppercase letters.",
      "Zstandard; QPACK was banned for security flaws."
    ],
    "correctIndex": 0,
    "explanation": "HPACK modifies its dynamic table incrementally based on sequential frame order. Because QUIC delivers independent streams over UDP out-of-order, HPACK would force streams to block waiting for earlier dynamic table updates. QPACK separates dynamic state across dedicated encoder/decoder streams."
  },
  {
    "id": 97,
    "topicId": "websockets-sse",
    "category": "WebSockets & Server-Sent Events",
    "difficulty": "Advanced",
    "question": "What is the purpose of WebSocket 'Ping' and 'Pong' control frames (Opcodes 0x9 and 0xA)?",
    "options": [
      "To serve as low-overhead heartbeats that verify connection liveness and prevent stateful intermediate NAT firewalls and proxies from dropping idle TCP sockets.",
      "To calculate the user's ping latency for online gaming leaderboards.",
      "To transfer binary images between browser windows.",
      "To restart the web server after an unhandled exception."
    ],
    "correctIndex": 0,
    "explanation": "NAT gateways and load balancers drop idle TCP connections after 30\u201360 seconds of silence. Built-in Ping (0x9) and Pong (0xA) control frames keep connections alive with 2 bytes of overhead and measure real round-trip latency without application payload logic."
  },
  {
    "id": 98,
    "topicId": "dns-connection-lifecycle",
    "category": "DNS, TCP & TLS Lifecycle",
    "difficulty": "Advanced",
    "question": "What is the function of the '103 Early Hints' informational HTTP status code?",
    "options": [
      "It allows the server to send preliminary response headers containing Link: rel=preload headers to the browser while the backend is still asynchronously rendering the main HTML body.",
      "It gives hints to students taking an online computer science quiz.",
      "It warns the user that their internet speed is below 10 Mbps.",
      "It informs the client that the server will shut down in 103 seconds."
    ],
    "correctIndex": 0,
    "explanation": "Defined in RFC 8297, 103 Early Hints utilizes the 'server think time' (the 100\u2013500ms while a database query runs) to stream preloading hints (`Link: </app.css>; rel=preload`). The browser starts downloading CSS and fonts before the HTML response even begins!"
  },
  {
    "id": 99,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Advanced",
    "question": "What is 'TCP Slow Start' and how does it impact initial HTTP page load performance?",
    "options": [
      "TCP initializes with a small Congestion Window (CWND, typically 10 packets), doubling it with each successful round-trip, meaning large assets cannot achieve maximum network throughput immediately.",
      "TCP servers take 5 minutes to warm up after turning on power.",
      "TCP deliberately delays packets on mobile networks to conserve battery.",
      "TCP slow start is an obsolete algorithm from 1980 that was removed from modern operating systems."
    ],
    "correctIndex": 0,
    "explanation": "To prevent network congestion, every new TCP connection starts with an initial window (initcwnd = 10 packets, ~14KB). If your HTML file is 50KB, it cannot transfer in 1 roundtrip; it requires 3 roundtrips of slow-start expansion. This is why keeping critical HTML under 14KB is a legendary web performance rule!"
  },
  {
    "id": 100,
    "topicId": "performance",
    "category": "Performance & Best Practices",
    "difficulty": "Advanced",
    "question": "From a holistic systems perspective, what is the complete network journey of an HTTPS request from the moment a user presses Enter in the browser address bar?",
    "options": [
      "DNS resolution (Cache &rarr; Resolver &rarr; Root/TLD/Auth) &rarr; TCP 3-Way Handshake &rarr; TLS 1.3 Key Exchange & SNI/ALPN &rarr; HTTP Request Serialization &rarr; CDN Edge Cache Lookup / Origin Routing &rarr; Server Kernel / Reverse Proxy &rarr; Application Handler &rarr; HTTP Response Streaming &rarr; Browser Frame Parsing & DOM / CSSOM Rendering.",
      "Browser &rarr; Wi-Fi Router &rarr; Hard Drive &rarr; Display Monitor.",
      "Typing URL &rarr; Direct connection to satellite &rarr; Immediate display of web page.",
      "JavaScript compiler &rarr; Operating system kernel &rarr; CPU registers &rarr; RAM."
    ],
    "correctIndex": 0,
    "explanation": "The grand unified journey of the web: DNS translates names to IP, TCP establishes reliable byte delivery, TLS verifies identity and negotiates forward-secret symmetric keys, HTTP structures the semantic intent, CDN/proxies evaluate cache freshness, and the server executes application logic to stream responses back for client rendering."
  }
];
