import type { ITLesson } from './types';

export const group2Lessons: ITLesson[] = [
  {
    chapterId: 'input-output',
    hook:
      'Your keyboard, mouse, and monitor are not one system; they are three negotiations happening thousands of times a second.',
    plainEnglish:
      'Input devices send information into a computer, output devices present results, and controllers plus drivers handle the details so the processor does not have to.',
    oneIdea:
      'The CPU never touches a keyboard directly; a controller translates the device signals into a standard form, and a driver tells the operating system how to talk to that controller.',
    whyItMatters:
      'Most support tickets begin at the edge of the system: a device that will not connect, a display that looks wrong, or a printer that jams. Understanding controllers, drivers, and interrupts turns "it just broke" into a diagnostic path.',
    objectives: [
      'Distinguish input devices from output devices, including devices that do both.',
      'Describe the roles of device controllers and drivers in the I/O path.',
      'Compare interrupts with polling and explain when each is appropriate.',
      'Evaluate display resolution, print resolution, ergonomics, and accessibility choices.',
    ],
    sections: [
      {
        title: 'Input, Output, and the Devices In Between',
        body:
          'An input device converts something in the physical world into data the computer can process: a keyboard reports key presses, a microphone samples sound, and a sensor reports temperature. An output device does the reverse, turning data into something people or machines can use, such as a display, a speaker, or a motor. Some devices do both. A touchscreen displays an image and senses a finger, and a headset contains both a microphone and speakers. The distinction is about the direction of information flow at a given moment, not about the shape of the hardware.',
      },
      {
        title: 'Controllers and Drivers: The Translation Layer',
        body:
          'The CPU is fast and standardized; peripherals are slow and varied. A device controller is the chip on the device or motherboard that operates the device hardware and presents a standard interface. A driver is the software that tells the operating system how to command that controller. When you press a key, the keyboard controller detects the row and column, packages a scan code, and sends it over USB. The USB host controller receives it, and the keyboard driver turns the scan code into a character event. This layering lets one operating system support thousands of different devices.',
      },
      {
        title: 'Interrupts vs Polling',
        body:
          'Polling means the CPU repeatedly asks a device whether it has new data. It is simple, but every check costs instructions, and a fast device can be missed between checks. An interrupt is a signal that makes the CPU pause its current work, run a short handler, and then resume. A keyboard might generate an interrupt only when a key changes. A gaming mouse set to 1,000 Hz polling reports its position every millisecond, deliberately trading CPU time for low, predictable latency. Most systems use interrupts for occasional events and polling for high-rate streams where one interrupt per sample would cost more than the checks.',
      },
      {
        title: 'Resolution, Ergonomics, and Accessibility',
        body:
          'A 1920×1080 display has 2,073,600 pixels, but sharpness also depends on physical size and viewing distance. The same resolution on a 24-inch monitor looks crisper than on a 32-inch one because the pixels are denser. Printers use dots per inch: 300 dpi is fine for office text, while photo printing often uses 600 dpi or more. Ergonomics matters too: monitor height, keyboard angle, and lighting prevent strain. Accessibility features such as screen readers, captions, high contrast modes, and alternative input devices are not extras; they determine whether a person can use the system at all.',
      },
    ],
    example: {
      title: 'The Barcode Scanner That Stopped Mid-Shift',
      scenario:
        'A grocery store has three checkout lanes. On lane 2 the barcode scanner laser is on, but scanned items do not appear on screen. The same point-of-sale software works on lane 1.',
      steps: [
        {
          action: 'Test the lane 2 scanner on the known-good lane 1 port.',
          result:
            'It scans normally, proving the scanner hardware and its driver are working.',
        },
        {
          action: 'Reconnect it to lane 2 and inspect the port and cable.',
          result:
            'The connector is loose, and wiggling it produces intermittent beeps, so the port is worn.',
        },
        {
          action: 'Move the scanner to a spare rear USB port and scan three items.',
          result:
            'All three items appear, the system log shows a stable USB connection, and lane 2 reopens.',
        },
      ],
      conclusion:
        'The fault was the port, not the scanner or the software. Testing one layer at a time separated device, driver, and connection, which is faster than reinstalling drivers at random.',
    },
    tradeoff: {
      gain:
        'Wireless peripherals remove cable clutter, allow easy switching between devices, and make meeting rooms and mobile setups simpler.',
      cost:
        'They need batteries or charging, can suffer radio interference, add slightly less consistent latency, and introduce pairing and security concerns.',
      verdict:
        'Use wired peripherals for fixed desks and latency-sensitive work; use wireless for portability and shared spaces, and keep a spare cable for troubleshooting.',
    },
    terms: [
      {
        term: 'Device controller',
        definition:
          "A chip that operates a peripheral's hardware and exposes a standard interface to the rest of the computer.",
      },
      {
        term: 'Interrupt',
        definition:
          'A signal from hardware or software that asks the CPU to stop its current task briefly and run a handler.',
      },
    ],
    keyTakeaways: [
      'Input devices capture data from the world; output devices present data to it, and hybrid devices do both.',
      'A controller handles electrical details, a driver translates commands, and the operating system coordinates access.',
      'Interrupts are efficient for occasional events; polling is predictable but consumes CPU time.',
      'Resolution and DPI only make sense alongside physical size, viewing distance, and the task.',
    ],
    pitfalls: [
      'Assuming a device that powers on is communicating; power and data can travel over different wires.',
      'Reinstalling drivers before checking cables, ports, and whether the device works on another machine.',
      'Comparing displays by resolution alone, when pixel density depends on size and viewing distance.',
    ],
    focusPoints: [
      'The path from device signal to controller to driver to application.',
      'When to use interrupts versus polling.',
      'Reading specification numbers in context, including accessibility needs.',
    ],
    quiz: [
      {
        question: 'Why does a keyboard not send characters directly into the CPU?',
        options: [
          'Its controller sends scan codes or reports, and the driver translates them into characters.',
          'The CPU has no electrical connection to any peripheral.',
          'Characters are stored on the disk before they appear on screen.',
          'The monitor converts keystrokes into characters.',
        ],
        answer: 0,
        explanation:
          'The keyboard controller handles scanning and USB reporting, and the operating system driver maps those reports to characters. The CPU never reads raw key switches, and the monitor only displays the result. The monitor choice reverses input and output.',
      },
      {
        question: 'A gaming mouse advertises a 1,000 Hz polling rate. What does that mean?',
        options: [
          'It reports its position 1,000 times per second, even if it has not moved.',
          'It can track movement up to 1,000 inches per second.',
          'It uses 1,000 dpi of sensitivity.',
          'It sends an interrupt exactly once per second.',
        ],
        answer: 0,
        explanation:
          'Polling rate is how often a report is exchanged with the host; 1,000 Hz equals one report per millisecond. DPI measures sensitivity, not report frequency. High polling can improve latency at the cost of more USB traffic and CPU work.',
      },
    ],
  },
  {
    chapterId: 'motherboard-buses',
    hook:
      'A computer is often limited not by its fastest component but by the roads connecting the components.',
    plainEnglish:
      'The motherboard is the main circuit board that connects the processor, memory, storage, and ports, while buses are the shared paths that carry data between them.',
    oneIdea:
      'The chipset and buses decide which components can talk to each other and how fast, so the slowest link in a workflow sets the ceiling for the whole machine.',
    whyItMatters:
      'Upgrades and repairs fail at the motherboard more often than anywhere else: the wrong socket, a slot with fewer lanes, or a power supply without the right connector. Reading a board as a map prevents expensive mistakes.',
    objectives: [
      'Identify the motherboard sockets, slots, chipset, and power delivery components.',
      'Distinguish the system bus from I/O buses and describe what each connects.',
      'Compare PCIe, USB, SATA, and HDMI by purpose, direction, and typical use.',
      'Diagnose a bottleneck and check compatibility before buying an upgrade.',
    ],
    sections: [
      {
        title: 'The Board as a City Plan',
        body:
          'The motherboard is the main printed circuit board that physically and electrically connects the components. It provides the CPU socket, memory slots, expansion slots, storage connectors, and rear ports. The chipset is a set of chips that routes traffic between the CPU, storage, USB, and other peripherals; on modern boards it is usually one chip called the platform controller hub. Voltage regulator modules convert the power supply output into the roughly one volt a CPU needs. The form factor, such as ATX or micro-ATX, determines the board size and which cases and power supplies fit.',
      },
      {
        title: 'Buses: The Roads Data Travels',
        body:
          'A bus is a shared set of electrical paths for addresses, data, and control signals. Early computers used one front-side bus shared by all devices, so a slow device could waste time. Modern systems use point-to-point links instead: the CPU reaches memory through a dedicated memory bus and reaches the chipset through a dedicated high-speed link, such as Intel Direct Media Interface. PCI Express extends the same idea with independent lanes, while external I/O buses such as USB connect peripherals. The key mental model is capacity: width times transfers per second, minus overhead.',
      },
      {
        title: 'PCIe, USB, SATA, and HDMI',
        body:
          'These interfaces look similar as ports but serve different jobs. PCIe is an internal, point-to-point bus organized in lanes; an x16 slot gives a graphics card up to sixteen lanes. USB is a hot-pluggable external bus that carries both power and data and supports hubs. SATA connects internal drives at up to about 600 MB/s. HDMI carries digital video and audio to a display and also supports control signals. A USB 3.2 Gen 2 port moves about 1.25 GB/s, while HDMI 2.1 carries up to 48 Gbps, so numbers from different interfaces are not interchangeable. Matching the interface to the job prevents both wasted money and physical incompatibility.',
        code: `Interface  Typical use                    Direction               Cabling
PCIe       GPU, NVMe SSD, add-in card     internal, bidirectional slot or M.2
USB        Keyboard, phone, external SSD  external, bidirectional cable or hub
SATA       Hard drive, 2.5-inch SSD       internal, bidirectional data plus power
HDMI       Monitor, TV, projector         one-way video and audio  cable`,
      },
      {
        title: 'Power, Cooling, and Bottlenecks',
        body:
          'Fast components still need power and heat removal. A CPU voltage regulator, a graphics card, and several drives all draw from the power supply. A 450-watt supply may be fine for an office PC but not for a high-end graphics card that alone wants 300 watts and special connectors. Fans and heatsinks move heat into the case, and airflow must have a path out. A bottleneck is the slowest part of a workflow. Putting a PCIe 5.0 SSD in a laptop limited by a dual-core CPU will not make code compile much faster, because the processor is the constraint.',
      },
    ],
    example: {
      title: 'The Graphics Card That Fit but Crawled',
      scenario:
        'A student buys a used workstation with a 650 W power supply and a long PCIe x16 slot. A friend gives them a large graphics card. Games run, but the card reports only four lanes and frame rates are poor.',
      steps: [
        {
          action: 'Check the motherboard manual and the card link width in a GPU utility.',
          result:
            'The long slot is physically x16 but wired for x4, so the card negotiates four lanes and loses bandwidth.',
        },
        {
          action: 'Verify the power supply rating and the card power connectors.',
          result:
            'The 650 W supply has the required 8-pin connector and enough headroom, so power is not the limit.',
        },
        {
          action: 'Move the card to a true x16 slot on a replacement board and retest.',
          result:
            'The link reports x16, frame rates rise substantially, and the earlier slot is confirmed as the bottleneck.',
        },
      ],
      conclusion:
        'Physical fit is not compatibility. The slot lane count, the power supply, and the CPU together decide real performance, so check all three before buying or installing a card.',
    },
    tradeoff: {
      gain:
        'PCIe 5.0 roughly doubles the bandwidth of PCIe 4.0 per lane, which helps the fastest storage and accelerator cards move large amounts of data.',
      cost:
        'It adds cost, heat, and power draw, and most everyday workloads cannot use the extra bandwidth, so the benefit is often invisible.',
      verdict:
        'Choose PCIe 4.0 for general systems and PCIe 5.0 only when a specific device or workload can actually consume the bandwidth.',
    },
    terms: [
      {
        term: 'Bus',
        definition:
          'A shared set of electrical paths that carries addresses, data, and control signals between components.',
      },
      {
        term: 'Chipset',
        definition:
          'The chip or chips that route traffic between the CPU and peripherals such as storage, USB, and expansion slots.',
      },
    ],
    keyTakeaways: [
      'The motherboard sets compatibility through its socket, memory type, slots, and form factor.',
      'A bus moves data; its width and speed set a ceiling on throughput.',
      'PCIe is internal and lane-based, USB is external and hot-pluggable, SATA is for drives, and HDMI is for displays.',
      'Power delivery, cooling, and the slowest component decide real performance.',
    ],
    pitfalls: [
      'Buying a CPU that fits the socket but is unsupported by the board firmware or chipset.',
      'Assuming a physical x16 slot always provides sixteen electrical lanes.',
      'Upgrading one component without first finding the actual bottleneck.',
    ],
    focusPoints: [
      'Socket and chipset compatibility before any upgrade.',
      'Link width, link speed, and the bottleneck in a workflow.',
      'Power and cooling budgets for every added component.',
    ],
    quiz: [
      {
        question:
          "A processor physically fits a motherboard's socket, but the board's supported-CPU list requires a newer firmware version. What should you do before installing the processor?",
        options: [
          'Install it and let it overheat to trigger an update.',
          'Update the firmware using a supported processor, or use a board that already has the required version.',
          'Force the processor into the socket with more pressure.',
          'Assume the socket shape guarantees compatibility.',
        ],
        answer: 1,
        explanation:
          "Physical fit only matches the pin layout. The firmware must know the processor's microcode and power profile, or the board may not boot at all. Some boards can flash firmware without a CPU, but otherwise a supported chip is needed first. Socket shape alone does not guarantee support.",
      },
      {
        question: 'Which interface is the best match for an internal NVMe SSD?',
        options: ['HDMI', 'SATA', 'PCIe', 'USB 2.0'],
        answer: 2,
        explanation:
          'NVMe is a storage protocol that runs over PCIe, often in an M.2 slot, which gives it far more bandwidth than SATA. HDMI carries video, and USB is mainly for external devices. SATA remains fine for older drives but is not the NVMe path.',
      },
    ],
  },
  {
    chapterId: 'buying-maintaining',
    hook:
      'The most expensive computer is not the one with the highest price tag; it is the one that wastes an employee time every day.',
    plainEnglish:
      'Buy a computer for the work you actually do, then protect it with updates, cleaning, backups, and a realistic plan for repair or replacement.',
    oneIdea:
      'Specifications matter only in relation to a workload, and the cheapest machine is not the lowest total cost if it wastes time or fails without a restorable backup.',
    whyItMatters:
      'IT budgets are judged over years, not at checkout. Workload matching, maintenance, and tested backups decide whether a fleet stays productive or becomes a stream of emergencies.',
    objectives: [
      'Translate a real workload into CPU, memory, storage, and graphics requirements.',
      'Calculate total cost of ownership across a device lifespan.',
      'Build a preventive maintenance routine covering updates, cleaning, and health checks.',
      'Apply the 3-2-1 backup rule and decide between upgrading and replacing.',
    ],
    sections: [
      {
        title: 'Start With the Workload, Not the Spec Sheet',
        body:
          'Before comparing processors, describe what the machine must do. A bookkeeper running a browser, email, and a spreadsheet is comfortable with a mid-range CPU, 16 GB of memory, and a 512 GB SSD. A video editor needs more memory, fast storage, and a capable graphics card; a computer-aided design user may need a professional graphics card and a color-accurate display. Write down the programs, file sizes, and acceptable wait times. Then set a budget and a lifespan, typically three to five years for a business laptop. A faster chip that doubles the price may change nothing the user notices.',
      },
      {
        title: 'Total Cost of Ownership',
        body:
          'The purchase price is only the first cost. Total cost of ownership adds software licenses, support, extended warranties, electricity, consumables, training, downtime, and disposal. A 700-dollar laptop that needs a 150-dollar repair in year two and slows to a crawl in year four can cost more than a 1,000-dollar model that lasts five years. For a fleet, multiply by users and add administrator time. A useful calculation is annual cost: total cost divided by years of service. This makes a durable, repairable machine comparable to a cheap one and exposes subscriptions that quietly renew.',
      },
      {
        title: 'Preventive Maintenance',
        body:
          'Maintenance is mostly routine, not heroic. Install operating system and application updates, because most attacks exploit known flaws. Keep at least 10 percent of the drive free so updates and temporary files have room. Back up before major upgrades. Clean dust from vents with compressed air while the machine is off, and never block fan intakes. Laptop batteries last longer when kept out of sustained heat and not stored at 0 or 100 percent for months. Check drive health and error logs monthly, and replace aging drives before they fail. A short checklist beats a panicked repair.',
      },
      {
        title: 'Backups and Upgrade-or-Replace',
        body:
          'The 3-2-1 rule says keep three copies of important data, on two different kinds of media, with one copy offsite. A real backup is restorable: test a file restore quarterly, because a backup you cannot restore is only hope. Sync is not backup; deleting a file syncs the deletion. When a machine slows, measure before spending. Adding memory or swapping a hard disk for an SSD often revives a computer whose CPU is still adequate. Replace instead when the CPU is the bottleneck, the board lacks modern ports, or repairs cost more than half a replacement.',
      },
    ],
    example: {
      title: "Reviving the Office Assistant's Six-Year-Old PC",
      scenario:
        'A four-person office has a six-year-old desktop used for email, spreadsheets, and a browser-based booking system. It takes four minutes to boot, and the disk activity light stays on.',
      steps: [
        {
          action: 'Measure resource use during a typical morning.',
          result:
            'The CPU stays below 40 percent, memory is full at 8 GB, and the disk is busy 100 percent of the time, pointing to memory and storage.',
        },
        {
          action: 'Install 16 GB of memory and clone the system to a 1 TB SSD for 140 dollars.',
          result:
            'Boot time falls to 25 seconds and the booking system responds immediately; the CPU is no longer the constraint.',
        },
        {
          action: 'Set up automatic backups and run a restore test.',
          result:
            'A monthly image goes to an external drive and an offsite copy, and the first test restore succeeds.',
        },
      ],
      conclusion:
        'The desktop had a usable CPU, so a targeted upgrade cost far less than a new machine. Measurement found the bottleneck, and the backup plan protects the investment.',
    },
    tradeoff: {
      gain:
        'Upgrading memory or storage costs a fraction of a new computer, avoids migrating the user, and can extend a machine by two or three years.',
      cost:
        'An older CPU, aging battery, and limited warranty remain, and money spent on a machine near the end of its life may be wasted.',
      verdict:
        'Upgrade when the CPU is adequate and the device is under about five years old; replace when the CPU or platform is the bottleneck, or when repair approaches half the replacement cost.',
    },
    terms: [
      {
        term: 'Total cost of ownership',
        definition:
          'The full lifetime cost of a device, including purchase, software, support, power, downtime, and disposal.',
      },
      {
        term: '3-2-1 backup rule',
        definition:
          'Keep three copies of data, on two different media types, with one copy stored offsite.',
      },
    ],
    keyTakeaways: [
      'Start from the workload: programs, file sizes, and acceptable wait times drive the specifications.',
      'Judge a purchase by total cost of ownership over its lifespan, not by sticker price.',
      'Preventive maintenance is mostly updates, airflow, free disk space, and early drive replacement.',
      'A backup counts only after a restore has been tested, and sync alone is not backup.',
    ],
    pitfalls: [
      'Buying the fastest CPU while leaving 8 GB of memory and a mechanical hard disk.',
      'Calling a sync folder a backup; deletions and ransomware propagate to it.',
      'Never testing a restore until the day the original data is lost.',
    ],
    focusPoints: [
      'Matching specifications to a written workload.',
      'Calculating annual cost of ownership.',
      'The 3-2-1 rule and the upgrade-versus-replace decision.',
    ],
    quiz: [
      {
        question: 'Which setup satisfies the 3-2-1 backup rule?',
        options: [
          'Three copies on three external drives kept in the same desk drawer.',
          'Two copies on one external drive and the original laptop.',
          'The original on a laptop, a copy on an external drive, and a copy in cloud storage.',
          'One copy on a RAID 1 array inside the laptop.',
        ],
        answer: 2,
        explanation:
          'The rule requires three copies, two media types, and one offsite copy. The correct choice provides the laptop, an external drive, and the cloud. Three drives in one drawer are not offsite, and RAID protects against a disk failure but not deletion, theft, or fire.',
      },
      {
        question:
          'Laptop A costs 700 dollars plus a 150-dollar repair and lasts four years. Laptop B costs 1,000 dollars and lasts five years with no repair. Which has the lower annual cost?',
        options: [
          'Laptop A, at 212.50 dollars per year.',
          'Laptop B, at 200 dollars per year.',
          'They cost the same per year.',
          'Laptop A, because its purchase price is lower.',
        ],
        answer: 1,
        explanation:
          'Laptop A costs 850 dollars over four years, or 212.50 per year. Laptop B costs 1,000 dollars over five years, or 200 per year. The lower purchase price does not guarantee the lower lifetime cost.',
      },
    ],
  },
  {
    chapterId: 'binary-number-systems',
    hook:
      'Every photo, price, and password in a computer is ultimately a pattern of ones and zeros.',
    plainEnglish:
      'Binary is counting with two digits, 0 and 1, where each position is a power of two, and hexadecimal is the same idea with sixteen digits.',
    oneIdea:
      'Every number system is positional: the same digits mean different values depending on the base, so binary, decimal, and hexadecimal are three spellings of one quantity.',
    whyItMatters:
      'Binary and hex appear in every layer of IT: memory addresses, color codes, file sizes, permissions, network masks, and error codes. Fluent conversion makes technical documentation readable instead of intimidating.',
    objectives: [
      'Explain positional notation in base 2, base 10, and base 16.',
      'Convert values between binary, decimal, and hexadecimal.',
      'Define bit, byte, word, and the common powers of two.',
      'Interpret everyday computing quantities such as 0xFF and 4 GiB.',
    ],
    sections: [
      {
        title: 'Counting With Positional Notation',
        body:
          'In everyday decimal, each position is worth ten times the one to its right: 345 means 3×100 + 4×10 + 5×1. The base is the number of digits available. Binary has base 2 and only the digits 0 and 1; each position is worth a power of two: 1, 2, 4, 8, 16, and so on. Hexadecimal has base 16 and uses 0 through 9 plus A through F, where A means 10 and F means 15. The digits change, but the idea is identical: multiply each digit by its place value and add the results.',
        code: `decimal   3   4   5      = 3×100 + 4×10 + 5×1 = 345
binary    1   0   1   1  = 1×8 + 0×4 + 1×2 + 1×1 = 11
hex       2   F          = 2×16 + 15×1 = 47`,
      },
      {
        title: 'Binary to Decimal and Back',
        body:
          'To convert binary to decimal, write the place values above the bits and add the ones that are switched on. The 8-bit value 10110100 is 128 + 32 + 16 + 4, or 180. To go the other way, repeatedly divide by two and record the remainders, then read them from bottom to top. Eight bits hold 256 patterns, numbered 0 to 255. That is why an 8-bit color channel runs from 0 to 255, and why 255, not 256, is the largest value in one byte.',
        code: `Place:  128  64  32  16   8   4   2   1
Bits:     1   0   1   1   0   1   0   0
Sum:    128 + 32 + 16 + 4 = 180

180 ÷ 2 = 90 rem 0
 90 ÷ 2 = 45 rem 0
 45 ÷ 2 = 22 rem 1
 22 ÷ 2 = 11 rem 0
 11 ÷ 2 =  5 rem 1
  5 ÷ 2 =  2 rem 1
  2 ÷ 2 =  1 rem 0
  1 ÷ 2 =  0 rem 1    read upward: 10110100`,
      },
      {
        title: 'Hexadecimal: Shorthand for Four Bits',
        body:
          'Long binary strings are hard to read, so programmers group them in fours. Each group of four bits has exactly sixteen possible values, which maps perfectly to one hexadecimal digit. That makes conversion mechanical: 1011 0101 becomes B5, and 1111 1111 becomes FF. A byte is always two hex digits, from 00 to FF. Color codes such as #1A2B3C use this convention: 1A red, 2B green, 3C blue. Memory addresses and error codes are usually printed in hex for the same reason. This is why a hex dump is readable: each pair of characters is one byte, and each character is one nibble, or half a byte.',
        code: `Binary      Hex    Decimal
0000        0      0
0101        5      5
1001        9      9
1010        A      10
1111        F      15
1011 0101   B5     181`,
      },
      {
        title: 'Bits, Bytes, Words, and Powers of Two',
        body:
          'A bit is one binary digit. Eight bits make a byte, which is the usual addressable unit of memory and storage. A word is the chunk a processor naturally handles at once, usually the width of its general-purpose registers; on a 64-bit CPU that is 64 bits, or 8 bytes. Because computers use powers of two, 1 KiB is 1,024 bytes, while a storage vendor\'s 1 KB is 1,000 bytes. That gap explains why a 1 TB drive shows about 931 GiB in some operating systems. Powers of two also set limits: 32-bit addresses cover 2^32 bytes, about 4 GiB.',
      },
    ],
    example: {
      title: 'Decoding an IP Address from Hex',
      scenario:
        'A network log shows the hex value C0A80101. A technician needs the dotted-decimal IPv4 address for a firewall rule.',
      steps: [
        {
          action: 'Split the 32-bit value into four bytes.',
          result:
            'C0 A8 01 01, because every byte is exactly two hex digits.',
        },
        {
          action: 'Convert each byte to decimal.',
          result:
            'C0 = 192, A8 = 168, 01 = 1, and 01 = 1.',
        },
        {
          action: 'Join the decimal values with dots.',
          result:
            '192.168.1.1, a private address commonly used by home routers.',
        },
      ],
      conclusion:
        'The hex form was never a different number; it was the same 32 bits written compactly. Grouping by bytes made the conversion reliable.',
    },
    tradeoff: {
      gain:
        'Hexadecimal compresses four bits into one character and aligns exactly with byte boundaries, so addresses, colors, and masks stay short and readable.',
      cost:
        'People must convert to decimal to judge magnitude, and a single wrong digit changes the value by up to fifteen place units.',
      verdict:
        'Use hex when the audience works with bits and bytes, decimal for human-facing quantities, and binary for teaching or explicit bit masks.',
    },
    terms: [
      {
        term: 'Positional notation',
        definition:
          'A number system in which each digit is multiplied by a power of the base according to its position.',
      },
      {
        term: 'Byte',
        definition:
          'A group of eight bits, commonly the smallest addressable unit of computer memory and storage.',
      },
    ],
    keyTakeaways: [
      'All number systems use place value; only the base changes.',
      'Binary digits represent powers of two, and eight bits give 256 possible values.',
      'One hex digit equals four bits, so one byte is always two hex digits.',
      'Binary prefixes such as KiB are powers of two; decimal prefixes such as KB are powers of ten.',
    ],
    pitfalls: [
      'Reading 10 in binary as ten rather than two.',
      'Mixing bits and bytes, for example writing 100 MB/s when the link is 100 Mbps.',
      'Assuming a 1 TB drive is faulty because the operating system reports about 931 GiB.',
    ],
    focusPoints: [
      'Place values and grouping bits in fours.',
      'Converting in both directions without guessing.',
      'Power-of-two sizes and the limits they impose.',
    ],
    quiz: [
      {
        question: 'What is the binary value 1011 in decimal?',
        options: ['9', '11', '13', '15'],
        answer: 1,
        explanation:
          'The place values are 8, 4, 2, and 1. Add the switched-on positions: 8 + 0 + 2 + 1 = 11. The value 13 would be 1101, and 15 would be 1111.',
      },
      {
        question: 'What is the hexadecimal value 0x2F in decimal?',
        options: ['31', '32', '47', '255'],
        answer: 2,
        explanation:
          'Hex 2F means 2×16 plus F×1. F is 15, so the value is 32 + 15 = 47. It is not 2×10 + 15, because the base is 16 rather than 10.',
      },
    ],
    walkthrough: 'binary',
  },
  {
    chapterId: 'integers-floating-point',
    hook:
      'A computer can add 250 and 10 and get 4, and that is not a malfunction.',
    plainEnglish:
      'Computers store numbers in fixed-size boxes of bits, so whole numbers can overflow and decimals are often rounded, which is why 0.1 + 0.2 is not exactly 0.3.',
    oneIdea:
      'A number means nothing without its format: the same bits can be an unsigned count, a signed integer, or part of a floating-point value.',
    whyItMatters:
      'Overflow and rounding cause real outages, incorrect bills, and failed spacecraft. Knowing the width and format of a number is the difference between trusting a calculation and hoping.',
    objectives: [
      'Interpret unsigned integers and two\'s complement signed integers.',
      'Predict overflow and wraparound in fixed-width arithmetic.',
      'Explain the IEEE 754 sign, exponent, and mantissa fields.',
      'Recognize rounding error and choose an appropriate numeric type.',
    ],
    sections: [
      {
        title: 'Fixed-Width Integers',
        body:
          'An integer type stores a whole number in a fixed number of bits, so its range is fixed too. Eight unsigned bits hold 0 through 255; sixteen hold 0 through 65,535; thirty-two hold 0 through 4,294,967,295. An n-bit unsigned value has 2^n possible patterns, so its range is 0 through 2^n − 1. Fixed width makes arithmetic fast and predictable, but it also leaves no room to grow. Add 1 to the largest value of an unsigned type and it wraps to zero, just like a car odometer rolling over. This is called overflow.',
      },
      {
        title: 'Signed Integers and Two\'s Complement',
        body:
          'To store negative numbers, most systems use two\'s complement. The leftmost bit becomes the sign bit: 0 for non-negative, 1 for negative. To negate a value, invert every bit and add one. In eight bits, 5 is 00000101, so −5 is 11111010 plus 1, which is 11111011. The range becomes −128 through 127, not −127 through 127, because there is only one zero. The sign bit is not a separate minus sign; it is the highest place value, worth −128 in eight bits, which is why the range is asymmetric. Two\'s complement also lets addition and subtraction share the same hardware, which is why it displaced older sign-magnitude designs.',
        code: ` 5 = 0000 0101
invert: 1111 1010
add 1:  1111 1011  = -5

8-bit signed range:   -128 .. 127
8-bit unsigned range:    0 .. 255`,
      },
      {
        title: 'Overflow, Wraparound, and Expensive Bugs',
        body:
          'Overflow is not a theoretical concern. A 16-bit counter wraps after 65,535; a 32-bit Unix timestamp runs out in January 2038; an 8-bit brightness calculation can turn 250 plus 10 into 4 and produce a black pixel where white was expected. Some systems saturate instead of wrapping, so the result stops at the maximum. Others raise an exception. The dangerous cases are silent wraparound, because the program keeps running with a wrong number. Always ask how wide the value is, whether it is signed, and what the maximum realistic input can be.',
      },
      {
        title: 'IEEE 754 Floating Point and Rounding',
        body:
          'Floating point represents numbers in scientific notation using binary: a sign, an exponent, and a fraction called the mantissa. A 32-bit float uses 1 sign bit, 8 exponent bits, and 23 fraction bits; a 64-bit double uses 1, 11, and 52. That design covers enormous and tiny values but cannot represent most decimals exactly, because 0.1 in binary repeats forever. The stored value is rounded to the nearest representable one. Comparing floats with strict equality is therefore fragile; compare the absolute difference against a small tolerance instead.',
        code: `> 0.1 + 0.2
0.30000000000000004
> Math.abs((0.1 + 0.2) - 0.3) < 1e-9
true`,
      },
    ],
    example: {
      title: 'The Inventory Counter That Lost 256 Boxes',
      scenario:
        'A warehouse uses an embedded controller with an 8-bit unsigned counter for boxes received in a day. One busy day it logs 250 boxes by 4 p.m. and keeps counting.',
      steps: [
        {
          action: 'Add ten more receipts and read the counter.',
          result:
            'It shows 4, not 260, because 260 modulo 256 is 4 and the register wrapped.',
        },
        {
          action: 'Check how the software uses the value.',
          result:
            'It compares receipts against a 260-box delivery, so the wrap makes 256 boxes appear missing.',
        },
        {
          action: 'Widen the counter to 32 bits and add a sanity check.',
          result:
            'The count passes 255 normally, and impossible values are rejected before they reach inventory.',
        },
      ],
      conclusion:
        'The hardware did exactly what an 8-bit unsigned integer does. The bug was choosing a width too small for the peak workload and failing to detect the wrap.',
    },
    tradeoff: {
      gain:
        'Floating point handles huge and tiny magnitudes and runs in hardware, so graphics, simulations, and scientific code stay fast.',
      cost:
        'Most decimal fractions are approximate, equality is unreliable, and results can depend on the order of operations.',
      verdict:
        'Use floats for measurements, graphics, and science; use integers in the smallest currency unit for money, and compare floats with a tolerance rather than strict equality.',
    },
    terms: [
      {
        term: 'Two\'s complement',
        definition:
          'A signed integer representation in which a negative value is formed by inverting all bits and adding one.',
      },
      {
        term: 'IEEE 754',
        definition:
          'The standard format for binary floating-point numbers, defining the sign, exponent, and fraction fields.',
      },
    ],
    keyTakeaways: [
      'A fixed number of bits gives a fixed range; always know the width and signedness.',
      'Two\'s complement stores negatives by inverting and adding one, giving one zero and an asymmetric range.',
      'Overflow can wrap silently and turn a correct-looking program into a wrong one.',
      'Floating point approximates most decimals, so compare with a tolerance and represent money as integer cents.',
    ],
    pitfalls: [
      'Testing floating-point values with strict equality.',
      'Assuming 0.1 + 0.2 should print 0.3 exactly in binary floating point.',
      'Choosing a counter width that the peak workload can exceed.',
    ],
    focusPoints: [
      'Width, range, and signedness of integer types.',
      'The two\'s complement negation steps.',
      'Tolerance-based comparison for floating-point values.',
    ],
    quiz: [
      {
        question:
          "What decimal value does the 8-bit two's complement pattern 11111111 represent?",
        options: ['-1', '255', '-127', '128'],
        answer: 0,
        explanation:
          "Invert 11111111 to get 00000000, then add one to get 00000001, so the pattern represents -1. As an unsigned value it would be 255, but the leading 1 marks it negative in two's complement. The value -127 would be 10000001, and 128 is outside the 8-bit signed range.",
      },
      {
        question: 'Why can 0.1 + 0.2 produce 0.30000000000000004?',
        options: [
          'The CPU cannot add decimal numbers at all.',
          '0.1 and 0.2 are rounded to nearby binary fractions, and the small errors add.',
          'JavaScript uses base 3 for fractions.',
          'The result is always rounded up to the next integer.',
        ],
        answer: 1,
        explanation:
          'IEEE 754 stores binary fractions, and 0.1 and 0.2 have repeating expansions in base 2. Each is rounded to the nearest representable double, and the sum exposes that tiny error. It is a format limitation, not a JavaScript bug.',
      },
    ],
    walkthrough: 'binary',
  },
  {
    chapterId: 'character-encoding',
    hook:
      'The same five bytes can spell café or cafÃ©, depending on which rulebook reads them.',
    plainEnglish:
      'Text is stored as numbers, and a character encoding is the shared rulebook that says which number means which character, so every system must read it the same way.',
    oneIdea:
      'A character set maps characters to code points, and an encoding such as UTF-8 maps those code points to bytes; confusing the two layers causes mojibake.',
    whyItMatters:
      'Names, addresses, contracts, and messages cross systems built in different decades. Choosing UTF-8 and declaring it correctly prevents corrupted text, broken search, and records that cannot be matched.',
    objectives: [
      'Distinguish a character set, a code point, and a character encoding.',
      'Decode ASCII and UTF-8 byte sequences by hand.',
      'Explain how Unicode handles accented letters, emoji, and grapheme clusters.',
      'Diagnose mojibake and apply Unicode normalization before comparing text.',
    ],
    sections: [
      {
        title: 'Characters, Code Points, and Encodings',
        body:
          'Text starts as an abstract character: the letter A, the digit 7, or the emoji 😀. A character set assigns each character a number called a code point. Unicode writes code points as U+0041 for A and U+1F600 for 😀. A character encoding then decides how those numbers become bytes in a file or network packet. These are separate layers. Unicode is the catalog; UTF-8 is one way of writing the catalog entries. Two systems can agree on Unicode and still disagree if one writes UTF-8 and the other reads a legacy encoding.',
        code: `Character   Code point   UTF-8 bytes
A           U+0041       41
é           U+00E9       C3 A9
€           U+20AC       E2 82 AC
😀          U+1F600      F0 9F 98 80`,
      },
      {
        title: 'ASCII and the Extended-ASCII Mess',
        body:
          'ASCII, published in 1963, defined 128 code points using seven bits. It covered English letters, digits, punctuation, and control codes: A is 65, a is 97, and 0 is 48. That was enough for English but not for accented letters, Greek, or Chinese. Vendors filled the unused 128 values with different characters, producing code pages such as Windows-1252 and ISO-8859-1. The same byte 0xE9 meant é in Windows-1252, a Greek capital theta in code page 437, and something else in another page. Files without a declared encoding were therefore ambiguous, and guessing produced garbled text.',
      },
      {
        title: 'Unicode and UTF-8',
        body:
          'Unicode defines more than 150,000 characters across many scripts and assigns each a code point up to U+10FFFF. UTF-8 is a variable-length encoding: code points U+0000 to U+007F take one byte, U+0080 to U+07FF take two, U+0800 to U+FFFF take three, and U+10000 to U+10FFFF take four. The first byte announces the length, and continuation bytes begin with 10. Each continuation byte carries six payload bits, so the length prefix and continuation pattern together show exactly where a character starts and ends. Pure ASCII text is byte-for-byte identical in UTF-8, which is why UTF-8 could take over the web without breaking old English files.',
        code: `1 byte:  0xxxxxxx
2 bytes: 110xxxxx 10xxxxxx
3 bytes: 1110xxxx 10xxxxxx 10xxxxxx
4 bytes: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx`,
      },
      {
        title: 'Grapheme Clusters, Normalization, and Mojibake',
        body:
          'A code point is not the same as a visible character. The letter é can be one code point, U+00E9, or two: e plus a combining accent, U+0065 U+0301. A family emoji may be several emoji joined by zero-width joiners. Users see one grapheme cluster, while code sees many code points. Unicode normalization converts equivalent sequences to a standard form, usually NFC, before comparing or storing them. Mojibake happens when bytes are decoded with the wrong encoding: the UTF-8 bytes C3 A9 for é, read as Windows-1252, become the two characters Ã©.',
        code: `"café" in UTF-8:       63 61 66 C3 A9
read as Windows-1252:  c  a  f  Ã  ©   -> "cafÃ©"`,
      },
    ],
    example: {
      title: 'The Customer Name That Arrived as cafÃ©',
      scenario:
        'A support agent exports customer names from an old order system into a UTF-8 CSV. One name, café, displays as cafÃ© in the new dashboard, and the duplicate-customer check fails to match it with an existing café record.',
      steps: [
        {
          action: 'Inspect the raw bytes of the exported name.',
          result:
            'They are 63 61 66 C3 A9, which is correct UTF-8 for café, so the database is not corrupt.',
        },
        {
          action: 'Check how the dashboard decodes the CSV.',
          result:
            'It opens the file as Windows-1252, so C3 A9 becomes Ã© and the text is garbled on display.',
        },
        {
          action: 'Declare UTF-8 on import and normalize names to NFC.',
          result:
            'The name renders as café, and duplicate checks treat the composed and decomposed forms as equal.',
        },
      ],
      conclusion:
        'The bytes were never wrong; the decoder was. Fixing the declared encoding and normalizing the text resolved both the display problem and the duplicate-match bug.',
    },
    tradeoff: {
      gain:
        'UTF-8 covers every Unicode character, is backward compatible with ASCII, and needs no byte-order mark, so it works across languages and platforms.',
      cost:
        'It is variable-width, so finding the nth character or slicing a string by bytes can split a sequence, and software must decode carefully.',
      verdict:
        'Use UTF-8 for storage, files, and network protocols; convert deliberately only when a legacy system demands another encoding.',
    },
    terms: [
      {
        term: 'Code point',
        definition:
          'A number assigned to an abstract character in a character set; Unicode writes it as U+ followed by hex digits.',
      },
      {
        term: 'UTF-8',
        definition:
          'A variable-length Unicode encoding that uses one to four bytes per code point and is byte-compatible with ASCII.',
      },
    ],
    keyTakeaways: [
      'A character set maps characters to code points; an encoding maps code points to bytes.',
      'ASCII uses seven bits, and UTF-8 preserves those values exactly for the first 128 code points.',
      'UTF-8 is variable-width: one to four bytes, with the leading byte announcing the length.',
      'Grapheme clusters can contain several code points, and mojibake is a decoding error rather than corrupted data.',
    ],
    pitfalls: [
      'Counting bytes or code points as visible characters, then splitting text in the wrong place.',
      'Opening UTF-8 as Latin-1 and saving it back, which double-encodes the text.',
      'Assuming an emoji is one code point, or that string length equals what the user sees.',
    ],
    focusPoints: [
      'The separation between character set, code point, and encoding.',
      'UTF-8 byte patterns and ASCII compatibility.',
      'Normalization and correct decoding before comparison.',
    ],
    quiz: [
      {
        question:
          'In UTF-8, a byte that begins with 11110xxx starts a sequence of how many bytes?',
        options: ['One', 'Two', 'Three', 'Four'],
        answer: 3,
        explanation:
          'The number of leading ones in the first byte gives the total sequence length. Four leading ones mean a four-byte sequence, followed by three continuation bytes beginning with 10. Values above U+FFFF, including most emoji, use this form.',
      },
      {
        question: 'Why is reversing a UTF-8 string byte by byte unsafe?',
        options: [
          'Multi-byte characters end up with their bytes in reverse order, producing invalid sequences.',
          'UTF-8 strings are encrypted and cannot be reversed.',
          'ASCII characters use seven bits, so one bit is lost.',
          'UTF-8 stores characters in a random order.',
        ],
        answer: 0,
        explanation:
          'Reversing bytes reverses the order of whole characters and scrambles each multi-byte sequence, so continuation bytes appear first. Software must iterate code points or grapheme clusters instead. ASCII-only text happens to survive, which can hide the bug in testing.',
      },
    ],
    walkthrough: 'binary',
  },
];
