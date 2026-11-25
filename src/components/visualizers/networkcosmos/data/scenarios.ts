// Lab scenarios and graded challenge bank for the network curriculum.
// Pure data - no browser APIs - safe for module scope and SSG.

export type HopSpec = {
  layer: string;
  device: string;
  direction: 'out' | 'in';
  note: string;
};

// `id` is plan-mandated for these three fixed scenarios; all other string
// identifiers in this module follow the repository `slug` convention.
export interface Scenario {
  id: 'dns' | 'http' | 'ping';
  title: string;
  description: string;
  hops: HopSpec[];
}

export interface Challenge {
  slug: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'dns',
    title: 'Resolving a Name',
    description:
      'Follow a DNS lookup from the browser stub resolver to a recursive resolver and back. The client-to-resolver exchange is a single UDP query/answer pair with no transport handshake; a cache miss makes the resolver issue separate iterative datagrams later in the path, but either way every layer is traversed in both directions.',
    hops: [
      {
        layer: 'Application',
        device: 'client',
        direction: 'out',
        note: "The browser calls getaddrinfo('www.example.com'); the stub resolver builds a recursive DNS query (RD = 1) asking for the A record.",
      },
      {
        layer: 'Transport',
        device: 'client',
        direction: 'out',
        note: 'The query is wrapped in UDP from an ephemeral source port to destination port 53. There is no handshake and no delivery guarantee - a lost query simply times out.',
      },
      {
        layer: 'Network',
        device: 'client',
        direction: 'out',
        note: 'An IP packet is formed with the recursive resolver as destination; the client consults its routing table and selects the default gateway as next hop.',
      },
      {
        layer: 'Link',
        device: 'client',
        direction: 'out',
        note: "An Ethernet frame is addressed to the gateway's MAC address, learned earlier by ARP, and a frame check sequence is appended.",
      },
      {
        layer: 'Physical',
        device: 'switch',
        direction: 'in',
        note: 'The access switch receives the electrical signals, re-clocks them, checks the FCS, and forwards the frame out the port leading toward the router.',
      },
      {
        layer: 'Network',
        device: 'router',
        direction: 'in',
        note: 'The router decapsulates the Ethernet frame, decrements the TTL, and looks up the longest matching prefix for the resolver address.',
      },
      {
        layer: 'Link',
        device: 'router',
        direction: 'out',
        note: 'The router re-encapsulates the IP packet in a fresh Ethernet frame addressed to the next-hop router MAC on the outbound link.',
      },
      {
        layer: 'Physical',
        device: 'server',
        direction: 'in',
        note: "Bits arrive at the recursive resolver's NIC, are clocked in, reassembled into a frame, and passed up as the UDP datagram on port 53.",
      },
      {
        layer: 'Application',
        device: 'server',
        direction: 'out',
        note: 'Its cache misses, so the resolver performs iterative queries to the root, TLD, and authoritative servers, then builds an answer carrying the A record with RA = 1.',
      },
      {
        layer: 'Transport',
        device: 'server',
        direction: 'out',
        note: 'The answer is returned in a UDP datagram from port 53 to the client ephemeral port, again without any connection setup.',
      },
      {
        layer: 'Network',
        device: 'router',
        direction: 'in',
        note: 'The return IP packet enters the router, which matches the client network as the destination and forwards it toward the client-facing interface.',
      },
      {
        layer: 'Link',
        device: 'switch',
        direction: 'out',
        note: "The access switch looks up the client's MAC in its forwarding table and sends the frame out that port only, not out every port.",
      },
      {
        layer: 'Physical',
        device: 'client',
        direction: 'in',
        note: 'The client NIC receives the signals and validates the frame checksum before handing the frame to the network stack.',
      },
      {
        layer: 'Transport',
        device: 'client',
        direction: 'in',
        note: 'UDP delivers the datagram to the socket on the ephemeral port; the stub resolver checks that the 16-bit transaction ID matches its outstanding query.',
      },
      {
        layer: 'Application',
        device: 'client',
        direction: 'in',
        note: 'The OS caches the A record for its TTL and returns the RFC 5737 documentation address 203.0.113.10 to the waiting browser.',
      },
    ],
  },
  {
    id: 'http',
    title: 'Loading an HTTPS Page',
    description:
      'A browser loads https://www.example.com/index.html. The path combines name resolution, the TCP three-way handshake, a TLS 1.3 handshake, an encrypted HTTP GET, and the response - with every device traversed in both directions.',
    hops: [
      {
        layer: 'Application',
        device: 'client',
        direction: 'out',
        note: 'DNS resolution has returned the server IP; the browser prepares an HTTPS GET request for /index.html and asks the stack for a connection.',
      },
      {
        layer: 'Transport',
        device: 'client',
        direction: 'out',
        note: 'TCP starts the three-way handshake with a SYN to destination port 443 from an ephemeral port, carrying an initial sequence number and an MSS option.',
      },
      {
        layer: 'Network',
        device: 'client',
        direction: 'out',
        note: 'An IP packet addressed to the server is built; a routing-table lookup selects the default gateway as the next hop.',
      },
      {
        layer: 'Link',
        device: 'client',
        direction: 'out',
        note: "The packet is placed in an Ethernet frame addressed to the gateway's MAC address, with a frame check sequence appended.",
      },
      {
        layer: 'Physical',
        device: 'switch',
        direction: 'in',
        note: 'The access switch clocks in the signals, verifies the FCS, and forwards the frame toward the router based on its destination MAC.',
      },
      {
        layer: 'Network',
        device: 'router',
        direction: 'in',
        note: 'The router decapsulates the frame, decrements the TTL, and selects the next hop on the route toward the server subnet.',
      },
      {
        layer: 'Transport',
        device: 'server',
        direction: 'in',
        note: 'The SYN arrives at port 443; the server allocates a transmission control block and prepares a SYN-ACK acknowledging the client ISN plus one.',
      },
      {
        layer: 'Transport',
        device: 'server',
        direction: 'out',
        note: 'The SYN-ACK leaves the server with its own initial sequence number; the server socket sits in SYN-RECEIVED awaiting the final ACK.',
      },
      {
        layer: 'Link',
        device: 'router',
        direction: 'out',
        note: 'The router re-encapsulates the SYN-ACK in a new frame addressed to the next-hop MAC on the client-facing link.',
      },
      {
        layer: 'Physical',
        device: 'switch',
        direction: 'out',
        note: "The access switch forwards the frame out the learned port for the client's MAC address rather than flooding it.",
      },
      {
        layer: 'Physical',
        device: 'client',
        direction: 'in',
        note: 'The client NIC receives the bits and validates the frame; TCP sends the final ACK and the connection enters ESTABLISHED.',
      },
      {
        layer: 'Application',
        device: 'client',
        direction: 'out',
        note: 'TLS 1.3 begins: the ClientHello carries the SNI for www.example.com and an X25519 key share inside the established TCP stream.',
      },
      {
        layer: 'Application',
        device: 'server',
        direction: 'in',
        note: 'The server answers with ServerHello, its certificate chain, and Finished; session keys are derived and the encrypted channel is ready.',
      },
      {
        layer: 'Application',
        device: 'client',
        direction: 'out',
        note: 'An encrypted GET /index.html is sent as a TLS record; TCP assigns sequence numbers and tracks acknowledgements underneath.',
      },
      {
        layer: 'Application',
        device: 'server',
        direction: 'out',
        note: 'The server replies with an encrypted 200 OK response containing Content-Length and the HTML body over the same connection.',
      },
      {
        layer: 'Physical',
        device: 'client',
        direction: 'in',
        note: 'The client receives the response bits, TLS decrypts and authenticates the record, and the browser renders the page.',
      },
    ],
  },
  {
    id: 'ping',
    title: 'An ICMP Echo Round Trip',
    description:
      'A user runs ping to a remote host. ICMP echo request and reply are carried directly by IP with no ports, but the probe still crosses the client, switch, router, and server in both directions and exercises TTL, routing, and RTT measurement.',
    hops: [
      {
        layer: 'Application',
        device: 'client',
        direction: 'out',
        note: 'The user runs ping; the OS builds an ICMP Echo Request (type 8, code 0) with an identifier, a sequence number of 1, and a timestamp.',
      },
      {
        layer: 'Transport',
        device: 'client',
        direction: 'out',
        note: 'There is no transport header: ICMP rides directly inside IP with protocol number 1 and uses no TCP or UDP ports.',
      },
      {
        layer: 'Network',
        device: 'client',
        direction: 'out',
        note: 'An IP packet with the client source address, destination 8.8.8.8, and an initial TTL of 64 is built and routed via the default gateway.',
      },
      {
        layer: 'Link',
        device: 'client',
        direction: 'out',
        note: 'The packet is encapsulated in an Ethernet frame addressed to the gateway MAC, learned from the ARP cache, with an FCS added.',
      },
      {
        layer: 'Physical',
        device: 'switch',
        direction: 'in',
        note: 'The access switch receives the signals, checks the frame checksum, and forwards the frame toward the router.',
      },
      {
        layer: 'Network',
        device: 'router',
        direction: 'in',
        note: 'The router strips the incoming frame, decrements the TTL from 64 to 63, and uses longest prefix match to choose the upstream next hop.',
      },
      {
        layer: 'Link',
        device: 'router',
        direction: 'out',
        note: 'A new Ethernet frame addressed to the upstream next-hop MAC carries the packet onto the outgoing link.',
      },
      {
        layer: 'Network',
        device: 'server',
        direction: 'in',
        note: 'The destination host receives the IP packet, sees protocol 1, and recognizes an ICMP Echo Request addressed to it.',
      },
      {
        layer: 'Network',
        device: 'server',
        direction: 'out',
        note: 'It swaps the IP source and destination, changes the ICMP type to 0 (Echo Reply), copies the identifier and sequence number, and sends the reply.',
      },
      {
        layer: 'Link',
        device: 'router',
        direction: 'in',
        note: 'The return frame arrives at the router, which decapsulates it and looks up the route back toward the client network.',
      },
      {
        layer: 'Physical',
        device: 'switch',
        direction: 'out',
        note: 'The access switch forwards the reply frame out the port associated with the client MAC address.',
      },
      {
        layer: 'Physical',
        device: 'client',
        direction: 'in',
        note: 'The client NIC receives the bits and the IP stack validates the header checksum and identifies the ICMP Echo Reply.',
      },
      {
        layer: 'Application',
        device: 'client',
        direction: 'in',
        note: 'Ping matches the identifier and sequence number, computes the round-trip time from the embedded timestamp, and prints the reply with its TTL and time.',
      },
    ],
  },
];

// Twenty unique multiple-choice questions: 4 subnet math, 3 longest-prefix
// match, 3 ARP, 4 retransmit/RTT, 3 capture reading, 3 TLS/DNS/routing.
export const CHALLENGES: Challenge[] = [
  {
    slug: 'subnet-192-168-1-0-25',
    question: 'A host has address 192.168.1.130/25. What is the broadcast address of its subnet?',
    options: ['192.168.1.127', '192.168.1.128', '192.168.1.255', '192.168.1.129'],
    answer: 2,
    explanation:
      'A /25 mask (255.255.255.128) borrows one bit from the last octet, creating two blocks of 128 addresses: 0-127 and 128-255. Because 192.168.1.130 lies in the second block, its network address is .128 and its broadcast address is .255 (all host bits set to 1). The usable hosts range from .129 through .254.',
  },
  {
    slug: 'subnet-usable-hosts-26',
    question: 'How many usable host addresses are available in a /26 subnet?',
    options: ['62', '64', '63', '126'],
    answer: 0,
    explanation:
      'A /26 prefix leaves 32 - 26 = 6 host bits, so each subnet contains 2^6 = 64 total addresses. Two of them are reserved and cannot be assigned to hosts: the all-zeros network identifier and the all-ones broadcast address. That leaves 64 - 2 = 62 usable addresses. (A /25 has 126 usable hosts, and a /23 has 510.)',
  },
  {
    slug: 'subnet-aggregate-172-16',
    question: 'Which CIDR prefix aggregates the four networks 172.16.0.0/24 through 172.16.3.0/24 into one route?',
    options: ['172.16.0.0/23', '172.16.0.0/24', '172.16.0.0/21', '172.16.0.0/22'],
    answer: 3,
    explanation:
      'Four contiguous /24 blocks contain 4 x 256 = 1024 addresses, which requires 10 host bits, i.e. a /22 prefix. The range 172.16.0.0/22 spans 172.16.0.0 through 172.16.3.255, exactly matching the four networks. A /23 would cover only two of them, while a /21 would also swallow 172.16.4.0 through 172.16.7.0.',
  },
  {
    slug: 'subnet-10-hosts-500',
    question: 'Splitting 10.0.0.0/8 into equal subnets that each support at least 500 hosts, what is the longest prefix that works?',
    options: ['/22', '/23', '/24', '/21'],
    answer: 1,
    explanation:
      'Supporting 500 hosts needs at least 9 host bits: 2^8 - 2 = 254 is too few, while 2^9 - 2 = 510 is enough. Nine host bits correspond to a /23 prefix (32 - 9 = 23), which is the most specific prefix meeting the requirement. A /22 also works but wastes capacity with 1022 hosts per subnet, and a /24 supports only 254.',
  },
  {
    slug: 'lpm-choose-route',
    question: 'A routing table holds 0.0.0.0/0 -> R1, 172.16.0.0/12 -> R2, and 172.16.32.0/20 -> R3. Which next hop is chosen for 172.16.40.7?',
    options: ['R1 (the default route)', 'R2 (172.16.0.0/12)', 'R3 (172.16.32.0/20)', 'The packet is dropped'],
    answer: 2,
    explanation:
      'Longest prefix match selects the entry sharing the most leading bits with the destination. 172.16.40.7 matches the default route, the /12, and the /20 (which covers 172.16.32.0 through 172.16.47.255). The /20 is the most specific of the three, so R3 is chosen even though the default route also matches. Specificity, not configuration order, decides.',
  },
  {
    slug: 'lpm-default-route',
    question: "A packet's destination matches no specific entry in the routing table, but a default route is present. What happens?",
    options: [
      'It is forwarded via the default route',
      'It is dropped immediately',
      'The router broadcasts an ARP request for the destination',
      'Its TTL is set to zero',
    ],
    answer: 0,
    explanation:
      'The default route 0.0.0.0/0 matches every possible destination with zero matching prefix bits, so it acts as the fallback of last resort. The router forwards the packet to the gateway named by that route. Only when no default route and no specific entry exist does the router discard the packet, usually sending an ICMP destination-unreachable message back to the source.',
  },
  {
    slug: 'lpm-two-matches',
    question: 'Routes 10.0.0.0/8 -> A and 10.1.0.0/16 -> B both match destination 10.1.2.3. Which route is used?',
    options: [
      'A, because it was configured first',
      'Whichever route has the lower metric',
      'Both, using equal-cost multipath',
      'B, because /16 is the longer prefix',
    ],
    answer: 3,
    explanation:
      'IP forwarding always prefers the longest matching prefix, regardless of configuration order or metrics. The /16 entry matches the first 16 bits of 10.1.2.3 whereas the /8 matches only the first 8, so route B wins. Metrics break ties only between entries with the same prefix length, and ECMP applies when multiple equal-cost routes share that same prefix.',
  },
  {
    slug: 'arp-purpose',
    question: 'What does the Address Resolution Protocol (ARP) resolve on an Ethernet LAN?',
    options: [
      'A DNS name to an IP address',
      'A MAC address to an IPv4 address',
      'An IPv4 address to a MAC address',
      'A port number to a process ID',
    ],
    answer: 2,
    explanation:
      'Before a host can transmit an Ethernet frame it needs the link-layer (MAC) address of the next hop on the local network. ARP maps a known IPv4 address to that MAC address by broadcasting a request ("who has this IP?") and accepting the unicast reply. DNS maps names to IP addresses, and Reverse ARP performed the opposite mapping in older networks.',
  },
  {
    slug: 'arp-broadcast-scope',
    question: 'A client wants to send to an off-subnet IP. What is the destination MAC in its ARP request frame?',
    options: [
      'The remote host\'s MAC address',
      'The default gateway\'s MAC address',
      'The client\'s own MAC address',
      'FF:FF:FF:FF:FF:FF (broadcast)',
    ],
    answer: 3,
    explanation:
      'ARP requests are always sent as link-layer broadcasts to FF:FF:FF:FF:FF:FF because the sender does not yet know the target MAC. ARP never crosses a router, so for an off-subnet destination the client broadcasts a request asking for the default gateway\'s IP; the gateway replies with its own MAC. The remote host\'s MAC is never learned directly.',
  },
  {
    slug: 'arp-cache-miss',
    question: 'With an empty ARP cache, what happens to the first IP packet a host sends to a neighbor on the same LAN?',
    options: [
      'It is dropped immediately',
      'It is buffered while ARP resolves the next-hop MAC',
      'It is broadcast unchanged to every host',
      'It is sent with a permanent broadcast MAC',
    ],
    answer: 1,
    explanation:
      'When the link layer finds no ARP entry for the next-hop IP, the stack queues the outgoing packet, broadcasts an ARP request, and waits for the neighbor\'s reply. It then populates the cache, builds the Ethernet frame with the learned MAC, and transmits the queued packet. If no reply arrives, resolution times out and the buffered packet is eventually dropped.',
  },
  {
    slug: 'rtt-timeout-calculation',
    question: 'With SRTT = 80 ms and smoothed deviation RTTDEV = 20 ms, what RTO does the Jacobson/Karels formula SRTT + 4 x RTTDEV give?',
    options: ['100 ms', '120 ms', '200 ms', '160 ms'],
    answer: 3,
    explanation:
      'The formula is RTO = SRTT + 4 x RTTDEV. Substituting the values gives 80 ms + (4 x 20 ms) = 160 ms. Scaling the deviation makes the timeout tolerant of ordinary jitter while still detecting genuine loss: a too-small RTO causes needless spurious retransmissions, while a too-large RTO leaves the connection idle for too long after a real loss.',
  },
  {
    slug: 'tcp-duplicate-ack',
    question: 'A TCP sender receives three duplicate ACKs for the same sequence number. What does it typically do?',
    options: [
      'Fast-retransmit the missing segment',
      'Wait for the retransmission timer to expire',
      'Close the connection',
      'Double the receive window',
    ],
    answer: 0,
    explanation:
      'Three duplicate ACKs strongly suggest that later segments arrived out of order while one segment was lost, so TCP performs fast retransmit: it resends the missing segment immediately instead of waiting for the RTO. It then enters fast recovery, deflating the congestion window rather than restarting from slow start. Waiting for the timer would leave the link idle much longer.',
  },
  {
    slug: 'tcp-cwnd-on-timeout',
    question: 'In TCP Reno, what happens to the congestion window when a retransmission timeout (rather than three duplicate ACKs) signals loss?',
    options: [
      'It is halved and slow start is skipped',
      'It resets to one MSS and slow start begins',
      'It remains unchanged',
      'It doubles immediately',
    ],
    answer: 1,
    explanation:
      'A timeout is treated as stronger evidence of severe congestion than three duplicate ACKs. TCP Reno resets cwnd to one maximum segment size and re-enters slow start, growing exponentially until it reaches ssthresh (set to half the previous window). Three duplicate ACKs, by contrast, only halve the window during fast recovery. The conservative timeout response avoids flooding an already congested path.',
  },
  {
    slug: 'rtt-vs-throughput',
    question: 'A TCP flow has a 50 ms RTT and a 64 KiB receive window with no loss. What upper bound does the window place on throughput?',
    options: ['About 10.5 Mbit/s', 'About 1.3 Mbit/s', 'About 42 Mbit/s', 'About 64 kbit/s'],
    answer: 0,
    explanation:
      'The bandwidth-delay product sets the ceiling: throughput is at most the receive window divided by the RTT. 64 KiB is 524,288 bits; divided by 0.05 s that is roughly 10.5 Mbit/s. Filling a faster link requires a larger window (via TCP window scaling) or a shorter RTT, which is why high-bandwidth-delay-product paths depend on window scaling.',
  },
  {
    slug: 'capture-syn-flags',
    question: 'In a capture, the first packet of a connection has SYN set, ACK clear, and a relative sequence number of 0. What is it?',
    options: [
      'The final ACK of the handshake',
      'A retransmitted data segment',
      "The client's initial connection request",
      'An RST tearing down the connection',
    ],
    answer: 2,
    explanation:
      'A segment with SYN = 1 and ACK = 0 is the first step of the three-way handshake: the client\'s active open. Its sequence number is the client\'s initial sequence number, which capture tools often display as a relative 0. The server answers with SYN-ACK, and the client finishes with a pure ACK. An RST would abort the connection rather than start one.',
  },
  {
    slug: 'capture-port-443',
    question: 'A captured packet has IPv4, IP protocol 6 (TCP), and destination port 443. What is most likely inside?',
    options: ['Plaintext HTTP', 'HTTPS (HTTP over TLS)', 'DNS over UDP', 'ICMP Echo Request'],
    answer: 1,
    explanation:
      'TCP destination port 443 is the well-known port for HTTPS, so the payload is normally a TLS record carrying encrypted HTTP: the URL and headers cannot be read in the clear. Plaintext HTTP would use port 80. The IP protocol field of 6 confirms TCP (1 is ICMP, 17 is UDP), and DNS normally runs over UDP port 53.',
  },
  {
    slug: 'capture-icmp-time-exceeded',
    question: 'A capture shows an ICMP Time Exceeded (type 11) message from a router. What caused it?',
    options: [
      'The destination port was closed',
      'The header checksum was invalid',
      'The packet exceeded the MTU',
      "The packet's TTL reached zero at that router",
    ],
    answer: 3,
    explanation:
      'Routers decrement a packet\'s TTL (hop limit) on every forward and discard it when the value reaches zero, returning ICMP Time Exceeded type 11 from that interface. Traceroute exploits this by sending probes with TTL 1, 2, 3, and so on to discover each hop. A closed port yields ICMP port unreachable (type 3, code 3), while an oversized packet with the DF (Don\'t Fragment) bit set triggers fragmentation-needed (type 3, code 4); without DF, an oversized packet is simply fragmented instead.',
  },
  {
    slug: 'tls-1-3-key-share',
    question: 'Which TLS 1.3 feature allows application data after one round trip, and even 0-RTT with resumption?',
    options: [
      'Negotiating cipher suites in cleartext',
      'Including a key share in the very first ClientHello flight',
      'Reusing TCP port 80',
      'Replacing certificates with pre-shared keys only',
    ],
    answer: 1,
    explanation:
      'TLS 1.3 folds key exchange into the first flight: the ClientHello already carries a key share, so after the ServerHello and Finished messages both endpoints have keys and application data can flow in 1-RTT. Resumed sessions may additionally use a pre-shared key for 0-RTT early data, at the cost of replay exposure for that data. TLS 1.2 needed two round trips.',
  },
  {
    slug: 'dns-aaaa-record',
    question: 'Which DNS record type maps a hostname to an IPv6 address?',
    options: ['AAAA', 'A', 'CNAME', 'MX'],
    answer: 0,
    explanation:
      'An AAAA record holds a 128-bit IPv6 address; the name reflects four times the 32 bits of an A record. An A record stores an IPv4 address, CNAME creates an alias to another hostname, and MX identifies mail exchange servers. A hostname can publish both A and AAAA records, allowing dual-stack clients to pick the address family they prefer.',
  },
  {
    slug: 'routing-vs-switching',
    question: 'What is the key difference between a router and a layer-2 switch?',
    options: [
      'A switch routes between IP networks; a router forwards within one LAN',
      'A router works at the physical layer; a switch works at the application layer',
      'A router forwards between IP networks using IP addresses; a switch forwards frames within a LAN using MAC addresses',
      'There is no functional difference',
    ],
    answer: 2,
    explanation:
      'A layer-2 switch uses MAC addresses to forward frames within a single broadcast domain (a LAN or VLAN) and does not terminate IP. A router works at layer 3, consulting a routing table and IP addresses to connect different networks, containing broadcast domains and decrementing the TTL. Layer-3 switches blur the line, but MAC forwarding versus IP forwarding remains the core distinction.',
  },
];
