import type { ITLesson } from './types';

export const group4Lessons: ITLesson[] = [
  {
    chapterId: 'networks-internet',
    hook:
      "You click a video in Nairobi and it plays from a server in Frankfurt in under a second, yet no single wire connects the two.",
    plainEnglish:
      "A network is a set of computers that agree on rules for passing messages, and the internet is the worldwide network of those networks.",
    oneIdea:
      "Data does not travel as one piece; it is split into packets that each find their own way, then reassembled at the destination.",
    whyItMatters:
      "Networks carry every call, payment, backup, and login. Knowing the difference between a name, an address, and a route turns a vague outage into a problem you can measure and fix.",
    objectives: [
      "Distinguish a LAN, a WAN, and the internet.",
      "Explain what an IP address and a subnet identify.",
      "Trace a name lookup and a routed packet across networks.",
      "Choose between TCP and UDP and diagnose performance with the right metric.",
    ],
    sections: [
      {
        title: "A network is an agreement, not a wire",
        body:
          "A network is any group of devices that can exchange data using shared rules called protocols. A home or office LAN (local area network) usually spans one building and uses Ethernet or Wi-Fi. A WAN (wide area network) connects sites across cities or countries, often over links rented from a telecom. The internet is the largest WAN: a network of networks that all speak the same core protocols. Your laptop does not need to know how the other side is built. It only needs to follow the agreement, and routers handle the rest. That shared agreement is why a phone in Kenya can reach a server in Germany.",
      },
      {
        title: "IP addresses are postal addresses",
        body:
          "Every device on a network needs an address so replies can find it. An IPv4 address is 32 bits, written as four numbers from 0 to 255, such as 192.168.1.42. That gives about 4.3 billion addresses, which ran out at the public level; IPv6 uses 128 bits instead. A subnet is a block of addresses that share a prefix, and the /24 in 192.168.1.42/24 means the first 24 bits identify the network. A device sends traffic to its default gateway when the destination is outside its subnet. Private ranges such as 192.168.x.x are reused inside millions of networks and translated to public addresses by NAT.",
        code: `192.168.1.42/24

network:   192.168.1.0
host:      42
broadcast: 192.168.1.255
usable:    192.168.1.1 to 192.168.1.254`,
      },
      {
        title: "DNS and routing: names to addresses, addresses to paths",
        body:
          "Humans remember names; routers need addresses. DNS (Domain Name System) is a worldwide, hierarchical lookup service that maps a name such as www.example.com to an IP address. Your device asks a resolver, which may consult root, top-level-domain, and authoritative servers; answers are cached for a time-to-live, often minutes to a day. Routing is separate. Each router keeps a table of destinations and next hops, and a packet may cross 10 to 20 networks. Border Gateway Protocol lets ISPs exchange routes. A DNS failure can look like a total outage, so test both name resolution and a raw IP connection before blaming the internet.",
      },
      {
        title: "TCP, UDP, and the real performance limits",
        body:
          "IP delivers packets but promises nothing: they can arrive late, twice, or not at all. TCP adds a handshake, sequence numbers, acknowledgements, and retransmission, so an application sees an ordered, reliable stream. That reliability costs delay, which is why live voice and video often use UDP: a late frame is useless, so dropping it beats waiting. Bandwidth is capacity, measured in megabits per second. Latency is round-trip delay, measured in milliseconds. Jitter is variation in that delay, and packet loss is the percentage that never arrives. A link can have plenty of bandwidth and still feel terrible if latency or loss is high. A 150 ms call feels natural; 400 ms feels like a walkie-talkie.",
      },
    ],
    example: {
      title: "The video call that freezes while the backup runs",
      scenario:
        "A 40-person office has a 200 Mbps fiber link. At 2 p.m., the accounting team starts a 60 GB cloud backup. Video calls freeze, but the provider's speed test still reports 190 Mbps.",
      steps: [
        {
          action: "Check utilization and queueing on the office router.",
          result:
            "The upload link is at 99 percent; call packets wait behind backup traffic, so latency rises from 25 ms to 300 ms.",
        },
        {
          action: "Measure latency, jitter, and loss separately from bandwidth.",
          result:
            "Ping shows 280 ms and 6 percent loss during the backup, while download speed stays near 190 Mbps.",
        },
        {
          action:
            "Apply quality-of-service rules for real-time UDP traffic and schedule backups outside work hours.",
          result:
            "Call latency returns to about 30 ms, and the backup still completes overnight.",
        },
      ],
      conclusion:
        "The speed-test number was never the problem. Queueing caused latency and loss, and prioritization fixed it. Buy more bandwidth only after measuring which of the four numbers is actually bad.",
    },
    tradeoff: {
      gain:
        "Packet switching lets thousands of conversations share one link, routes around failures, and costs far less than a dedicated circuit per user.",
      cost:
        "Sharing creates queues, so latency and loss vary under load; operators must add capacity, QoS, and monitoring.",
      verdict:
        "Packet switching is the right default for nearly everything, but real-time services need latency budgets and prioritization, not just a bigger pipe.",
    },
    terms: [
      {
        term: "Packet",
        definition:
          "A small unit of data with a source address, a destination address, and a payload that is forwarded independently across a network.",
      },
      {
        term: "Subnet",
        definition:
          "A range of IP addresses that share a network prefix; devices in the same subnet can usually reach each other without a router.",
      },
    ],
    keyTakeaways: [
      "Networks are defined by shared protocols, not by a particular cable.",
      "IP moves packets, DNS maps names, routing chooses paths, and TCP or UDP sets the delivery guarantees.",
      "Bandwidth, latency, jitter, and packet loss are different problems with different fixes.",
      "A private address such as 192.168.1.42 can appear in millions of homes because NAT translates it at the edge.",
    ],
    pitfalls: [
      "Blaming the whole internet when only DNS resolution is failing.",
      "Assuming a fast speed test proves a link is healthy for calls.",
      "Thinking an IP address identifies a person; NAT and shared networks break that assumption.",
    ],
    focusPoints: [
      "Trace one request from name lookup to packet delivery.",
      "Separate naming, addressing, and routing when diagnosing a fault.",
      "Measure latency and loss before buying more bandwidth.",
    ],
    quiz: [
      {
        question:
          "A user reports a frozen video call, but a speed test shows 190 Mbps on a 200 Mbps link. What is the most likely cause?",
        options: [
          "The link has too little bandwidth.",
          "Queueing is raising latency and packet loss.",
          "DNS is resolving the wrong name.",
          "The IPv4 address space is exhausted.",
        ],
        answer: 1,
        explanation:
          "Bandwidth is capacity, not responsiveness. When a large backup fills the uplink, real-time packets wait in queues, which raises latency and loss. Buying more bandwidth might help only if utilization is genuinely the limit; here the measurement points to queueing. DNS would affect name lookup, not an already-connected call, and address exhaustion has nothing to do with this symptom.",
      },
      {
        question: "What is the main job of DNS?",
        options: [
          "Encrypt traffic between a browser and a server.",
          "Assign a unique IP address to every new device.",
          "Translate human-readable names into IP addresses.",
          "Choose the best route for each packet.",
        ],
        answer: 2,
        explanation:
          "DNS is a distributed lookup service: it maps names such as example.com to addresses. Encryption is TLS, address assignment is DHCP or static configuration, and path selection is routing. A useful test is to try a known IP address directly; if that works while the name fails, DNS is the suspect.",
      },
    ],
    walkthrough: 'network',
  },
  {
    chapterId: 'web-email-cloud',
    hook:
      "The web is not the internet, just as a library is not the building that contains it.",
    plainEnglish:
      "The web is pages and apps you open in a browser, email is messages passed between mail servers, and cloud services are computers someone else runs for you.",
    oneIdea:
      "Almost every online service is the same loop: a client sends a request, a server sends a response, and names, sessions, and protocols make that loop trustworthy.",
    whyItMatters:
      "Work, school, and money now run through browsers and inboxes. Understanding URLs, requests, and sender checks helps you spot phishing, fix sync mistakes, and explain why a login fails.",
    objectives: [
      "Break a URL into its scheme, host, port, path, query, and fragment.",
      "Read an HTTP request and response, including methods and status codes.",
      "Explain how email is delivered and why the From line can be forged.",
      "Distinguish cloud sync from backup and describe how SSO sessions work.",
    ],
    sections: [
      {
        title: "A URL is an instruction",
        body:
          "Uniform Resource Locator is the full instruction for finding one resource. The scheme says how to communicate; https means HTTP over an encrypted TLS connection. The host names the server, and the optional port selects a service, with 443 the default for HTTPS. The path identifies the resource, the query carries parameters, and the fragment points to a place inside the page and is not sent to the server. Domains are read right to left: the rightmost label is the top-level domain, and each label to the left is more specific. A lookalike character in the host is how phishing URLs deceive people.",
        code: `https://shop.example.com:443/orders/42?ref=email#delivery

scheme   https
host     shop.example.com
port     443
path     /orders/42
query    ref=email
fragment delivery`,
      },
      {
        title: "HTTP is one request and one response",
        body:
          "HTTP is the language browsers and servers use to exchange resources. A request has a method, a target, headers, and sometimes a body. GET asks for data and should not change anything; POST submits data; PUT and DELETE change or remove resources. A response carries a status code: 2xx means success, 3xx means redirect, 4xx means the client erred, and 5xx means the server failed. Headers carry metadata such as content type, caching rules, and cookies. HTTP is stateless, so a cookie or token must accompany each request to remind the server who you are.",
        code: `GET /orders/42 HTTP/1.1
Host: shop.example.com
Cookie: session=abc123

HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-store`,
      },
      {
        title: "Email is store-and-forward, and the From line is easy to forge",
        body:
          "Email is not a direct connection between two people. Your mail client sends a message to your outgoing server using SMTP. That server looks up the recipient domain's mail exchanger in DNS and relays the message, which may pass through several servers before it lands in a mailbox. Retrieval usually uses IMAP, which keeps folders synchronized, or POP, which downloads and often removes. The visible From header is just text and can claim anything. Real defenses check the envelope sender and cryptographic signatures with SPF, DKIM, and DMARC. A display name that says your bank proves nothing.",
      },
      {
        title: "Cloud sync, sessions, and single sign-on",
        body:
          "Cloud storage keeps objects on a provider's servers and synchronizes copies to your devices. Sync is not backup: delete a file locally and the deletion propagates, and ransomware can encrypt every synced copy. A backup keeps earlier, separate versions that an attacker cannot reach. When you log in, the server creates a session and gives the browser a cookie or token. Single sign-on centralizes login at an identity provider, so one account reaches many apps and one revocation locks them all. That convenience concentrates risk, which is why MFA and short session lifetimes matter. Shared responsibility means the provider secures the building, but you secure your data and access.",
      },
    ],
    example: {
      title: "The invoice that came from the boss",
      scenario:
        "An accounts-payable clerk receives an email that appears to be from the CEO, asking for an urgent 24,000 dollar transfer to a new supplier. The display name is correct, and the message thread looks real.",
      steps: [
        {
          action: "Inspect the full headers and the sender domain.",
          result:
            "The display name says CEO, but the return-path is a lookalike domain registered nine days ago; SPF fails and DMARC reports no alignment.",
        },
        {
          action: "Verify the request through a separate, known channel.",
          result:
            "The clerk calls the CEO's number from the staff directory; the CEO did not send it. No link is clicked and no credentials are entered.",
        },
        {
          action: "Report the message and tighten the payment process.",
          result:
            "Security blocks the sender, searches for other recipients, and finance adds a callback rule for any new bank details.",
        },
      ],
      conclusion:
        "The visible From name was a costume, not an identity. Out-of-band verification stopped the transfer, and the header check gave responders evidence.",
    },
    tradeoff: {
      gain:
        "Single sign-on removes password sprawl, enforces MFA in one place, and lets IT revoke access to every app at once when someone leaves.",
      cost:
        "The identity provider becomes a high-value target and a single point of failure; a stolen session can open many doors, and misconfiguration can lock out the whole company.",
      verdict:
        "Use SSO with phishing-resistant MFA, short sessions, and a tested break-glass administrator path. The concentration risk is manageable; password sprawl is not.",
    },
    terms: [
      {
        term: "Session cookie",
        definition:
          "A small piece of data a site stores in your browser and receives with each request so a stateless protocol can remember that you logged in.",
      },
      {
        term: "SPF",
        definition:
          "Sender Policy Framework, a DNS record that lists which servers may send email for a domain, letting receivers flag forged senders.",
      },
    ],
    keyTakeaways: [
      "A URL names the scheme, host, port, path, query, and fragment; the padlock means encryption, not honesty.",
      "HTTP is a stateless request-response protocol, and status codes tell you whether the client or server failed.",
      "The From line in email is easy to forge; check the domain and verify money requests out of band.",
      "Sync propagates deletions and ransomware, while a real backup keeps separate, restorable versions.",
    ],
    pitfalls: [
      "Treating the padlock as proof that a site is trustworthy; HTTPS only proves the connection is encrypted.",
      "Calling cloud sync a backup; deletions and encryption spread to every synced device.",
      "Trusting the display name in an email instead of the domain and an independent check.",
    ],
    focusPoints: [
      "Read a URL and an HTTP response before clicking or debugging.",
      "Check the sender domain and verify payment changes by phone.",
      "Keep a real backup separate from sync and protect SSO with MFA.",
    ],
    quiz: [
      {
        question:
          "In the URL https://shop.example.com:8443/orders/42?ref=email#delivery, which part is the host?",
        options: ["https", "shop.example.com", "/orders/42", "ref=email"],
        answer: 1,
        explanation:
          "The host names the server, shop.example.com. The scheme is https, 8443 is the port, /orders/42 is the path, ref=email is the query, and #delivery is the fragment. The fragment stays in the browser and is not sent in the HTTP request.",
      },
      {
        question:
          "An email shows the CFO's name, but the sender domain is cfo-finance.example.net and SPF fails. What is the best action?",
        options: [
          "Reply to ask whether the message is genuine.",
          "Open the attachment in a browser to inspect it.",
          "Verify using a known phone number and report the message.",
          "Forward it to colleagues for a second opinion.",
        ],
        answer: 2,
        explanation:
          "Replying goes to the attacker, and opening an attachment can run malware. The display name is not identity, and a failed SPF result plus a lookalike domain is strong evidence of spoofing. Verify through a channel you already trust, then report so others are protected.",
      },
    ],
    walkthrough: 'network',
  },
  {
    chapterId: 'cybersecurity',
    hook:
      "A company can buy the strongest locks in the building and still lose everything because an employee held the door for someone carrying boxes.",
    plainEnglish:
      "Cybersecurity is the work of keeping data and systems safe from people who want to steal, change, or disrupt them.",
    oneIdea:
      "Security is risk management, not perfection: you reduce the chance and impact of attacks with layered controls, then plan for the day one succeeds.",
    whyItMatters:
      "One clicked attachment can stop a hospital, leak payroll data, or cost millions. Every IT role touches security, and the practical choices are access, updates, backups, and how you respond.",
    objectives: [
      "Apply confidentiality, integrity, and availability to a scenario.",
      "Recognize phishing, malware, and social engineering tactics.",
      "Distinguish authentication from authorization and apply least privilege.",
      "Explain encryption, patching, backups, and incident response as layers.",
    ],
    sections: [
      {
        title: "The CIA triad is the scoreboard",
        body:
          "Confidentiality means only authorized people can read data. Integrity means data is accurate and has not been altered. Availability means systems work when users need them. Every control helps at least one goal and often costs another. Full-disk encryption protects confidentiality if a laptop is stolen, but a lost recovery key can destroy availability. A write-once backup protects integrity and availability after ransomware, yet it does nothing for a leaked customer list. Security teams rank risks by likelihood and impact rather than chasing every vulnerability. When someone proposes a control, ask which part of the triad it improves and which part it might weaken.",
      },
      {
        title: "Attackers target people first",
        body:
          "Most breaches start with a person, not a clever exploit. Phishing sends a message that looks routine and pushes you to click, pay, or log in. Spear phishing is tailored to one target using details from social media. Pretexting invents a story, such as an urgent call from the help desk. Malware is software written to do harm: viruses attach to files, worms spread without help, trojans hide inside useful-looking programs, and ransomware encrypts data and demands payment. MFA fatigue bombards you with login prompts until you approve one. The common thread is pressure: urgency, authority, fear, or curiosity. Slow down and verify through a separate channel.",
      },
      {
        title: "Authentication, authorization, and least privilege",
        body:
          "Authentication proves who you are. Authorization decides what you may do. A valid login does not mean access to every record. Role-based access control assigns permissions to jobs, such as help-desk agent or payroll administrator, rather than to individuals. Least privilege means granting the minimum needed for the task and for the shortest useful time. A support agent who needs to reset passwords does not need permission to read salary data. Administrators should use separate accounts for routine work so a phishing page cannot capture domain-wide power. Log access changes, review them quarterly, and remove permissions when people change roles. Excessive access turns one stolen account into a company-wide incident.",
      },
      {
        title: "Encryption, patching, backups, and response",
        body:
          "Encryption scrambles data so only someone with the key can read it. TLS protects data in transit, as shown by HTTPS; encryption at rest protects a stolen disk or backup. Hashing is different: it is one-way and is used to store passwords, never to recover them. Patching closes known holes, and a large share of ransomware uses vulnerabilities that had fixes available for months. Backups must be isolated, versioned, and tested; an untested backup is a hope. A simple incident response plan says who declares an incident, how to isolate systems, what to preserve, and who talks to customers and regulators. Prevention lowers the odds; response and recovery lower the damage.",
      },
    ],
    example: {
      title: "Ransomware at a dental clinic",
      scenario:
        "A 40-person dental clinic runs one server for records and one shared drive. On Monday, a receptionist opens an email attachment labeled updated fee schedule. Within minutes, files on the shared drive are renamed with a strange extension, and a ransom note appears.",
      steps: [
        {
          action: "Disconnect the affected workstation and disable the shared-drive link.",
          result:
            "The encryption process stops before it reaches the record server; staff switch to paper forms for urgent patients.",
        },
        {
          action: "Restore files from the offline backup taken Friday and verify a sample.",
          result:
            "The clinic recovers its schedule and images in about six hours, without paying, losing only the morning's new entries.",
        },
        {
          action:
            "Patch the mail gateway and office suite, reset credentials, add MFA, and train staff on attachments.",
          result:
            "The known vulnerability is closed, stolen credentials no longer work, and a repeat test phish is reported by staff.",
        },
      ],
      conclusion:
        "Prevention failed once, but isolation, a tested backup, and fast response kept a clinic open. Security is judged by recovery, not by the absence of incidents.",
    },
    tradeoff: {
      gain:
        "Least privilege and MFA sharply reduce the damage one stolen password can cause and make access easier to audit.",
      cost:
        "They add friction: more approvals, more login steps, and support tickets when someone changes roles or loses a phone.",
      verdict:
        "Accept the friction for admin, finance, and health data, and invest in fast, self-service recovery so security does not become an excuse for shared passwords.",
    },
    terms: [
      {
        term: "Multi-factor authentication",
        definition:
          "A login check that requires two or more independent proofs, such as a password plus a code or a hardware key.",
      },
      {
        term: "Least privilege",
        definition:
          "The principle of giving each person or program only the access needed for its task, for no longer than necessary.",
      },
    ],
    keyTakeaways: [
      "Confidentiality, integrity, and availability give you a scoreboard for any security control.",
      "People are the main attack surface, and pressure tactics such as urgency and authority are the warning sign.",
      "Authentication proves identity; authorization limits action; least privilege limits the blast radius.",
      "Layers of patching, encryption, tested backups, and a practiced response plan reduce both chance and impact.",
    ],
    pitfalls: [
      "Believing antivirus alone is enough; it misses new malware and social engineering.",
      "Approving an MFA prompt you did not start.",
      "Keeping the only backup on the same network as the original data.",
    ],
    focusPoints: [
      "Map a scenario to confidentiality, integrity, and availability.",
      "Ask who needs which access and for how long.",
      "Test a restore, not just the creation of a backup.",
    ],
    quiz: [
      {
        question:
          "An employee receives five login approval prompts at 2 a.m. and approves the last one to stop the notifications. What attack just succeeded?",
        options: [
          "A phishing email with a malicious link",
          "MFA fatigue, giving an attacker a stolen-password login",
          "A worm spreading across the local network",
          "DNS cache poisoning",
        ],
        answer: 1,
        explanation:
          "The repeated prompts are push bombing. The attacker already has the password and needs only one approval to turn it into a session, so approving grants access. No link was clicked, so this is not a phishing link; a worm spreads by itself, and DNS poisoning redirects names, neither of which matches the prompt flood.",
      },
      {
        question:
          "Which control most directly restores operations after ransomware encrypts files?",
        options: [
          "A stronger password policy",
          "An isolated, tested backup",
          "Hiding the Wi-Fi network name",
          "A longer screen-lock timeout",
        ],
        answer: 1,
        explanation:
          "Backups let you rebuild encrypted data and are the direct recovery control. Stronger passwords reduce the chance of initial access but cannot decrypt files, hiding a network name is not a security boundary, and a screen-lock timeout limits physical exposure rather than restoring service.",
      },
    ],
    walkthrough: 'network',
  },
  {
    chapterId: 'databases-information-systems',
    hook:
      "A spreadsheet with 20 rows is a helpful tool; the same sheet with 20 million rows and 200 editors is an outage waiting to happen.",
    plainEnglish:
      "A database is an organized store of facts that many programs can search and update safely at the same time.",
    oneIdea:
      "A database is a system of record: one authoritative place for each fact, with rules and transactions that keep it consistent when many people act at once.",
    whyItMatters:
      "Every order, booking, grade, and payment is a row somewhere. When keys, transactions, or ownership are wrong, the business loses money and trust, and reports quietly disagree.",
    objectives: [
      "Explain tables, rows, columns, primary keys, and foreign keys.",
      "Compare relational and NoSQL models and choose by workload.",
      "Describe how a query becomes a report and why indexes matter.",
      "Explain transactions, ACID, and the system of record.",
    ],
    sections: [
      {
        title: "Tables, rows, and keys",
        body:
          "A relational database stores data in tables, also called relations. Each row is one record, such as one customer, and each column is one attribute with a defined type. A primary key uniquely identifies a row and cannot be null; a customer ID or order number works, while a name does not because duplicates exist. A foreign key is a column that refers to a primary key in another table, which is how an order points to its customer. The database enforces these rules, so a program cannot silently create an order for a customer who does not exist. Keys are the skeleton that makes joins and reliable reporting possible.",
        code: `Customers
customer_id (PK) | name         | email
1001             | Ada Lovelace | ada@example.com

Orders
order_id (PK) | customer_id (FK) | total
9001          | 1001             | 42.50`,
      },
      {
        title: "Relational versus NoSQL",
        body:
          "Relational systems organize facts into tables with a fixed schema and use SQL to join them. They shine when data is structured and consistency matters: ledgers, orders, inventory. NoSQL is an umbrella for document, key-value, wide-column, and graph stores. Document stores keep a whole record as one JSON-like object, which is convenient for changing shapes such as product descriptions. Key-value stores are fast for lookups. Graph stores follow relationships. NoSQL often scales horizontally and relaxes immediate consistency. The right question is not which is modern but which access pattern and consistency guarantee the workload needs. Many systems use both: a relational ledger plus a search index.",
      },
      {
        title: "Queries turn stored facts into answers",
        body:
          "A query is a question expressed in a data language, not a copy of the database. In SQL you name the columns you want, the tables they come from, filters, grouping, and sort order. The database's query planner chooses an execution plan; an index on a filtered column can turn a scan of five million rows into a handful of reads. That is why a report can be fast on Monday and slow on Friday after data grows. Reports and dashboards are saved queries with presentation, and read replicas can serve them without slowing checkout. A query returns a snapshot; a report adds labels, totals, and time windows.",
      },
      {
        title: "Transactions and the system of record",
        body:
          "A transaction groups several changes into one all-or-nothing unit. A bank transfer must debit one account and credit another; if the system crashes between the two, neither change may commit. Databases provide ACID: atomicity for all-or-nothing, consistency for rule enforcement, isolation so concurrent users do not see half-finished work, and durability so committed data survives a crash. Isolation has levels because stronger guarantees cost concurrency; most systems use row versions instead of locking every reader. The system of record is the authoritative copy of a fact. Caches, search indexes, and spreadsheets are copies that must be refreshed from it. When two systems disagree, the system of record wins.",
      },
    ],
    example: {
      title: "The appointment that was booked twice",
      scenario:
        "A clinic has two receptionists and one booking screen. Both click Confirm for the same doctor at 3:00 p.m. within the same second. The app checks for a conflict and then inserts, but both checks ran before either insert.",
      steps: [
        {
          action:
            "Reproduce the race with two simultaneous requests and inspect the table.",
          result:
            "Both rows are inserted because appointments has no unique rule on doctor_id plus start_time; the app's check is not atomic.",
        },
        {
          action:
            "Add a unique constraint on the doctor-and-time pair and wrap check plus insert in one transaction.",
          result:
            "The second request now fails cleanly with a conflict message instead of creating a duplicate.",
        },
        {
          action: "Clean the existing duplicates and add a daily exception report.",
          result:
            "Staff merge the affected bookings, call both patients, and the report catches any future overlap within minutes.",
        },
      ],
      conclusion:
        "Application code alone cannot guarantee consistency under concurrency. A database constraint plus a transaction made the rule impossible to violate, and the clean error message kept the fix usable.",
    },
    tradeoff: {
      gain:
        "Strict tables, keys, and transactions give consistent answers, safe concurrent updates, and reports that finance and auditors can trust.",
      cost:
        "Schema changes need migrations, strict rules reject messy data, and heavily normalized designs can require many joins and slower reads.",
      verdict:
        "Use a relational system of record for money, orders, and identity, then add flexible or denormalized copies for search and analytics where speed matters more than perfect freshness.",
    },
    terms: [
      {
        term: "Primary key",
        definition:
          "A column or set of columns that uniquely identifies each row in a table and cannot be empty.",
      },
      {
        term: "Transaction",
        definition:
          "A group of database changes that either all commit or all roll back, so other users never see a half-finished update.",
      },
    ],
    keyTakeaways: [
      "Primary keys identify rows, foreign keys connect them, and the database enforces both rules.",
      "Choose relational or NoSQL from the access pattern and consistency needs, not from fashion.",
      "Queries answer questions; indexes and query plans decide whether the answer arrives in milliseconds or minutes.",
      "ACID transactions and a declared system of record are what make shared data trustworthy.",
    ],
    pitfalls: [
      "Using a name or email as a primary key when it can change or repeat.",
      "Treating a search index or nightly export as the system of record.",
      "Assuming a uniqueness check in application code is safe under concurrent requests.",
    ],
    focusPoints: [
      "Identify the key and the rule it protects.",
      "Choose the data model from the workload, not from fashion.",
      "Ask what happens if the power fails halfway through a change.",
    ],
    quiz: [
      {
        question:
          "A table of orders has a customer_id column that must match a customer in the Customers table. What is this column?",
        options: ["A primary key", "A foreign key", "An index", "A transaction"],
        answer: 1,
        explanation:
          "A foreign key references a primary key in another table, which is exactly how an order points to a valid customer. A primary key uniquely identifies a row in its own table, an index speeds lookups but does not enforce the relationship, and a transaction groups changes rather than linking tables.",
      },
      {
        question:
          "A transfer debits one account, then the database crashes before the credit. Which property ensures the debit is undone?",
        options: ["Durability", "Atomicity", "Normalization", "Replication"],
        answer: 1,
        explanation:
          "Atomicity makes the debit and credit one all-or-nothing unit, so an incomplete transaction rolls back. Durability is tempting but only guarantees that a committed transaction survives a crash; this one never committed. Normalization reduces duplication, and replication copies data to another server, neither of which undoes the debit.",
      },
    ],
  },
  {
    chapterId: 'business-systems',
    hook:
      "A company can build a superb product and still lose the order because sales promised a date that operations never saw.",
    plainEnglish:
      "Business systems are software tools that run a company's shared work, from stock and orders to customer relationships and online sales.",
    oneIdea:
      "These systems exist to move one trusted version of a fact through a process, so every team acts on the same customer, item, and order.",
    whyItMatters:
      "ERP, CRM, and e-commerce decisions shape whether orders ship, customers stay, and upgrades remain possible. Most IT jobs integrate, support, or report on these systems.",
    objectives: [
      "Explain ERP modules and the role of shared master data.",
      "Map the CRM customer lifecycle and its limits.",
      "Trace an e-commerce order from catalog to fulfillment.",
      "Evaluate integration styles and the cost of customization.",
    ],
    sections: [
      {
        title: "ERP: one system for the core",
        body:
          "Enterprise resource planning software runs the transactional core: finance, procurement, inventory, manufacturing, and often HR. Its power comes from shared master data. A customer, item, or supplier has one ID and one definition, so an order can reserve stock, create a shipment, and post an invoice without re-keying. A typical ERP also enforces approvals and keeps an audit trail. The trade-off is rigidity: processes must be configured to a common model, and a change that seems local can ripple across finance and reporting. Large ERP projects fail more often from unclear ownership and bad data than from missing features. Cleaning master data before go-live matters more than a flashy demo.",
      },
      {
        title: "CRM: the customer lifecycle",
        body:
          "A customer relationship management system tracks people and organizations across a lifecycle: lead, qualified opportunity, customer, renewal, and sometimes churn. It stores contacts, conversations, quotes, tickets, and consent to contact. Sales uses a pipeline of stages with values and dates; support uses cases with service-level targets; marketing uses segments and campaigns. The CRM is not the ledger. It should not decide revenue recognition or inventory, though it often triggers the order in the ERP. Duplicate contacts and stale owners are the classic failure modes, so deduplication rules and a clear definition of an active customer matter. A CRM is only as good as the notes people actually record.",
      },
      {
        title: "E-commerce: from catalog to checkout",
        body:
          "An online store is a chain of small systems. The catalog holds products and SKUs, where a SKU is a unique identifier for a sellable variant such as a blue medium shirt. Search and recommendations help discovery. The cart holds tentative choices; checkout calculates tax and shipping, authorizes a payment, and creates an order. Fulfillment reserves stock, picks, packs, and ships. Returns reverse the flow. Each handoff can fail: a price change during checkout, a payment authorized but not captured, or stock sold in a store while the website still shows it. Idempotency keys prevent a retried payment from charging twice. The customer sees one button; the business sees a dozen dependencies.",
      },
      {
        title: "Integration, APIs, and process fit",
        body:
          "Business systems rarely stand alone. Integration moves data between them through APIs, scheduled file transfers, or events. An API is a defined contract for one system to ask another for data or action. Events announce that something happened, such as OrderPlaced, and let several systems react without tight coupling. Master data needs an owner: if the ERP owns the customer ID, the CRM should not invent a second one. Configuration tailors supported settings; customization changes code. Customizations feel precise but complicate every upgrade, testing cycle, and support contract. A useful rule is to configure for standard processes and customize only what genuinely differentiates the business. Integration latency is a business decision, because stale stock causes overselling.",
      },
    ],
    example: {
      title: "The Black Friday oversell",
      scenario:
        "An outdoor retailer has 200 tents in one warehouse. The website and three stores share stock, but the inventory file syncs every 15 minutes. At 9:00 a.m., the website sells the last 40 tents while two stores sell 12 of the same units.",
      steps: [
        {
          action:
            "Compare timestamps in the order, point-of-sale, and inventory tables.",
          result:
            "Both channels accepted sales against the same 9:00 snapshot; 12 orders have no stock to fulfill.",
        },
        {
          action:
            "Reserve stock through a real-time API at cart checkout and publish inventory events on every sale.",
          result:
            "The website now holds units for 10 minutes, and store sales release or confirm them; the next test oversells zero units.",
        },
        {
          action:
            "Contact affected customers with a substitute or refund, then monitor sync lag and stock exceptions daily.",
          result:
            "All 12 customers are made whole, and the lag dashboard flags any channel more than 60 seconds behind.",
        },
      ],
      conclusion:
        "The catalog was correct; the integration was not. A single stock owner, an atomic reservation, and visible lag turned inventory from a guess into a commitment.",
    },
    tradeoff: {
      gain:
        "Configuration-first ERP and CRM keep upgrades feasible, reduce custom code, and preserve a shared process that finance, sales, and operations can trust.",
      cost:
        "Standard processes can feel clumsy, some teams must change how they work, and real differentiation may still require expensive extensions.",
      verdict:
        "Configure the commodity processes, integrate through documented APIs and events, and reserve customization for the few workflows customers truly pay for.",
    },
    terms: [
      {
        term: "Master data",
        definition:
          "The core shared records, such as customers, products, suppliers, and locations, that multiple systems must agree on.",
      },
      {
        term: "SKU",
        definition:
          "A stock keeping unit, a unique code for one sellable product variant, such as a specific size and color.",
      },
    ],
    keyTakeaways: [
      "ERP runs the transactional core and depends on one shared definition of customers, items, and suppliers.",
      "CRM manages the relationship lifecycle but is not the financial ledger.",
      "E-commerce is a chain of handoffs where stock reservation and idempotent payment prevent expensive failures.",
      "Every core fact needs an owner, and configuration-first integration keeps future upgrades possible.",
    ],
    pitfalls: [
      "Letting every system create its own customer ID.",
      "Treating the website catalog as the stock ledger.",
      "Customizing core ERP code for a process that should change instead.",
    ],
    focusPoints: [
      "Find the owner of each core fact.",
      "Trace one order end to end and name every handoff.",
      "Ask what stale data costs before choosing batch sync.",
    ],
    quiz: [
      {
        question:
          "A company finds three different billing addresses for the same customer in its CRM, ERP, and shipping tool. What is the underlying problem?",
        options: [
          "The company needs more storage.",
          "There is no single owner and source for master data.",
          "The firewall is blocking updates.",
          "The backup schedule is too frequent.",
        ],
        answer: 1,
        explanation:
          "Different addresses are a master-data problem: each system created or edited its own copy without a declared owner. More storage, firewall rules, and backup frequency do not resolve conflicting definitions. The fix is to choose the system of record, deduplicate, and synchronize changes from that source.",
      },
      {
        question:
          "Why should a company prefer configuration over custom code changes in a core ERP?",
        options: [
          "Configuration always improves security.",
          "It keeps future upgrades and support manageable.",
          "It removes the need for testing.",
          "It makes the ERP run without a database.",
        ],
        answer: 1,
        explanation:
          "Supported configuration settings survive upgrades far better than custom code, which must be retested and can break with each release. Configuration does not automatically improve security, it still needs testing, and every ERP still needs a database.",
      },
    ],
  },
  {
    chapterId: 'ethics-ai-careers',
    hook:
      "A system can pass every test and still be unfair to the people it judges.",
    plainEnglish:
      "IT ethics means asking who a system helps, who it harms, and whether people can understand and challenge its decisions.",
    oneIdea:
      "Every technical choice distributes power and risk, so ethical work makes those choices visible, tests who bears the cost, and leaves room to appeal.",
    whyItMatters:
      "Privacy laws, biased models, inaccessible apps, and hidden vulnerabilities affect real people. Trust is part of the job, and ethical habits travel with you into any IT role.",
    objectives: [
      "Apply privacy principles such as consent and data minimization.",
      "Identify sources of bias in AI and ways to test for it.",
      "Explain accessibility principles and concrete design checks.",
      "Describe responsible disclosure and several IT career paths.",
    ],
    sections: [
      {
        title: "Privacy, consent, and data minimization",
        body:
          "Privacy is not secrecy; it is control over how personal data is collected, used, shared, and kept. Personal data that can identify someone, often called PII, includes names, emails, phone numbers, location, and sometimes IP addresses. Good practice follows purpose limitation, data minimization, and retention limits: collect only what the task needs, use it only for the stated purpose, and delete it when that purpose ends. Consent must be informed and revocable, and laws such as the GDPR and CCPA add rights to access, correct, and delete data. A loyalty app that asks for precise location to recommend a nearby store should explain why, make it optional, and not keep it forever.",
      },
      {
        title: "Bias and fairness in AI",
        body:
          "An AI model learns patterns from data, including the biases in that data. If a hiring model is trained on ten years of hires who were mostly men, it may treat male-coded resumes as stronger. Sampling bias, biased labels, and proxy features such as postcode or career gaps can all encode discrimination without anyone intending it. Fairness itself is contested: equal selection rates, equal error rates, and equal outcomes cannot all be maximized at once. Useful safeguards include auditing outcomes by group, testing on slices the model was not trained on, documenting intended use, keeping a human decision-maker, and providing an appeal path. A model that scores 95 percent overall can still fail one group badly.",
      },
      {
        title: "Accessibility and inclusive design",
        body:
          "Accessibility means people with disabilities can perceive, operate, and understand a system. The WCAG guidelines summarize four principles: perceivable, operable, understandable, and robust. Concrete checks include text contrast of at least 4.5 to 1, keyboard access to every control, labels tied to form fields, alt text for meaningful images, captions for video, and no flashing that could trigger seizures. About 16 percent of the world's population lives with significant disability, so accessibility is a mainstream requirement, not an edge case. It also helps everyone: curb cuts serve wheelchairs, strollers, and delivery carts. Test with a keyboard and a screen reader, not only with an automated scanner, because scanners catch perhaps a third of issues.",
      },
      {
        title: "Security ethics, disclosure, and career paths",
        body:
          "Security work raises ethical choices because the same skill can protect or harm. Testing a system without permission is unauthorized access, even with good intentions. Responsible disclosure means telling the vendor privately, giving a reasonable deadline to fix the issue, and coordinating public details after a patch. Bug bounty programs make that permission explicit. Whistleblowing is different: reporting an organization's harm when internal channels fail, with care for the people exposed. IT careers include help desk, systems administration, network engineering, security operations, database administration, development, product management, and data analysis. Beginners often start where they touch users and systems, then specialize. Certifications help, but a small working project and clear writing often help more.",
      },
    ],
    example: {
      title: "The hiring model that rejected qualified candidates",
      scenario:
        "A retail company uses a model to rank job applicants. It was trained on five years of successful hires, 78 percent of whom were men. An audit finds that CVs from women are rejected at twice the rate of comparable CVs from men.",
      steps: [
        {
          action:
            "Pause automated rejection and measure selection rates by group at each stage.",
          result:
            "The disparity appears at the CV-ranking stage, not the interview stage, so the model is the likely cause.",
        },
        {
          action:
            "Trace features and labels with the vendor; remove proxies such as career gaps and gendered wording, then retest on held-out data.",
          result:
            "The gap narrows but does not disappear, showing that labels and historical outcomes still carry bias.",
        },
        {
          action:
            "Keep a human reviewer for every rejection, add an appeal path, and monitor group outcomes monthly.",
          result:
            "No candidate is rejected by the model alone, appeals are logged, and the next quarter's disparity falls within the agreed threshold.",
        },
      ],
      conclusion:
        "Removing one biased feature was not enough. Fairness required measurement, human judgment, and ongoing monitoring, plus a way for candidates to challenge a decision.",
    },
    tradeoff: {
      gain:
        "Automated scoring can make high-volume decisions faster, cheaper, and more consistent on the criteria it measures.",
      cost:
        "It can hide bias, remove context, and make harm harder to see; appeals and human review add cost and delay.",
      verdict:
        "Automate low-stakes sorting with transparency and appeals; keep humans accountable for hiring, lending, health, and other consequential decisions.",
    },
    terms: [
      {
        term: "PII",
        definition:
          "Personally identifiable information, data that can single out a person directly or when combined with other data.",
      },
      {
        term: "Responsible disclosure",
        definition:
          "Reporting a security flaw privately to the owner, allowing time to fix it, and coordinating any public explanation.",
      },
    ],
    keyTakeaways: [
      "Privacy is control over personal data, supported by consent, minimization, retention limits, and legal rights.",
      "AI bias comes from data, labels, and proxies; fairness needs measurement, human judgment, and an appeal path.",
      "Accessibility follows perceivable, operable, understandable, and robust principles, and manual testing matters.",
      "Responsible disclosure protects people, and IT careers reward curiosity, clear writing, and working projects.",
    ],
    pitfalls: [
      "Assuming a model is neutral because it does not use race or gender directly; proxies can carry the same signal.",
      "Treating an automated accessibility score as complete proof of compliance.",
      "Publishing a vulnerability before a fix because it feels like transparency.",
    ],
    focusPoints: [
      "Ask who is affected and who can appeal.",
      "Test outcomes by group and across edge cases.",
      "Prefer permission, minimal data, and independent verification.",
    ],
    quiz: [
      {
        question:
          "A hiring model never uses gender as an input, yet it rejects women at twice the rate. What is the most likely explanation?",
        options: [
          "The model is too slow.",
          "Proxy features and biased training labels encode gender indirectly.",
          "The company uses too much storage.",
          "The applicants have poor internet connections.",
        ],
        answer: 1,
        explanation:
          "A model can reproduce a protected trait through correlated features such as career gaps, wording, or school names, and through labels based on biased past decisions. Removing the gender column is not enough; you must audit outcomes by group. Speed, storage, and applicant connectivity do not explain a systematic disparity.",
      },
      {
        question:
          "A researcher finds a flaw that exposes patient records in a hospital app. What is the most ethical first step?",
        options: [
          "Post the exploit publicly to force a fast fix.",
          "Sell the details to a security broker.",
          "Report it privately to the vendor and agree on a disclosure deadline.",
          "Ignore it because the hospital did not ask for a test.",
        ],
        answer: 2,
        explanation:
          "Responsible disclosure gives the hospital a chance to protect patients before attackers learn the details. Public posting and selling increase harm, and ignoring the flaw leaves patients exposed. A reasonable deadline and coordinated publication balance urgency with safety.",
      },
    ],
  },
];
