import type { ITLesson } from './types';

export const group3Lessons: ITLesson[] = [
  {
    chapterId: 'multimedia-compression',
    hook: 'A one-hour video can be 100 GB raw or 1 GB streamed, and the difference is not magic. It is a series of deliberate choices about which details to keep.',
    plainEnglish:
      'Pictures, sound, and video are stored as numbers, and compression makes those numbers smaller by removing repetition or detail people are unlikely to notice.',
    oneIdea:
      'Media quality and file size are two ends of one dial: a codec spends a limited bit budget where human eyes and ears will notice it most.',
    whyItMatters:
      'Every video call, photo message, and streaming service depends on this balance. Understanding it helps you choose settings, explain why a file looks blocky, and avoid wasting storage or bandwidth on detail that will never be seen.',
    objectives: [
      'Explain how pixels, resolution, and color depth determine raw image size.',
      'Describe how sample rate and bit depth shape audio size and quality.',
      'Distinguish lossless from lossy compression and when each is appropriate.',
      'Separate a container from a codec and explain why an extension alone does not identify a format.',
    ],
    sections: [
      {
        title: 'Pixels, resolution, and color depth',
        body: 'A digital image is a grid of pixels, and each pixel stores one color. Resolution is the grid size: a 1920 by 1080 photo has 2,073,600 pixels. Color depth is how many bits describe each pixel. At 24-bit color, one pixel needs 3 bytes, so that photo is about 6 MB before compression. More pixels or more color depth means more detail and larger files. But size alone does not prove quality: a sharp 12-megapixel photo can look better than a blurry 48-megapixel one. Screens also cap useful detail, so a poster and a phone wallpaper need different resolutions.',
      },
      {
        title: 'Sampling and audio bitrate',
        body: 'Sound is a wave, and digital audio stores it as samples: measurements taken thousands of times per second. The sample rate is how many measurements happen each second; 44,100 Hz is common because it can represent frequencies up to about 22,050 Hz, just beyond human hearing. Bit depth is how precisely each sample records loudness; 16-bit gives 65,536 levels. Size adds up fast. One second of CD-quality stereo is 44,100 samples times 2 bytes times 2 channels, about 176 KB, or roughly 10.6 MB per minute. A 128 kbps MP3 stream needs only about 1 MB per minute because it discards detail the ear is less likely to notice.',
      },
      {
        title: 'Frames, video bitrate, and artifacts',
        body: 'Video is a sequence of images called frames, shown fast enough to look like motion, usually 24 to 60 frames per second. Uncompressed video is enormous: at 30 fps, one second of 1080p 24-bit video is 30 frames times 6 MB, about 180 MB. A three-minute clip would be over 32 GB. Video codecs reduce this by storing one full frame and then describing only what changed, while also softening detail in areas people rarely study. Bitrate is the data budget per second. A 5 Mbps stream uses about 37.5 MB per minute. Lower bitrate means smaller files but more blocky artifacts, especially in motion and dark scenes.',
      },
      {
        title: 'Lossless, lossy, containers, and codecs',
        body: 'Lossless compression shrinks a file by finding redundancy, and decompression restores every original bit. ZIP, PNG, and FLAC are lossless. Lossy compression throws away detail chosen to be hard for humans to notice. JPEG, MP3, AAC, and H.264 are lossy, and each re-save or re-encode loses more quality. A container is the wrapper file, such as MP4, MKV, or WebM. A codec is the algorithm that compresses the streams inside. This is why an MP4 can hold H.264 or AV1 video, and why changing the extension does not convert anything. Containers also store metadata: duration, subtitles, rotation, and camera settings.',
      },
    ],
    example: {
      title: 'Fitting a club video under an upload limit',
      scenario:
        'A student must upload a three-minute 1080p video to a learning platform that accepts at most 100 MB. The raw camera file is far too large, and the platform will re-encode anything it receives.',
      steps: [
        {
          action:
            'Measure the raw size: 3 minutes times 60 seconds times 30 frames per second is 5,400 frames. At about 6 MB per uncompressed 1080p frame, the video is roughly 32.4 GB.',
          result:
            'The raw file cannot be uploaded, so compression is mandatory rather than optional.',
        },
        {
          action:
            'Encode with H.264 at 3.5 Mbps video and 128 kbps audio: 3.5 Mbps times 180 seconds is 630 Mb, or about 79 MB, and the audio adds about 2.9 MB.',
          result:
            'The file is about 82 MB, leaving room for the container and subtitles under the 100 MB cap.',
        },
        {
          action:
            'Check the result on a phone and a projector, looking for readable text, smooth motion, and audio sync. If artifacts are severe, trim the intro or reduce to 720p before raising the bitrate.',
          result:
            'The upload succeeds and the important content stays clear; the trade-off is accepted consciously.',
        },
      ],
      conclusion:
        'Compression is bit budgeting. Measure the raw size, choose a codec and bitrate for the destination, then verify the result on the screen and speakers that matter.',
    },
    tradeoff: {
      gain:
        'Smaller files cut storage, bandwidth, and waiting time, and make streaming and video calls practical on ordinary connections.',
      cost:
        'Lossy compression permanently removes detail, encoding takes time and computing power, and repeated re-encoding makes artifacts worse.',
      verdict:
        'Keep a high-quality master, deliver a lossy copy sized for the screen and connection, and never treat the compressed copy as the archive.',
    },
    terms: [
      {
        term: 'Codec',
        definition:
          'The algorithm that compresses and decompresses a media stream, such as H.264 for video or AAC for audio.',
      },
      {
        term: 'Bitrate',
        definition:
          'The amount of data used per second of audio or video; a higher bitrate usually means better quality and a larger file.',
      },
    ],
    keyTakeaways: [
      'Raw media size comes from pixels times color depth, samples times bit depth, or frames times frame size.',
      'Lossless compression preserves every bit; lossy compression discards detail permanently.',
      'A container is not a codec, and a file extension is only a hint about the contents.',
      'Match resolution and bitrate to the screen and connection, and keep a high-quality master for editing.',
    ],
    pitfalls: [
      'A bigger file is always better quality. It is not: a blurry, poorly encoded, or oversized file can look worse than a smaller, well-made one.',
      'Changing the extension converts the file. Renaming holiday.mov to holiday.mp4 only changes the label; the codec inside is unchanged.',
      'Compressing once is harmless. Each lossy encode discards more detail, so edit from the master, not from an already compressed copy.',
    ],
    focusPoints: [
      'Estimate raw image, audio, or video size from pixels, samples, and frames.',
      'Choose lossless or lossy compression for a stated purpose.',
      'Separate the container from the codec when a file will not play.',
    ],
    quiz: [
      {
        question:
          'A 1920 by 1080 image at 24 bits per pixel is about 6 MB raw. Which change reduces the raw pixel data the most?',
        options: [
          'Reduce the resolution to 960 by 540',
          'Increase color depth from 24 to 32 bits',
          'Rename the file from PNG to JPG',
          'Change the container from MP4 to WebM',
        ],
        answer: 0,
        explanation:
          'Halving both dimensions leaves one quarter of the pixels, so the raw image falls to about 1.5 MB. Increasing color depth makes it larger, while renaming or changing a container does not alter the pixel grid at all.',
      },
      {
        question:
          'A video named trip.mp4 plays on a laptop but shows an error on an older television. What is the most likely cause?',
        options: [
          'MP4 files cannot store video',
          'The television lacks a decoder for the codec inside the MP4',
          'The file name is too short',
          'The video has no metadata',
        ],
        answer: 1,
        explanation:
          'MP4 is a container; the video inside may be H.264, HEVC, AV1, or another codec. The laptop has the needed decoder, while the television does not. The extension only tells you the wrapper, not whether a device can decode the stream.',
      },
    ],
  },
  {
    chapterId: 'operating-systems',
    hook: 'Your laptop runs a browser, a music player, a backup, and a virus scan at the same time, on one CPU. Something must decide who goes next and who must wait.',
    plainEnglish:
      'An operating system is the software that shares one computer among many programs, keeping them apart while letting them use the processor, memory, files, and devices.',
    oneIdea:
      'The operating system is both a referee and a translator: it turns limited, shared hardware into safe, convenient resources that programs can request.',
    whyItMatters:
      'Every app you use depends on the OS to start, save, print, connect, and recover. When a machine slows down or a program crashes, the cause often sits at this boundary rather than inside the app itself.',
    objectives: [
      'Explain the difference between kernel mode and user mode, and why a system call crosses that boundary.',
      'Describe how the scheduler shares CPU time among many processes.',
      'Explain virtual memory, page faults, and why swap slows a machine.',
      'Identify the roles of file systems, drivers, and system software.',
    ],
    sections: [
      {
        title: 'Kernel space and user space',
        body: 'An operating system has a privileged core called the kernel. The kernel can touch memory, devices, and CPU control registers directly; ordinary programs run in user space with limited rights. When a program needs to open a file, send network data, or start another process, it makes a system call. That call switches the CPU into kernel mode, where the kernel checks the request and performs it. This boundary is protection, not bureaucracy: a crashed photo editor cannot overwrite the kernel, and a malicious app cannot quietly reformat the disk. Drivers usually run in the kernel, so a faulty driver can crash the whole machine.',
      },
      {
        title: 'Processes and scheduling',
        body: 'A program on disk is passive. When it runs, the OS creates a process with its own memory, open files, and process ID. A computer with four cores can truly run four threads at once, but it may have hundreds of runnable processes. The scheduler gives each one a short turn, often a few milliseconds, then saves its state and switches to another. That switch is a context switch. Because turns are so short, the machine feels simultaneous even when it is not. Priorities and nice values influence who runs next, but a runaway process can still starve others if the scheduler or memory system is overwhelmed.',
      },
      {
        title: 'Memory and virtual memory',
        body: 'Each process sees its own virtual address space, as if it owned a large block of memory starting at zero. The memory management unit translates those virtual addresses into real physical RAM using page tables. Memory is divided into pages, commonly 4 KB. When a process touches a page that is not in RAM, the CPU raises a page fault and the OS loads it from disk. This lets an 8 GB laptop keep 20 GB of programs open, but the extra data lives in swap, which is far slower than RAM. Constant swapping is called thrashing, and it makes the machine crawl.',
      },
      {
        title: 'File systems, drivers, and system software',
        body: 'The OS turns raw storage blocks into files and directories, tracks free space, enforces permissions, and records changes in a journal so a power cut does not leave the disk half-written. A file system such as NTFS, APFS, or ext4 defines those rules. Drivers are small translators between the kernel and specific hardware: a printer, graphics card, or Wi-Fi chip. System software includes the kernel, drivers, utilities, and background services. Applications sit above it and ask for services through documented interfaces. That separation lets one app run on many machines, as long as the OS and drivers present the same promises.',
      },
    ],
    example: {
      title: 'Diagnosing a laptop that stalls under a heavy workload',
      scenario:
        'A student has 8 GB of RAM, 30 browser tabs, a video editor, and a chat app open. Switching tabs freezes for several seconds, even though the processor is mostly idle.',
      steps: [
        {
          action:
            'Open the system monitor and read memory pressure, swap, CPU, and disk. It shows 6.8 GB of 8 GB RAM used, 2.1 GB of swap, CPU near 15 percent, and disk busy.',
          result: 'The pattern points to memory pressure and paging, not a slow CPU.',
        },
        {
          action:
            'Close 20 unused tabs and quit two background helpers, then watch the same counters for five minutes.',
          result:
            'Memory use drops by about 4 GB, swap falls below 200 MB, and tab switching becomes responsive.',
        },
        {
          action:
            'For a durable fix, add RAM to 16 GB or limit how many heavy apps run together, then retest with the same workload.',
          result:
            'Memory pressure stays low with headroom, so the freezes do not return during normal work.',
        },
      ],
      conclusion:
        'The OS kept the laptop working by moving inactive pages to disk, but swap cannot match RAM speed. Measure the bottleneck, reduce demand or add memory, and verify with the same workload.',
    },
    tradeoff: {
      gain:
        'Multitasking, isolation between programs, and one stable interface to many devices, so apps do not need drivers for every disk and printer.',
      cost:
        'Kernel complexity, memory and CPU overhead, and a large attack surface that must be patched; a bad driver can still crash the machine.',
      verdict:
        'The OS earns its overhead in almost every general-purpose computer. Keep it updated, avoid unnecessary kernel extensions, and size memory for the real workload.',
    },
    terms: [
      {
        term: 'Kernel',
        definition:
          'The privileged core of an operating system that can directly control memory, devices, and CPU state.',
      },
      {
        term: 'Virtual memory',
        definition:
          'An abstraction that gives each process its own address space and lets the OS move pages between RAM and disk.',
      },
    ],
    keyTakeaways: [
      'The kernel runs with privileges that user programs do not have; system calls are the controlled doorway.',
      'A process is a running program with its own memory, files, and identity, and the scheduler shares CPU time among processes.',
      'Virtual memory lets programs exceed physical RAM, but paging to disk is far slower and can cause thrashing.',
      'File systems, drivers, and system services are part of the OS platform that applications rely on.',
    ],
    pitfalls: [
      'The desktop is the operating system. The desktop is a shell or application; the kernel and system services continue even when it restarts.',
      'More RAM speeds up every task. Extra memory helps memory-bound work; it does not fix a slow CPU, disk, network, or badly written app.',
      'Closing a window always ends the program. Many apps keep background processes, tray icons, or helpers alive, which still consume memory.',
    ],
    focusPoints: [
      'Recognize a system call and the kernel boundary.',
      'Read memory pressure and swap before blaming the CPU.',
      'Distinguish a program, a process, and a service.',
    ],
    quiz: [
      {
        question:
          'A program wants to read a file from disk. What happens at the operating system boundary?',
        options: [
          'The program reads raw disk sectors directly',
          'A system call switches to kernel mode, which performs the read and returns the data',
          'The browser cache supplies the file automatically',
          'The CPU restarts in safe mode',
        ],
        answer: 1,
        explanation:
          'User programs cannot safely touch hardware. They ask the kernel through a system call, and the kernel checks permissions, performs the I/O, and returns the result. Direct disk access would let any app bypass file permissions.',
      },
      {
        question:
          'A laptop with 8 GB of RAM is running about 20 GB of applications and still responds, though slowly. Why?',
        options: [
          'The CPU creates extra RAM on demand',
          'All applications share a single memory space',
          'Compression always makes RAM twice as large',
          'The OS uses virtual memory to page inactive data to disk',
        ],
        answer: 3,
        explanation:
          'Virtual memory maps each process to its own address space and moves less-used pages to swap. The machine survives, but page faults and disk access are much slower than RAM, which explains the sluggishness. Extra RAM is not created, and apps remain isolated.',
      },
    ],
  },
  {
    chapterId: 'files-storage',
    hook: 'Two files can share the same name, size, and icon, yet one opens and the other is unreadable. The difference is where the bytes live and how they are labeled.',
    plainEnglish:
      'A file is a named container of bytes, a folder groups files, and a path tells the computer how to find one.',
    oneIdea:
      'The name is only a label; the path, the bytes, and the permissions are what actually locate and protect the data.',
    whyItMatters:
      'Lost files, broken shared links, and accidental data leaks usually come from misunderstanding these basics. Clear storage habits and tested backups turn a crisis into a minor inconvenience.',
    objectives: [
      'Read and build absolute and relative file paths.',
      'Explain the difference between a file extension and a MIME type.',
      'Interpret basic permissions and apply least privilege.',
      'Choose local, network, or cloud storage and distinguish backup from sync.',
    ],
    sections: [
      {
        title: 'Files, folders, and paths',
        body: 'A file is a named sequence of bytes plus metadata such as size, owner, and timestamps. A directory, or folder, is a container that maps names to files and other directories. A path describes a route through that tree. An absolute path starts at the root and works from anywhere: /home/ana/reports/q3.pdf on Linux or macOS, or C:\\Users\\Ana\\reports\\q3.pdf on Windows. A relative path starts from the current directory: ../images/logo.png means go up one level, then into images. The same file can have many paths through links, but the underlying bytes are stored once.',
        code: '/home/ana/reports/q3.pdf\n../images/logo.png',
      },
      {
        title: 'Extensions and MIME types',
        body: 'The extension is the part after the last dot: report.pdf. It is a hint that helps the OS choose an application, not proof of the content. MIME types are labels used on the web and in email, such as text/html, image/png, or application/pdf. A web server sends a Content-Type header so the browser knows how to treat a response. Renaming notes.txt to notes.pdf does not convert the bytes, so the file will probably fail to open or show garbage. Attackers exploit this gap with double extensions like invoice.pdf.exe. Inspect the actual content and trust the source, not just the name.',
        code: 'Content-Type: application/pdf',
      },
      {
        title: 'Permissions and ownership',
        body: 'Permissions decide who may read, write, or execute a file. On Linux and macOS, each file has an owner, a group, and three permission sets: user, group, and others. In ls -l output, rwxr-x--- means the owner can read, write, and execute; the group can read and execute; everyone else gets nothing. Windows uses access control lists that can grant finer rights to individual accounts. Sharing a folder with the whole company because configuring a group is inconvenient is a common mistake. Least privilege means giving each person only the access the task requires, and reviewing that access when roles change.',
        code: '-rwxr-x--- 1 ana finance 4096 Nov 27 09:14 budget.sh',
      },
      {
        title: 'Local, network, and cloud storage',
        body: 'Local storage lives inside the machine: fast, private, and tied to that device. Network storage lives on a file server or NAS and depends on the LAN and its permissions. Cloud storage keeps copies in a data center run by a provider and syncs changes over the internet. Sync keeps devices identical, which is convenient but also copies deletions and ransomware. Backup is different: it keeps earlier versions so you can restore after damage. A sound rule is 3-2-1: three copies, on two kinds of media, with one off-site. Test a restore; an untested backup is only a hope.',
      },
    ],
    example: {
      title: 'Recovering a budget file after a bad sync',
      scenario:
        'An intern edits the shared budget.xlsx, accidentally clears a sheet, and saves. The cloud client immediately syncs the broken file to every teammate.',
      steps: [
        {
          action:
            'Confirm the scope: open the file on two devices and check the modification time. Both show a blank sheet saved at 10:15, so this is a synced overwrite, not a display glitch.',
          result:
            'The team stops editing to avoid spreading the damage further.',
        },
        {
          action:
            'Restore the 09:05 version from the cloud version history. If history is unavailable, restore a backup from the night before and compare the totals and formulas.',
          result:
            'The file returns with the expected total of $48,250 and all formulas intact.',
        },
        {
          action:
            'Prevent a repeat: enable version history, keep daily backups on separate media, restrict write access to the finance group, and run a restore test each quarter.',
          result:
            'The next mistake can be reversed in minutes, and the backup is proven rather than assumed.',
        },
      ],
      conclusion:
        'Sync copies the latest state, including mistakes, to every device. Backup keeps earlier states. You need both, and you need to test the restore before an emergency.',
    },
    tradeoff: {
      gain:
        'Cloud and network storage make sharing and remote work easy, with provider maintenance, version history, and access from many devices.',
      cost:
        'You depend on connectivity and a provider, pay recurring fees, and place sensitive data under rules you do not fully control.',
      verdict:
        'Use fast local storage for active work, cloud or network storage for collaboration, and an independent, tested backup for recovery. Do not confuse the three.',
    },
    terms: [
      {
        term: 'Absolute path',
        definition:
          'A path that starts at the file system root and gives the full route to a file, such as /home/ana/reports/q3.pdf.',
      },
      {
        term: 'MIME type',
        definition:
          'A standard label for the type of content, such as image/png or application/pdf, used by browsers, servers, and email.',
      },
    ],
    keyTakeaways: [
      'A file is bytes plus metadata; a path is the route to it.',
      'An extension is a hint for choosing an app, while a MIME type is a content label; neither proves what the bytes are.',
      'Permissions should follow least privilege, with write access limited to the people who need it.',
      'Sync keeps devices identical; backup keeps older versions and must be tested.',
    ],
    pitfalls: [
      'Renaming a file converts it. Changing report.txt to report.pdf only changes the label; the bytes remain text.',
      'Cloud sync is a backup. Sync copies deletions and corruption everywhere, while a backup preserves earlier versions.',
      'Permissions are not only an administrator concern. Every user who shares a folder or link can expose data, so access choices matter at all levels.',
    ],
    focusPoints: [
      'Build an absolute and a relative path for the same file.',
      'Compare an extension with a MIME type.',
      'Design a 3-2-1 backup that is separate from sync.',
    ],
    quiz: [
      {
        question: 'Which of these is an absolute path?',
        options: [
          'notes.txt',
          '../notes.txt',
          '/home/ana/notes.txt',
          './notes.txt',
        ],
        answer: 2,
        explanation:
          'An absolute path starts at the root and works from any current directory. The others are relative: they depend on where the user or program currently is.',
      },
      {
        question:
          'A colleague renames chart.png to chart.jpg. Some apps then refuse to open it. What is the best explanation?',
        options: [
          'The rename compressed the image',
          'The extension changed, but the PNG bytes did not, so apps that trust the extension misread the file',
          'JPG files cannot contain images',
          'The file system deleted the header',
        ],
        answer: 1,
        explanation:
          'Renaming does not convert or corrupt the bytes. The extension is only a hint, so an app may try a JPEG decoder on PNG data and fail. The correct fix is to convert the file properly or restore the original name.',
      },
    ],
  },
  {
    chapterId: 'applications',
    hook: 'A budget spreadsheet can show the right total on screen while the file behind it no longer contains a working formula. The application is only the surface.',
    plainEnglish:
      'An application is a program that helps you do a task, and most office apps are really editors for structured data saved in a file.',
    oneIdea:
      'The document is the data; the app is one window onto it, so the format and version decide who can open it next.',
    whyItMatters:
      'Work moves between people, devices, and organizations. Choosing the wrong format or app can break formulas, hide content, or lock a team into a subscription it cannot leave.',
    objectives: [
      'Group applications by the data model they edit.',
      'Explain how word processors and spreadsheets store content and formulas.',
      'Evaluate file formats for interoperability and long-term access.',
      'Compare installed software, web apps, and SaaS licensing.',
    ],
    sections: [
      {
        title: 'Application categories and data models',
        body: 'Applications are grouped by the kind of data they edit. A word processor models flowing text with paragraphs, styles, and page layout. A spreadsheet models a grid of cells that can hold numbers, text, or formulas. A presentation tool models slides and objects; a browser renders web pages; an email client handles messages and folders. The data model shapes the tool: spreadsheets are excellent for totals and hypothetical changes, but poor for long prose, while word processors are the reverse. Choosing the right category is half the job. A database or a simple text editor may beat both when the real need is structured records.',
      },
      {
        title: 'Documents and spreadsheets under the hood',
        body: 'A .docx file is not a plain stream of text. It is a ZIP archive containing XML files for paragraphs, styles, images, and settings, which is why a document can carry formatting and still be compressed. An .xlsx workbook similarly stores sheets, shared strings, and formulas; the last calculated value is often cached beside the formula. A CSV file is just rows of comma-separated text: universal and simple, but it has no formulas, colors, column types, or multiple sheets. That difference matters when someone exports a budget to CSV and expects the totals to keep working. They will not; only the displayed numbers remain.',
      },
      {
        title: 'Formats and interoperability',
        body: 'Interoperability means a file opens correctly in another program or on another system. It depends on the format, the app version, fonts, and features used. DOCX and XLSX are widely supported but not perfectly identical everywhere; ODF is an open alternative, and PDF freezes layout for reading but is awkward to edit. CSV and JSON are good for exchanging raw data, not styling. Compatibility problems often appear as shifted page breaks, missing fonts, or broken formulas. Before sending an important file, export a copy, open it in the app the recipient likely uses, and check the result. Prefer open, documented formats when long-term access matters.',
      },
      {
        title: 'Collaboration, versioning, and licensing',
        body: 'Real-time collaboration lets several people edit one document while the service merges their changes. Change tracking and version history help when edits conflict, but they do not replace clear ownership. Cloud suites usually run on a subscription, often called SaaS: you rent access per user per month and the provider handles updates and storage. Perpetual licenses cost more up front and may be cheaper over years, but you manage installation and upgrades. Check where data is stored, who can export it, and what happens if you stop paying. Cheap seats are not cheap if leaving the platform means losing your archive.',
      },
    ],
    example: {
      title: 'Moving a budget between office suites without breaking it',
      scenario:
        'The finance team builds budget.xlsx with cross-sheet formulas, merged headers, and a custom font; the grand total is $48,250. A partner insists on editing it in a different cloud suite.',
      steps: [
        {
          action:
            'Open the original in the partner suite and inspect the formulas, links, and layout before changing anything.',
          result:
            'Two external links and several merged cells break, and two subtotal cells display $0 instead of their expected values.',
        },
        {
          action:
            'Export a CSV to move the raw numbers, then check what survives the round trip.',
          result:
            'The values arrive, but formulas, formatting, and the second sheet disappear, confirming CSV is only a data interchange format.',
        },
        {
          action:
            'Rebuild the working model in the target suite, replace external links with local references, lock calculated cells, and compare totals with the original.',
          result:
            'Both versions show $48,250, and the PDF sent to readers matches the approved layout.',
        },
      ],
      conclusion:
        'Choose the format for the consumer, test the round trip, and keep one authoritative source. A copy that merely looks right can still hide broken calculations.',
    },
    tradeoff: {
      gain:
        'Rich features, templates, and real-time collaboration let teams produce polished work quickly without building tools from scratch.',
      cost:
        'Subscriptions recur, formats can lock data into one vendor, and features or fonts may not survive the trip to another app.',
      verdict:
        'Standardize on one suite for editing, export open formats such as PDF, CSV, or ODF for exchange and archiving, and keep one authoritative copy.',
    },
    terms: [
      {
        term: 'File format',
        definition:
          'The rules that define how an application stores data in a file, such as DOCX, XLSX, PDF, or CSV.',
      },
      {
        term: 'SaaS',
        definition:
          'Software as a service: an application hosted by a provider and rented by subscription, usually through a browser.',
      },
    ],
    keyTakeaways: [
      'Applications are shaped by their data models: text, cells, slides, messages, or records.',
      'DOCX and XLSX are ZIP archives of XML parts, not simple text files.',
      'CSV is excellent for raw tabular exchange but drops formulas, formatting, and extra sheets.',
      'Match the format to the reader: editable source for the team, PDF for fixed layout, open data formats for exchange.',
    ],
    pitfalls: [
      'CSV keeps formulas. CSV stores displayed values as text, so totals become fixed numbers and no longer recalculate.',
      'PDF is a good editing master. PDF preserves layout for reading but is awkward for editing; keep the editable source separately.',
      'SaaS means you own the software. You rent access; stopping payment or leaving the provider can affect access and export.',
    ],
    focusPoints: [
      'Identify the data model behind a familiar app.',
      'Choose a format for editing, exchange, or archival.',
      'Check licensing, export, and collaboration terms before adopting a suite.',
    ],
    quiz: [
      {
        question:
          'Which format is best for sending a finished, print-ready report to external readers who must not edit it?',
        options: ['DOCX', 'CSV', 'XLSX', 'PDF'],
        answer: 3,
        explanation:
          'PDF fixes the layout and fonts for viewing and printing on many devices. DOCX and XLSX invite editing and may reflow, while CSV cannot represent the report layout at all.',
      },
      {
        question:
          'A team exports an XLSX budget to CSV and reopens it. What is lost?',
        options: [
          'Only the file name',
          'Formulas, formatting, and any extra sheets',
          'The numeric values',
          'Nothing, because CSV is a complete Excel format',
        ],
        answer: 1,
        explanation:
          'CSV stores rows of values as plain text. Formulas become fixed results, colors and column widths disappear, and only one sheet can be represented. The numbers survive, but the working model does not.',
      },
    ],
  },
  {
    chapterId: 'programming-web',
    hook: 'You type a web address, press Enter, and a page appears in under a second. Behind that blink are a language, a translation step, two computers, and a strict request-response contract.',
    plainEnglish:
      'Programming languages let people write instructions in readable form, and the web delivers the results between a browser and a server.',
    oneIdea:
      'Code is written once in a high-level language and translated for the machine; the web then splits the work between a browser and a remote server.',
    whyItMatters:
      'Almost every service you use is a web application built from these pieces. Knowing the split helps you debug failures, judge security claims, and understand why a page is slow.',
    objectives: [
      'Distinguish compiled from interpreted languages and high-level from low-level code.',
      'Explain which work belongs on the client and which on the server.',
      'Describe the roles of HTML, CSS, and JavaScript in a page.',
      'Trace an HTTP request and response, including a JSON API call.',
    ],
    sections: [
      {
        title: 'Languages, compilers, and interpreters',
        body: 'Source code is written in a language people can read. A high-level language such as Python or JavaScript hides memory addresses and CPU details; a low-level language such as assembly is close to the machine. A compiler translates the whole program into machine code before it runs, which can produce fast standalone programs but requires a build step. An interpreter reads and executes code as it goes, which is flexible but often slower. Many modern systems mix both: Java compiles to bytecode, then a virtual machine just-in-time compiles hot paths. Neither approach guarantees correct logic; translation only makes execution possible.',
      },
      {
        title: 'Client side and server side',
        body: 'The web splits work between a client and a server. The client is usually a browser on your device; it renders the interface and runs JavaScript. The server is a remote computer that stores data, checks identities, and applies business rules. When you load a page, the browser sends a request; the server returns HTML, CSS, JavaScript, images, or data. Client-side code is visible to users, so it must never hold passwords or decide who is allowed to delete a record. Server-side code enforces those rules. A slow server makes every client wait, while heavy client code drains battery life.',
      },
      {
        title: 'HTML, CSS, and JavaScript',
        body: 'A web page has three cooperating layers. HTML describes structure and meaning: headings, paragraphs, buttons, and links. CSS controls presentation: colors, spacing, and layout. JavaScript adds behavior: responding to clicks, validating input, and fetching new data. The same HTML can look completely different with another stylesheet, and it can still work with JavaScript disabled if the page is built sensibly. Use semantic elements so screen readers and search engines understand the page. A button should be a button, not a clickable div. Keep content in HTML, styling in CSS, and behavior in JavaScript; mixing them makes maintenance harder.',
        code: '<button id="save">Save note</button>\n<p id="status">Not saved</p>',
      },
      {
        title: 'HTTP, APIs, and JSON',
        body: 'HTTP is the request-response protocol of the web. A request names a method and path, such as GET /api/weather?city=Pune, plus headers and sometimes a body. A response returns a status code: 200 means success, 404 means not found, 401 means not authenticated, and 500 means the server failed. APIs are contracts that let one program call another, usually exchanging JSON. JSON is text with objects, arrays, strings, and numbers, such as {"city":"Pune","tempC":31}. Good APIs document their endpoints, errors, and versioning. They also validate every input, because a request can come from anywhere.',
        code: 'GET /api/weather?city=Pune HTTP/1.1\nHost: api.example.com\nAccept: application/json',
      },
    ],
    example: {
      title: 'Why a save button loses the note',
      scenario:
        'A student builds a note-taking page. Clicking Save shows no error, but after a refresh the new note is gone. The browser console shows a failed POST to /api/notes.',
      steps: [
        {
          action:
            'Reproduce the failure with the browser developer tools open. The Network panel shows POST /api/notes returning status 500, and the request body contains the note text.',
          result:
            'The client is sending data, but the server is failing while handling it, so the fault is likely server-side.',
        },
        {
          action:
            'Read the server log. The handler expects Content-Type: application/json, but the fetch call sent text/plain, so the parsed body is empty and the code crashes on a missing field.',
          result:
            'The contract mismatch explains both the 500 response and the missing note.',
        },
        {
          action:
            'Send the correct header, return 201 with the saved note, show a visible error message on failure, and retest create, refresh, and delete.',
          result:
            'The note survives a refresh, and a future failure now produces a useful message instead of silence.',
        },
      ],
      conclusion:
        'A web feature is a contract between client and server. Status codes, request headers, and logs narrow the fault before you change code blindly.',
    },
    tradeoff: {
      gain:
        'One codebase can reach users on any modern device, updates ship instantly, and APIs let services combine without rebuilding everything.',
      cost:
        'More moving parts, browser differences, network latency, and a large security surface; client code is public and servers must validate every request.',
      verdict:
        'The web is the default for reach and rapid updates, but it demands discipline: validate on the server, keep secrets there, and treat the client as untrusted.',
    },
    terms: [
      {
        term: 'Compiler',
        definition:
          'A program that translates source code into machine code or another target form before the program runs.',
      },
      {
        term: 'API',
        definition:
          'A defined interface that lets one program request data or actions from another, usually over HTTP with structured data such as JSON.',
      },
    ],
    keyTakeaways: [
      'High-level code is human-readable; compilers or interpreters translate it for the machine.',
      'The client renders and interacts; the server stores data and enforces rules.',
      'HTML gives structure, CSS gives style, and JavaScript gives behavior.',
      'HTTP status codes and JSON payloads are the contract between browser and server.',
    ],
    pitfalls: [
      'JavaScript is Java. They are unrelated languages with similar names; JavaScript runs mainly in browsers and Node.js, while Java runs on the JVM.',
      'The browser can keep a secret. Anything sent to the client can be inspected, so passwords, API keys, and authorization checks belong on the server.',
      'HTML is a programming language. HTML is markup that describes structure; it has no variables, loops, or general logic.',
    ],
    focusPoints: [
      'Trace a request from browser to server and back.',
      'Separate structure, style, and behavior in a page.',
      'Explain why server-side validation is mandatory.',
    ],
    quiz: [
      {
        question: 'Which statement best describes a compiler?',
        options: [
          'It translates source code into machine code before the program runs',
          'It stores cookies for the browser',
          'It executes code one line at a time and stops at the first error',
          'It only works for HTML pages',
        ],
        answer: 0,
        explanation:
          'A compiler performs translation ahead of execution and produces a runnable program. Executing line by line describes an interpreter, cookies are browser state, and HTML is markup rather than a compiled programming language.',
      },
      {
        question:
          'A browser sends a valid POST request and receives HTTP status 500. What does that tell you?',
        options: [
          'The user is not authenticated',
          'The requested page does not exist',
          'The server hit an internal error while handling the request',
          'The request succeeded',
        ],
        answer: 2,
        explanation:
          'Status codes in the 500 range mean the server failed while processing an otherwise reachable request. A 401 would point to authentication, 404 to a missing resource, and 2xx to success. The log usually holds the real cause.',
      },
    ],
  },
  {
    chapterId: 'virtualization-cloud',
    hook: 'A physical server that once ran one website can now run forty. A cloud console can create a new machine in another country in under a minute.',
    plainEnglish:
      'Virtualization uses software to split one physical computer into several pretend computers, and cloud computing rents those computers over the internet.',
    oneIdea:
      'Virtualization provides the abstraction; the cloud adds self-service, automation, and a business model that rents shared capacity by the minute.',
    whyItMatters:
      'Most new services run in clouds, and most corporate servers are virtualized. The model explains both the flexibility teams gain and the bills, outages, and security duties they must manage.',
    objectives: [
      'Explain how a hypervisor runs virtual machines and why isolation matters.',
      'Distinguish virtual machines from containers.',
      'Match IaaS, PaaS, and SaaS to the responsibilities of provider and customer.',
      'Reason about regions, availability, elasticity, shared responsibility, and cost.',
    ],
    sections: [
      {
        title: 'Virtual machines and hypervisors',
        body: 'A virtual machine is a complete computer implemented in software. It has virtual CPUs, memory, disks, and a network card, and it runs its own guest operating system. A hypervisor sits between the hardware and the guest, sharing physical resources while keeping guests isolated. Type 1 hypervisors run directly on the hardware, as in most data centers; Type 2 hypervisors run as apps on a desktop. Because each VM thinks it owns a machine, you can run Linux and Windows side by side or snapshot a system before an upgrade. The trade-off is overhead: every guest carries a full OS and duplicates memory and patching work.',
      },
      {
        title: 'Containers and isolation',
        body: 'A container packages an application with its libraries and dependencies, but it shares the host operating system kernel. That makes containers much lighter and faster to start than virtual machines: often seconds versus a minute, and megabytes versus gigabytes. The kernel enforces isolation with namespaces and cgroups, which control what a process can see and how much CPU or memory it can use. Because the kernel is shared, a kernel vulnerability can affect every container on the host. Use containers for portable services and rapid scaling; use VMs when you need a different OS, stronger boundaries, or full machine control.',
      },
      {
        title: 'IaaS, PaaS, SaaS, and regions',
        body: 'Cloud services are often sorted by how much you manage. With infrastructure as a service, or IaaS, you rent virtual machines, storage, and networks, and you install and patch the OS and runtime. With platform as a service, or PaaS, you deploy code and the provider manages the runtime, scaling, and patching. With software as a service, or SaaS, you simply use an application such as email or a CRM. Providers organize resources into regions, which are geographic areas, and availability zones, which are separate data centers within a region. Zones reduce the chance that one failure takes everything down.',
      },
      {
        title: 'Shared responsibility and cost control',
        body: 'Cloud security is shared. The provider secures the physical buildings, hardware, and core network; you secure your accounts, data, configurations, and access rules. A public storage bucket left readable is your mistake, not a mistake by the provider. Cost works the same way: you control usage. Elasticity lets capacity grow automatically with demand and shrink afterward, which is powerful but can also multiply spending. Common leaks include forgotten test machines, oversized databases, idle load balancers, and data transfer fees. Set budgets and alerts, tag resources by team, right-size instances, and schedule shutdowns for non-production systems. Review the bill monthly, not after a surprise.',
      },
    ],
    example: {
      title: 'Preparing a small shop for a tenfold traffic spike',
      scenario:
        'An online shop runs on one 4 vCPU, 8 GB cloud server. It handles 200 requests per second at 40 percent CPU, but a holiday sale is expected to reach 2,000 requests per second.',
      steps: [
        {
          action:
            'Load-test the current server and record where it saturates. It stays stable to about 400 requests per second, so the forecast is five times beyond capacity and the single server is also a single point of failure.',
          result:
            'The team confirms that vertical scaling alone would be expensive and still leave an outage risk.',
        },
        {
          action:
            'Deploy two application servers behind a load balancer in two availability zones, add a managed database with a standby, and configure autoscaling from 2 to 10 instances.',
          result:
            'A repeat load test reaches 2,000 requests per second with p95 latency under 300 ms, and shutting down one zone still serves traffic.',
        },
        {
          action:
            'Estimate the cost: 10 instances at $0.10 per hour for 6 peak hours is about $6 in compute, plus database and transfer charges. Set a budget alert and a scale-down policy.',
          result:
            'The monthly bill stays within the cap, and capacity returns to two instances after the sale.',
        },
      ],
      conclusion:
        'Elasticity is a design decision, not automatic magic. Redundancy costs money, but a planned budget and a failure test make the trade-off visible.',
    },
    tradeoff: {
      gain:
        'Capacity arrives in minutes, scales with demand, spans regions, and needs no owned hardware or data-center staff.',
      cost:
        'Bills recur and can grow quietly, data transfer and lock-in add friction, and the customer still owns security of data, identity, and configuration.',
      verdict:
        'Cloud is a strong default for variable demand and global reach, but only with budgets, tagging, backups, and a clear split of security duties.',
    },
    terms: [
      {
        term: 'Hypervisor',
        definition:
          'Software that creates and runs virtual machines by sharing the hardware of a host computer while keeping guests isolated.',
      },
      {
        term: 'Elasticity',
        definition:
          'The ability to add or remove computing resources automatically as demand changes, then pay for what was used.',
      },
    ],
    keyTakeaways: [
      'A VM is a full software computer with its own guest OS; a hypervisor shares the physical host.',
      'Containers share the host kernel, so they are lighter but offer weaker isolation than VMs.',
      'IaaS, PaaS, and SaaS differ in how much of the stack the provider manages.',
      'Elasticity is powerful only when paired with budgets, monitoring, and failure testing.',
    ],
    pitfalls: [
      'Cloud is always cheaper. Owning hardware can be cheaper for steady, predictable loads; cloud wins when demand varies or speed matters.',
      'Containers and VMs are the same. Containers share a kernel and start in seconds; VMs carry a full OS and provide a stronger boundary.',
      'The provider secures everything. The provider secures the physical infrastructure; customers still secure accounts, data, permissions, and configurations.',
    ],
    focusPoints: [
      'Compare a VM and a container for a given workload.',
      'Place a service in IaaS, PaaS, or SaaS.',
      'Design for failure and cost, not only for launch.',
    ],
    quiz: [
      {
        question:
          'Which option gives the strongest isolation between two applications on one physical host?',
        options: [
          'Two containers sharing the host kernel',
          'Two virtual machines, each with its own guest operating system',
          'Two threads inside one process',
          'Two functions in one serverless application',
        ],
        answer: 1,
        explanation:
          'A hypervisor places a separate guest OS behind a virtual hardware boundary. Containers share the host kernel, so a kernel flaw can cross between them; threads share memory, and serverless functions share a runtime.',
      },
      {
        question:
          'A team leaves 20 test virtual machines running all month, and the cloud bill jumps. Which response best addresses the cause?',
        options: [
          'Buy more reserved capacity for the test machines',
          'Move everything to a larger region',
          'Set budgets and alerts, tag resources, and schedule automatic shutdown for non-production machines',
          'Disable monitoring to reduce overhead',
        ],
        answer: 2,
        explanation:
          'Idle resources need visibility and lifecycle control. Budgets and alerts expose the spend, tags assign ownership, and scheduled shutdowns remove waste. Reserved capacity locks in more spending, a region change does not fix idle machines, and disabling monitoring hides the problem.',
      },
    ],
  },
];
