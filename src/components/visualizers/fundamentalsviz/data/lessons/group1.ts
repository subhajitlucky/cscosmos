import type { ITLesson } from './types';

export const group1Lessons: ITLesson[] = [
  {
    chapterId: 'what-is-it',
    hook:
      'A hospital can buy identical laptops for every ward and still have one ward run smoothly while another drowns in paper. The difference is rarely the hardware.',
    plainEnglish:
      'IT is the work of using computers, networks, and data to help people get tasks done, including choosing the tools, running them, and fixing them when they break.',
    oneIdea:
      'IT is a service built from layers: hardware, operating system, applications, data, and people and process. Most problems are solved by finding the right layer.',
    whyItMatters:
      'Nearly every organization runs on IT, but many IT failures are not mysterious. They are mismatches between layers, unclear ownership, or a tool that does not fit the work. Learning the layers gives you a checklist for diagnosing problems and a language for talking to specialists.',
    objectives: [
      'Distinguish information technology from computer science and information systems.',
      'Name the five layers of a working IT system.',
      'Explain the roles of users, administrators, and builders.',
      'Describe why IT is judged as a service, not just a technology.',
    ],
    sections: [
      {
        title: 'Three fields, three questions',
        body:
          'Computer science asks what can be computed and how to compute it efficiently. Information technology asks how to deploy, operate, secure, and support computing for real people. The field of information systems asks how technology and business process together create value. The fields overlap constantly. A new sorting algorithm is computer science; rolling it out to 300 warehouse scanners, training staff, and keeping it running is IT; deciding whether it cuts picking errors enough to justify the cost is information systems. IT borrows from both, but its center of gravity is operations: keeping services available, usable, and recoverable.',
      },
      {
        title: 'The five-layer model',
        body:
          'A practical way to picture any IT system is five layers. At the bottom is physical hardware, including the network equipment that connects it. Above it sits the operating system, which manages those resources. Next are applications, such as a payroll program or web browser. Then comes data: the records the applications read and write. Raw data becomes information only when context makes it meaningful. At the top are people and process: the staff who use the system and the agreed steps they follow. Each layer depends on the ones below and serves the ones above. It is a useful model, not a law, but it turns a vague outage into a set of places to check.',
      },
      {
        title: 'Users, administrators, builders',
        body:
          'Three roles appear in almost every system. Users do the work the system exists to support: nurses admitting patients, teachers posting grades, clerks issuing refunds. Administrators run and protect the system: creating accounts, applying updates, watching backups, and responding to incidents. Builders design and change it: developers, integrators, and database specialists. The boundaries blur. A finance analyst who automates a report is both user and builder. Each role needs different access, documentation, and measures of success. A common misconception is that IT means only the help desk; support is one service inside a much larger set of responsibilities.',
      },
      {
        title: 'IT as a service',
        body:
          'IT is judged by the service it delivers, not by how clever the components are. A school does not need a database; it needs report cards available on the deadline. That shift in view creates service commitments. An SLA, or service level agreement, might promise 99.9 percent availability, which allows about 8.8 hours of downtime a year. Support teams use tickets, priorities, and planned maintenance windows to keep work visible. They also measure restoration time, not just failure count. The discipline is deciding what matters most when several requests compete for limited staff and equipment.',
      },
    ],
    example: {
      title: 'The clinic that replaced paper sign-in',
      scenario:
        'A 12-doctor clinic wants tablet sign-in. The practice manager asks IT to "buy 20 tablets" by Monday. Before ordering, the team maps the request to the five layers.',
      steps: [
        {
          action:
            'Map the workflow: patients arrive, scan a QR code, confirm details, and join a queue.',
          result:
            'The team sees that the real requirement is a checked-in queue, not a tablet; a web form on a phone could also work.',
        },
        {
          action:
            'Check each layer: Wi-Fi coverage in the waiting room, browser compatibility, patient-record integration, staff process for walk-ins, and privacy rules.',
          result:
            'Two gaps appear: weak Wi-Fi near the entrance and no agreed process for patients without a phone.',
        },
        {
          action:
            'Pilot with 3 tablets and 2 staff for one week, measuring check-in time and failed attempts.',
          result:
            'Average check-in drops from 4 minutes to 90 seconds, but 1 in 8 patients needs staff help, so the clinic keeps a paper fallback.',
        },
      ],
      conclusion:
        'The clinic buys 12 tablets, not 20, and fixes Wi-Fi first. Framing the request as a service exposed process and network work that a device order would have hidden.',
    },
    tradeoff: {
      gain:
        'A standardized set of supported devices and software is cheaper to secure, patch, and troubleshoot.',
      cost:
        'Staff lose the freedom to choose tools that fit unusual work, and one bad standard affects everyone.',
      verdict:
        'Standardize common needs, but keep a reviewed exception process for specialist roles; uniformity is a default, not a religion.',
    },
    terms: [
      {
        term: 'Information technology',
        definition:
          'The practice of selecting, deploying, operating, and supporting computing systems so people can do work reliably.',
      },
      {
        term: 'Service level agreement (SLA)',
        definition:
          'A written promise about a service, such as availability, response time, or repair time, with measurable targets.',
      },
    ],
    keyTakeaways: [
      'IT focuses on operating technology for people; computer science focuses on computation itself.',
      'The five layers are hardware, operating system, applications, data, and people and process.',
      'Users, administrators, and builders need different access and success measures.',
      'An SLA turns an expectation into a measurable promise.',
    ],
    pitfalls: [
      'Treating an IT request as a shopping list ("buy 20 tablets") instead of a service outcome.',
      'Blaming the application for every slowdown without checking network, data, or process layers.',
      'Assuming 99.9 percent uptime means no outages; it still allows about 8.8 hours a year.',
    ],
    focusPoints: [
      'Use the five-layer model to locate a problem before proposing a fix.',
      'Explain the difference between IT, computer science, and information systems with one example each.',
      'Read an SLA and say what it does and does not guarantee.',
    ],
    quiz: [
      {
        question: 'Which task is information technology rather than computer science?',
        options: [
          'Designing a faster sorting algorithm',
          'Proving a problem cannot be solved in polynomial time',
          'Rolling out an approved update to 400 staff laptops',
          'Inventing a new programming language',
        ],
        answer: 2,
        explanation:
          'Rolling out and supporting an update is operations work. Algorithm design, complexity theory, and language design are computer science.',
      },
      {
        question:
          'A dashboard is slow only for staff in one branch. Which first step fits the five-layer model best?',
        options: [
          'Check the network and hardware at that branch before changing the application',
          'Rewrite the dashboard application immediately',
          'Buy new servers for every branch',
          'Ignore it because other branches are fine',
        ],
        answer: 0,
        explanation:
          'The problem is limited to one branch, so check the local network and hardware before changing shared software. Rewriting the application is expensive and unlikely to fix a single-site fault.',
      },
    ],
  },

  {
    chapterId: 'computer-system',
    hook:
      'A laptop, a car engine controller, and a smart light bulb all contain processors, yet only one has a screen. What they share is a loop: take something in, do something with it, put something out.',
    plainEnglish:
      'A computer system is a machine that takes input, processes it using stored instructions, stores results, and produces output, all coordinated by software.',
    oneIdea:
      'Every computer, from a watch to a data-center server, repeats the same pattern: input, processing, storage, output, and control, with programs stored in memory.',
    whyItMatters:
      'Knowing the pattern helps you tell whether a problem is in the input device, the program, the storage, or the output. It also explains why a device with a fast processor can still feel slow when its storage or network is the bottleneck.',
    objectives: [
      'Describe the input-process-output model with storage and control.',
      'Explain the stored-program idea and why it matters.',
      'Trace the boot process from power-on to operating system.',
      'Identify system boundaries and the interfaces between parts.',
    ],
    sections: [
      {
        title: 'Input, processing, output, storage, control',
        body:
          'The classic model is input, processing, output, plus storage and control. Input is anything entering the system: a keypress, a barcode scan, a sensor reading, or a network packet. Processing is the central processing unit (CPU) following instructions to transform that input. Storage holds data temporarily in memory or durably on a disk. Output is the result: pixels, sound, a printed page, or a signal that opens a valve. Control coordinates the parts with a clock and status signals. A car engine controller reads an oxygen sensor, adjusts fuel, and stores a fault code, all without a screen. The model fits phones, servers, and microwaves alike.',
      },
      {
        title: 'The stored-program idea',
        body:
          'Early computers were reconfigured by rewiring or plugging cables, so changing a task meant changing the machine. The stored-program idea, often called the von Neumann architecture, puts instructions in the same memory as data. The CPU fetches the next instruction from an address held in the program counter, decodes it, and executes it. A general-purpose computer can therefore become a word processor, a game console, or a web server simply by loading different instructions. The cost is the von Neumann bottleneck: instructions and data travel over the same path between CPU and memory, which limits throughput.',
      },
      {
        title: 'Firmware and the boot process',
        body:
          'When you press the power button, the operating system is not running yet. Firmware, software stored in a chip on the motherboard, starts first. On a modern PC this is UEFI, the Unified Extensible Firmware Interface; older systems used BIOS, the Basic Input/Output System. Firmware runs a power-on self-test, detects basic devices, and looks for a boot device in a configured order. It loads a bootloader, which loads the operating system kernel. The kernel then starts services and presents a login screen. Secure Boot adds a signature check so unsigned boot code cannot quietly replace the trusted chain. A common misconception is that the OS controls the very first moments of startup; it does not.',
        code: String.raw`1. Power on -> firmware (UEFI or BIOS) starts
2. POST (power-on self-test): test CPU, RAM, basic devices
3. Read boot order: USB -> internal drive -> network
4. Load bootloader from the chosen device
5. Bootloader loads the OS kernel
6. Kernel starts drivers and services -> login`,
      },
      {
        title: 'Boundaries and interfaces',
        body:
          'A system boundary is the line between what you are responsible for and everything else. An interface is the agreed set of rules for crossing that line: the shape of a USB plug, the commands a disk accepts over a storage interface such as SATA or NVMe, or the functions an application exposes through an application programming interface (API). Clear interfaces let one side change without breaking the other. You can replace a keyboard with a different brand because both sides follow the USB standard. They also hide complexity: the OS does not need to know how a particular SSD stores bits. Most compatibility problems are interface mismatches, not broken components.',
      },
    ],
    example: {
      title: 'The self-checkout lane that stopped scanning',
      scenario:
        'On a busy Saturday morning, one of six self-checkout lanes at a supermarket refuses to scan barcodes. The screen is on and the card reader works. The supervisor calls the supermarket IT team.',
      steps: [
        {
          action:
            'Check the input path: try three known-good items, reseat the scanner cable, and test the scanner on another lane.',
          result:
            'The scanner fails on another lane too, so the fault is the scanner or its cable, not the checkout software.',
        },
        {
          action:
            'Replace the cable, then the scanner, one at a time, watching the device status in the operating system.',
          result:
            'With a new cable the device appears but scans nothing; with a replacement scanner it scans immediately.',
        },
        {
          action:
            'Confirm the fix end to end: scan five items, pay by card, print a receipt, and check the transaction in the back-office log.',
          result:
            'All five items appear at correct prices and the sale is recorded, so the lane returns to service.',
        },
      ],
      conclusion:
        'The fault was a failed scanner, found by testing input separately from processing and output. Swapping parts one at a time prevented two changes from hiding which one fixed it.',
    },
    tradeoff: {
      gain:
        'A general-purpose machine runs many programs and can be updated for new tasks, so one device covers work, communication, and media.',
      cost:
        'It carries layers of software, configuration choices, and security exposure that a fixed-function appliance avoids.',
      verdict:
        'Use general-purpose computers where needs change; use locked appliances where a single task must be cheap, reliable, and hard to misuse.',
    },
    terms: [
      {
        term: 'Stored-program concept',
        definition:
          'The design idea that a computer keeps both instructions and data in memory, so loading a different program changes what the machine does.',
      },
      {
        term: 'Bootloader',
        definition:
          'A small program that runs after firmware and loads the operating system kernel into memory.',
      },
    ],
    keyTakeaways: [
      'Input, processing, output, storage, and control describe every computer system.',
      'Stored programs let one machine change behavior by loading new instructions.',
      'Firmware starts before the OS and loads the bootloader.',
      'Clear interfaces let components change without breaking the system.',
    ],
    pitfalls: [
      'Assuming the CPU is always the bottleneck; storage, network, and input devices often are.',
      'Calling any slow device broken before testing input and output separately.',
      'Confusing firmware with the operating system; firmware runs before the OS loads.',
    ],
    focusPoints: [
      'Trace one familiar task through input, processing, storage, and output.',
      'Explain why storing instructions in memory makes computers general-purpose.',
      'Order the boot stages correctly.',
    ],
    quiz: [
      {
        question: 'Which component runs first when a PC is powered on?',
        options: [
          'The operating system kernel',
          'The web browser',
          'The UEFI firmware',
          'The login shell',
        ],
        answer: 2,
        explanation:
          'UEFI firmware runs the power-on self-test and chooses a boot device before any operating system code executes.',
      },
      {
        question: 'Why can one laptop run both a spreadsheet and a video game?',
        options: [
          'It has separate hardware for each task',
          'Its instructions are stored in memory and loaded as needed',
          'The CPU is rewired for each program',
          'The screen changes the program',
        ],
        answer: 1,
        explanation:
          'The stored-program design keeps instructions in memory, so the same hardware can run different software. No rewiring is needed.',
      },
    ],
  },

  {
    chapterId: 'hardware-and-software',
    hook:
      'A printer can be perfectly healthy and still print nonsense, because the thing that failed was not plastic or metal. It was the conversation between two pieces of software.',
    plainEnglish:
      'Hardware is the physical parts you can touch, and software is the instructions that tell those parts what to do.',
    oneIdea:
      'Hardware provides capabilities; software supplies behavior, and the two only work together when both sides follow the same interface contract.',
    whyItMatters:
      'Most "broken" devices are actually mismatches: a driver for the wrong model, an app that needs a newer OS, or a cable that fits but cannot carry the required signal. Separating physical from logical faults saves time and money.',
    objectives: [
      'Distinguish hardware from software with concrete examples.',
      'Explain where firmware and embedded software sit.',
      'Describe the role of a driver as a translator.',
      'Diagnose compatibility problems as interface mismatches.',
    ],
    sections: [
      {
        title: 'Physical versus logical',
        body:
          'Hardware is the physical equipment: the processor, memory chips, circuit boards, disk drives, cables, and peripherals. Software is the set of instructions and configuration that tells that equipment what to do: the operating system, applications, drivers, and settings. Hardware sets physical limits. A machine with 4 GB of RAM (random-access memory) cannot keep 8 GB of active data in memory, and a 60 Hz display cannot show more than 60 distinct frames per second. Software decides how well those limits are used. A fast processor running wasteful code can lose to a slower one running efficient code. Hardware wears out; software is copied, patched, and rolled back.',
      },
      {
        title: 'Firmware and embedded software',
        body:
          'Firmware is software stored on a hardware device, usually in flash memory, and treated as part of that device. A motherboard has boot firmware, a solid-state drive (SSD) has controller firmware, and a printer has firmware that runs its motors and paper path. Embedded software is the broader label for programs inside a dedicated product: a washing machine cycle, the anti-lock brakes in a car, a pacemaker. It is still software, but users rarely install it and may never see it. The line is about packaging and role, not a different kind of physics. Firmware updates can fix bugs, but a failed update can leave a device unusable, so they deserve care.',
      },
      {
        title: 'Drivers as translators',
        body:
          'A driver is software that lets the operating system talk to a specific piece of hardware. An application does not need to know how a printer draws letters; it asks the OS to print a page. The OS passes the request to the printer driver, which translates it into commands that printer model understands. Graphics drivers do the same for drawing commands and graphics processing unit (GPU) instructions. The driver is the translator between a general request and a device-specific language. Because it runs with deep system access, a faulty driver can crash the machine or drain a battery. That is why operating systems prefer signed, tested drivers and why the correct version matters.',
      },
      {
        title: 'Compatibility and interfaces',
        body:
          'Compatibility means two parts agree on every layer of their interface: the physical connector, the electrical signals, the protocol, and the data format. A USB-C plug fits many devices, but not every USB-C port carries video or delivers the same power. The shape agrees while the capabilities do not. Software has the same problem. An application built for one version of an operating system or library may call functions that the older version lacks. Backward compatibility is the deliberate promise that old software still runs on a new platform. When buying or upgrading, check the full specification and version, not just whether the connector fits.',
      },
    ],
    example: {
      title: 'The school printer that printed hieroglyphics',
      scenario:
        'A school replaces its office printer with a newer model of the same brand. Staff can print, but pages come out with garbled symbols and huge gaps. The test page printed from the printer menu is perfect.',
      steps: [
        {
          action:
            'Print the built-in test page and a plain text file from a USB stick.',
          result:
            'Both look correct, so the printer hardware and its internal firmware are healthy.',
        },
        {
          action:
            'Compare the installed driver with the printer model and check the driver selected in the print queue.',
          result:
            'The computer is still using the old model driver, which sends commands the new printer interprets differently.',
        },
        {
          action:
            'Install the vendor driver for the exact new model, restart the print service, and print a 5-page mixed document.',
          result:
            'Text, tables, and images all render correctly, and the queue reports no errors.',
        },
      ],
      conclusion:
        'Nothing physical was broken. The failure was in the translation layer. Checking the device independently from the driver localized the fault in minutes.',
    },
    tradeoff: {
      gain:
        'Vendor-tested hardware and software work together, updates arrive as one package, and support has one owner.',
      cost:
        'Repairs and upgrades usually go through the vendor, choice is limited, and leaving the ecosystem can mean replacing working parts.',
      verdict:
        'Choose integration when reliability and single-owner support matter more than flexibility; choose open components when price, repairability, and custom fit matter more.',
    },
    terms: [
      {
        term: 'Driver',
        definition:
          'Software that translates general operating-system requests into the specific commands a hardware device understands.',
      },
      {
        term: 'Firmware',
        definition:
          'Software stored in nonvolatile memory on a device that controls its basic operation and starts it up.',
      },
    ],
    keyTakeaways: [
      'Hardware is physical; software is instructions and configuration.',
      'Firmware and embedded software are software packaged inside devices.',
      'Drivers translate between the operating system and specific hardware.',
      'Compatibility requires agreement at every interface layer, not just a matching plug.',
    ],
    pitfalls: [
      'Assuming a matching connector means full compatibility.',
      'Replacing hardware before checking whether the driver or firmware is wrong.',
      'Treating firmware as something that never needs updates or maintenance.',
    ],
    focusPoints: [
      'Given a fault, decide whether it is physical, logical, or an interface mismatch.',
      'Explain the job of a driver in one sentence.',
      'List the layers where two devices must agree to be compatible.',
    ],
    quiz: [
      {
        question: 'What is the main job of a device driver?',
        options: [
          'To physically connect the device',
          'To store the files on the device',
          'To increase the clock speed of the device',
          'To translate operating-system requests into device-specific commands',
        ],
        answer: 3,
        explanation:
          'The driver translates general OS requests into commands the device understands. The cable and connector handle the physical link; they do not translate commands.',
      },
      {
        question:
          'A USB-C cable plugs in but the external monitor stays dark. What is the most likely explanation?',
        options: [
          'USB-C ports always support video',
          'The monitor needs a new operating system',
          'The cable or port does not carry the required video signal',
          'The keyboard is unplugged',
        ],
        answer: 2,
        explanation:
          'USB-C is a connector shape with optional capabilities such as video and power delivery. A matching plug does not guarantee every feature, so check the cable and port specifications.',
      },
    ],
  },

  {
    chapterId: 'data-information-knowledge',
    hook:
      'The number 42 on a screen is not automatically an answer. It could be a temperature, an age, a price, or the number of failed logins, and the difference decides what you do next.',
    plainEnglish:
      'Data is raw facts, information is data with context and meaning, and knowledge is the understanding that helps you decide what to do.',
    oneIdea:
      'Value comes from the chain data to information to knowledge, and each step depends on context, quality, and human judgment.',
    whyItMatters:
      'Dashboards, reports, and AI (artificial intelligence) outputs are only as good as the data and context behind them. Learning to ask "compared with what, measured how, and missing whom?" prevents expensive decisions based on confident-looking nonsense.',
    objectives: [
      'Distinguish data, information, and knowledge.',
      'Explain how metadata supplies context.',
      'Evaluate information quality on five dimensions.',
      'Recognize how a dashboard can mislead.',
    ],
    sections: [
      {
        title: 'Data: raw symbols',
        body:
          'Data is a recording of facts or symbols without the context needed to interpret it. A database row might contain 38.6, 2026-11-27, S-104, and 0.42. Those values could be a temperature, a date, a patient ID, and a discount rate, but the row alone does not say. Data can be structured, like columns in a table, or unstructured, like photos, audio, and free text. It is not automatically true: a sensor can drift, a clerk can mistype a postcode, and a form can accept impossible dates. Data is the raw material, not yet a message.',
      },
      {
        title: 'Information: data plus context',
        body:
          'Information is data placed in context so it answers a question. Context comes from metadata: what the value measures, its unit, when and where it was captured, who recorded it, and how it is defined. The value 38.6 becomes information when you know it is a body temperature in Celsius taken at 14:05 from patient S-104, which suggests a fever. The same number as an outdoor temperature suggests a dangerously hot day. Organizations often argue about a metric because two teams define it differently: revenue before or after refunds, for example. Agreeing on definitions is not paperwork; it is what makes comparison possible.',
        code: String.raw`{
  "value": 38.6,
  "unit": "celsius",
  "measuredAt": "2026-11-27T14:05:00Z",
  "patientId": "S-104",
  "method": "ear thermometer",
  "source": "ward-3-vitals"
}`,
      },
      {
        title: 'Information quality',
        body:
          'Information quality is judged on several dimensions. Accuracy asks whether the value matches reality. Completeness asks whether required fields are present. Timeliness asks whether it is current enough for the decision. Consistency asks whether the same fact agrees across systems. Relevance asks whether it actually informs the question being asked. A customer address can be accurate but five years old, a report can be complete but a week late, and two systems can hold different phone numbers for the same person. Poor input produces poor output, no matter how polished the dashboard. Quality is not free, so teams should measure error rates where the cost of a wrong decision is highest.',
      },
      {
        title: 'Knowledge and decisions',
        body:
          'Knowledge is the understanding that lets someone act: recognizing patterns, knowing which rules apply, and anticipating consequences. It lives in people, procedures, and models, not just in tables. A school can report that average test scores rose 6 points, which is information. Knowledge is noticing that 40 lower-scoring students transferred out, so the remaining group looks better without anyone improving. That understanding changes the decision from "the new teaching method worked" to "check results student by student." Information becomes knowledge through interpretation and experience. Software can present information and even suggest patterns, but accountable decisions still need a person who understands the context.',
      },
    ],
    example: {
      title: 'The cafe chain with growing revenue and shrinking profit',
      scenario:
        'A 12-cafe chain sees revenue up 4 percent on its weekly dashboard. The operations director proposes opening two more cafes. The finance analyst asks for the underlying data before the meeting.',
      steps: [
        {
          action:
            'Pull the raw sales rows for the last 8 weeks and separate new stores from stores open at least a year.',
          result:
            'Three cafes opened in that period. Same-store revenue is down 3 percent, while new stores add enough sales to make the total look positive.',
        },
        {
          action:
            'Add context: discount rate, refunds, food costs, and staff hours per cafe.',
          result:
            'Discounts rose from 8 to 17 percent of sales and food costs rose 6 percent, so gross margin fell 5 points.',
        },
        {
          action:
            'Present two views to the director: total revenue and same-store margin, with definitions on the slide.',
          result:
            'The director sees that growth is bought with discounts and new locations, not stronger existing cafes, and pauses expansion.',
        },
      ],
      conclusion:
        'The dashboard was not lying; it was answering a different question. Adding context turned a misleading total into knowledge that changed the decision.',
    },
    tradeoff: {
      gain:
        'Fresh data lets staff react quickly to outages, fraud, or demand spikes.',
      cost:
        'Real-time numbers are often incomplete, provisional, and differently defined across systems, so they can trigger wrong actions.',
      verdict:
        'Use real-time views for operational signals with clear definitions, and verified reports for financial or strategic decisions where accuracy matters more than speed.',
    },
    terms: [
      {
        term: 'Metadata',
        definition:
          'Data about data: the name, unit, timestamp, source, and definition that give a value meaning.',
      },
      {
        term: 'Information quality',
        definition:
          'The degree to which information is accurate, complete, timely, consistent, and relevant for its intended use.',
      },
    ],
    keyTakeaways: [
      'Data is raw; information is data with context; knowledge is understanding that guides action.',
      'Metadata supplies the unit, time, source, and definition that make data interpretable.',
      'Quality has several dimensions, and a polished dashboard cannot fix bad input.',
      'Aggregates can hide what is happening underneath; always ask what changed.',
    ],
    pitfalls: [
      'Treating a number as meaningful without its unit, time, and definition.',
      'Judging information only by whether it looks accurate, while ignoring completeness and timeliness.',
      'Comparing metrics from two teams that define them differently.',
    ],
    focusPoints: [
      'Turn one raw value into information by adding metadata.',
      'Name the five quality dimensions and give an example of each.',
      'Explain how an aggregate can mislead even when every number is correct.',
    ],
    quiz: [
      {
        question:
          'A patient record shows 38.6 with no unit. What is missing that would turn this into information?',
        options: [
          'More decimal places',
          'A pie chart',
          'A faster database',
          'Metadata such as unit, time, and measurement method',
        ],
        answer: 3,
        explanation:
          'A value without a unit, timestamp, or method cannot be interpreted; metadata supplies that context. More decimal places or a chart do not create meaning.',
      },
      {
        question:
          'Total revenue rises 4 percent while same-store sales fall 3 percent. What best explains the gap?',
        options: [
          'The data must be fake',
          'New stores or acquisitions added revenue',
          'Inflation always increases revenue',
          'The dashboard cannot add',
        ],
        answer: 1,
        explanation:
          'Total revenue includes new locations, while same-store sales compare only locations open in both periods. Inflation might lift prices, but it does not explain why the existing stores sold less.',
      },
    ],
  },

  {
    chapterId: 'cpu',
    hook:
      'A CPU can execute billions of instructions every second and still make you wait, because speed is not one number. It is a cycle, repeated with incredible regularity.',
    plainEnglish:
      'The CPU, or central processing unit, is the part of a computer that follows instructions one small step at a time, billions of times per second.',
    oneIdea:
      'Performance is the instruction cycle repeated over time, shaped by clock speed, cores, caches, and how well the program can be parallelized.',
    whyItMatters:
      'When a computer feels slow, the cause might be a single slow core, too few cores for the workload, a cache miss, or a program that cannot run work in parallel. Knowing the cycle tells you which upgrade or fix can actually help.',
    objectives: [
      'Describe fetch, decode, execute, and write back.',
      'Explain the roles of registers and the program counter.',
      'Distinguish cores, threads, and clock speed.',
      'Explain how caches and pipelining hide memory delays.',
    ],
    sections: [
      {
        title: 'The instruction cycle',
        body:
          'Every program, however complex, is a sequence of small instructions. The CPU repeats four stages. Fetch reads the next instruction from the address in the program counter. Decode works out what the instruction means: add, load, jump, or compare. Execute performs the operation, using the arithmetic unit, registers, or memory. Write back stores the result in a register or memory. Then the program counter moves on, unless a branch changes it. A single instruction may take several clock cycles, and different instructions take different times. The cycle is the heartbeat that every performance number ultimately describes.',
        code: String.raw`LOAD  R1, [1000]   ; R1 = value at address 1000
LOAD  R2, [1004]   ; R2 = value at address 1004
ADD   R3, R1, R2   ; R3 = R1 + R2
STORE R3, [1008]   ; save result`,
      },
      {
        title: 'Registers and the program counter',
        body:
          'Registers are the private scratch space of the CPU: a handful of storage slots, each holding a number or address. They are the fastest storage in the machine because they sit inside the processor. General-purpose registers hold operands and intermediate results. The program counter holds the address of the next instruction, the instruction register holds the one being decoded, and status flags record conditions such as a zero result or an overflow beyond the register size. A 64-bit register can address far more memory than a 32-bit one. Compilers work hard to keep frequently used variables in registers. When the operating system switches between programs, it saves and restores these registers so each program can resume exactly where it stopped.',
      },
      {
        title: 'Cores, threads, and clock speed',
        body:
          'Clock speed counts cycles per second: a 3.5 gigahertz (GHz) processor completes 3.5 billion cycles each second. That does not mean 3.5 billion instructions, because each instruction may need several cycles and some cores do more work per cycle than others. A core is an independent execution unit with its own registers and pipeline. A thread is a stream of instructions; a core can run one or more threads, and simultaneous multithreading lets two threads share the execution units of one core. Two threads on one core do not double performance. More cores help work that can be split, such as encoding several videos, but a single-threaded task uses one core no matter how many are idle.',
      },
      {
        title: 'Caches, pipelines, and locality',
        body:
          'Pipelining overlaps the stages of different instructions, so while one is executing, the next is decoding and a third is being fetched. Pipelining is instruction-level parallelism in action. Ideally the pipeline finishes about one instruction per cycle, but hazards, such as waiting for a value, stall it. If the branch predictor, which guesses which path a branch will take, guesses wrong, several stages of work are flushed. Caches fight a related problem: memory is slow compared with the CPU. Small, fast caches hold recently used instructions and data, relying on temporal locality (reuse soon) and spatial locality (nearby addresses). A cache hit costs a few cycles; a miss to main memory can cost around a hundred. Performance comes from keeping the pipeline fed, not just from a big clock number.',
      },
    ],
    example: {
      title: 'The 40-minute video export',
      scenario:
        'A content creator exports a 10-minute 4K video. The laptop has 8 cores, but the export takes 40 minutes and Task Manager shows one core near 100 percent while the others are mostly idle.',
      steps: [
        {
          action:
            'Watch per-core usage and the encoder settings during a short 1-minute test export.',
          result:
            'Only one core is saturated, so the encoding work is largely single-threaded; extra cores cannot help that stage.',
        },
        {
          action:
            'Enable the graphics processor hardware encoder and run the same 1-minute test, comparing both time and visual quality.',
          result:
            'Export time drops from 4 minutes to 1 minute 10 seconds, with a small quality difference visible only in high-motion scenes.',
        },
        {
          action:
            'Choose the graphics processor encoder for a draft review, then run the final master on the CPU overnight with a slower preset.',
          result:
            'The draft arrives in minutes, and the final file keeps the quality the creator wants without blocking the afternoon.',
        },
      ],
      conclusion:
        'The bottleneck was one thread, not the whole CPU. Matching the encoder to the workload delivered a draft more than three times faster without buying a new machine.',
    },
    tradeoff: {
      gain:
        'Higher clocks speed up each thread, which helps interactive and single-threaded work; more cores raise throughput for parallel jobs.',
      cost:
        'High clocks produce heat and draw power, while extra cores sit idle when software cannot split the work, and splitting work adds coordination overhead.',
      verdict:
        'Pick fast cores for responsiveness and apps that use few threads; pick more cores for rendering, compiling, virtual machines, and servers with parallel workloads.',
    },
    terms: [
      {
        term: 'Register',
        definition:
          'A small, very fast storage location inside the CPU that holds operands, addresses, or status information.',
      },
      {
        term: 'Clock speed',
        definition:
          'The number of cycles a processor completes per second, measured in gigahertz (billions of cycles per second).',
      },
    ],
    keyTakeaways: [
      'The CPU repeats fetch, decode, execute, and write back.',
      'Registers and the program counter hold the state of the running program.',
      'Cores and threads help only when work can be divided.',
      'Caches and pipelines keep the CPU supplied with work.',
    ],
    pitfalls: [
      'Comparing clock speed across different processor designs as if it were a complete measure of speed.',
      'Assuming a program will use all cores just because they exist.',
      'Confusing threads with physical cores; two threads on one core share its execution units.',
    ],
    focusPoints: [
      'Trace one instruction through all four stages.',
      'Explain why a single-threaded task leaves most cores idle.',
      'Use the terms latency and throughput correctly for CPU work.',
    ],
    quiz: [
      {
        question: 'Which stage determines that an instruction is an ADD rather than a LOAD?',
        options: ['Fetch', 'Decode', 'Write back', 'Boot'],
        answer: 1,
        explanation:
          'Decode interprets the instruction bits and determines the operation. Fetch only retrieves the instruction from memory.',
      },
      {
        question:
          'A video exporter uses one core heavily and leaves seven idle. What is the best explanation?',
        options: [
          'The other cores are broken',
          'The CPU has no cache',
          'The encoding work is largely one-at-a-time and cannot use the idle cores',
          'The clock speed is zero',
        ],
        answer: 2,
        explanation:
          'The encoder is limited by a part of its work that must run in sequence, so extra cores sit idle. Idle cores do not mean the others are broken.',
      },
    ],
  },

  {
    chapterId: 'memory-storage',
    hook:
      'The fastest memory in a computer holds only a handful of numbers, while the slowest holds years of video. That gap is not a design flaw; it is the deal that makes computing affordable.',
    plainEnglish:
      'Memory and storage are places a computer keeps data, arranged from tiny and extremely fast to huge and much slower.',
    oneIdea:
      'The memory hierarchy trades capacity and cost against speed, and software performs well when it keeps the working set close to the CPU.',
    whyItMatters:
      'Adding RAM, buying an SSD, or choosing a laptop all depend on the same hierarchy. Understanding it tells you which upgrade fixes a slow machine and which one just moves the bottleneck.',
    objectives: [
      'Distinguish volatile from nonvolatile memory.',
      'Order the memory hierarchy by speed, size, and cost.',
      'Distinguish latency from bandwidth.',
      'Explain locality, working sets, and thrashing.',
    ],
    sections: [
      {
        title: 'Volatile versus nonvolatile',
        body:
          'Volatile memory loses its contents when power is removed. Registers, caches, and RAM (random-access memory) are volatile. Nonvolatile storage keeps data without power: solid-state drives (SSDs), hard disks, USB flash, and tape. This is why unsaved work disappears in a power cut while files already saved survive. RAM is the desk where active work sits; storage is the filing cabinet. Sleep mode keeps RAM powered so the desk stays as it was, while hibernation copies RAM to disk and powers off. Solid-state storage is nonvolatile, but it is not permanent: cells wear out and unused drives can lose data after years without power, so important data still needs backups.',
      },
      {
        title: 'The hierarchy',
        body:
          'The hierarchy arranges memory by speed, size, and cost. Registers sit inside the CPU and hold a few hundred bytes (one byte is eight bits). Closely behind are L1, L2, and L3 caches, which hold recently used data in kilobytes to megabytes. RAM holds gigabytes but is much slower than cache. Solid-state drives (SSDs), including fast NVMe models, hold hundreds of gigabytes to several terabytes and are slower again; NVMe is a fast interface between an SSD and the CPU. Hard disks and tape trade speed for very low cost per terabyte. As you move down, capacity grows and cost per gigabyte falls, while latency rises by orders of magnitude. The numbers below are typical orders of magnitude, not guarantees; designs and generations vary.',
        code: String.raw`Level        Typical latency      Typical capacity
Registers    < 1 ns               hundreds of bytes
L1 cache     ~1 ns                32-64 KB per core
L2 cache     ~4 ns                256 KB-2 MB per core
L3 cache     ~10-20 ns            8-64 MB shared
RAM          ~80-100 ns           8-128 GB
NVMe SSD     ~50-100 microseconds 256 GB-4 TB
Hard disk    ~5-10 milliseconds   1-20 TB
Tape         seconds to minutes   many TB (offline)
KB = kilobyte, MB = megabyte, GB = gigabyte, TB = terabyte`,
      },
      {
        title: 'Latency and bandwidth',
        body:
          'Latency is how long one request takes; bandwidth is how much data can move per second. They are different problems. A truck carrying a thousand hard disks across the country has enormous bandwidth but terrible latency for a single file. A solid-state drive usually wins on both counts, especially random reads, while a hard disk can stream large files quickly but takes milliseconds to reach a random spot. Systems also queue requests: under load, waiting time grows even if the raw bandwidth of the device is unchanged. A video call needs low latency more than high bandwidth; a backup job needs sustained bandwidth more than instant response. Measure the one that matches the task.',
      },
      {
        title: 'Locality and working sets',
        body:
          'Programs rarely touch memory randomly. Temporal locality means recently used data is likely to be used again soon, such as a loop counter. Spatial locality means nearby addresses are likely to be used together, which is why caches fetch a whole line, often 64 bytes, instead of one byte. The working set is the set of data a program actively needs during a period. If the working set fits in RAM, the machine runs smoothly. If it does not, the operating system swaps fixed-size pages of memory to storage, and the machine can spend more time moving pages than doing work, a condition called thrashing. This is why many small tabs can make a laptop crawl even when the CPU is idle.',
      },
    ],
    example: {
      title: 'The 8 GB laptop with 30 tabs',
      scenario:
        'A laptop used by a student has 8 GB of RAM and a fast SSD. With a browser, a video call, and a design app open, it becomes unresponsive; the storage activity indicator stays on and the fan is loud.',
      steps: [
        {
          action:
            'Open the system resource monitor and record memory usage, the memory committed to running programs, and storage activity while reproducing the slowdown.',
          result:
            'RAM is 96 percent full, committed memory exceeds physical memory, and the SSD is busy almost constantly.',
        },
        {
          action:
            'Close the design app and half the tabs, then repeat the same workload.',
          result:
            'RAM drops to 70 percent, storage activity falls, and switching tabs becomes responsive again, confirming memory pressure rather than a slow CPU.',
        },
        {
          action:
            'Upgrade from 8 GB to 16 GB of RAM and set the browser to suspend inactive tabs.',
          result:
            'The full workload now fits in memory with headroom, paging nearly stops, and the laptop stays responsive during video calls.',
        },
      ],
      conclusion:
        'The SSD was fast, but it was being used as overflow for RAM, and storage is hundreds of times slower. The right fix was more memory for the working set, not a faster disk.',
    },
    tradeoff: {
      gain:
        'More RAM keeps the working set in memory, eliminating paging and keeping the CPU supplied.',
      cost:
        'RAM is expensive per gigabyte and limited by slots and platform; unused capacity does nothing.',
      verdict:
        'If the machine pages under a normal workload, add RAM first; if launches and file loads are slow but memory pressure is low, a faster SSD gives more benefit.',
    },
    terms: [
      {
        term: 'Volatile memory',
        definition:
          'Memory that loses its stored contents when electrical power is removed, such as RAM and CPU caches.',
      },
      {
        term: 'Working set',
        definition:
          'The amount of data and code a program actively uses during a period; if it exceeds available RAM, the system pages and slows down.',
      },
    ],
    keyTakeaways: [
      'Volatile memory needs power; nonvolatile storage keeps data without it.',
      'The hierarchy trades capacity and cost against speed, from registers to tape.',
      'Latency and bandwidth measure different things and must be matched to the task.',
      'Performance depends on keeping the working set in fast memory.',
    ],
    pitfalls: [
      'Calling an SSD "memory" in the same sense as RAM; one is volatile working space, the other is nonvolatile storage.',
      'Buying a faster SSD to fix a machine that is short on RAM and paging heavily.',
      'Judging storage only by capacity while ignoring random-read latency and endurance.',
    ],
    focusPoints: [
      'Order the hierarchy from registers to tape by speed and capacity.',
      'Explain the difference between latency and bandwidth with an example.',
      'Diagnose paging from memory usage and disk activity.',
    ],
    quiz: [
      {
        question: 'Which statement about RAM is correct?',
        options: [
          'It keeps data after power is removed',
          'It is always slower than an SSD',
          'It stores the operating system permanently',
          'It is volatile and holds active programs and data',
        ],
        answer: 3,
        explanation:
          'RAM is volatile and holds active code and data; it loses contents without power. An SSD is nonvolatile but slower than RAM.',
      },
      {
        question:
          'A laptop with 8 GB of RAM and an SSD slows down with many apps open, and storage activity is constant. What is the most likely cause?',
        options: [
          'The CPU clock is too low',
          'The monitor refresh rate is too high',
          'The working set exceeds RAM, so the system pages to storage',
          'The SSD has no firmware',
        ],
        answer: 2,
        explanation:
          'Constant storage activity with high memory use is the signature of paging when the working set exceeds RAM. A low clock would slow computation, but it would not by itself cause continuous storage activity.',
      },
    ],
    walkthrough: 'system',
  },
];
