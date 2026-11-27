import type { ITProblemSeed } from '../types';

export const group4Seeds: ITProblemSeed[] = [
  {
    chapterId: 'networks-internet',
    title: 'Forwarding Between Networks',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which device forwards packets between separate networks by using IP addresses?',
    options: ['A hub', 'A router', 'A switch', 'A repeater'],
    answer: 1,
    explanation:
      'A router chooses a path between networks using IP addresses. A switch forwards frames inside a local network, while hubs and repeaters only extend a signal.',
    hint: 'Think about the device at the edge of a home or office network.',
  },
  {
    chapterId: 'networks-internet',
    title: 'The Role of DNS',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the main job of the Domain Name System (DNS)?',
    options: [
      'Assign IP addresses to devices automatically',
      'Translate human-readable names into IP addresses',
      'Encrypt traffic between browsers and servers',
      'Filter unwanted email before delivery',
    ],
    answer: 1,
    explanation:
      'DNS resolves names such as example.com into the numeric IP addresses that computers use to reach servers. DHCP, not DNS, assigns addresses automatically.',
    hint: 'Consider what has to happen before a browser can contact a named website.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Opening a Course Website',
    difficulty: 'Easy',
    type: 'scenario',
    context: 'A student types https://courses.example.edu/login into a browser.',
    prompt: 'Which service is consulted first to find the server for courses.example.edu?',
    options: ['DNS', 'DHCP', 'FTP', 'SMTP'],
    answer: 0,
    explanation:
      'The browser needs an IP address for the hostname, so it queries DNS. DHCP configures local network settings, while FTP and SMTP serve other purposes.',
    hint: 'The name must become an address before a connection can start.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Hardware Address on a LAN',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which address is assigned to a network interface by its manufacturer and used for delivery within a local network?',
    options: ['Subnet mask', 'Port number', 'MAC address', 'Domain name'],
    answer: 2,
    explanation:
      'A MAC address identifies a network interface on a LAN and is used for local frame delivery. IP addresses are logical and can change when a device moves.',
    hint: 'It is often written as six pairs of hexadecimal digits.',
  },
  {
    chapterId: 'networks-internet',
    title: 'LAN Versus WAN',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which statement best describes the difference between a LAN and a WAN?',
    options: [
      'A LAN is always wireless, while a WAN is always wired',
      'A WAN is limited to one building, while a LAN spans countries',
      'A LAN covers a small area such as an office, while a WAN spans a large geographic area',
      'A LAN uses IP addresses, while a WAN uses only MAC addresses',
    ],
    answer: 2,
    explanation:
      'LANs connect devices in a limited area, such as a home or office. WANs link networks across cities or countries; the internet is the largest WAN.',
    hint: 'Consider the scale of each network type rather than its cabling.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Small Office Network',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A dental clinic has 12 computers, a printer, a switch, and one internet connection in a single building.',
    prompt: 'What type of network is the clinic using internally?',
    options: [
      'A local area network (LAN)',
      'A wide area network (WAN)',
      'A metropolitan area network (MAN)',
      'The public internet',
    ],
    answer: 0,
    explanation:
      'The clinic\'s devices share a switch inside one building, which is a LAN. A WAN would connect separate sites across a wider area.',
    hint: 'The key detail is that all devices sit in one building.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Reliable Transport',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which transport protocol establishes a connection, acknowledges received data, and retransmits lost segments?',
    options: ['UDP', 'IP', 'DNS', 'TCP'],
    answer: 3,
    explanation:
      'TCP provides reliable, ordered delivery with acknowledgements and retransmission. UDP sends datagrams without those guarantees, and IP handles addressing and routing.',
    hint: 'One transport protocol is built around reliability rather than speed alone.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Live Video Priority',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A video-calling app keeps audio flowing during a brief network glitch, accepting a little lost quality rather than pausing to recover every packet.',
    prompt: 'Which transport protocol does this behavior most suggest?',
    options: ['TCP', 'UDP', 'HTTP', 'SMTP'],
    answer: 1,
    explanation:
      'UDP favors timely delivery over guaranteed delivery, which suits live media where waiting for retransmissions would cause delay. TCP would recover lost data but may add latency.',
    hint: 'Real-time media often prefers speed over perfect reliability.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Defining Latency',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does network latency measure?',
    options: [
      'The time it takes data to travel from source to destination',
      'The maximum amount of data a link can carry per second',
      'The percentage of packets discarded by a router',
      'The number of devices attached to a switch',
    ],
    answer: 0,
    explanation:
      'Latency is delay, usually measured in milliseconds. Bandwidth measures capacity, while packet loss measures discarded traffic; they are separate characteristics.',
    hint: 'Ping times are a common way to report this value.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Usable Hosts in a /24',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'A network uses the subnet mask 255.255.255.0. How many usable host addresses does each subnet provide?',
    options: ['254', '256', '255', '512'],
    answer: 0,
    explanation:
      'The last octet offers 256 combinations, but the all-zero network address and all-one broadcast address are reserved, leaving 254 usable host addresses.',
    hint: 'Two addresses in every subnet cannot be assigned to hosts.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Reaching a Private Web Server',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A company web server has the private address 10.0.0.5. Customers on the internet reach it through the public address 203.0.113.10.',
    prompt: 'Which technique maps the public address to the private server?',
    options: ['DNS caching', 'Dynamic host configuration', 'Network address translation', 'Packet sniffing'],
    answer: 2,
    explanation:
      'Network address translation rewrites addresses as traffic crosses the boundary, letting private hosts share public addresses. DNS only maps names to addresses.',
    hint: 'The router must translate one address into another at the network edge.',
  },
  {
    chapterId: 'networks-internet',
    title: 'IP Address Plus Port',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Why is an IP address alone usually insufficient to identify a specific service on a server?',
    options: [
      'IP addresses change every second',
      'Every service must use a domain name',
      'Ports are only used by switches',
      'A port number identifies which service or application should receive the traffic',
    ],
    answer: 3,
    explanation:
      'One server can run many services on the same IP address, and the port number separates them. For example, HTTPS normally listens on port 443.',
    hint: 'Think about several services sharing one machine.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Name Resolution Failure',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A user can open http://93.184.216.34 in a browser, but typing www.example.com fails with a server-not-found error.',
    prompt: 'Which service has probably failed?',
    options: [
      'The local monitor resolution',
      'DNS name resolution',
      'The server disk capacity',
      'The user\'s keyboard layout',
    ],
    answer: 1,
    explanation:
      'Reaching the site by IP proves basic connectivity works, so the failure is likely in resolving the name. A DNS problem prevents the browser from obtaining the address.',
    hint: 'The IP path works; compare what the name requires.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Purpose of a Default Gateway',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does a host use its default gateway for?',
    options: [
      'To store copies of frequently visited web pages',
      'To translate domain names into IP addresses',
      'To forward traffic destined for a different network',
      'To assign itself a permanent MAC address',
    ],
    answer: 2,
    explanation:
      'When the destination is outside the host\'s subnet, the host sends the packet to its default gateway, typically a router that can forward it onward.',
    hint: 'It is the exit point from the local subnet.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Same Subnet Check',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Two computers are configured as 192.168.1.50/24 and 192.168.1.180/24 and are connected to the same switch.',
    prompt: 'How will they communicate?',
    options: [
      'Directly through the switch, because both addresses are in the same subnet',
      'Only through a router, because the host portions differ',
      'Only through a DNS server',
      'They cannot communicate because the addresses are duplicated',
    ],
    answer: 0,
    explanation:
      'Both addresses share the 192.168.1.0/24 network, so they are local to each other and can exchange frames through the switch without routing.',
    hint: 'Compare the first three octets and the /24 prefix.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Packet Switching',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which statement best describes packet switching on the internet?',
    options: [
      'A dedicated circuit stays open for the entire conversation',
      'All packets from a message must follow the same path',
      'Messages are broadcast to every connected device',
      'Data is split into packets that can travel independently and be reassembled',
    ],
    answer: 3,
    explanation:
      'Packet switching divides data into addressed packets that may take different routes and are reassembled at the destination. This sharing improves efficiency and resilience.',
    hint: 'Think about how many conversations share one link.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Fast Link, Slow Response',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A branch office has a 1 Gbps download link, yet interactive video calls feel sluggish and files take time to appear after a click.',
    prompt: 'Which explanation is most consistent with these symptoms?',
    options: [
      'Bandwidth is too low for any video call',
      'High bandwidth does not guarantee low latency, and delay hurts interactivity',
      'The link must be using UDP instead of TCP',
      'A larger subnet mask would fix the delay',
    ],
    answer: 1,
    explanation:
      'Bandwidth is capacity, not delay. A fast link can still have high latency, which makes interactive traffic feel slow even when large transfers complete quickly.',
    hint: 'Separate the amount of data a link carries from how long a round trip takes.',
  },
  {
    chapterId: 'networks-internet',
    title: 'TCP Loss Recovery',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'A TCP segment is lost in transit. What normally happens next?',
    options: [
      'The application must always detect and resend it',
      'The receiver silently discards the whole connection',
      'The sender retransmits it after detecting a missing acknowledgement',
      'The router permanently reroutes all traffic to another host',
    ],
    answer: 2,
    explanation:
      'TCP uses acknowledgements and timers to detect missing data and retransmit it. UDP leaves recovery to the application, but TCP handles it at the transport layer.',
    hint: 'Reliability is one of the defining responsibilities of TCP.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Missing Route Between Subnets',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Users on 10.1.2.0/24 can reach each other but cannot reach servers on 10.1.3.0/24. Both networks connect to the same router.',
    prompt: 'What is the most likely problem?',
    options: [
      'The router lacks a route or interface configuration for the second subnet',
      'The computers have identical MAC addresses',
      'DNS is resolving the server names incorrectly',
      'The switch is broadcasting too many frames',
    ],
    answer: 0,
    explanation:
      'Local traffic works, so the hosts and switch are fine. Crossing to another subnet requires correct routing, and a missing route or interface configuration would block it.',
    hint: 'The failure starts exactly at the boundary between two subnets.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Teleporting Players',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'An online game reports 30 ms average ping, but players see characters jump across the map and actions sometimes fail to register.',
    prompt: 'Which network condition best explains this?',
    options: [
      'Excessive bandwidth',
      'A DNS cache that is too large',
      'A subnet mask that is too short',
      'Packet loss causing missing position updates',
    ],
    answer: 3,
    explanation:
      'Low average latency does not prevent individual packets from being dropped. Lost updates make remote players appear to jump when the next update arrives.',
    hint: 'Average delay looks fine, so look for data that never arrives.',
  },
  {
    chapterId: 'networks-internet',
    title: 'Why the Internet Scales',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'The internet connects billions of devices, yet no single router knows every possible path in advance.',
    prompt: 'Which design choice most helps it scale?',
    options: [
      'Every device shares one flat address space with no hierarchy',
      'Hierarchical addressing lets routers aggregate routes instead of storing every host',
      'All traffic is broadcast so routers never need tables',
      'Each connection is assigned a dedicated physical circuit',
    ],
    answer: 1,
    explanation:
      'Hierarchical addressing allows route aggregation, so routers can summarize large groups of addresses. A flat scheme would require enormous routing tables and would not scale.',
    hint: 'Summarizing groups of addresses reduces the size of routing tables.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Parts of a URL',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In the URL https://store.example.com/cart?id=42, which part is the host?',
    options: ['https', '/cart', 'store.example.com', 'id=42'],
    answer: 2,
    explanation:
      'The host is the server name immediately after the scheme, here store.example.com. The path is /cart, and id=42 is a query parameter.',
    hint: 'Look between the scheme and the first slash.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'What HTTPS Adds',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does HTTPS add to ordinary HTTP?',
    options: [
      'Encryption and integrity protection using TLS',
      'Faster page rendering in the browser',
      'Automatic removal of malicious files',
      'A guarantee that the website owner is honest',
    ],
    answer: 0,
    explanation:
      'HTTPS runs HTTP over TLS, protecting traffic from eavesdropping and tampering. It does not prove the site is trustworthy or make pages render faster.',
    hint: 'The padlock concerns the connection, not the site\'s character.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Interpreting the Padlock',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A shopper sees a padlock and https:// in the address bar of an unfamiliar online store.',
    prompt: 'What can the shopper reasonably conclude?',
    options: [
      'The store has been audited for fair trading',
      'The products are guaranteed to be genuine',
      'The site cannot contain malware',
      'The connection to the site is encrypted, but the store may still be untrustworthy',
    ],
    answer: 3,
    explanation:
      'The padlock shows that traffic is encrypted in transit. It says nothing about the seller\'s honesty, product quality, or whether the site is a scam.',
    hint: 'Separate transport security from business trustworthiness.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Reading a Page',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which HTTP method is normally used to retrieve a web page without intentionally changing server state?',
    options: ['POST', 'GET', 'DELETE', 'PUT'],
    answer: 1,
    explanation:
      'GET requests a representation of a resource and should not modify it. POST commonly submits data, while PUT and DELETE change or remove resources.',
    hint: 'Browsers use this method when you simply open an address.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Browser Cache Benefit',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why do browsers keep a cache of previously downloaded files?',
    options: [
      'To load repeated resources faster and reduce network traffic',
      'To permanently back up the user\'s documents',
      'To increase the screen resolution',
      'To encrypt cookies before storage',
    ],
    answer: 0,
    explanation:
      'A cache stores copies of resources such as images and scripts so repeat visits need less downloading. It improves speed and reduces bandwidth use.',
    hint: 'Think about revisiting a site you loaded a moment ago.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Editing Across Devices',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An employee edits a report on a laptop, then opens the same report on a phone and sees the new text within seconds.',
    prompt: 'Which cloud feature made this possible?',
    options: ['File synchronization', 'Disk defragmentation', 'Packet filtering', 'Screen mirroring'],
    answer: 0,
    explanation:
      'Synchronization copies changes between devices through the cloud service. It is not a backup by itself, because a deletion can sync everywhere.',
    hint: 'The change is being copied, not merely stored in one place.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Retrieving Mail',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which protocol lets a mail client retrieve messages while typically keeping them on the server?',
    options: ['SMTP', 'FTP', 'DNS', 'IMAP'],
    answer: 3,
    explanation:
      'IMAP synchronizes mailboxes and leaves messages on the server so multiple devices can see the same state. SMTP is for sending mail, not retrieving it.',
    hint: 'One protocol is designed for synchronized mailboxes across devices.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Sending a Newsletter',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A marketing team composes a newsletter in its mail platform and sends it to 5,000 subscribers.',
    prompt: 'Which protocol carries the outgoing messages from the sending server?',
    options: ['IMAP', 'SMTP', 'DNS', 'HTTPS'],
    answer: 1,
    explanation:
      'SMTP is the standard protocol for sending and relaying email between servers. IMAP retrieves mail, and DNS only resolves server names.',
    hint: 'Sending and retrieving email use different protocols.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Path in a URL',
    difficulty: 'Medium',
    type: 'mcq',
    context: 'The link is https://shop.example.com/orders/2024/invoice.pdf?lang=en.',
    prompt: 'Which component identifies the specific resource on the server?',
    options: ['shop.example.com', 'https', '/orders/2024/invoice.pdf', 'lang=en'],
    answer: 2,
    explanation:
      'The path /orders/2024/invoice.pdf locates the resource on the host. The host names the server, https is the scheme, and lang=en is a query parameter.',
    hint: 'It comes after the host and before the question mark.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'A Convincing Executive Request',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An employee receives an email that appears to come from the CEO, asking for an urgent gift-card purchase. The reply-to address is a free webmail account.',
    prompt: 'What is the best response?',
    options: [
      'Reply to the email and ask whether it is genuine',
      'Verify the request through a separate known channel before acting',
      'Buy one card first to test the process',
      'Forward the email to colleagues for their opinions',
    ],
    answer: 1,
    explanation:
      'The mismatched reply-to and unusual request are classic signs of phishing. Confirm through a known phone number or in person, not by replying to the suspicious message.',
    hint: 'Do not use the contact details supplied by the suspicious message.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Sync Versus Backup',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the key difference between cloud synchronization and backup?',
    options: [
      'Sync encrypts files, while backup does not',
      'Backup keeps files on a server, while sync is always local',
      'Sync only works for photos, while backup works for all files',
      'Sync mirrors current changes, while backup preserves earlier versions for recovery',
    ],
    answer: 3,
    explanation:
      'Synchronization propagates the latest version, including deletions or ransomware changes. A backup keeps separate historical copies so you can restore an earlier state.',
    hint: 'Ask what happens when a file is deleted or corrupted.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'A Public Edit Link',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A project lead shares a cloud document using a link set to "anyone with the link can edit". The link is later posted in a public chat.',
    prompt: 'What is the main risk?',
    options: [
      'Unauthorized people may change or delete the document',
      'The document will automatically become read-only',
      'The cloud provider will delete the file after 24 hours',
      'The file will stop synchronizing to the lead\'s computer',
    ],
    answer: 0,
    explanation:
      'Anyone who finds the link can edit, so the document can be altered or destroyed by unintended users. Sharing should use named accounts and the least access needed.',
    hint: 'Consider who can act on the document, not just who can view it.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Why Sessions Exist',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why do web applications use session cookies?',
    options: [
      'To compress images before download',
      'To replace DNS with a local lookup table',
      'To recognize a user across separate HTTP requests',
      'To prevent the browser from caching any content',
    ],
    answer: 2,
    explanation:
      'HTTP is stateless, so each request stands alone. A session cookie carries an identifier that lets the server associate requests with an authenticated user.',
    hint: 'The protocol does not remember previous requests by itself.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Login on an HTTP Page',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An employee opens a company tool over plain http:// and is asked to enter a username and password.',
    prompt: 'Why is this dangerous?',
    options: [
      'The page will load too slowly',
      'Credentials can be read or altered by someone on the network path',
      'HTTP prevents the use of strong passwords',
      'The browser cannot display a login form over HTTP',
    ],
    answer: 1,
    explanation:
      'Plain HTTP sends data unencrypted, so an attacker on the path can capture credentials. Login pages should use HTTPS to protect the exchange.',
    hint: 'Think about who else can see traffic on the route.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'One Login for Many Apps',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An employee must remember separate passwords for email, the expense tool, and the project tracker. The company wants one trusted login for all three.',
    prompt: 'Which capability provides this experience?',
    options: [
      'Single sign-on',
      'A browser cache',
      'Network address translation',
      'A mailing list',
    ],
    answer: 0,
    explanation:
      'Single sign-on centralizes authentication so one login grants access to multiple connected applications. It reduces password sprawl and can simplify access removal.',
    hint: 'One set of credentials should unlock several services.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Who Secures the Mailbox?',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A company adopts a hosted email service. The provider secures the data centers and underlying platform.',
    prompt: 'Under the shared responsibility model, what remains the company\'s job?',
    options: [
      'Physically guarding the provider servers',
      'Patching the provider hypervisors',
      'Managing user accounts, access permissions, and email settings',
      'Maintaining the provider network backbone',
    ],
    answer: 2,
    explanation:
      'The provider secures the cloud infrastructure, but the customer controls accounts, permissions, and configuration. Misconfigured sharing is therefore the customer\'s risk.',
    hint: 'Focus on the parts of the service the customer actually configures.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Why Email Can Be Spoofed',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why is it possible for an attacker to forge the From address of an email?',
    options: [
      'Email protocols always verify the sender\'s identity before delivery',
      'The From header is supplied by the sender and is not inherently authenticated',
      'Every mail server requires a digital signature from the sender',
      'DNS prevents any domain from being used without permission',
    ],
    answer: 1,
    explanation:
      'The From header is easy to set, and basic SMTP does not prove the sender is genuine. SPF, DKIM, and DMARC add checks that help receivers detect forgery.',
    hint: 'Distinguish a displayed label from a verified identity.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Reading a Deceptive Link',
    difficulty: 'Hard',
    type: 'scenario',
    context: 'An email contains the link https://paypal.com.account-check.example/login.',
    prompt: 'Which part is the actual domain that will receive the request?',
    options: ['paypal.com', 'account-check.example', 'login', 'https'],
    answer: 1,
    explanation:
      'The hostname ends in account-check.example, which is the actual registered domain. The leading paypal.com is a subdomain prefix chosen to look reassuring.',
    hint: 'Read the domain from right to left, not left to right.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Conflicting Cloud Edits',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Two staff members edit the same synced spreadsheet while offline. Both come online with different changes to the same cell.',
    prompt: 'What is the safest service behavior?',
    options: [
      'Silently keep the version from the faster connection',
      'Delete the file and ask both users to start again',
      'Disable offline editing permanently for all users',
      'Merge unrelated changes and clearly flag the conflicting cell for review',
    ],
    answer: 3,
    explanation:
      'Automatic merging can handle disjoint edits, but true conflicts need a visible decision. Silently overwriting one person\'s work loses data without warning.',
    hint: 'The goal is to preserve both people\'s work and make the conflict visible.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Stateless HTTP Trade-off',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What is the main trade-off of adding server-side sessions to stateless HTTP?',
    options: [
      'Requests become easier to scale, but users must log in for every page',
      'HTTP stops working over TLS',
      'Browsers can no longer cache any content',
      'The server gains continuity for users but must store and expire session state',
    ],
    answer: 3,
    explanation:
      'Sessions let the server remember users across requests, but they add storage, expiration, and coordination overhead. Tokens shift some of that state to the client instead.',
    hint: 'Consider where the memory of the login has to live.',
  },
  {
    chapterId: 'web-email-cloud',
    title: 'Email Authentication Controls',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'Which set of technologies helps receiving mail servers verify that a message legitimately came from its claimed domain?',
    options: [
      'IMAP, POP3, and SMTP',
      'HTML, CSS, and JavaScript',
      'SPF, DKIM, and DMARC',
      'TCP, UDP, and ICMP',
    ],
    answer: 2,
    explanation:
      'SPF authorizes sending servers, DKIM signs messages cryptographically, and DMARC tells receivers how to act when checks fail. Together they reduce spoofing.',
    hint: 'These are policies and signatures attached to a domain\'s mail.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'The CIA Triad',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which three properties make up the CIA triad in information security?',
    options: [
      'Confidentiality, integrity, and availability',
      'Control, identity, and auditing',
      'Confidentiality, isolation, and authentication',
      'Consistency, integrity, and access',
    ],
    answer: 0,
    explanation:
      'The CIA triad names confidentiality, integrity, and availability as the core goals of security. Controls are chosen according to which property a risk threatens.',
    hint: 'The acronym is also a familiar three-letter agency name.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Ransomware Impact',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Ransomware encrypts a hospital\'s patient records and the staff can no longer open them.',
    prompt: 'Which part of the CIA triad is most immediately disrupted?',
    options: ['Confidentiality only', 'Integrity only', 'Availability', 'Non-repudiation'],
    answer: 2,
    explanation:
      'Staff cannot access records, so availability is directly lost. Ransomware can also harm confidentiality and integrity, but the immediate outage is an availability failure.',
    hint: 'Ask what the staff can no longer do with the data.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Defining Phishing',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is phishing?',
    options: [
      'Flooding a server with traffic until it fails',
      'Deceiving people into revealing information or clicking malicious links',
      'Guessing passwords by trying every combination',
      'Intercepting traffic on a wireless network',
    ],
    answer: 1,
    explanation:
      'Phishing uses convincing messages to manipulate people into handing over credentials, data, or access. Flooding traffic is a denial-of-service attack, not phishing.',
    hint: 'The target is the person, not the network device.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Help Desk Impersonation',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A caller claims to be a senior manager, says they are locked out before a board meeting, and demands an immediate password reset without verification.',
    prompt: 'Which attack is this most likely to be?',
    options: [
      'A brute-force attack',
      'A denial-of-service attack',
      'A supply-chain attack',
      'Social engineering',
    ],
    answer: 3,
    explanation:
      'The caller exploits urgency and authority to manipulate the help desk. Verifying identity through an independent channel is the appropriate defense.',
    hint: 'The pressure and claimed authority are the tools being used.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Least Privilege',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the principle of least privilege require?',
    options: [
      'Giving users only the access needed for their current tasks',
      'Giving every administrator full access to all systems',
      'Removing all passwords from internal systems',
      'Granting access permanently so it is never reviewed',
    ],
    answer: 0,
    explanation:
      'Least privilege limits accounts to what their role requires, reducing the damage from mistakes or stolen credentials. Access should be reviewed and removed when no longer needed.',
    hint: 'Think about limiting blast radius rather than trusting users less.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Multi-Factor Authentication',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What makes an authentication method multi-factor?',
    options: [
      'It uses two different passwords',
      'It asks the same question twice',
      'It combines independent evidence from different categories, such as a password and a code',
      'It stores credentials in two databases',
    ],
    answer: 2,
    explanation:
      'MFA requires factors from separate categories, such as something you know and something you have. Two passwords are still only one category and do not qualify.',
    hint: 'Two items from the same category do not add a second factor.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Password Reuse Risk',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An employee uses the same password for a social media site and for the company email.',
    prompt: 'Why is this especially dangerous?',
    options: [
      'It makes the password harder to remember',
      'A breach at the social site can expose credentials used to attack company email',
      'It slows down the employee\'s computer',
      'It prevents the use of multi-factor authentication',
    ],
    answer: 1,
    explanation:
      'Attackers reuse leaked credentials across services, a practice called credential stuffing. One breach can therefore unlock unrelated accounts, including work email.',
    hint: 'Think about what a leaked password reveals beyond the site that leaked it.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'What Encryption Provides',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does encryption primarily protect?',
    options: [
      'The availability of a service during an outage',
      'The speed of a network connection',
      'The physical durability of a disk',
      'The confidentiality of data against unauthorized readers',
    ],
    answer: 3,
    explanation:
      'Encryption makes data unreadable without the key, protecting confidentiality. It does not by itself ensure availability, speed, or the integrity of every system component.',
    hint: 'The goal is to stop others from understanding the contents.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Authentication Versus Authorization',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the difference between authentication and authorization?',
    options: [
      'Authentication checks permissions, while authorization verifies identity',
      'Authentication encrypts data, while authorization decrypts it',
      'Authentication verifies who you are, while authorization decides what you may do',
      'They are two names for the same process',
    ],
    answer: 2,
    explanation:
      'Authentication establishes identity, such as through a password or token. Authorization then checks whether that identity is allowed to perform a specific action.',
    hint: 'One comes before the other and answers a different question.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Keys in a Public Repository',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A developer accidentally commits cloud API keys to a public code repository. The commit is deleted minutes later.',
    prompt: 'What should happen first?',
    options: [
      'Revoke and rotate the exposed keys, then investigate for misuse',
      'Assume deletion removed all copies and take no further action',
      'Add the keys to a private branch and continue',
      'Wait for the cloud provider to notice and contact the company',
    ],
    answer: 0,
    explanation:
      'Public repositories are copied quickly, so deletion is not containment. Revoking and rotating the credentials limits exposure, and logs should be reviewed for unauthorized use.',
    hint: 'Removing the text does not remove the secret from others who copied it.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Why Patching Matters',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why is timely software patching a core security control?',
    options: [
      'It increases the screen brightness',
      'It removes the need for backups',
      'It guarantees that no new vulnerabilities will appear',
      'It closes known vulnerabilities before attackers can exploit them',
    ],
    answer: 3,
    explanation:
      'Patches fix flaws that attackers may already know how to exploit. Patching does not replace backups or prevent future bugs, but it shrinks a well-known attack surface.',
    hint: 'Attackers often automate exploitation of flaws that already have fixes.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Backups Never Restored',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A company runs nightly backups but has never tested a restore. A ransomware attack destroys the production file server.',
    prompt: 'What is the main risk in this situation?',
    options: [
      'The backups will automatically decrypt the ransomware',
      'The backups may be incomplete or unusable when recovery is attempted',
      'The backup software will patch the server',
      'The company will be forced to buy new monitors',
    ],
    answer: 1,
    explanation:
      'A backup is only useful if it can be restored within the required time. Untested backups may fail because of errors, missing data, or corrupt media.',
    hint: 'A copy that has never been read back is an unproven copy.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'HTTPS on Public Wi-Fi',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does HTTPS protect when you use an untrusted public Wi-Fi network?',
    options: [
      'It hides your device MAC address from the access point',
      'It prevents the Wi-Fi operator from seeing which websites you visit',
      'It encrypts and authenticates traffic between your browser and the website',
      'It stops the website from collecting your data',
    ],
    answer: 2,
    explanation:
      'HTTPS protects the connection to the site, preventing nearby attackers from reading or altering its contents. The network operator may still see that you connected to a domain.',
    hint: 'Focus on the browser-to-server channel, not the whole network.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'An Unexpected IT Request',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An email claiming to be from IT asks an employee to click a link and re-enter their password to avoid account suspension.',
    prompt: 'What is the best action?',
    options: [
      'Report the message to security and verify through a known IT contact',
      'Click the link quickly before the account is suspended',
      'Reply with the password to prove the account is active',
      'Forward the message to all colleagues as a warning without reporting it',
    ],
    answer: 0,
    explanation:
      'Unexpected credential requests are a common phishing pattern. Reporting and verifying through an independent channel avoids both compromise and unnecessary panic.',
    hint: 'Urgency is a signal to slow down, not to comply.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Salting Password Hashes',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why do password systems add a unique salt before hashing each password?',
    options: [
      'To make the password shorter to type',
      'To allow the password to be reversed by administrators',
      'To encrypt the password with a shared public key',
      'To prevent identical passwords from producing identical hashes and defeat precomputed tables',
    ],
    answer: 3,
    explanation:
      'A unique salt changes each hash, so attackers cannot reuse one precomputed table across accounts. Salting complements slow hashing but does not make weak passwords strong.',
    hint: 'Consider two users who choose the same password.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Convenient Admin Rights',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An IT manager gives a summer intern domain-administrator rights because it makes setup tasks faster.',
    prompt: 'Which principle is being violated?',
    options: ['Defense in depth', 'Least privilege', 'Data minimization', 'Separation of duties'],
    answer: 1,
    explanation:
      'The intern receives far more access than the tasks require. Least privilege would grant only the permissions needed, reducing harm from mistakes or a compromised account.',
    hint: 'The problem is the breadth of access, not the intern\'s intent.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Defense in Depth',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What does defense in depth mean in security planning?',
    options: [
      'Relying on one very strong control so nothing else is needed',
      'Hiding all security measures from users',
      'Layering independent controls so a single failure does not expose everything',
      'Buying the most expensive security product available',
    ],
    answer: 2,
    explanation:
      'Defense in depth assumes any one control can fail and adds overlapping protections. This reduces the chance that a single mistake or bypass leads to full compromise.',
    hint: 'Assume one barrier will eventually be crossed.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'First Steps After a Breach',
    difficulty: 'Hard',
    type: 'scenario',
    context: 'A security team confirms that an attacker has an active foothold on several servers.',
    prompt: 'Which sequence is most appropriate?',
    options: [
      'Contain the affected systems, then eradicate the attacker\'s access, recover, and review lessons',
      'Immediately wipe every disk before collecting any evidence',
      'Publish all forensic details before notifying anyone',
      'Wait for the attacker to leave before changing any credentials',
    ],
    answer: 0,
    explanation:
      'Containment stops further damage, eradication removes the foothold, and recovery restores services. A post-incident review then improves defenses; evidence collection should not be destroyed.',
    hint: 'Stop the spread before cleaning up, and learn afterward.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Responding to a Zero-Day',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A critical zero-day vulnerability affects an internet-facing service, and no vendor patch exists yet.',
    prompt: 'What is the most reasonable short-term response?',
    options: [
      'Ignore it until a patch is released',
      'Disable all logging to reduce disk usage',
      'Publish exploit code to pressure the vendor',
      'Apply compensating controls, reduce exposure, and monitor for exploitation',
    ],
    answer: 3,
    explanation:
      'Without a patch, teams reduce the attack surface, add temporary controls such as filtering or isolation, and watch for signs of compromise. Waiting passively leaves the service exposed.',
    hint: 'You cannot patch yet, so limit who can reach the vulnerable service.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Limits of Encryption at Rest',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Why is encryption at rest not sufficient on its own?',
    options: [
      'It only protects data while it is being transmitted',
      'It cannot protect data once an authorized process or stolen key can decrypt it',
      'It makes databases run too slowly to be secure',
      'It prevents backups from being created',
    ],
    answer: 1,
    explanation:
      'Encryption at rest protects stored media, but data must be decrypted for use. A compromised account, application, or key can still expose plaintext, so access controls matter too.',
    hint: 'Think about who or what is allowed to decrypt the data.',
  },
  {
    chapterId: 'cybersecurity',
    title: 'Impossible Travel Alert',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'An identity dashboard flags a user login from another country at 3 a.m., shortly after a login from the user\'s home city.',
    prompt: 'What is the best first response?',
    options: [
      'Ignore it because the user may travel often',
      'Contain the account, reset credentials, review activity, and contact the user',
      'Delete the user\'s mailbox to protect company data',
      'Disable all company accounts until the end of the month',
    ],
    answer: 1,
    explanation:
      'An impossible-travel signal may indicate stolen credentials. Containment and credential reset limit access while the team verifies with the user and reviews what the session did.',
    hint: 'Protect the account first, then establish whether the alert is real.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Role of a Primary Key',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the purpose of a primary key in a database table?',
    options: [
      'To store the largest value in each column',
      'To uniquely identify each row in the table',
      'To link the table to a web page',
      'To encrypt sensitive columns automatically',
    ],
    answer: 1,
    explanation:
      'A primary key uniquely identifies every row, so no two rows share the same key value. Other tables can then reference that row reliably.',
    hint: 'Every row needs a value that no other row shares.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Linking Students and Enrollments',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A Students table has StudentID as its primary key. An Enrollments table stores StudentID to show which student took each course.',
    prompt: 'What role does StudentID play in the Enrollments table?',
    options: [
      'It is a report filter',
      'It is a second primary key for Students',
      'It is a foreign key referencing Students',
      'It is a password field',
    ],
    answer: 2,
    explanation:
      'A foreign key is a column that references a primary key in another table. Here it connects each enrollment to the correct student record.',
    hint: 'The value points back to a key in a different table.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Rows and Records',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a relational table, what does one row represent?',
    options: [
      'One instance of the entity described by the table',
      'One column definition',
      'One database user',
      'One backup file',
    ],
    answer: 0,
    explanation:
      'A row, also called a record, holds one instance such as a single customer or order. Columns define the attributes recorded for each instance.',
    hint: 'Think of one customer in a customer list.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'How Relational Data Is Organized',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How does a relational database primarily organize data?',
    options: [
      'As unlabeled text files in folders',
      'As a single shared document',
      'As a hierarchy of printed reports',
      'As tables made of rows and columns',
    ],
    answer: 3,
    explanation:
      'Relational databases store data in tables with defined columns, and relationships are represented through keys. This structure supports queries and integrity rules.',
    hint: 'The name comes from relations between tables, but the basic unit is tabular.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'A Recurring Sales Summary',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A manager needs total sales by region every Monday, formatted the same way for a standing meeting.',
    prompt: 'What database output best fits this need?',
    options: ['A one-off ad hoc query', 'A saved report', 'A schema migration', 'A backup'],
    answer: 1,
    explanation:
      'A saved report presents query results in a consistent layout on a schedule, which suits recurring summaries. An ad hoc query is better for a one-time question.',
    hint: 'The result repeats on a schedule and needs a stable format.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'What a Query Does',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is a database query?',
    options: [
      'A physical cable connecting two servers',
      'A permanent copy of the entire database',
      'A request for data that matches specified conditions',
      'A rule that prevents users from logging in',
    ],
    answer: 2,
    explanation:
      'A query asks the database for particular rows, columns, or summaries. It can filter, sort, join, and aggregate data without changing the underlying tables.',
    hint: 'It is a question, not a copy.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'One Seat, One Booking',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Two customers try to reserve the last seat at the same moment. The system records the booking and marks the seat taken as a single all-or-nothing operation.',
    prompt: 'Which transaction property does this illustrate?',
    options: ['Atomicity', 'Durability', 'Portability', 'Compression'],
    answer: 0,
    explanation:
      'Atomicity means a transaction either completes fully or has no effect. The booking and seat update must succeed together, preventing a half-finished reservation.',
    hint: 'The unit cannot be split into a successful half and a failed half.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Why Normalize',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the main goal of normalizing a relational database?',
    options: [
      'To make every table as wide as possible',
      'To remove all foreign keys',
      'To store duplicate copies of data for speed',
      'To reduce redundancy and avoid inconsistent updates',
    ],
    answer: 3,
    explanation:
      'Normalization organizes data so each fact is stored once, reducing duplication and update anomalies. It can add joins, which is a trade-off against simpler read performance.',
    hint: 'Think about the cost of storing the same address many times.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Updating One Address',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An orders spreadsheet repeats the customer\'s address on every order row. A staff member updates the address on one row but not the others.',
    prompt: 'What problem has occurred?',
    options: [
      'A hardware failure',
      'An update anomaly causing inconsistent data',
      'A network timeout',
      'A loss of referential integrity across servers',
    ],
    answer: 1,
    explanation:
      'Repeated data can diverge when only one copy is changed. Storing the address once in a customer table and referencing it would prevent this inconsistency.',
    hint: 'The same fact now has two different values.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Relational Versus NoSQL Trade-off',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which statement best captures a common trade-off between relational and NoSQL databases?',
    options: [
      'Relational databases cannot store text, while NoSQL stores only numbers',
      'NoSQL databases always enforce stronger integrity than relational ones',
      'Relational models offer strong structure and integrity, while NoSQL models offer flexible schemas with more responsibility on the application',
      'Relational databases require no schema, while NoSQL databases require a fixed one',
    ],
    answer: 2,
    explanation:
      'Relational databases enforce a schema and integrity rules, which suits consistent transactions. NoSQL systems often relax structure for scale or flexibility, so applications must handle more consistency logic.',
    hint: 'One side gains flexibility by giving up some built-in guarantees.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Profiles With Varying Fields',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A startup stores user profiles whose optional fields differ widely by account type and change frequently.',
    prompt: 'Which database model is often the best initial fit?',
    options: [
      'A document-oriented NoSQL store',
      'A fixed relational table with hundreds of unused columns',
      'A flat text file per user on the web server',
      'A printed filing system',
    ],
    answer: 0,
    explanation:
      'Document stores allow each record to carry different fields without a fixed table schema. The team still must design validation and consistency rules in the application.',
    hint: 'The requirement emphasizes variable structure rather than complex joins.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'What a Transaction Guarantees',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is a database transaction?',
    options: [
      'A scheduled backup of the whole server',
      'A graphical report for managers',
      'A permanent index on every column',
      'A group of operations that succeeds or fails as a single unit',
    ],
    answer: 3,
    explanation:
      'A transaction groups related changes so they commit together or roll back together. This protects consistency when several rows or tables must change at once.',
    hint: 'Think about transferring money between two accounts.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Reports Slowing Checkout',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A long-running reporting query scans millions of order rows during peak checkout hours, slowing the production database.',
    prompt: 'Which change best addresses the problem?',
    options: [
      'Delete the order history to make the query smaller',
      'Run reporting against a read replica and add suitable indexes',
      'Disable all database backups during the day',
      'Give every shopper an administrator account',
    ],
    answer: 1,
    explanation:
      'Read replicas separate reporting load from checkout traffic, and indexes speed filtered queries. Deleting history or weakening access controls creates worse problems.',
    hint: 'Move the workload and reduce the data the query must scan.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'What a Foreign Key Enforces',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does a foreign key constraint enforce?',
    options: [
      'That referenced rows exist, preserving referential integrity',
      'That every column contains a unique value',
      'That all data is encrypted at rest',
      'That queries always return a single row',
    ],
    answer: 0,
    explanation:
      'A foreign key requires its value to match a primary key in the referenced table, preventing orphan records. It does not make ordinary columns unique or encrypt data.',
    hint: 'It keeps relationships from pointing at records that do not exist.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Stale Data After an Update',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A user updates a profile through an app, but a dashboard keeps showing the old name for several minutes even though the database contains the new value.',
    prompt: 'What is the most likely explanation?',
    options: [
      'The database lost the update permanently',
      'The user mistyped the new name',
      'A cache is serving an old copy until it expires or is invalidated',
      'The dashboard is using a different keyboard layout',
    ],
    answer: 2,
    explanation:
      'The database already has the new value, so the delay is likely cached data. Invalidating the cache on writes or using a short expiry would make views consistent.',
    hint: 'The write succeeded; another layer is returning an older copy.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Database Versus DBMS',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'What is the difference between a database and a database management system (DBMS)?',
    options: [
      'A database is software, while a DBMS is a collection of files',
      'A database is the organized data, while a DBMS is the software that manages and queries it',
      'They are identical terms with no practical distinction',
      'A DBMS only stores images, while a database only stores numbers',
    ],
    answer: 1,
    explanation:
      'The database is the stored collection of data; the DBMS is the engine that enforces structure, handles queries, and manages access and recovery.',
    hint: 'One is the content, the other is the program that runs it.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Blocked Customer Deletion',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An administrator tries to delete a customer row, but the database rejects the delete because invoices still reference that customer.',
    prompt: 'Which mechanism caused the rejection?',
    options: [
      'A DNS resolution failure',
      'A full disk caused by backups',
      'A foreign key constraint enforcing referential integrity',
      'A browser cache that has expired',
    ],
    answer: 2,
    explanation:
      'The invoice table\'s foreign key points to the customer, so deleting the customer would orphan those invoices. The database blocks the action unless the related rows are handled first.',
    hint: 'The database is protecting a relationship, not failing randomly.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Choosing Denormalization',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Why might a team deliberately denormalize part of a database?',
    options: [
      'To remove every primary key',
      'To speed up reads by storing redundant data, accepting more complex updates',
      'To guarantee that no data is ever duplicated',
      'To avoid backing up the database',
    ],
    answer: 1,
    explanation:
      'Denormalization trades redundancy for fewer joins and faster reads, which helps reporting or high-traffic paths. The cost is extra storage and careful update logic to avoid inconsistency.',
    hint: 'Accept some duplication in exchange for a performance gain.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Two Withdrawals at Once',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Two transactions read the same account balance of $500, each withdraws $300, and both write back a balance of $200.',
    prompt: 'Which ACID property should have prevented this lost update?',
    options: ['Isolation', 'Durability', 'Atomicity', 'Portability'],
    answer: 0,
    explanation:
      'Isolation controls how concurrent transactions interact, preventing one from overwriting another\'s uncommitted work. Stronger isolation or locking would stop the lost update.',
    hint: 'The problem appears only when transactions run at the same time.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'Restore Loses a Day',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A company restores a database from its last full backup, taken 24 hours earlier, because transaction log backups were never configured.',
    prompt: 'Which concept was poorly planned?',
    options: ['Screen resolution', 'DNS caching', 'Password salting', 'Recovery point objective'],
    answer: 3,
    explanation:
      'The recovery point objective defines how much data loss is acceptable. Without log backups, the restore point is the last full backup, so a day of changes is lost.',
    hint: 'Ask how much recent work the business can afford to lose.',
  },
  {
    chapterId: 'databases-information-systems',
    title: 'ACID Versus BASE',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'How does the BASE approach differ from ACID transactions?',
    options: [
      'BASE guarantees stricter consistency than ACID',
      'BASE forbids replication across servers',
      'BASE favors availability and eventual consistency over immediate strong consistency',
      'BASE requires every table to have a foreign key',
    ],
    answer: 2,
    explanation:
      'BASE systems accept temporary inconsistency to stay available and scale across nodes. ACID systems prioritize immediate consistency, which can cost availability during partitions.',
    hint: 'One approach accepts that replicas may briefly disagree.',
  },
  {
    chapterId: 'business-systems',
    title: 'What ERP Stands For',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does ERP stand for in business computing?',
    options: [
      'Electronic Reporting Platform',
      'Enterprise Resource Planning',
      'External Routing Protocol',
      'Employee Review Process',
    ],
    answer: 1,
    explanation:
      'ERP stands for Enterprise Resource Planning. These systems integrate core processes such as finance, inventory, purchasing, and human resources around shared data.',
    hint: 'The middle word concerns company resources, not internet routing.',
  },
  {
    chapterId: 'business-systems',
    title: 'One System for Core Operations',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A manufacturer replaces separate finance, inventory, and HR applications with one integrated suite that shares supplier and employee records.',
    prompt: 'Which category of system did the manufacturer adopt?',
    options: ['ERP', 'A standalone photo editor', 'A web browser', 'A network firewall'],
    answer: 0,
    explanation:
      'An ERP system integrates core enterprise functions around common master data. This reduces duplicate entry and gives departments a consistent view of operations.',
    hint: 'The suite spans several back-office departments at once.',
  },
  {
    chapterId: 'business-systems',
    title: 'Purpose of a CRM',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'What is a customer relationship management (CRM) system mainly designed to do?',
    options: [
      'Manage employee payroll taxes',
      'Route packets between networks',
      'Track interactions and manage the customer lifecycle',
      'Compile source code into machine instructions',
    ],
    answer: 2,
    explanation:
      'A CRM records contacts, sales opportunities, service history, and marketing interactions so teams can manage relationships across the customer lifecycle.',
    hint: 'The name points to relationships, not infrastructure.',
  },
  {
    chapterId: 'business-systems',
    title: 'Preparing for a Sales Call',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Before a meeting, a sales representative reviews the customer\'s past purchases, support tickets, and recent email exchanges in one place.',
    prompt: 'Which system most likely provides this view?',
    options: ['A disk defragmenter', 'A domain name server', 'A spreadsheet macro', 'A CRM'],
    answer: 3,
    explanation:
      'A CRM consolidates customer interactions and history so sales and support staff can see context. It is organized around the customer relationship rather than infrastructure.',
    hint: 'The representative needs a timeline of customer contact.',
  },
  {
    chapterId: 'business-systems',
    title: 'Role of a Shopping Cart',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In an online store, what is the shopping cart\'s main purpose?',
    options: [
      'To hold selected items temporarily before checkout',
      'To permanently store the customer\'s payment card',
      'To replace the product catalog',
      'To ship orders without a warehouse',
    ],
    answer: 0,
    explanation:
      'The cart collects items a shopper intends to buy and passes them to checkout. It is a temporary selection, not the catalog or the payment record.',
    hint: 'It sits between browsing and paying.',
  },
  {
    chapterId: 'business-systems',
    title: 'Variants on One Product Page',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A clothing store sells one shirt design in five sizes and four colors. It wants a single product page that shares the description and photos while tracking stock and price for each combination.',
    prompt: 'How should the catalog represent the shirt?',
    options: [
      'As twenty unrelated products with copied descriptions',
      'As one product with separate variant records for each size and color',
      'As a single text note listing the available options',
      'As one product with no stock tracking',
    ],
    answer: 1,
    explanation:
      'A parent product holds shared content, while variant records carry the size, color, item code, and stock for each combination. This avoids duplicated descriptions and keeps availability accurate.',
    hint: 'Separate shared product content from the specific combination being sold.',
  },
  {
    chapterId: 'business-systems',
    title: 'What Master Data Is',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is master data in a business system?',
    options: [
      'Temporary session data stored in a browser',
      'Log files generated by a firewall',
      'Core shared reference data such as customers, products, and suppliers',
      'The password hashes of administrators',
    ],
    answer: 2,
    explanation:
      'Master data is the stable reference information many processes rely on. Consistent product and customer records let orders, billing, and reporting agree.',
    hint: 'Think about records reused across many transactions.',
  },
  {
    chapterId: 'business-systems',
    title: 'Two Versions of One Customer',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Sales has customer ID 1042 for Acme Ltd, while finance has customer ID 7781 for the same company and a different address.',
    prompt: 'What problem does this illustrate?',
    options: [
      'A network routing loop',
      'An encryption key mismatch',
      'A browser compatibility issue',
      'Inconsistent master data across systems',
    ],
    answer: 3,
    explanation:
      'The same real-world customer has conflicting identifiers and details in different systems. A shared master data process would create one trusted record and cross-reference the rest.',
    hint: 'The disagreement is about the customer record itself.',
  },
  {
    chapterId: 'business-systems',
    title: 'Why ERP Projects Are Hard',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why are ERP implementations often difficult beyond installing software?',
    options: [
      'ERP systems cannot store financial data',
      'They require no user training',
      'They force organizations to align processes and migrate clean, consistent data',
      'They only run on a single laptop',
    ],
    answer: 2,
    explanation:
      'ERP success depends on standardizing processes, cleaning data, and gaining user adoption. The technical install is only one part of a larger change effort.',
    hint: 'The hard parts are organizational, not just technical.',
  },
  {
    chapterId: 'business-systems',
    title: 'Customization That Blocks Upgrades',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A company heavily rewrites its ERP to preserve dozens of unique departmental procedures. Years later, applying vendor updates requires extensive rework.',
    prompt: 'What trade-off did the company mishandle?',
    options: [
      'Process fit versus customization, where excessive customization raises long-term cost',
      'Encryption strength versus key length',
      'Bandwidth versus latency',
      'Screen resolution versus file size',
    ],
    answer: 0,
    explanation:
      'ERP systems embody standard processes. Changing the software for every local exception can fit today\'s workflow but makes future upgrades expensive and risky.',
    hint: 'Every custom change becomes something the vendor update must preserve.',
  },
  {
    chapterId: 'business-systems',
    title: 'APIs Between Business Systems',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'What does an application programming interface (API) allow two business systems to do?',
    options: [
      'Share a single physical keyboard',
      'Replace all human users with automated scripts',
      'Guarantee that both systems use identical databases',
      'Exchange data and invoke functions programmatically under defined rules',
    ],
    answer: 3,
    explanation:
      'An API defines how one system can request data or actions from another, such as creating an order or reading a price. It does not require shared databases.',
    hint: 'Think of a documented contract for software-to-software requests.',
  },
  {
    chapterId: 'business-systems',
    title: 'In-Stock but Unavailable',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A catalog page says "in stock" because inventory data syncs once each morning. By afternoon, the shelf is empty but the site still accepts orders.',
    prompt: 'What is the best description of the problem?',
    options: [
      'The catalog has too many product images',
      'Inventory integration is too slow for the rate of sales',
      'The checkout page uses the wrong font',
      'The payment gateway is encrypting orders',
    ],
    answer: 1,
    explanation:
      'The catalog page relies on stale inventory data. More frequent or event-driven updates, plus safety stock rules, would keep displayed availability closer to reality.',
    hint: 'The display is correct only as of this morning.',
  },
  {
    chapterId: 'business-systems',
    title: 'The Customer Lifecycle',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does the customer lifecycle describe?',
    options: [
      'The warranty period of a laptop',
      'The time it takes to boot a server',
      'The stages a customer goes through, from awareness and purchase to loyalty or departure',
      'The sequence of database backup jobs',
    ],
    answer: 2,
    explanation:
      'The lifecycle frames marketing, sales, onboarding, support, and retention as connected stages. CRM systems track customers across these stages rather than only at purchase.',
    hint: 'Think beyond a single transaction to the whole relationship.',
  },
  {
    chapterId: 'business-systems',
    title: 'Duplicates Before CRM Migration',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A company plans to import 20,000 contacts from three legacy systems into a new CRM. Many contacts appear multiple times with slightly different spellings.',
    prompt: 'What should the team do before migration?',
    options: [
      'Cleanse and deduplicate the records, then define a matching rule',
      'Import everything and let sales staff sort it out later',
      'Delete all contacts to start fresh',
      'Convert every contact into a separate company account',
    ],
    answer: 0,
    explanation:
      'Cleaning and deduplicating first prevents the new CRM from inheriting messy data. A documented matching rule makes merges consistent and preserves important history.',
    hint: 'Fix the data before copying it into the new system.',
  },
  {
    chapterId: 'business-systems',
    title: 'Why Integrate Business Systems',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Why do organizations integrate business systems instead of re-entering data in each one?',
    options: [
      'Integration removes the need for any data storage',
      'Integration guarantees that every process is identical',
      'Integration makes all systems free to license',
      'Integration reduces manual errors and keeps information consistent across processes',
    ],
    answer: 3,
    explanation:
      'Automated data exchange avoids duplicate entry and delays, so systems work from the same facts. Integration does not eliminate the need to design processes or govern data.',
    hint: 'Consider what happens when a person copies numbers by hand.',
  },
  {
    chapterId: 'business-systems',
    title: 'Payment Succeeds, Order Fails',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'During checkout, the payment service charges the card, but the order service then fails before creating the order record.',
    prompt: 'What is the most important design concern?',
    options: [
      'The font used on the confirmation page',
      'Compensating actions such as a refund or retry so the customer is not charged for nothing',
      'Reducing the catalog image resolution',
      'Adding more colors to the checkout button',
    ],
    answer: 1,
    explanation:
      'A multi-step process can fail between steps, leaving money taken without an order. A compensating action or reliable workflow must restore a consistent outcome.',
    hint: 'The customer must not end up paying for an order that does not exist.',
  },
  {
    chapterId: 'business-systems',
    title: 'Best Features, Poor Fit',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'A company selects an ERP with the richest feature list, but it barely supports a legally required approval process. What is the main risk?',
    options: [
      'The vendor will refuse to sell the software',
      'The system will automatically simplify the regulation',
      'Costly customization or a compliance gap may erase the expected benefit',
      'Users will learn the software too quickly',
    ],
    answer: 2,
    explanation:
      'Feature breadth matters less than fit to critical processes. Heavy customization raises cost and upgrade risk, while leaving the gap unaddressed can create legal exposure.',
    hint: 'Weigh must-have compliance needs against optional features.',
  },
  {
    chapterId: 'business-systems',
    title: 'Checkout Across Three Services',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'An order spans payment, inventory, and shipping services. Payment succeeds, inventory reserves the item, but shipping fails after the reservation.',
    prompt: 'Which approach best handles this distributed failure?',
    options: [
      'A saga or workflow that compensates by releasing inventory and refunding the payment',
      'Ignoring the failure because two of three steps succeeded',
      'Storing all three services in one spreadsheet',
      'Retrying forever without alerting anyone',
    ],
    answer: 0,
    explanation:
      'Distributed transactions need explicit compensation when a later step fails. Releasing the reservation and refunding restores consistency; endless retries can leave customers stuck.',
    hint: 'Undo the completed steps or complete the order through a controlled workflow.',
  },
  {
    chapterId: 'business-systems',
    title: 'Real-Time Dashboards From Core Systems',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Executives want near-real-time sales and support dashboards drawing on both ERP and CRM data without slowing transaction processing.',
    prompt: 'What is the most appropriate architecture?',
    options: [
      'Run heavy analytical queries directly against production tables all day',
      'Email spreadsheets between departments hourly',
      'Give every executive update rights on the ERP database',
      'Feed changes into a reporting store or warehouse through managed integration',
    ],
    answer: 3,
    explanation:
      'Separating analytics from transactional systems protects performance and allows combined reporting. Direct heavy queries on production risk slowing the core business processes.',
    hint: 'Keep reporting load away from the systems that run daily transactions.',
  },
  {
    chapterId: 'business-systems',
    title: 'Lift-and-Shift ERP Risk',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'Why can moving a legacy ERP to cloud infrastructure without redesign produce limited benefit?',
    options: [
      'Cloud providers do not support databases',
      'Existing technical debt and process problems are carried along unchanged',
      'Cloud infrastructure cannot run business applications',
      'Moving to cloud automatically removes all customizations',
    ],
    answer: 1,
    explanation:
      'Lift-and-shift changes where the software runs, not how it works. Old customizations, poor data quality, and inefficient processes remain, so costs may even rise.',
    hint: 'Changing the hosting location does not fix the application design.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Informed Consent',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does informed consent require when collecting personal data?',
    options: [
      'Telling people clearly what is collected and why, then obtaining a voluntary agreement',
      'Hiding the purpose until after the data is sold',
      'Assuming consent because a website is public',
      'Collecting data first and asking only if someone complains',
    ],
    answer: 0,
    explanation:
      'Informed consent means people understand the collection and purpose and can choose freely. Bundling consent or hiding details undermines the choice.',
    hint: 'Both information and genuine choice are required.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Location Tracking Without Notice',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A mobile app records users\' precise locations in the background and never mentions this in its privacy notice.',
    prompt: 'Which ethical and legal principle is most clearly violated?',
    options: [
      'Data compression',
      'Network neutrality',
      'Transparency and informed consent',
      'Least privilege for administrators',
    ],
    answer: 2,
    explanation:
      'Users cannot consent to collection they do not know about. A clear notice and a meaningful choice are basic requirements for handling personal data.',
    hint: 'The users had no way to know the collection was happening.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'A New Hire Cannot Log In',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'On their first morning, a new employee cannot sign in to email or open the expense system. The company needs someone to diagnose the account and device problem.',
    prompt: 'Which IT role is the usual first point of contact?',
    options: [
      'Data scientist',
      'Help-desk or service-desk technician',
      'Network architect',
      'Compliance auditor',
    ],
    answer: 1,
    explanation:
      'Service-desk staff handle incidents and requests such as password resets and device issues. They are often the first point of contact between users and IT.',
    hint: 'This role is usually the first call when something stops working.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'A Newsletter Signup Form',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A newsletter signup asks for a name, email address, birth date, gender, and household income, although the newsletter only needs an email address.',
    prompt: 'Which principle suggests the extra fields are inappropriate?',
    options: ['Availability', 'Normalization', 'Load balancing', 'Data minimization'],
    answer: 3,
    explanation:
      'The form collects more personal data than the stated purpose requires. Asking only for the email address reduces privacy risk and friction for users.',
    hint: 'Compare each requested field with what the service actually does.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Algorithmic Bias',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is algorithmic bias?',
    options: [
      'A random hardware fault in a processor',
      'A deliberate virus inserted into software',
      'Systematic unfair outcomes produced by data, design choices, or use of a model',
      'The tendency of a computer to run slowly over time',
    ],
    answer: 2,
    explanation:
      'Bias arises when a system consistently disadvantages a group because of skewed data, flawed labels, or inappropriate objectives. It can occur without any malicious intent.',
    hint: 'It is a pattern in outcomes, not necessarily a programmer motive.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'A Pattern in a Hiring Model',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A company trains a resume-screening model on ten years of past hires, a period when most technical roles were filled by men. The model favors male applicants.',
    prompt: 'What is the most likely cause?',
    options: [
      'Bias learned from historical data',
      'A shortage of computer memory',
      'A slow internet connection',
      'An error in the printer driver',
    ],
    answer: 0,
    explanation:
      'The model learned the patterns in its training data, including past imbalance. Without careful data review and testing, it reproduces and amplifies that history.',
    hint: 'The model is imitating the examples it was given.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Defining Accessibility',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does accessibility mean for a digital product?',
    options: [
      'Making it available only on expensive devices',
      'Designing it so people with disabilities can perceive, navigate, and use it',
      'Adding as many colors as possible',
      'Requiring every user to complete training first',
    ],
    answer: 1,
    explanation:
      'Accessibility removes barriers so people with visual, auditory, motor, or cognitive disabilities can use a product. It often improves usability for everyone.',
    hint: 'The goal is equal ability to use the product.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Images Without Descriptions',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A public information site publishes charts as images but provides no alternative text.',
    prompt: 'Which group is most directly disadvantaged?',
    options: [
      'People using very large monitors',
      'People with a fast fiber connection',
      'People who prefer dark mode',
      'People who use screen readers',
    ],
    answer: 3,
    explanation:
      'Screen readers rely on text alternatives to convey image content. Without them, blind and low-vision users miss the information entirely.',
    hint: 'Think about how a chart is experienced without seeing it.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'The Nothing to Hide Argument',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why is the claim "I have nothing to hide" an incomplete response to privacy concerns?',
    options: [
      'Privacy only matters to people who commit crimes',
      'Everyone who values privacy is hiding something illegal',
      'Privacy protects autonomy, context, and vulnerable people, not just secrets',
      'Privacy laws apply only to government agencies',
    ],
    answer: 2,
    explanation:
      'Privacy supports personal autonomy and protects people from misuse, discrimination, and context collapse. Someone may share information with one audience but not another.',
    hint: 'Privacy is about control over personal information, not only concealment.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Facial Recognition at School',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A school proposes cameras that recognize students\' faces to automate attendance, without explaining retention or allowing an opt-out.',
    prompt: 'Which concern is most central?',
    options: [
      'The cameras may take too long to boot',
      'Consent, proportionality, and the security of sensitive biometric data',
      'The attendance spreadsheet may be sorted incorrectly',
      'The school Wi-Fi may be too slow',
    ],
    answer: 1,
    explanation:
      'Biometric data is sensitive, and automating attendance affects students who cannot meaningfully refuse. The school must justify necessity, obtain consent where required, and protect the data.',
    hint: 'Consider the nature of the data and the power imbalance.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Anonymization Versus Pseudonymization',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What distinguishes anonymization from pseudonymization?',
    options: [
      'Anonymization uses encryption, while pseudonymization uses compression',
      'Pseudonymization permanently deletes all records',
      'Anonymization only applies to paper records',
      'Anonymized data cannot reasonably be linked back to a person, while pseudonymized data still can with additional information',
    ],
    answer: 3,
    explanation:
      'Pseudonymization replaces identifiers but keeps a way to re-identify, so the data remains personal. Anonymization aims to make re-identification impossible, which is difficult to guarantee.',
    hint: 'One process still has a lookup key somewhere.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Predictive Policing by Neighborhood',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A model predicts crime risk using historical arrest locations. Officers are then sent more often to the neighborhoods the model flags as high risk.',
    prompt: 'Which ethical problem is most likely?',
    options: [
      'A feedback loop that turns biased policing into self-confirming data',
      'A shortage of police radios',
      'An error in the city DNS records',
      'Too much encryption on the police network',
    ],
    answer: 0,
    explanation:
      'More patrols produce more arrests, which the model treats as more evidence of crime. This feedback loop can encode and amplify existing bias rather than measure underlying harm.',
    hint: 'The model\'s predictions change the future data it learns from.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Human Oversight of AI',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does meaningful human oversight of an AI system require?',
    options: [
      'A person who rubber-stamps every output without context',
      'Removing all documentation to speed decisions',
      'The ability to understand, question, and override consequential outputs',
      'Letting the model approve its own changes',
    ],
    answer: 2,
    explanation:
      'Oversight is more than a signature. People need enough information, authority, and time to catch errors and intervene when outcomes affect real people.',
    hint: 'Approval without understanding is not real oversight.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'A New Use for Old Data',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A retailer collected customer email addresses for order receipts. Marketing now wants to sell access to those addresses to a partner.',
    prompt: 'What should the retailer do first?',
    options: [
      'Proceed, because the data already belongs to the company',
      'Assess whether the new purpose is lawful and obtain fresh consent if required',
      'Publish the addresses to make the use transparent',
      'Delete the customer accounts to avoid questions',
    ],
    answer: 1,
    explanation:
      'Data collected for one purpose should not automatically be reused for an unrelated one. The retailer must assess the new use and give customers a meaningful choice.',
    hint: 'The original reason for collection did not include advertising.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Responsible Disclosure',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is responsible disclosure of a security vulnerability?',
    options: [
      'Reporting it privately to the affected organization and allowing reasonable time to fix it',
      'Posting exploit instructions publicly before notifying anyone',
      'Selling the vulnerability to the highest bidder',
      'Ignoring it because finding flaws is impolite',
    ],
    answer: 0,
    explanation:
      'Responsible disclosure gives defenders a chance to fix the issue before details become widely known. Public exploitation without warning puts users at immediate risk.',
    hint: 'Notify the party who can fix it before telling everyone else.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'A Leaked Customer Database',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A security researcher discovers an unprotected database containing customer records and realizes anyone could download it.',
    prompt: 'What is the most ethical action?',
    options: [
      'Download and publish the records to prove the risk',
      'Sell the records to test the market',
      'Ignore it because the researcher did not create the exposure',
      'Notify the organization and relevant authorities without exploiting the data',
    ],
    answer: 3,
    explanation:
      'The researcher should minimize access, avoid copying more than necessary, and report the exposure privately. Publishing or selling the data would harm the very customers at risk.',
    hint: 'Prove the problem without causing the harm you are warning about.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Translating Clinical Needs',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A hospital wants to replace paper patient intake with a new system. The project needs someone to gather clinical requirements, model the workflow, and test whether the design fits staff needs.',
    prompt: 'Which IT role best matches this work?',
    options: ['Network engineer', 'Business analyst', 'Database administrator', 'Help-desk technician'],
    answer: 1,
    explanation:
      'A business analyst bridges stakeholders and technical teams by documenting requirements and validating process fit. Network and database roles focus on infrastructure rather than workflow design.',
    hint: 'The role sits between users and developers.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'More Data, Better Model?',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'A team wants to collect additional personal data to improve an AI model. What is the most balanced way to decide?',
    options: [
      'Collect everything available because more data always improves outcomes',
      'Refuse all data collection regardless of benefit',
      'Weigh expected benefit against privacy, security, and consent costs, then collect only what is justified',
      'Let the model collect data without telling users',
    ],
    answer: 2,
    explanation:
      'Model quality is not the only consideration. Teams should justify each data category, minimize collection, and protect what they keep, rather than treating more data as automatically better.',
    hint: 'Balance usefulness with the rights and risks of the people represented.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Good Average, Bad Subgroup',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A loan model has 92% overall accuracy, but its error rate for one minority group is twice that of the majority group.',
    prompt: 'What is the best next step?',
    options: [
      'Investigate subgroup performance, fix data or model issues, and monitor after deployment',
      'Deploy it because the overall accuracy is high',
      'Remove the minority group from the evaluation data',
      'Increase the interest rate for everyone',
    ],
    answer: 0,
    explanation:
      'Aggregate accuracy can hide unequal harm. Disaggregated testing reveals where the model fails, and remediation plus ongoing monitoring is needed before high-stakes use.',
    hint: 'Look beyond the single headline metric.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Finding a Flaw in Your Own Product',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'An engineer discovers a serious security flaw in a product their employer sells. The release deadline is tomorrow.',
    prompt: 'What is the most appropriate action?',
    options: [
      'Stay silent because the flaw is not public yet',
      'Follow the internal security escalation process and push for a risk-based release decision',
      'Post the details anonymously on social media',
      'Fix it quietly without telling anyone or documenting the change',
    ],
    answer: 1,
    explanation:
      'Internal escalation routes the issue to people who can assess risk and coordinate a fix. Silent fixes and public leaks both undermine the organization\'s ability to protect users.',
    hint: 'Use the process designed to handle security incidents before release.',
  },
  {
    chapterId: 'ethics-ai-careers',
    title: 'Training on Support Chats',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A company plans to train a customer-service model on years of support chat transcripts that may contain personal details and abusive exchanges.',
    prompt: 'Which governance step is most important before training begins?',
    options: [
      'Increasing the model\'s context window',
      'Buying more graphics cards',
      'Renaming the project',
      'Classifying the data, removing unnecessary personal information, and defining allowable use and review',
    ],
    answer: 3,
    explanation:
      'Sensitive transcripts require purpose review, minimization, and handling rules before reuse. Without governance, the model may memorize or expose personal and harmful content.',
    hint: 'Decide what data is appropriate and how it may be used before feeding it to a model.',
  },
];
