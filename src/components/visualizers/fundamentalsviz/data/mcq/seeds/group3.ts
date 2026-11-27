import type { ITProblemSeed } from '../types';

export const group3Seeds: ITProblemSeed[] = [
  // multimedia-compression (21)
  {
    chapterId: 'multimedia-compression',
    title: 'Pixel Dimensions and Resolution',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the resolution of a digital image describe?',
    options: [
      'The number of pixels across and down the image',
      'The number of frames captured each second',
      'The number of bits transferred per second',
      'The number of colours a monitor can display',
    ],
    answer: 0,
    explanation:
      'Resolution is the pixel grid, usually written as width by height. Frame rate and bitrate describe time-based media, while colour depth concerns bits per pixel.',
    hint: 'Think of the rows and columns that make up the picture.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Oversized Web Photo',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A product photo is 6000 by 4000 pixels and will appear in a 300 by 200 pixel box on a shopping page.',
    prompt: 'What change best reduces download size without a visible loss on that page?',
    options: [
      'Increase the JPEG quality to 100',
      'Convert the image to a RAW camera file',
      'Resize it close to 300 by 200 pixels before export',
      'Raise the colour depth to 48 bits per pixel',
    ],
    answer: 2,
    explanation:
      'A 6000 by 4000 file contains far more pixels than a 300 by 200 box can show. Downscaling removes unseen detail and saves bandwidth.',
    hint: 'Match the pixel count to the space where the image is displayed.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Colour Depth Capacity',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A 24-bit colour image uses 24 bits per pixel. How many distinct colours can a pixel represent?',
    options: [
      'Exactly 24',
      'About 16.7 million',
      'Exactly 256',
      'Exactly 1,024',
    ],
    answer: 1,
    explanation:
      'Twenty-four bits give 2 to the power 24 combinations, about 16.7 million. That usually means eight bits each for red, green, and blue.',
    hint: 'Raise two to the number of bits per pixel.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Lossy Versus Lossless',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which statement correctly contrasts lossy and lossless compression?',
    options: [
      'Lossy keeps every original bit, while lossless discards some',
      'Both always reproduce the original data exactly',
      'Lossless only works for video, while lossy only works for images',
      'Lossless restores the original exactly, while lossy permanently discards detail',
    ],
    answer: 3,
    explanation:
      'Lossless compression can rebuild the original data byte for byte. Lossy compression removes detail it judges less noticeable, and that detail cannot be recovered.',
    hint: 'Ask which method can return the exact original after decompression.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Archival Scan Format',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A volunteer is scanning historical photographs for an archive that must preserve fine detail for future restoration work.',
    prompt: 'Which export choice best suits that goal?',
    options: [
      'A low-quality JPEG small enough for email',
      'An MP3 audio export',
      'A lossless format such as PNG or TIFF',
      'A heavily compressed MP4 video of each photo',
    ],
    answer: 2,
    explanation:
      'Archival scans should avoid permanent detail loss, so a lossless image format is appropriate. JPEG would introduce artefacts that later restoration cannot undo.',
    hint: 'Preservation favours formats that keep every captured pixel.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Blurry Receipt Photo',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A traveller photographs a paper receipt, but the small printed text looks blocky and unreadable when zoomed in.',
    prompt: 'Which change most directly improves the legibility of the text?',
    options: [
      'Capture at higher quality or use a lossless image format',
      'Increase the colour saturation of the photo',
      'Reduce the image resolution before saving',
      'Convert the photo into an audio file',
    ],
    answer: 0,
    explanation:
      'Blocky artefacts around thin strokes come from heavy lossy compression. Higher quality or lossless capture keeps the edges of the letters intact.',
    hint: 'Compression damage shows up most around sharp dark edges.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Audio Sample Rate',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'An audio sample rate of 44.1 kHz means that the recorder takes what measurement?',
    options: [
      '44,100 bits of storage every second',
      '44,100 snapshots of the waveform every second',
      '44.1 channels of sound every second',
      '44.1 kilobytes of data every minute',
    ],
    answer: 1,
    explanation:
      'Hertz counts cycles or events per second, so 44.1 kHz means 44,100 samples per second. Each sample records the waveform level at that instant.',
    hint: 'Hertz measures events per second, not data per second.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Frame Rate Meaning',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A video recorded at 30 frames per second contains what?',
    options: [
      'Thirty bits of colour for every pixel',
      'Thirty pixels in each row of the picture',
      'Thirty seconds of audio for every minute',
      'Thirty still images for every second of playback',
    ],
    answer: 3,
    explanation:
      'Frame rate is the number of still images shown per second. More frames can make motion smoother, but they also increase the raw data produced.',
    hint: 'Picture a flipbook and how many pages pass each second.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Podcast Export Choice',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A spoken-word podcast will be downloaded over mobile data. The host wants clear speech without wasting bandwidth.',
    prompt: 'Which export setting is the most sensible starting point?',
    options: [
      'Uncompressed stereo WAV at 44.1 kHz',
      'FLAC at 24 bits and 96 kHz',
      'Mono MP3 or AAC at roughly 64 to 96 kbps',
      'Stereo MP3 at 320 kbps',
    ],
    answer: 2,
    explanation:
      'Speech needs a narrow frequency range, so a modest mono bitrate stays clear while cutting download size. Lossless or high-bitrate stereo mostly wastes bytes on speech.',
    hint: 'Speech carries less acoustic detail than music.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Container Versus Codec',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In a video file, what is the difference between a container and a codec?',
    options: [
      'A container packages tracks and metadata; a codec compresses and decompresses a stream',
      'A container compresses pixels; a codec stores subtitles',
      'A container is hardware; a codec is a cable',
      'A container sets the frame rate; a codec sets the resolution',
    ],
    answer: 0,
    explanation:
      'Formats such as MP4 or MKV are containers holding video, audio, and metadata. Codecs such as H.264 or AV1 define how a stream is compressed inside that container.',
    hint: 'Think of a box and the method used to squeeze what goes in it.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Raw Image Size Calculation',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'An uncompressed image is 1920 by 1080 pixels at 24 bits per pixel. What is its approximate size?',
    options: [
      'About 0.6 MB',
      'About 6.2 MB',
      'About 2.1 MB',
      'About 24 MB',
    ],
    answer: 1,
    explanation:
      '1920 times 1080 is about 2.07 million pixels. At three bytes per pixel that is roughly 6.2 million bytes, or 6.2 MB before compression.',
    hint: 'Multiply pixel count by bytes per pixel, then convert.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Uncompressed Audio Size',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A sound engineer plans a three-minute stereo recording at 44.1 kHz with 16-bit samples and wants to estimate raw storage.',
    prompt: 'Which figure is closest to the uncompressed size?',
    options: [
      'About 5 MB',
      'About 16 MB',
      'About 64 MB',
      'About 32 MB',
    ],
    answer: 3,
    explanation:
      '44,100 samples per second times two bytes times two channels times 180 seconds gives about 31.8 million bytes, or roughly 32 MB.',
    hint: 'Multiply rate, bytes per sample, channels, and duration.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'JPEG for Sharp Logos',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why is JPEG usually a poor choice for a logo with flat colours and sharp edges?',
    options: [
      'It introduces block artefacts and blur around high-contrast edges',
      'It cannot represent the colour red',
      'It supports only sixteen colours per image',
      'It always produces a larger file than any other format',
    ],
    answer: 0,
    explanation:
      'JPEG is tuned for photographs and discards fine detail. Flat colour areas and crisp lettering make the resulting blockiness and edge blur easy to see.',
    hint: 'Consider how a lossy photo codec treats a hard boundary.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Slow Hero Image',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A news site serves a four-megabyte PNG photograph as the top banner, and readers on mobile connections complain about slow loads.',
    prompt: 'Which change gives the biggest practical improvement?',
    options: [
      'Rename the file from .png to .jpg',
      'Increase the image bit depth',
      'Compress it as a modern lossy format and serve responsive sizes',
      'Add a thicker border around the banner',
    ],
    answer: 2,
    explanation:
      'Re-encoding the photo with a modern lossy codec and sending smaller versions to small screens cuts transferred bytes. Renaming a file does not change its encoding.',
    hint: 'The bytes transferred, not the filename, determine download time.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Chroma Subsampling',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What does 4:2:0 chroma subsampling reduce in a compressed video stream?',
    options: [
      'The audio sample rate',
      'The resolution used to store colour detail',
      'The number of frames per second',
      'The container metadata size',
    ],
    answer: 1,
    explanation:
      'Human vision resolves brightness more finely than colour. 4:2:0 keeps full luma detail but stores colour at lower resolution, saving bits with little visible change.',
    hint: 'It exploits the weak sensitivity of human vision to fine colour detail.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Screen Recording Text',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A trainer records a slide deck at a low bitrate. Fine bullet text and the moving cursor look smeared during playback.',
    prompt: 'Which adjustment is most likely to fix the problem?',
    options: [
      'Lower the frame rate to five frames per second',
      'Convert the audio track to mono',
      'Reduce the output resolution to 480p',
      'Raise the video bitrate or use a screen-content codec',
    ],
    answer: 3,
    explanation:
      'Sharp text and a moving cursor need many bits, especially during motion. A higher bitrate or a codec designed for screen content preserves those edges.',
    hint: 'Fine detail and motion are expensive to encode.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Photo Location Leak',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A journalist posts a phone photo online, then discovers that viewers can see the exact street where it was taken.',
    prompt: 'Which part of the file most likely exposed that location?',
    options: [
      'GPS coordinates stored in EXIF metadata',
      'The image colour profile',
      'The audio sample rate',
      'The file permission bits',
    ],
    answer: 0,
    explanation:
      'Phone cameras often write GPS coordinates and capture details into EXIF metadata. Sharing the original file can therefore reveal where and when it was taken.',
    hint: 'The pixels are not the only data inside a photo file.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Streaming Data Estimate',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A ninety-minute training video is encoded at 5 Mbps and will be streamed to remote staff.',
    prompt: 'Roughly how much data does one viewing transfer?',
    options: [
      'About 0.5 GB',
      'About 3.4 GB',
      'About 27 GB',
      'About 450 MB',
    ],
    answer: 1,
    explanation:
      'Five megabits per second is about 0.625 megabytes per second. Over 5,400 seconds that comes to roughly 3,375 MB, or about 3.4 GB.',
    hint: 'Divide megabits by eight before multiplying by the duration.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Repeated JPEG Saves',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Why does repeatedly opening, editing, and saving the same JPEG gradually degrade its quality?',
    options: [
      'The file system adds a checksum on every save',
      'The colour depth increases beyond the display range',
      'Each save re-encodes the image and discards more detail',
      'The EXIF metadata overwrites some pixels',
    ],
    answer: 2,
    explanation:
      'Every JPEG save approximates an image that is already an approximation, so artefacts accumulate. Editing from a lossless master avoids generation loss.',
    hint: 'Think about approximating something that was already approximated.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Long-Term Video Archive',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A studio must keep finished film masters readable for twenty years, accept no quality loss, and still control storage growth.',
    prompt: 'Which approach is most appropriate?',
    options: [
      'Store only low-bitrate MP4 copies for phones',
      'Keep a folder of JPEG stills instead of video',
      'Re-encode every master monthly at a lower bitrate',
      'Keep lossless or high-quality master files with checksums and a migration plan',
    ],
    answer: 3,
    explanation:
      'Archives prioritise fidelity, integrity checks, and future readability. Lossless masters plus planned format migration cost more storage but prevent irreversible quality loss.',
    hint: 'An archive must survive both bit rot and changing playback software.',
  },
  {
    chapterId: 'multimedia-compression',
    title: 'Bitrate Versus Resolution',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Two videos are both 1080p; one is encoded at 8 Mbps and the other at 2 Mbps. Which conclusion is most defensible?',
    options: [
      'The 8 Mbps video has four times as many pixels',
      'The 8 Mbps video usually keeps more detail but consumes four times the data',
      'The 2 Mbps video must have a higher frame rate',
      'Bitrate alone determines the width and height of the picture',
    ],
    answer: 1,
    explanation:
      'Both share the same pixel dimensions, so resolution is equal. The higher bitrate can preserve more detail in complex scenes, at four times the bandwidth cost.',
    hint: 'Separate pixel count from the rate used to describe those pixels.',
  },

  // operating-systems (20)
  {
    chapterId: 'operating-systems',
    title: 'Operating System Role',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the central job of an operating system?',
    options: [
      'Manage hardware resources and provide services that applications use',
      'Create business documents and presentations',
      'Compile source code into web pages',
      'Store data permanently on behalf of the user',
    ],
    answer: 0,
    explanation:
      'The OS coordinates CPU time, memory, storage, and devices, and exposes services such as files and networking. Documents and compilers are applications, not the core OS role.',
    hint: 'Think about what must coordinate everything else.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Kernel Definition',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the kernel of an operating system?',
    options: [
      'The graphical desktop and its icons',
      'The privileged core that manages memory, CPU time, and devices',
      'A user application for editing photos',
      'A physical chip that stores files',
    ],
    answer: 1,
    explanation:
      'The kernel runs with elevated privileges and controls access to hardware. The desktop is a user-space program that asks the kernel to perform privileged work.',
    hint: 'It is the part allowed to touch protected hardware directly.',
  },
  {
    chapterId: 'operating-systems',
    title: 'One Frozen Application',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A user reports that a browser window has stopped responding, but the file manager and clock still work normally.',
    prompt: 'What does this situation most likely indicate?',
    options: [
      'The kernel has stopped running completely',
      'The CPU has physically failed',
      'One process is stuck while the OS continues running others',
      'The hard disk is completely empty',
    ],
    answer: 2,
    explanation:
      'A hung application can be closed while the kernel keeps scheduling other processes. A total kernel failure would affect every program, not just the browser.',
    hint: 'Notice which parts of the system still respond.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Definition of a Process',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In operating-system terms, what is a process?',
    options: [
      'A file stored in a folder',
      'A user account with a password',
      'A cable connecting two computers',
      'A running program with its own memory and execution state',
    ],
    answer: 3,
    explanation:
      'A process is a program in execution, including its memory, registers, and open resources. The same program can run as several independent processes at once.',
    hint: 'Distinguish the stored program from the version that is running.',
  },
  {
    chapterId: 'operating-systems',
    title: 'System Software Example',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which item is system software rather than an application?',
    options: [
      'A device driver',
      'A photo editor',
      'A web browser',
      'A spreadsheet program',
    ],
    answer: 0,
    explanation:
      'Device drivers are system software that let the OS communicate with hardware. Photo editors, browsers, and spreadsheets are applications built for end users.',
    hint: 'Ask which item supports the machine rather than a user task.',
  },
  {
    chapterId: 'operating-systems',
    title: 'New Printer Driver',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A worker connects a new office printer. The OS detects the device but cannot send jobs to it.',
    prompt: 'What does the OS most likely need before the printer will work?',
    options: [
      'A spreadsheet macro',
      'A compatible device driver',
      'An extra font package',
      'A browser extension',
    ],
    answer: 1,
    explanation:
      'A driver translates general OS commands into instructions the printer understands. Without a compatible driver, the device may be detected but remain unusable.',
    hint: 'The OS needs a translator for this specific hardware.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Multitasking Appearance',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does multitasking mean at the operating-system level?',
    options: [
      'Running only one program until it finishes',
      'Copying every file into memory at boot',
      'Switching the CPU among processes quickly to create the appearance of simultaneous work',
      'Increasing the monitor refresh rate',
    ],
    answer: 2,
    explanation:
      'The scheduler gives each runnable process a slice of CPU time and switches rapidly. On multi-core systems, some processes also run genuinely in parallel.',
    hint: 'Many tasks appear to progress at once on a limited CPU.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Browser Tabs and RAM',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A laptop has 8 GB of RAM. With sixty browser tabs open, it slows sharply and the disk activity light stays busy.',
    prompt: 'Which resource shortage best explains the slowdown?',
    options: [
      'Network bandwidth',
      'Monitor refresh rate',
      'Keyboard input buffer',
      'Physical memory, forcing the OS to page to disk',
    ],
    answer: 3,
    explanation:
      'When RAM fills, the OS moves pages to disk and reads them back, which is far slower than memory access. Closing tabs or adding RAM reduces that pressure.',
    hint: 'The busy disk points to where overflow memory is going.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Purpose of Virtual Memory',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does virtual memory allow an operating system to do?',
    options: [
      'Give each process its own address space and use disk as an overflow for RAM',
      'Increase the physical clock speed of the CPU',
      'Encrypt every file automatically',
      'Connect the computer to a wireless network',
    ],
    answer: 0,
    explanation:
      'Virtual memory maps process addresses to physical frames and can move inactive pages to disk. That isolation and flexibility cost performance when paging is heavy.',
    hint: 'It separates the addresses a program sees from real memory chips.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Thrashing Symptom',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A workstation with too little RAM spends most of its time moving pages between memory and disk, so every application feels frozen.',
    prompt: 'What is this behaviour called?',
    options: [
      'Overclocking',
      'Thrashing',
      'Defragmentation',
      'Spooling',
    ],
    answer: 1,
    explanation:
      'Thrashing is excessive paging that leaves little time for useful work. Adding memory or reducing the number of active processes is the usual remedy.',
    hint: 'The system is busy but accomplishing very little.',
  },
  {
    chapterId: 'operating-systems',
    title: 'File System Responsibility',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is a file system mainly responsible for?',
    options: [
      'Rendering web pages in a browser',
      'Compiling source code into programs',
      'Organising files and directories and tracking where their data blocks live',
      'Checking user passwords at login',
    ],
    answer: 2,
    explanation:
      'A file system provides names, directories, metadata, and block allocation on storage. Authentication and compilation are handled by other OS components or applications.',
    hint: 'It imposes structure on a raw storage device.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Cross-Platform USB Format',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A video editor needs a USB drive that both Windows and macOS can read and write, including single files larger than 4 GB.',
    prompt: 'Which file system is the safest choice for that requirement?',
    options: [
      'FAT32',
      'NTFS',
      'ext4',
      'exFAT',
    ],
    answer: 3,
    explanation:
      'exFAT is widely supported on both systems and handles large files. FAT32 has a 4 GB file limit, while NTFS writing and ext4 support are not universal on macOS.',
    hint: 'Cross-platform support and large-file limits both matter here.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Scheduling a Video Call',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A video call stutters while a large rendering job runs in the background. The OS gives the call short, frequent turns and lets the render use longer stretches.',
    prompt: 'What is the scheduler primarily balancing?',
    options: [
      'Responsiveness for interactive work against throughput for long jobs',
      'Disk capacity against monitor resolution',
      'Password strength against login speed',
      'Network encryption against cable length',
    ],
    answer: 0,
    explanation:
      'Interactive tasks need the CPU often and briefly, while batch work benefits from longer runs. The scheduler trades latency against overall throughput.',
    hint: 'Two workloads want CPU time for different reasons.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Why Updates Need Restarts',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An operating-system update downloads successfully but asks the user to restart before it takes effect.',
    prompt: 'Why is a restart often necessary?',
    options: [
      'The monitor needs to recalibrate its colours',
      'Core system files are in use and must be replaced before the new kernel and drivers load',
      'RAM must be permanently emptied and cannot be reused',
      'The software licence expires at shutdown',
    ],
    answer: 1,
    explanation:
      'Running processes hold core files open, so the update stages replacements and installs them during boot. Restarting also loads the new kernel and drivers cleanly.',
    hint: 'Some files cannot be swapped while they are being used.',
  },
  {
    chapterId: 'operating-systems',
    title: 'User Mode Restrictions',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why can a normal application not write directly to a disk controller register?',
    options: [
      'All disks are physically read-only',
      'Applications are forbidden from using files',
      'It runs in user mode without the privilege to access hardware directly',
      'Kernel space is reserved for web browsers',
    ],
    answer: 2,
    explanation:
      'User-mode code is deliberately restricted so a faulty or malicious app cannot corrupt the system. It must request privileged operations through system calls.',
    hint: 'The CPU enforces two levels of privilege.',
  },
  {
    chapterId: 'operating-systems',
    title: 'High Memory Use',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A user task manager shows memory at 95 percent, with the browser using 3 GB and several background apps open.',
    prompt: 'What is the most sensible first response?',
    options: [
      'Delete the operating system',
      'Replace the monitor',
      'Disable the keyboard',
      'Close unused tabs and applications, or add more RAM if this is routine',
    ],
    answer: 3,
    explanation:
      'High memory use from many open programs is relieved by reducing demand or increasing capacity. Reinstalling or replacing unrelated hardware does not address the shortage.',
    hint: 'Start with what is consuming the memory.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Context Switch',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What happens during a context switch?',
    options: [
      'The OS saves one process state and restores another so the CPU can run it',
      'The OS permanently deletes the paused process',
      'RAM is converted into long-term disk storage',
      'The display resolution changes to match the app',
    ],
    answer: 0,
    explanation:
      'A context switch stores registers and scheduling state for the outgoing process, then reloads those for the incoming one. It enables multitasking but consumes time.',
    hint: 'The CPU must be able to resume each task exactly where it stopped.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Robot Control Scheduling',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A robot controller must react to a sensor within five milliseconds on every cycle, regardless of other work.',
    prompt: 'Which scheduling approach best fits that requirement?',
    options: [
      'Equal round-robin slices among all tasks',
      'Priority-based preemptive scheduling with bounded latency',
      'Overnight batch processing',
      'First come, first served, with long jobs first',
    ],
    answer: 1,
    explanation:
      'A deadline-driven system needs the control task to preempt less urgent work and receive a predictable response time. Equal sharing or batch queues cannot guarantee the deadline.',
    hint: 'The key word is guaranteed, not average.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Page Fault Meaning',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'A page fault occurs when a running process does what?',
    options: [
      'Enters the wrong password',
      'Deletes a file it does not own',
      'Accesses a virtual page that is not currently in physical memory',
      'Writes more data than the disk can hold',
    ],
    answer: 2,
    explanation:
      'The memory manager traps the access, loads the needed page from disk or creates it, then resumes the instruction. Frequent faults slow a system considerably.',
    hint: 'It is about a missing piece of memory, not a user mistake.',
  },
  {
    chapterId: 'operating-systems',
    title: 'Missing Shared Library',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'After a system library update, an application fails to start and reports a missing symbol at load time.',
    prompt: 'Which explanation fits the startup error best?',
    options: [
      'The monitor is too small',
      'The mouse battery is low',
      'The file name is too long',
      'A shared library version mismatch or unresolved dependency',
    ],
    answer: 3,
    explanation:
      'Dynamically linked programs expect specific library versions and symbols. Replacing a library without the expected interface breaks loading until the dependency is fixed.',
    hint: 'The error appears before the application can draw a window.',
  },

  // files-storage (21)
  {
    chapterId: 'files-storage',
    title: 'Absolute Path Recognition',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which of these is an absolute path on a Linux system?',
    options: [
      '/home/ana/reports/q3.pdf',
      'reports/q3.pdf',
      '../q3.pdf',
      'q3.pdf',
    ],
    answer: 0,
    explanation:
      'An absolute path starts at the root directory, shown by the leading slash. The other paths are relative to the current working directory.',
    hint: 'Look for the path that starts at the top of the tree.',
  },
  {
    chapterId: 'files-storage',
    title: 'Same Name in Two Folders',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A student saves report.docx to Documents, then later opens an older report.docx from Downloads and wonders why the edits are missing.',
    prompt: 'What best explains the confusion?',
    options: [
      'The operating system merged both files automatically',
      'File extensions are unique across the whole disk',
      'Two files with the same name exist in different folders',
      'Word hides every second copy of a document',
    ],
    answer: 2,
    explanation:
      'A filename identifies a file only within its folder. The same name in Documents and Downloads refers to two separate files with different contents.',
    hint: 'A name is unique only inside its own directory.',
  },
  {
    chapterId: 'files-storage',
    title: 'Purpose of a File Extension',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does a file extension usually indicate?',
    options: [
      'The file owner and its permissions',
      'The file format and the application likely to open it',
      'The exact size of the file in bytes',
      'The folder in which the file must be stored',
    ],
    answer: 1,
    explanation:
      'Extensions such as .pdf or .docx are naming conventions that help the OS choose a default application. They describe format expectations but do not guarantee the content.',
    hint: 'It is a label at the end of the name, not the data itself.',
  },
  {
    chapterId: 'files-storage',
    title: 'Purpose of a Folder',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is a folder or directory?',
    options: [
      'A type of physical disk',
      'A file that contains no data',
      'A protocol for transferring files',
      'A container that organises files and other folders',
    ],
    answer: 3,
    explanation:
      'A directory groups related files and can contain subdirectories, forming a tree. It provides organisation and a place for names and permissions to apply.',
    hint: 'Think of the drawers and folders in a filing cabinet.',
  },
  {
    chapterId: 'files-storage',
    title: 'Renamed Spreadsheet',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A user renames budget.xlsx to budget.txt, then finds that the spreadsheet application no longer opens it in the usual way.',
    prompt: 'Why does the rename not convert the file?',
    options: [
      'Changing the extension does not change the internal file format',
      'The file is now encrypted by the operating system',
      'The disk lost the file contents during the rename',
      'Spreadsheet apps require uppercase file names',
    ],
    answer: 0,
    explanation:
      'The extension is only part of the name. The bytes are still in the original spreadsheet format, so renaming can confuse the OS without converting anything.',
    hint: 'A label does not rewrite the contents of the box.',
  },
  {
    chapterId: 'files-storage',
    title: 'Backup Versus Sync',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the key difference between backup and sync?',
    options: [
      'Backup only works on phones, while sync only works on computers',
      'Backup keeps a restorable copy over time, while sync mirrors current changes',
      'Sync stores files permanently, while backup deletes older copies',
      'Both terms mean exactly the same process',
    ],
    answer: 1,
    explanation:
      'Sync copies current changes between devices, including deletions. Backup preserves earlier copies so data can be restored after loss, corruption, or ransomware.',
    hint: 'Ask which one can recover yesterday before a mistake.',
  },
  {
    chapterId: 'files-storage',
    title: 'Cloud Deletion Propagation',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A user deletes a project folder on a laptop, and the folder immediately disappears from the cloud drive and the user phone too.',
    prompt: 'What explains this behaviour?',
    options: [
      'Cloud storage is always read-only',
      'The phone formatted the cloud account',
      'Sync mirrors changes, including deletions, to every device',
      'The backup service automatically erased history',
    ],
    answer: 2,
    explanation:
      'Synchronisation keeps devices identical by applying changes in both directions, so a deletion propagates. A versioned backup is what protects against an accidental removal.',
    hint: 'Every device is being kept in the same state.',
  },
  {
    chapterId: 'files-storage',
    title: 'Read-Only Permission',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which permission setting lets a user open and view a file but not modify it?',
    options: [
      'Read-write',
      'Execute-only',
      'Full control',
      'Read-only',
    ],
    answer: 3,
    explanation:
      'Read-only access permits viewing and copying but blocks writes. Read-write and full control include editing, while execute-only is about running a program.',
    hint: 'Match the setting name to the ability to change content.',
  },
  {
    chapterId: 'files-storage',
    title: 'Administrator Prompt on Copy',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An employee tries to copy a report into a protected system folder, and the OS asks for administrator approval.',
    prompt: 'What does the prompt indicate?',
    options: [
      'The destination requires elevated permission',
      'The file is corrupted and cannot be read',
      'The disk is completely full',
      'The mouse driver is missing',
    ],
    answer: 0,
    explanation:
      'Protected folders are writable only by privileged accounts or administrators. The OS is enforcing permissions rather than reporting a damaged file or disk.',
    hint: 'The request is about who may write there.',
  },
  {
    chapterId: 'files-storage',
    title: 'Purpose of a MIME Type',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is a MIME type used for?',
    options: [
      'Storing the file owner and creation date',
      'Compressing the file before transfer',
      'Telling software the content type so it can handle it correctly',
      'Assigning a permanent IP address to a server',
    ],
    answer: 2,
    explanation:
      'A MIME type such as text/html or image/png describes content so browsers and servers handle it appropriately. It complements, rather than replaces, the filename extension.',
    hint: 'It labels what kind of content is being sent.',
  },
  {
    chapterId: 'files-storage',
    title: 'HTML Served as Plain Text',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A web server sends an HTML file with the header Content-Type: text/plain.',
    prompt: 'What will the browser most likely do?',
    options: [
      'Refuse every connection to the site',
      'Display the markup as plain text instead of rendering the page',
      'Convert the file into a PDF automatically',
      'Install an operating system update',
    ],
    answer: 1,
    explanation:
      'The Content-Type tells the browser how to interpret the bytes. Labelling HTML as plain text makes the browser show the tags rather than build the page.',
    hint: 'The header overrides the expectation set by the file content.',
  },
  {
    chapterId: 'files-storage',
    title: 'Offline File Availability',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'A consultant needs a large file available during a flight with no internet access. Which storage choice is most reliable?',
    options: [
      'A cloud-only file that streams on demand',
      'A network share at the office',
      'A link to an intranet page',
      'A local copy on the laptop disk',
    ],
    answer: 3,
    explanation:
      'Offline access requires the bytes to be present on the device. Cloud-only or network files depend on connectivity, which the flight does not provide.',
    hint: 'No internet means no remote storage.',
  },
  {
    chapterId: 'files-storage',
    title: 'Resolving a Relative Path',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A script running in /home/ana/work/scripts opens the relative path ../../data/input.csv.',
    prompt: 'Which absolute path does it resolve to?',
    options: [
      '/home/ana/data/input.csv',
      '/home/ana/work/data/input.csv',
      '/data/input.csv',
      '/home/data/input.csv',
    ],
    answer: 0,
    explanation:
      'Each .. moves up one directory: from scripts to work, then to ana. Appending data/input.csv gives /home/ana/data/input.csv.',
    hint: 'Walk upward once for every double dot.',
  },
  {
    chapterId: 'files-storage',
    title: 'Interpreting Permission Bits',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'A file has permissions rwxr-x---. What can members of the owning group do?',
    options: [
      'Read, write, and execute the file',
      'Nothing at all',
      'Read and execute it, but not write to it',
      'Write to it, but not read it',
    ],
    answer: 2,
    explanation:
      'The middle triple r-x grants group members read and execute, while write is absent. The final triple --- denies all access to other users.',
    hint: 'Read the three permission groups from left to right.',
  },
  {
    chapterId: 'files-storage',
    title: 'Shared Folder Permissions',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      "A finance team needs a shared folder where staff can add files but cannot delete or change colleagues' work.",
    prompt: 'Which control addresses the requirement most directly?',
    options: [
      'Rename the folder to include the word private',
      'Apply role-based permissions that allow adding but not modifying existing files',
      'Zip the folder before every use',
      'Move the folder to a larger disk',
    ],
    answer: 1,
    explanation:
      "Access controls are enforced by the storage system, not by names or disk size. A drop-box style permission model lets staff contribute without altering others' files.",
    hint: 'The restriction must be enforced by the system, not by convention.',
  },
  {
    chapterId: 'files-storage',
    title: 'Shared Project Storage',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A design team wants project files reachable from office desktops and home laptops, with central backups handled by IT.',
    prompt: 'Which storage arrangement fits best?',
    options: [
      'A copy on each designer laptop only',
      'Emailing files between team members',
      'A different USB drive for each project',
      'Shared network or cloud storage managed centrally',
    ],
    answer: 3,
    explanation:
      'Central shared storage gives every device one reachable copy and lets IT back it up. Local copies or email attachments fragment versions and leave backups to individuals.',
    hint: 'Many devices need the same files and one backup process.',
  },
  {
    chapterId: 'files-storage',
    title: 'Cloud-Synced Video Stalls',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An editor tries to scrub through 4K video stored in a cloud-synced folder, and playback stalls repeatedly.',
    prompt: 'What best explains the repeated stalls?',
    options: [
      'The footage must travel over the network instead of a fast local disk',
      'Cloud folders are always read-only',
      'The video codec cannot store colour',
      'The monitor cannot display 4K',
    ],
    answer: 0,
    explanation:
      'Cloud-synced files may be placeholders fetched on demand, and wide-area latency and bandwidth are poor for large sequential reads. Copying footage locally first avoids the bottleneck.',
    hint: 'Compare where the bytes physically sit with where the editor reads them.',
  },
  {
    chapterId: 'files-storage',
    title: 'Instant Large File Deletion',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Why can deleting a large file be nearly instant while copying it takes a long time?',
    options: [
      'The OS compresses the data during deletion',
      'The disk spins faster when removing data',
      'Deletion removes the directory entry and frees blocks rather than overwriting every byte',
      'Deletion encrypts the file and discards the key',
    ],
    answer: 2,
    explanation:
      'The file system updates metadata and marks blocks as available, leaving the old bytes in place until overwritten. That is also why deleted data can sometimes be recovered.',
    hint: 'Think about bookkeeping rather than moving every block.',
  },
  {
    chapterId: 'files-storage',
    title: 'Shrinking Backup Window',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A team nightly full backup no longer finishes inside the allowed window, even though most files change very little from day to day.',
    prompt: 'Which backup change is most appropriate?',
    options: [
      'Disable backups until the storage is replaced',
      'Switch to incremental or differential backups with periodic full backups',
      'Rename the files so they copy faster',
      'Add larger monitors to the backup server',
    ],
    answer: 1,
    explanation:
      'Incremental or differential backups transfer only changed data, shrinking the nightly job. Periodic full backups still provide a simple restoration baseline.',
    hint: 'Stop copying data that has not changed.',
  },
  {
    chapterId: 'files-storage',
    title: 'Backup Copy Outside the Office',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A team keeps three copies of a project: the working SSD, a nightly USB drive in the same office, and an encrypted copy in a cloud region in another city.',
    prompt: 'Which part of the 3-2-1 rule does the cloud copy satisfy?',
    options: ['Three copies', 'Two media types', 'One off-site copy', 'One password'],
    answer: 2,
    explanation:
      '3-2-1 calls for three copies, two media types, and one copy off-site. The cloud copy in another city is the off-site leg.',
    hint: 'Which number describes location, not count or media?',
  },
  {
    chapterId: 'files-storage',
    title: 'Ransomware and Backups',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Ransomware encrypts a company file server and the network drives that were mounted on the infected machines.',
    prompt: 'Which backup approach best protects the company?',
    options: [
      'Continuous sync to the same server',
      'A RAID 5 array in the same room',
      'Hidden file extensions on the server',
      'Offline or immutable backups with a tested restore process',
    ],
    answer: 3,
    explanation:
      'Ransomware can reach any backup that is online and writable. Offline or immutable copies survive the attack, and regular restore tests prove they are usable.',
    hint: 'The backup must be unreachable while the attack runs.',
  },

  // applications (21)
  {
    chapterId: 'applications',
    title: 'Application Software Category',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which item is application software?',
    options: [
      'A word processor',
      'The OS kernel',
      'A device driver',
      'The firmware in a keyboard',
    ],
    answer: 0,
    explanation:
      'A word processor helps a user complete a task and runs on top of system software. Kernels, drivers, and firmware support the machine itself.',
    hint: 'Which program exists for an end-user task?',
  },
  {
    chapterId: 'applications',
    title: 'Spreadsheet SUM Formula',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a spreadsheet, what does the formula =SUM(B2:B6) do?',
    options: [
      'Sorts the values in column B',
      'Adds the values in cells B2 through B6',
      'Deletes rows two through six',
      'Formats B2 through B6 as currency',
    ],
    answer: 1,
    explanation:
      'SUM adds the numeric values in the referenced range. The colon means a continuous range from B2 to B6 inclusive.',
    hint: 'The colon defines a range, and SUM adds numbers.',
  },
  {
    chapterId: 'applications',
    title: 'Fraction Becomes a Date',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A user types 1/2 into a spreadsheet cell to record a fraction, but the cell displays a date instead.',
    prompt: 'What is the best explanation?',
    options: [
      'The spreadsheet has a virus',
      'The keyboard layout is broken',
      'The spreadsheet automatically interpreted the input as a date',
      'The file has exceeded its row limit',
    ],
    answer: 2,
    explanation:
      'Spreadsheet apps parse typed input using cell formats and locale rules, so 1/2 can become January 2. Formatting the cell as a fraction avoids this.',
    hint: 'The program is guessing a data type from the pattern.',
  },
  {
    chapterId: 'applications',
    title: 'Purpose of a Word Processor',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is a word processor primarily designed to do?',
    options: [
      'Edit photographs and illustrations',
      'Manage relational database tables',
      'Route packets between networks',
      'Create and format text documents',
    ],
    answer: 3,
    explanation:
      'Word processors focus on composing, formatting, and printing text, with support for tables and images. Photo editing, databases, and networking are separate application categories.',
    hint: 'Think of the tool used to draft a letter.',
  },
  {
    chapterId: 'applications',
    title: 'Live Collaborative Editing',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Several colleagues edit the same online document at once and see one another changes appear within seconds.',
    prompt: 'Which capability makes this possible?',
    options: [
      'Real-time collaborative editing with shared state and version tracking',
      'Saving separate copies to local folders',
      'Sending the file as an email attachment',
      'Sharing only a screenshot of the document',
    ],
    answer: 0,
    explanation:
      'Collaboration suites keep a shared document state and merge concurrent edits, often showing presence and history. Email attachments create divergent copies instead of one live document.',
    hint: 'Everyone is working on one shared copy, not separate files.',
  },
  {
    chapterId: 'applications',
    title: 'Presentation Software Purpose',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is presentation software primarily used to create?',
    options: [
      'Relational tables with foreign keys',
      'Slide decks that combine text, images, and media for an audience',
      'Device drivers for printers',
      'Encrypted network tunnels',
    ],
    answer: 1,
    explanation:
      'Presentation tools organise content into slides for a live or recorded audience. Databases, drivers, and tunnels belong to other software categories.',
    hint: 'Think of a sequence of slides shown to a room.',
  },
  {
    chapterId: 'applications',
    title: 'Managed Email Choice',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A small charity has no IT staff and does not want to run or patch its own email servers.',
    prompt: 'Which approach best matches its needs?',
    options: [
      'Build a custom mail server in the office',
      'Run an on-premises server that volunteers administer',
      'Use a hosted email service with a subscription',
      'Store all mail in shared spreadsheets',
    ],
    answer: 2,
    explanation:
      'A hosted email service is SaaS: the provider handles servers, updates, and availability. Running mail infrastructure locally would create exactly the administrative burden the charity wants to avoid.',
    hint: 'Match the workload to the team available to operate it.',
  },
  {
    chapterId: 'applications',
    title: 'Why Share as PDF',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why is PDF a useful format for sharing a finished document?',
    options: [
      'It makes the document easy for anyone to rewrite',
      'It guarantees the file is under one megabyte',
      'It can only be opened on the computer that created it',
      'It preserves layout and is widely viewable without the original editor',
    ],
    answer: 3,
    explanation:
      'PDF fixes the visual layout and can embed fonts and images, so recipients see the intended design. Editing is intentionally less convenient than in a word processor.',
    hint: 'Think about layout stability across different machines.',
  },
  {
    chapterId: 'applications',
    title: 'Projector Aspect Ratio',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A presenter slides appear with black bars at the sides when projected, because the deck and projector use different shapes.',
    prompt: 'Which setting should the presenter adjust?',
    options: [
      'The slide size or aspect ratio',
      'The font licence',
      'The spreadsheet formula',
      'The file permission bits',
    ],
    answer: 0,
    explanation:
      'Mismatched aspect ratios, such as 4:3 slides on a 16:9 projector, produce bars or cropping. Setting the deck to the projector shape uses the screen fully.',
    hint: 'The mismatch is between width and height proportions.',
  },
  {
    chapterId: 'applications',
    title: 'Absolute Cell Reference',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What happens when the formula reference $B$4 is copied to another cell?',
    options: [
      'It automatically becomes C5',
      'It still refers to cell B4',
      'It deletes the contents of B4',
      'It turns into plain text',
    ],
    answer: 1,
    explanation:
      'Dollar signs lock the column and row, making an absolute reference. Copying the formula keeps it pointed at B4 instead of shifting with the destination.',
    hint: 'The dollar signs prevent the usual relative adjustment.',
  },
  {
    chapterId: 'applications',
    title: 'Copied Formula Tax Error',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A manager copies the formula =B2*C2 down a pricing column. A tax rate stored in F1 is referenced relatively, so later rows use empty cells and totals drop to zero.',
    prompt: 'What is the most direct fix?',
    options: [
      'Retype every calculated value by hand',
      'Sort the table before copying',
      'Change the tax reference to an absolute reference such as $F$1',
      'Convert the workbook to PDF',
    ],
    answer: 2,
    explanation:
      'A relative reference moves when copied, so the tax cell drifts away from F1. Anchoring it with dollar signs keeps every row pointed at the same rate.',
    hint: 'Decide which cell must stay fixed as the formula moves.',
  },
  {
    chapterId: 'applications',
    title: 'Concurrent Clinic Spreadsheet',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A small clinic tracks patients and appointments in one spreadsheet. Two receptionists edit it at the same time, and formulas and rows are frequently corrupted.',
    prompt: 'Which software change should the clinic make?',
    options: [
      'Give each receptionist a separate copy of the workbook',
      'Print the spreadsheet each morning and edit on paper',
      'Email the workbook back and forth after each shift',
      'Move the records into a multi-user database application with validation',
    ],
    answer: 3,
    explanation:
      'A database handles concurrent users, relationships, and enforced rules, while a flat sheet is easily damaged by simultaneous edits. Separate copies would reintroduce version conflicts.',
    hint: 'The problem is simultaneous edits and a fragile structure.',
  },
  {
    chapterId: 'applications',
    title: 'Email Attachment Conflicts',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A budget file is emailed back and forth. Two managers edit different copies, and the returned figures no longer agree.',
    prompt: 'Which process change addresses the root cause?',
    options: [
      'Rename each copy with a date',
      'Move the work into a shared document with version history',
      'Print the file and scan it after edits',
      'Ask everyone to disable spell check',
    ],
    answer: 1,
    explanation:
      'Email attachments create separate copies that must be merged manually. A shared document gives one current version and records who changed what.',
    hint: 'The problem is many copies, not the editing itself.',
  },
  {
    chapterId: 'applications',
    title: 'Version History Value',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does version history in a collaboration suite let a team do?',
    options: [
      'Increase the brightness of the screen',
      'Install hardware drivers automatically',
      'Review earlier versions of a document and restore one if needed',
      'Change the Wi-Fi password',
    ],
    answer: 2,
    explanation:
      'Version history records saved states and often the author of each change. That makes it possible to compare, audit, or roll back an unwanted edit.',
    hint: 'It is a timeline of saved states.',
  },
  {
    chapterId: 'applications',
    title: 'Leading Zeros Lost',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A user opens a CSV export of employee records in a spreadsheet, and identifiers such as 00417 appear as 417.',
    prompt: 'Why does this happen?',
    options: [
      'CSV files cannot contain the digit zero',
      'The spreadsheet treats the digits as a number and drops leading zeros',
      'The spreadsheet deletes entire columns on import',
      'The file is encrypted and unreadable',
    ],
    answer: 1,
    explanation:
      'Numeric cells do not preserve leading zeros because 00417 and 417 have the same value. Importing the identifier as text keeps the original form.',
    hint: 'Ask what a number looks like without cosmetic padding.',
  },
  {
    chapterId: 'applications',
    title: 'Perpetual Versus Subscription',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What distinguishes a perpetual software licence from a subscription licence?',
    options: [
      'A perpetual licence expires every month',
      'A subscription is always free of charge',
      'A perpetual licence has no terms or conditions',
      'A perpetual licence grants use indefinitely after payment, while a subscription renews periodically',
    ],
    answer: 3,
    explanation:
      'Perpetual licences grant ongoing use of a specific version, though support or upgrades may stop. Subscriptions spread cost over time and usually include updates while payments continue.',
    hint: 'Think about whether payments stop or continue.',
  },
  {
    chapterId: 'applications',
    title: 'Low-Cost Office Suite',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A volunteer-run community centre needs word processing and spreadsheets, has almost no budget, and can tolerate minor format differences.',
    prompt: 'Which option fits the constraints best?',
    options: [
      'A pirated commercial office suite',
      'A custom word processor built from scratch',
      'An open-source office suite',
      'A database server with no client software',
    ],
    answer: 2,
    explanation:
      'An open-source office suite provides the needed tools at no licence cost and is legitimate to deploy. Pirated software creates legal and security risk, while custom development is far too costly.',
    hint: 'The requirement is basic tools with no licence budget.',
  },
  {
    chapterId: 'applications',
    title: 'Macro Security Risk',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Why do office suites often disable macros in files downloaded from the internet by default?',
    options: [
      'Macros can execute code and be used to deliver malware',
      'Macros make printers run more slowly',
      'Macros prevent PDF files from opening',
      'Macros change the monitor resolution',
    ],
    answer: 0,
    explanation:
      'A document macro is a small program, so a malicious file can run code with the permissions of the user. Disabling untrusted macros blocks a common malware delivery path.',
    hint: 'A macro is not just formatting; it can be executable logic.',
  },
  {
    chapterId: 'applications',
    title: 'Layout Shifts Across Offices',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Two departments exchange DOCX files, but page breaks and line spacing shift because their machines have different fonts and software versions.',
    prompt: 'Which approach makes final review most reliable?',
    options: [
      'Email more copies of the same file',
      'Convert the document to CSV',
      'Disable spell check on both sides',
      'Standardise fonts and templates, and share a PDF for final review',
    ],
    answer: 3,
    explanation:
      'Layout depends on available fonts and the rendering engine. Standard templates reduce drift, and a PDF freezes the final appearance for reviewers.',
    hint: 'Control the ingredients that determine line breaks.',
  },
  {
    chapterId: 'applications',
    title: 'System of Record Meaning',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'In a business application, what does system of record mean?',
    options: [
      'The newest file on a user desktop',
      'The printed report kept in a folder',
      'The authoritative source for a particular set of data',
      'A backup that is never opened',
    ],
    answer: 2,
    explanation:
      'A system of record is the trusted master source that other systems reference or copy from. Without one, teams get conflicting versions of the same customer or product data.',
    hint: 'Which copy do other systems treat as the truth?',
  },
  {
    chapterId: 'applications',
    title: 'Duplicate Customer Data',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A sales team keeps customer contacts in both a CRM and a shared spreadsheet. Monthly reports from the two sources disagree.',
    prompt: 'What is the core problem?',
    options: [
      'Duplicated data without a single system of record',
      'Too much RAM in the sales laptops',
      'Incorrect monitor resolution',
      'Missing fonts in the spreadsheet',
    ],
    answer: 0,
    explanation:
      'Two editable stores of the same facts drift apart because updates reach only one. Choosing one authoritative system and feeding the other from it removes the conflict.',
    hint: 'The same fact is being maintained in two places.',
  },

  // programming-web (21)
  {
    chapterId: 'programming-web',
    title: 'Role of HTML',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is HTML mainly responsible for on a web page?',
    options: [
      'Applying colours and layout to elements',
      'Running database queries on the server',
      'Encrypting traffic between browser and server',
      'Structuring content such as headings, paragraphs, and links',
    ],
    answer: 3,
    explanation:
      'HTML describes the meaning and structure of content. CSS handles presentation, JavaScript adds behaviour, and encryption comes from protocols such as HTTPS.',
    hint: 'It is the skeleton, not the paint or the muscles.',
  },
  {
    chapterId: 'programming-web',
    title: 'Role of CSS',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does CSS control in a web page?',
    options: [
      'The structure of headings and lists',
      'Presentation such as colours, spacing, and layout',
      'Server-side database access',
      'The domain name resolution process',
    ],
    answer: 1,
    explanation:
      'CSS supplies styling rules that decide how HTML elements look and arrange on screen. Structure stays in HTML, while CSS handles visual presentation.',
    hint: 'It is the stylesheet language.',
  },
  {
    chapterId: 'programming-web',
    title: 'Hover Colour Change',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A developer wants a button background to change colour only while the pointer is over it.',
    prompt: 'Which technology is the most direct fit?',
    options: [
      'SQL',
      'Python',
      'CSS',
      'JSON',
    ],
    answer: 2,
    explanation:
      'CSS has state-based selectors such as :hover that restyle an element without scripting. SQL, Python, and JSON do not describe visual states in the browser.',
    hint: 'The behaviour is pure presentation on pointer state.',
  },
  {
    chapterId: 'programming-web',
    title: 'JavaScript Purpose',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a typical web page, what is JavaScript mainly used for?',
    options: [
      'Defining the page structure',
      'Styling colours and fonts',
      'Storing rows in a relational table',
      'Adding interactivity and dynamic behaviour in the browser',
    ],
    answer: 3,
    explanation:
      'JavaScript responds to clicks, updates content, and calls APIs, making pages interactive. Structure belongs to HTML and visual styling to CSS.',
    hint: 'Which language makes the page react?',
  },
  {
    chapterId: 'programming-web',
    title: 'Link Click Request',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A user clicks a link, the browser briefly shows a loading indicator, and a new page appears.',
    prompt: 'What best describes what happened?',
    options: [
      'The browser sent an HTTP request and the server returned a response',
      'The browser compiled the operating system',
      'The disk defragmented itself',
      'The network adapter was disabled',
    ],
    answer: 0,
    explanation:
      'Following a link triggers an HTTP request for the target URL. The server replies with a status and content, which the browser then renders.',
    hint: 'The browser asks a server for a resource.',
  },
  {
    chapterId: 'programming-web',
    title: 'Client-Side Execution',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a web application, which code normally runs inside the user browser?',
    options: [
      'The database engine',
      'Client-side code such as HTML, CSS, and JavaScript',
      'The server file system driver',
      'The operating system kernel of the web server',
    ],
    answer: 1,
    explanation:
      'The browser downloads and runs client-side resources on the user device. Database and server-side application code run on infrastructure the user does not control.',
    hint: 'Think about which machine is displaying the page.',
  },
  {
    chapterId: 'programming-web',
    title: 'Missing Stylesheet',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A page text and images appear, but all styling is missing because the linked CSS file returns a 404 error.',
    prompt: 'What is the most likely visible result?',
    options: [
      'The web server shuts down',
      'The database is erased',
      'The page appears unstyled, using browser defaults',
      'The keyboard stops responding',
    ],
    answer: 2,
    explanation:
      'HTML still renders when CSS is missing, but browser default styles apply. A 404 means the stylesheet could not be found at the requested path.',
    hint: 'Content survives; presentation does not.',
  },
  {
    chapterId: 'programming-web',
    title: 'URL Query String',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In the URL https://shop.example.com/items/42?color=red, which part is the query string?',
    options: [
      'https',
      'shop.example.com',
      '/items/42',
      'color=red',
    ],
    answer: 3,
    explanation:
      'The query string begins after the question mark and carries parameters such as color=red. The host names the server, and the path identifies the resource.',
    hint: 'Look for the portion after the question mark.',
  },
  {
    chapterId: 'programming-web',
    title: 'HTTP 404 Meaning',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A browser requests a page and receives an HTTP 404 response. What does that mean?',
    options: [
      'The server could not find the requested resource',
      'The request succeeded and content follows',
      'The user must log in first',
      'The server had an internal failure',
    ],
    answer: 0,
    explanation:
      '404 is the standard not-found status. It differs from 401 or 403 for access problems and from 500 for an internal server error.',
    hint: 'Match the number to a missing resource.',
  },
  {
    chapterId: 'programming-web',
    title: 'Compiled Versus Interpreted',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is a key difference between compiled and interpreted languages?',
    options: [
      'Compiled code cannot use variables',
      'Compiled code is translated ahead of time, while interpreted code is translated as it runs',
      'Interpreted code needs no processor',
      'Compiled code only works in web browsers',
    ],
    answer: 1,
    explanation:
      'A compiler produces machine code or bytecode before execution, while an interpreter processes source at runtime. Each model trades startup time, portability, and optimization differently.',
    hint: 'Ask when the translation happens.',
  },
  {
    chapterId: 'programming-web',
    title: 'Python Without a Build Step',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A developer edits a Python script and immediately reruns it, with no separate compilation step visible.',
    prompt: 'Which execution model does this most suggest?',
    options: [
      'Ahead-of-time compilation to native machine code',
      'Assembly language programming',
      'Interpreted execution',
      'Hardware synthesis',
    ],
    answer: 2,
    explanation:
      'Python is typically executed by an interpreter, which reads and runs the source each time. That supports quick edits, though startup and speed differ from compiled native code.',
    hint: 'The source is consumed directly at run time.',
  },
  {
    chapterId: 'programming-web',
    title: 'What an API Is',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is an API in web development?',
    options: [
      'A type of monitor',
      'A database backup format',
      'A CSS layout framework',
      'A defined interface for one program to request data or actions from another',
    ],
    answer: 3,
    explanation:
      'An API specifies endpoints, inputs, and response formats so software can interact without knowing internal details. Web APIs commonly exchange JSON over HTTP.',
    hint: 'It is a contract between programs.',
  },
  {
    chapterId: 'programming-web',
    title: 'Weather API Role',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A weather app on a phone fetches a JSON forecast from a remote service every ten minutes.',
    prompt: 'What role does the remote service play?',
    options: [
      'The operating system kernel',
      'A server-side API provider',
      'The phone file system',
      'The phone display driver',
    ],
    answer: 1,
    explanation:
      'The service exposes an API that returns forecast data in a documented format. The phone acts as the client, requesting and then presenting that data.',
    hint: 'One side asks; the other answers with data.',
  },
  {
    chapterId: 'programming-web',
    title: 'HTTP GET Purpose',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which HTTP method is conventionally used to retrieve data without changing it?',
    options: [
      'GET',
      'POST',
      'DELETE',
      'PUT',
    ],
    answer: 0,
    explanation:
      'GET requests a representation of a resource and is expected to be safe and repeatable. POST, PUT, and DELETE are used when creating or changing server state.',
    hint: 'Which verb sounds like reading?',
  },
  {
    chapterId: 'programming-web',
    title: 'Form Submission Method',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A registration form sends a new username and password to the server to create an account.',
    prompt: 'Which HTTP method is most appropriate for that action?',
    options: [
      'GET',
      'HEAD',
      'POST',
      'TRACE',
    ],
    answer: 2,
    explanation:
      'Creating an account changes server state and may include sensitive fields, so POST is appropriate. GET places data in the URL, where it can be logged or exposed.',
    hint: 'The operation creates something and should not appear in a URL.',
  },
  {
    chapterId: 'programming-web',
    title: 'Health Check Status',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A monitoring dashboard calls an API health endpoint and records HTTP status 200 for the latest check.',
    prompt: 'What should the dashboard conclude?',
    options: [
      'The request succeeded',
      'The resource was not found',
      'The server hit an internal error',
      'The client must follow a redirect',
    ],
    answer: 0,
    explanation:
      'A 200 response means the server processed the request successfully. The dashboard can treat this check as healthy, unlike a 404 or 500 response.',
    hint: 'Two hundred sits in the success family.',
  },
  {
    chapterId: 'programming-web',
    title: 'Server Error 500',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A web app calls an API to save an order and receives an HTTP 500 response.',
    prompt: 'What does that status indicate?',
    options: [
      'The order was saved successfully',
      'The server hit an internal error while processing the request',
      'The user is not authenticated',
      'The requested page does not exist',
    ],
    answer: 1,
    explanation:
      'A 500 status means the server failed unexpectedly while handling a valid-looking request. The client should surface an error and the server logs should explain the fault.',
    hint: 'The failure is on the server side, not a missing path.',
  },
  {
    chapterId: 'programming-web',
    title: 'Server-Side Validation',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Why must a server validate input even when the browser already checks it?',
    options: [
      'Browsers never validate forms',
      'Servers cannot read form fields',
      'Client checks can be bypassed, so the server is the trust boundary',
      'Validation makes pages load faster',
    ],
    answer: 2,
    explanation:
      'Users can disable scripts or send crafted requests directly, so browser checks are only a convenience. The server must enforce rules because it cannot trust the client.',
    hint: 'Anyone can talk to the server without using your page.',
  },
  {
    chapterId: 'programming-web',
    title: 'Single-Page App Loading',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A web app shows its interface almost immediately, then displays a spinner while order data arrives from an API.',
    prompt: 'Which architecture best explains this behaviour?',
    options: [
      'Server-rendered static HTML with no network calls',
      'A fully offline desktop program',
      'Compiled kernel modules running in the browser',
      'Client-side rendering with asynchronous API requests',
    ],
    answer: 3,
    explanation:
      'The browser loads the app shell first, then JavaScript fetches data and updates the page. That improves perceived speed but makes loading and error states important.',
    hint: 'The page skeleton arrives before the data.',
  },
  {
    chapterId: 'programming-web',
    title: 'High-Level Language Trade-Off',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What is the main trade-off of using a high-level programming language?',
    options: [
      'Easier, more portable code at the cost of less direct control over hardware',
      'It runs without any translation or runtime',
      'It is always faster than machine code',
      'It removes the need for testing',
    ],
    answer: 0,
    explanation:
      'High-level languages hide memory and hardware details, improving productivity and portability. The cost is less direct control and potential overhead compared with low-level code.',
    hint: 'Convenience and control usually pull in opposite directions.',
  },
  {
    chapterId: 'programming-web',
    title: 'Large JavaScript Bundle',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A website feels fast on an office laptop but slow on budget phones because it downloads and parses a five-megabyte JavaScript bundle.',
    prompt: 'Which fix addresses the cause most directly?',
    options: [
      'Add more RAM to the web server',
      'Change the domain name',
      'Disable HTTPS',
      'Reduce or split the bundle so each page loads only the code it needs',
    ],
    answer: 3,
    explanation:
      'Download, parse, and execution time grow with the JavaScript shipped to the device. Code splitting and removing unused libraries reduce that work on constrained phones.',
    hint: 'The phones are doing too much work before the page becomes useful.',
  },

  // virtualization-cloud (21)
  {
    chapterId: 'virtualization-cloud',
    title: 'Virtual Machine Definition',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is a virtual machine (VM)?',
    options: [
      'A software-defined computer that runs on a hypervisor',
      'A physical disk with no operating system',
      'A programming language for cloud apps',
      'A network cable used in data centres',
    ],
    answer: 0,
    explanation:
      'A VM presents virtual CPU, memory, disk, and network hardware to a guest OS. The hypervisor maps those virtual devices onto real physical resources.',
    hint: 'It behaves like a computer but is made of software.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Hypervisor Role',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does a hypervisor do?',
    options: [
      'Compiles Java source code',
      'Creates and runs virtual machines by sharing physical hardware',
      'Routes email between domains',
      'Edits images for a website',
    ],
    answer: 1,
    explanation:
      'The hypervisor allocates physical CPU, memory, and devices among VMs and isolates them. Guest operating systems run on the virtual hardware it presents.',
    hint: 'It sits between physical hardware and guest machines.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Sharing One Server',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A small firm runs three virtual servers for email, files, and accounting on a single physical host.',
    prompt: 'What is being shared among the three servers?',
    options: [
      'Only the monitor and keyboard',
      'Only the office printer',
      'CPU, memory, storage, and network capacity',
      'Nothing at all',
    ],
    answer: 2,
    explanation:
      'Virtual machines share the physical resources of the host, with the hypervisor dividing and isolating them. Consolidation saves hardware but can create contention.',
    hint: 'One physical machine is backing three logical ones.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'IaaS Definition',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does Infrastructure as a Service (IaaS) provide?',
    options: [
      'A finished word processor for end users',
      'Only a managed database table',
      'A physical server the customer owns outright',
      'Rented virtual infrastructure such as VMs, storage, and networks',
    ],
    answer: 3,
    explanation:
      'IaaS supplies virtualized compute, storage, and networking that customers configure. The provider manages the physical layer, while the customer manages the guest OS and applications.',
    hint: 'Think of renting the building blocks, not the finished app.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Rolling Back a Snapshot',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An administrator takes a snapshot before a risky VM update and rolls back when the update fails.',
    prompt: 'What does the snapshot capture?',
    options: [
      'The virtual machine disk and configuration state at that point in time',
      'Only the brightness of the administrator monitor',
      'The configuration of the physical office router',
      'The administrator account password',
    ],
    answer: 0,
    explanation:
      'A VM snapshot records the virtual disk and often memory and device state so the machine can return to that moment. It is not a substitute for an independent backup.',
    hint: 'The whole virtual machine can be returned to an earlier moment.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'SaaS Example',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which is an example of Software as a Service?',
    options: [
      'A virtual machine with a blank OS',
      'A web-based email service accessed through a browser',
      'A container runtime installed on a laptop',
      'A physical router in an office closet',
    ],
    answer: 1,
    explanation:
      'Web-based email is operated by the provider and used through a client, which is the SaaS model. VMs, container runtimes, and routers are infrastructure or platform components.',
    hint: 'The user consumes a finished application, not servers.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'PaaS Definition',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does Platform as a Service (PaaS) provide?',
    options: [
      'Only raw virtual machines with no software',
      'A managed runtime and services so developers can deploy code without managing servers',
      'A physical office network',
      'A desktop operating system for employees',
    ],
    answer: 1,
    explanation:
      'PaaS supplies the runtime, libraries, and operational plumbing, letting developers focus on application code. The provider handles the OS, scaling, and much of the administration.',
    hint: 'The platform runs the code; the developer brings the code.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Deploy Without Server Administration',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A two-person team wants to deploy a web app but does not want to patch operating systems or configure load balancers.',
    prompt: 'Which model reduces that operational work most directly?',
    options: [
      'Colocation of physical servers',
      'On-premises hardware in the office',
      'PaaS',
      'IaaS with manually managed VMs',
    ],
    answer: 2,
    explanation:
      'PaaS manages the underlying OS, runtime, and scaling infrastructure, so the team deploys code rather than servers. IaaS would still leave patching and load balancing to them.',
    hint: 'Which model hides the servers from the developer?',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Containers Versus VMs',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How do containers differ from virtual machines?',
    options: [
      'Containers share the host OS kernel and isolate processes, while each VM runs a full guest OS',
      'Containers provide no isolation at all',
      'Virtual machines cannot use networking',
      'Containers require a dedicated physical server each',
    ],
    answer: 0,
    explanation:
      'Containers package an app and its dependencies but share the host kernel, making them lighter. VMs virtualize hardware and run separate kernels, which is heavier but more isolated.',
    hint: 'Consider how much of an operating system each one carries.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Consistent Dev and Production',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A developer wants the same application environment on a laptop and in production, without running a full guest OS for every service.',
    prompt: 'Which approach fits best?',
    options: [
      'Manual installs repeated on each machine',
      'A container image used in both places',
      'One large VM for every developer',
      'Copying the production disk by hand',
    ],
    answer: 1,
    explanation:
      'A container image captures the app and its dependencies in one portable unit. Running the same image locally and in production reduces environment drift.',
    hint: 'Package once, run the same artifact in both places.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Elasticity Meaning',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does elasticity mean in cloud computing?',
    options: [
      'Storing every file forever',
      'Encrypting all network traffic',
      'Automatically adding or removing resources as demand changes',
      'Keeping prices fixed for a year',
    ],
    answer: 2,
    explanation:
      'Elasticity scales capacity up during demand and down afterward, often automatically. It helps match cost to workload instead of paying for a fixed peak all year.',
    hint: 'Think of stretching and shrinking with load.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Evening Traffic Spike',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An online shop receives most of its traffic between seven and ten each evening and wants to pay only for the capacity it actually needs.',
    prompt: 'Which cloud property matters most here?',
    options: [
      'A perpetual software licence',
      'A larger office monitor',
      'Manual network cabling',
      'Elasticity with usage-based pricing',
    ],
    answer: 3,
    explanation:
      'Elastic capacity can expand for the evening peak and shrink afterward, and usage-based billing charges for what runs. Fixed on-premises capacity would sit idle much of the day.',
    hint: 'The load rises and falls on a predictable schedule.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Multiple Regions',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why would a company deploy copies of a service in several geographic regions?',
    options: [
      'To increase the font size of its website',
      'To avoid making backups forever',
      'To reduce the amount of application code',
      'To survive regional outages and bring content closer to users',
    ],
    answer: 3,
    explanation:
      'Regional distribution limits the blast radius of an outage and can reduce network latency for nearby users. It adds complexity and cost, so it must be justified.',
    hint: 'Distance and failure domains are both at stake.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Backup in the Same City',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A firm keeps its only backup copies in a data centre in the same city as its production systems.',
    prompt: 'Which weakness remains?',
    options: [
      'A city-wide disaster could destroy production and backups together',
      'Backups consume too much electricity',
      'Cloud providers cannot store backups',
      'Encryption becomes impossible',
    ],
    answer: 0,
    explanation:
      'Backups protect against loss only if they are separated from the failure they must survive. Geographic separation addresses fires, floods, and regional outages.',
    hint: 'Consider what a single regional event could reach.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Shared Responsibility Model',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Under the shared responsibility model, which task generally belongs to the cloud provider?',
    options: [
      'Writing and testing the customer application code',
      'Classifying the customer sensitive data',
      'Physical security and the underlying infrastructure',
      'Choosing the customer passwords',
    ],
    answer: 2,
    explanation:
      'Providers secure facilities, hardware, and the base platform. Customers remain responsible for their data, identities, configuration, and application code.',
    hint: 'The provider owns the building and the metal.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Public Bucket Misconfiguration',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A team stores customer records in cloud object storage and later learns the bucket is publicly readable.',
    prompt: 'Who is responsible for that exposure?',
    options: [
      'Only the cloud provider',
      'The internet service provider',
      'No one, because cloud storage is public by design',
      'The customer, because access configuration is part of its responsibility',
    ],
    answer: 3,
    explanation:
      'Cloud providers supply access controls, but customers must configure them correctly. A public bucket is a customer-side configuration error under the shared responsibility model.',
    hint: 'Who chose the bucket permissions?',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Preventing Surprise Bills',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Which practice best helps prevent surprise cloud bills?',
    options: [
      'Monitor usage, set budgets and alerts, and remove idle resources',
      'Disable all logging and monitoring',
      'Pay annually for maximum capacity in every region',
      'Run every test workload around the clock',
    ],
    answer: 0,
    explanation:
      'Budgets, alerts, and regular cleanup make spending visible and stop idle resources from accumulating charges. Blindly reserving maximum capacity increases cost rather than controlling it.',
    hint: 'You cannot control what you do not measure.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Idle Test Environment',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A test environment runs large virtual machines twenty-four hours a day but is used only during weekday office hours.',
    prompt: 'Which action gives the clearest cost saving with little disruption?',
    options: [
      'Move it to larger instances',
      'Schedule shutdowns outside working hours and right-size the VMs',
      'Deploy it in more regions',
      'Disable all backups',
    ],
    answer: 1,
    explanation:
      'Stopping unused instances removes most compute charges, and right-sizing avoids paying for excess capacity. Adding regions or disabling backups raises risk without addressing idle spend.',
    hint: 'The environment is billed for hours nobody uses.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Proprietary Data Format Risk',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A company stores years of records in a proprietary cloud format that only one provider can read, and it is considering moving to another vendor.',
    prompt: 'What risk does this situation illustrate?',
    options: [
      'The data will inevitably be deleted',
      'Encryption will stop working',
      'Vendor lock-in makes migration costly or impractical',
      'The provider will reduce network latency',
    ],
    answer: 2,
    explanation:
      'Lock-in grows when data and interfaces are provider-specific, raising the cost of leaving. Exportable formats and standard interfaces preserve future options.',
    hint: 'Think about what happens when the company tries to leave.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Data Residency Requirement',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A regulated bank must keep customer records within its own country and demonstrate separation from other tenants.',
    prompt: 'Which cloud consideration is most relevant?',
    options: [
      'The cheapest global pricing plan',
      'The size of the provider logo',
      'A free trial credit',
      'Region choice and tenancy or isolation options that meet residency requirements',
    ],
    answer: 3,
    explanation:
      'Data residency depends on where storage and processing occur, while tenancy models affect isolation. Legal and compliance requirements must drive the architecture, not price alone.',
    hint: 'Location and separation are the stated constraints.',
  },
  {
    chapterId: 'virtualization-cloud',
    title: 'Noisy Neighbour Contention',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'A VM with eight virtual CPUs runs slowly because the physical host is heavily oversubscribed. What explains this?',
    options: [
      'The VM has no operating system',
      'Contention for shared physical CPU resources from other tenants',
      'The network is encrypted',
      'The virtual disk is empty',
    ],
    answer: 1,
    explanation:
      'Virtual CPUs are time-shared on physical cores, so oversubscription can cause contention and variable performance. Dedicated hosts or resource reservations reduce that noisy-neighbour effect.',
    hint: 'The virtual cores are not physical cores.',
  },
];
