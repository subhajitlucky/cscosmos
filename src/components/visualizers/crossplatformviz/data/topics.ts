export interface CrossPlatformTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Foundations & Mobile OS Pipeline' | 'React Native: Bridge to JSI' | 'Flutter: Own-Canvas & Impeller' | 'KMP & Architecture Strategy';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  codeSnippet: string;
  outputDescription: string;
  related: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CrossPlatformTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: CrossPlatformTopic[];
}

export const crossPlatformTopics: CrossPlatformTopic[] = [
  // ==========================================
  // GROUP 1: Foundations & Mobile OS Pipeline
  // ==========================================
  {
    id: 'what-is-cross-platform',
    title: 'Native vs Hybrid (WebView) vs Cross-Platform Engines',
    kicker: 'Foundations / 01',
    group: 'Foundations & Mobile OS Pipeline',
    difficulty: 'starter',
    summary: 'The three fundamental ways mobile apps are built: native platform code, embedded web wrappers, and cross-platform native execution engines.',
    definition: 'Cross-platform mobile development allows engineers to write application logic once and deploy it across both iOS and Android. While Hybrid apps embed web code inside a platform WebView, modern cross-platform engines either compile to native widgets (React Native JSI), paint directly to a GPU surface (Flutter), or compile shared logic to native binaries (Kotlin Multiplatform).',
    analogy: 'Imagine traveling internationally: Hybrid apps speak English loudly through a phrasebook translator (slow and clunky). React Native hires native local guides (OEM widgets). Flutter brings its own self-contained world (paints every pixel itself). KMP writes the rulebook once and lets local native citizens read it natively.',
    steps: [
      'Pure Native: Swift/Kotlin compiled directly to iOS/Android platform SDK binaries',
      'Hybrid (Cordova/Capacitor): HTML/CSS/JS loaded inside an embedded browser WebView instance',
      'Bridge-based Cross-Platform (Legacy RN): JavaScript thread sends JSON messages to native threads',
      'Modern Native Cross-Platform (RN JSI / KMP): Shared code interacts synchronously via C++ memory pointers or compiled LLVM binaries',
      'Own-Canvas Engines (Flutter): Bypasses platform widgets completely, drawing vector pixels directly via Vulkan/Metal'
    ],
    mistakes: [
      'Assuming "cross-platform" always means a web view running inside an app wrapper',
      'Underestimating platform-specific UI conventions (e.g. iOS navigation bars vs Android material bottom sheets)',
      'Thinking cross-platform code completely eliminates the need to understand native iOS (Xcode) and Android (Gradle) builds'
    ],
    optimization: 'Choosing the right architecture up front prevents costly re-writes when an app requires high-frequency Bluetooth, audio, or 120 FPS camera filters.',
    codeSnippet: `// Architectural Overview: The 3 Paradigms
// 1. Hybrid (Cordova/Capacitor):
//    [Web Code (HTML/DOM)] <-> [WebView Message Port] <-> [Native OS]
//
// 2. React Native (New Arch):
//    [JavaScript Code] <== JSI (Direct C++ Pointers) ==> [OEM Native Views]
//
// 3. Flutter (Own Canvas):
//    [Dart AOT Machine Code] ===> [Impeller GPU Shaders] ===> [Screen Pixels]`,
    outputDescription: 'Comparison of communication pathways between application logic and the mobile operating system.',
    related: ['mobile-rendering-pipeline', 'webview-vs-native-runtime', 'legacy-bridge-vs-jsi'],
    quiz: {
      question: 'What is the primary architectural difference between a Hybrid app (Capacitor) and React Native?',
      options: [
        'Hybrid apps render HTML inside a WebView browser; React Native renders real platform native widgets (UIViews / Android Views)',
        'Hybrid apps are written in C++; React Native is written in Python',
        'Hybrid apps do not work on Android devices',
        'React Native requires an active internet connection to render UI'
      ],
      correctIndex: 0,
      explanation: 'Hybrid apps run web code inside an embedded browser engine (WebView), whereas React Native translates your declarative JSX components into real, platform-native OEM widgets on iOS and Android.'
    }
  },
  {
    id: 'mobile-rendering-pipeline',
    title: 'The Mobile OS Frame Pipeline & The 16.6ms Budget',
    kicker: 'Foundations / 02',
    group: 'Foundations & Mobile OS Pipeline',
    difficulty: 'starter',
    summary: 'How mobile screens refresh at 60Hz and 120Hz, and why blocking the single main UI thread drops frames and creates jank.',
    definition: 'Mobile operating systems (iOS and Android) enforce a Single-Threaded UI rule: all layout, user input, and screen rendering must be orchestrated on the main UI Thread. To maintain a smooth 60 frames-per-second (FPS) animation, every frame must be calculated, laid out, and dispatched to the GPU in under 16.6 milliseconds (or 8.3ms for 120Hz ProMotion displays).',
    analogy: 'Imagine an assembly line conveyor belt running at high speed: every 16.6 milliseconds, a container passes your station. If you take 20ms to pack an item, the conveyor belt skips a beat, resulting in a dropped frame that the human eye perceives as a visual stutter or lag.',
    steps: [
      'V-Sync Pulse: Hardware clock emits a vertical synchronization signal (every 16.6ms at 60Hz, 8.3ms at 120Hz)',
      'Event Handling: Touch gestures and scroll events are read from native hardware buffers',
      'Layout & Measure: Measuring bounding boxes, margins, and flexbox dimensions',
      'Draw & Display List: Generating low-level drawing commands for views',
      'GPU Rasterization: GPU shaders execute vertex and fragment passes to push pixels to the framebuffer'
    ],
    mistakes: [
      'Executing heavy JSON parsing, database queries, or cryptographic operations on the main UI thread',
      'Triggering layout thrashing by measuring and mutating view geometries in rapid succession',
      'Failing to test on low-end budget Android devices with slower CPU cores'
    ],
    optimization: 'Offloading computation to background worker threads or C++ worker pools ensures the main UI thread never exceeds its 16.6ms budget.',
    codeSnippet: `// 60 FPS vs 120 FPS Frame Budget Constants
const FRAME_BUDGET_60FPS_MS  = 1000 / 60;  // 16.66 ms per frame
const FRAME_BUDGET_120FPS_MS = 1000 / 120; //  8.33 ms per frame (ProMotion)

// If UI thread work takes 25ms:
// 25ms > 16.66ms -> 1 Frame Dropped -> User perceives scroll stutter!`,
    outputDescription: 'Mathematical threshold required for glitch-free mobile animations and touch tracking.',
    related: ['what-is-cross-platform', 'legacy-bridge-vs-jsi', 'webview-vs-native-runtime'],
    quiz: {
      question: 'How much time does the UI thread have to prepare and render a single frame on a standard 60Hz mobile display?',
      options: [
        '100 milliseconds',
        '16.66 milliseconds',
        '1 second',
        '500 milliseconds'
      ],
      correctIndex: 1,
      explanation: 'At 60 frames per second, 1000ms / 60 = 16.66ms. If any work on the main thread takes longer than 16.66ms, the OS cannot prepare the frame in time, causing dropped frames (jank).'
    }
  },
  {
    id: 'webview-vs-native-runtime',
    title: 'Why WebViews Fall Short for High-Frequency Mobile Touch',
    kicker: 'Foundations / 03',
    group: 'Foundations & Mobile OS Pipeline',
    difficulty: 'starter',
    summary: 'The DOM reflow bottlenecks, memory limits, and asynchronous message port overhead that make WebViews struggle with 120Hz gesture tracking.',
    definition: 'A WebView is an embedded instance of a browser engine (WebKit on iOS, Chromium on Android). While suitable for document-heavy apps or forms, WebViews introduce significant overhead for complex mobile apps: high RAM usage from running an entire browser stack, DOM layout reflow recalculations, and latency when bridging touch coordinates between the native OS and JavaScript.',
    analogy: 'Using a heavy desktop web browser inside a small mobile screen window to build a sports car dashboard. It works for reading manuals, but when you hit the gas pedal (60Hz touch gesture), the web browser pauses to reflow the layout.',
    steps: [
      'User touches device screen: OS hardware touch digitizer registers coordinate (X, Y)',
      'Native OS dispatches touch event to the embedded platform WebView container',
      'WebView converts native touch into a synthetic DOM TouchEvent and queues it into the web event loop',
      'Web JavaScript runs event handler, mutates CSS/DOM styles',
      'Browser engine performs full DOM style calculation, layout reflow, repaint, and compositing passes'
    ],
    mistakes: [
      'Attempting to build 120 FPS physics-based swiping or draggable bottom sheets inside an un-accelerated WebView',
      'Ignoring the high memory footprint of multiple WebViews on budget Android devices with 2GB RAM'
    ],
    optimization: 'Restricting WebViews to static content, terms-of-service documents, and checkout flows while using native runtimes for core app navigation.',
    codeSnippet: `// WebView Touch Latency vs Native Touch Direct Traversal
// Native / JSI / Flutter:
// [Hardware Touch] -> [Main Thread] -> [Direct 60Hz Animation] (0-2ms latency)
//
// WebView:
// [Hardware Touch] -> [OS Event] -> [IPC to WebKit Process] 
//                  -> [DOM Synthetic Event] -> [JS Event Loop] 
//                  -> [DOM Reflow] -> [Compositor Thread] (15-40ms latency)`,
    outputDescription: 'Execution path comparison demonstrating multi-process IPC latency in WebViews.',
    related: ['what-is-cross-platform', 'legacy-bridge-vs-jsi', 'mobile-rendering-pipeline'],
    quiz: {
      question: 'Why do complex animations and gestures feel less responsive inside a WebView compared to native cross-platform engines?',
      options: [
        'WebViews cannot connect to the internet',
        'WebViews incur multi-process IPC latency, browser DOM reflow overhead, and synthetic event queue delays',
        'WebViews do not support JavaScript',
        'Mobile operating systems disable the GPU for all web pages'
      ],
      correctIndex: 1,
      explanation: 'A WebView must serialize native touch events across process boundaries into synthetic DOM events, re-calculate CSS styles, and perform DOM reflows, resulting in noticeable latency on rapid gestures.'
    }
  },

  // ==========================================
  // GROUP 2: React Native: Bridge to JSI
  // ==========================================
  {
    id: 'legacy-bridge-vs-jsi',
    title: 'The Legacy Asynchronous Bridge vs JavaScript Interface (JSI)',
    kicker: 'React Native / 01',
    group: 'React Native: Bridge to JSI',
    difficulty: 'intermediate',
    summary: 'Why JSON serialization over the asynchronous bridge created UI stutter, and how JSI exposes direct C++ memory pointers.',
    definition: 'In the Legacy React Native architecture, JavaScript and Native (Java/Obj-C) communicated by serializing messages into JSON strings over an asynchronous message queue (The Bridge). The New Architecture replaces this with the JavaScript Interface (JSI)—a lightweight C++ API that allows JavaScript code to directly hold references to C++ HostObjects and invoke native methods synchronously with zero serialization.',
    analogy: 'The Legacy Bridge is like mailing paper letters back and forth across a postal sorting office to coordinate a dance routine. JSI is holding hands with your dance partner and communicating muscle movements instantly in real-time.',
    steps: [
      'Legacy: JS thread serializes UI mutation into JSON payload [tag, method, args]',
      'Legacy: Message waits in asynchronous bridge message queue (batched every 5ms)',
      'Legacy: Native thread parses JSON and applies layout changes (causing gesture lag)',
      'JSI New Architecture: Hermes JS engine instantiates a C++ HostObject',
      'JSI: JavaScript invokes hostObject.invokeMethod() directly in a synchronous C++ call stack'
    ],
    mistakes: [
      'Sending high-frequency stream data (60Hz sensor telemetry, audio buffers) over the legacy bridge without throttling',
      'Assuming JSI synchronous calls are free (blocking the JS thread with heavy synchronous C++ computation causes frame freezes)'
    ],
    optimization: 'JSI allows direct ArrayBuffer byte sharing between JavaScript and C++ without copying or JSON encoding, enabling 120 FPS camera filters.',
    codeSnippet: `// JSI C++ HostObject Invocation (Zero Serialization)
class NativeMathHostObject : public jsi::HostObject {
public:
  jsi::Value get(jsi::Runtime &runtime, const jsi::PropNameID &name) override {
    auto propName = name.utf8(runtime);
    if (propName == "fastMultiply") {
      return jsi::Function::createFromHostFunction(
        runtime, name, 2,
        [](jsi::Runtime &rt, const jsi::Value &thisVal, const jsi::Value *args, size_t count) -> jsi::Value {
          double a = args[0].asNumber();
          double b = args[1].asNumber();
          return jsi::Value(a * b); // Direct synchronous C++ return!
        }
      );
    }
    return jsi::Value::undefined();
  }
};`,
    outputDescription: 'Executes native C++ calculation directly in the JavaScript call stack with zero bridge serialization overhead.',
    related: ['hermes-bytecode-engine', 'fabric-shadow-tree', 'turbomodules-codegen'],
    quiz: {
      question: 'What is the fundamental breakthrough of JSI (JavaScript Interface) in React Native’s New Architecture?',
      options: [
        'It converts JavaScript into Python',
        'It allows JavaScript to hold direct memory pointers to C++ HostObjects, enabling synchronous calls without JSON serialization',
        'It removes the native UI thread completely',
        'It requires all apps to be written in Assembly'
      ],
      correctIndex: 1,
      explanation: 'JSI lets JavaScript hold direct references to C++ HostObjects and invoke native methods synchronously on the same thread without serializing data into JSON strings across an asynchronous message queue.'
    }
  },
  {
    id: 'hermes-bytecode-engine',
    title: 'Hermes Engine & Ahead-of-Time (AOT) Bytecode',
    kicker: 'React Native / 02',
    group: 'React Native: Bridge to JSI',
    difficulty: 'intermediate',
    summary: 'Why React Native uses Hermes to compile JavaScript into bytecode at build time instead of JIT compiling on mobile devices.',
    definition: 'Hermes is an open-source JavaScript engine optimized specifically for React Native. Unlike browser V8 engines that perform heavy JIT compilation, Hermes compiles JS source code into compact bytecode Ahead-of-Time (AOT) during app build, reducing Time to Interactive (TTI), memory footprint, and APK/IPA binary size.',
    analogy: 'Pre-baking and packaging a pizza in an industrial kitchen so the customer can microwave it in 30 seconds, rather than shipping raw flour, yeast, and tomatoes for the customer to bake from scratch on a small camp stove.',
    steps: [
      'Build step: Hermes compiler (hermesc) parses JavaScript bundle into AST',
      'Emits pre-optimized Hermes Bytecode (HBC) binary file',
      'App startup: Mobile OS maps HBC file directly into virtual memory (mmap)',
      'Engine skips parsing and bytecode generation steps entirely',
      'Initial screen executes in <50ms with a compact generational garbage collector'
    ],
    mistakes: [
      'Evaluating dynamic eval() or new Function() code at runtime (Hermes disables JIT compilation for memory efficiency)',
      'Shipping unminified JS source bundles in production builds'
    ],
    optimization: 'Memory mapping (mmap) bytecode allows the OS to share and discard clean bytecode pages under memory pressure without killing the app process.',
    codeSnippet: `// android/app/build.gradle (Enabling Hermes Engine)
project.ext.react = [
    enableHermes: true,  // Compiles JS to HBC bytecode Ahead-of-Time
]

// Startup performance benchmark:
// V8/JSC: Parse + JIT warmup = ~1,200ms TTI, 45MB RAM
// Hermes: Memory-mapped HBC = ~240ms TTI, 18MB RAM (80% faster startup!)`,
    outputDescription: 'Reduces startup time by 80% and eliminates runtime parser memory spikes.',
    related: ['legacy-bridge-vs-jsi', 'fabric-shadow-tree', 'kmp-shared-architecture'],
    quiz: {
      question: 'Why does Hermes compile JavaScript Ahead-of-Time (AOT) instead of using JIT (Just-In-Time) compilation on mobile?',
      options: [
        'Because JIT compilation consumes excessive CPU and RAM during app launch, slowing down Time to Interactive',
        'Because Android devices do not support JavaScript',
        'Because JIT compilation is illegal on Google Play',
        'Because AOT bytecode can only run when connected to Wi-Fi'
      ],
      correctIndex: 0,
      explanation: 'JIT compilation requires parsing and compiling JavaScript while the app is booting up, causing high CPU spikes and battery drain. Hermes does this work on your development machine at build time so the mobile device boots instantly.'
    }
  },
  {
    id: 'fabric-shadow-tree',
    title: 'Fabric Renderer & Immutable C++ Shadow Trees',
    kicker: 'React Native / 03',
    group: 'React Native: Bridge to JSI',
    difficulty: 'advanced',
    summary: 'How Fabric achieves thread-safe concurrent rendering using immutable C++ shadow nodes and Yoga flexbox layout.',
    definition: 'Fabric is React Native’s New Architecture rendering engine. Fabric replaces the legacy UI manager by creating an immutable C++ Shadow Tree for every React element tree. Because shadow nodes are immutable C++ objects, layout calculations (via Yoga) and UI mutations can execute thread-safely across JavaScript, background worker, and UI threads.',
    analogy: 'Printing a new updated edition of a newspaper for every press release, rather than having three editors simultaneously scribble corrections with pencils on the same master copy.',
    steps: [
      'React executes component render() on JavaScript thread',
      'Fabric creates immutable C++ ShadowNodes representing the component hierarchy',
      'Yoga layout engine computes bounding boxes (X, Y, Width, Height) in C++',
      'Fabric calculates minimal diff between previous and new Shadow Tree',
      'Mounts mutations directly to Native UI thread (UIView/Android View) in a single atomic transaction'
    ],
    mistakes: [
      'Directly mutating native view properties from background threads without going through Fabric state updates',
      'Creating excessively deep component hierarchies causing redundant Yoga layout passes'
    ],
    optimization: 'Immutable shadow trees enable React 18 Concurrent Features (Transitions, Suspense) on mobile without thread race conditions.',
    codeSnippet: `// Fabric C++ ShadowNode Representation
class ParagraphShadowNode : public ConcreteViewShadowNode<ParagraphProps, ParagraphEventEmitter> {
public:
  void layout(LayoutContext layoutContext) override {
    // Yoga calculates text bounding box directly in multi-threaded C++
    Size size = measureText(props_.text, layoutContext.maxWidth);
    layoutMetrics_.frame.size = size;
  }
};`,
    outputDescription: 'Computes multi-threaded flexbox layout in C++ with 0 context switching.',
    related: ['legacy-bridge-vs-jsi', 'turbomodules-codegen', 'flutter-skia-pipeline'],
    quiz: {
      question: 'What makes Fabric’s C++ Shadow Nodes thread-safe across background and UI threads?',
      options: [
        'They are immutable: updates clone and create new nodes rather than mutating existing ones in place',
        'They are stored on an external cloud server',
        'They only run when the user is not touching the screen',
        'They disable multi-threading on mobile devices'
      ],
      correctIndex: 0,
      explanation: 'Because Fabric shadow nodes are immutable, multiple threads can safely read from the tree simultaneously without race conditions. When state changes, a new tree clone is created and diffed atomically.'
    }
  },
  {
    id: 'turbomodules-codegen',
    title: 'TurboModules & Automated C++ Codegen',
    kicker: 'React Native / 04',
    group: 'React Native: Bridge to JSI',
    difficulty: 'intermediate',
    summary: 'Type-safe native bindings generated automatically from TypeScript specs with lazy on-demand loading.',
    definition: 'In legacy React Native, all native modules were eagerly initialized at app launch, bloating startup time. TurboModules load lazily on demand when first accessed. React Native Codegen automatically generates strongly-typed C++ glue code from TypeScript or Flow specifications, guaranteeing compile-time type safety across the language boundary.',
    analogy: 'A library with 10,000 reference manuals: instead of carrying every manual to your desk before you start studying (eager load), you look up the exact book you need only when you turn to that chapter (lazy load).',
    steps: [
      'Developer authors TypeScript module specification: export interface Spec extends TurboModule { ... }',
      'Build step: Codegen parses TS spec and generates C++ header bindings and Java/Obj-C protocols',
      'App startup: TurboModuleRegistry registers module metadata with 0ms initialization overhead',
      'Runtime: JS calls NativeStorage.setItem("token", val)',
      'Engine lazily instantiates C++ HostObject and invokes native OS Keychain/Keystore directly'
    ],
    mistakes: [
      'Writing native module parameters without strict TypeScript types (Codegen requires strict static types)',
      'Forgetting to run pod install / gradle sync after updating Codegen specifications'
    ],
    optimization: 'Lazy module initialization saves 200–500ms of startup latency by loading camera, Bluetooth, and biometrics only when the user opens those screens.',
    codeSnippet: `// NativeStorageSpec.ts (Codegen Specification)
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeStorage');`,
    outputDescription: 'Generates type-safe C++ bindings and eliminates runtime type mismatch crashes.',
    related: ['legacy-bridge-vs-jsi', 'fabric-shadow-tree', 'kmp-shared-architecture'],
    quiz: {
      question: 'What performance benefit does TurboModules provide over legacy React Native native modules?',
      options: [
        'TurboModules are loaded lazily on demand instead of all being eagerly instantiated at app launch',
        'TurboModules convert all images to PNG format',
        'TurboModules eliminate the need for an Android SDK',
        'TurboModules remove all TypeScript code from the project'
      ],
      correctIndex: 0,
      explanation: 'Legacy native modules were all initialized at startup, even if the user never navigated to a screen using Bluetooth or Camera. TurboModules are loaded lazily only when first called, dramatically speeding up app cold start.'
    }
  },

  // ==========================================
  // GROUP 3: Flutter: Own-Canvas & Impeller
  // ==========================================
  {
    id: 'flutter-own-canvas',
    title: 'Why Flutter Bypasses OEM Native Platform Widgets',
    kicker: 'Flutter GPU / 01',
    group: 'Flutter: Own-Canvas & Impeller',
    difficulty: 'starter',
    summary: 'The philosophy of owning every pixel: how Flutter sidesteps platform widget fragmentation by rendering directly to GPU surfaces.',
    definition: 'Unlike React Native which translates declarative components into real platform OEM widgets (UIViews on iOS, Android Views on Android), Flutter bypasses platform widgets entirely. Flutter bundles its own complete rendering engine and paints every pixel directly onto a GPU surface (Metal on iOS, Vulkan on Android).',
    analogy: 'React Native is like hiring local actors in every country to perform a play in the local style. Flutter is like bringing a pre-recorded IMAX film projector that projects the exact identical high-definition movie in every theater worldwide.',
    steps: [
      'Dart code defines a tree of widgets (e.g. Container, Text, Column)',
      'Flutter layout engine computes exact pixel coordinates (constraints go down, sizes go up)',
      'RenderObject creates vector drawing instructions',
      'Flutter graphics engine rasterizes drawing instructions directly into GPU framebuffers',
      'Output matches 100% pixel-for-pixel across all Android and iOS device models'
    ],
    mistakes: [
      'Assuming Flutter renders a hidden web page (Flutter uses native machine code and GPU shaders, not HTML/DOM)',
      'Expecting native iOS accessibility or text magnifier features to work automatically without using Flutter’s semantics tree'
    ],
    optimization: 'Owning the canvas means Flutter apps look completely identical across 10,000+ different Android screen sizes and OS skins.',
    codeSnippet: `// Flutter CustomPaint: Direct GPU Drawing
class RadarRing extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF6366F1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    // Dispatches directly to GPU rasterizer without OEM widget translation!
    canvas.drawCircle(Offset(size.width / 2, size.height / 2), 40.0, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`,
    outputDescription: 'Executes direct vector drawing instructions on a GPU surface with zero platform widget overhead.',
    related: ['flutter-three-trees', 'flutter-skia-pipeline', 'flutter-platform-channels'],
    quiz: {
      question: 'How does Flutter render a button on an iOS device?',
      options: [
        'It asks iOS to create an OEM UIButton',
        'It paints the button pixels directly onto a GPU surface using its own rendering engine',
        'It displays an HTML <button> inside a hidden Safari tab',
        'It sends an SMS to the Apple servers'
      ],
      correctIndex: 1,
      explanation: 'Flutter does not use OEM platform widgets like UIButton. It draws the button’s shape, text, and tap ripple directly onto a GPU texture surface using its graphics engine.'
    }
  },
  {
    id: 'flutter-three-trees',
    title: 'The Three Trees: Widget Tree, Element Tree & RenderObject',
    kicker: 'Flutter GPU / 02',
    group: 'Flutter: Own-Canvas & Impeller',
    difficulty: 'intermediate',
    summary: 'The separation of concerns between immutable configuration (Widgets), lifecycle state (Elements), and layout calculation (RenderObjects).',
    definition: 'Flutter organizes user interfaces into three parallel trees. The Widget Tree consists of lightweight, immutable configuration blueprints. The Element Tree manages component lifecycle, state, and identity. The RenderObject Tree handles actual layout calculation, sizing constraints, hit testing, and paint instructions.',
    analogy: 'The Widget is an architect’s blueprint (cheap to redraw). The Element is the site foreman who decides which walls stay or go. The RenderObject is the actual brick wall that occupies physical space and takes effort to build.',
    steps: [
      'Widget Tree: Developer constructs immutable widget hierarchy in build()',
      'Element Tree: Flutter diffs new widgets against existing elements using key and runtimeType',
      'If key and type match: Element updates its configuration without rebuilding the RenderObject',
      'RenderObject Tree: Computes box constraints (min/max width/height) and lays out children',
      'Layer Tree: Compositor groups RenderObjects into display layers and sends to the GPU'
    ],
    mistakes: [
      'Instantiating heavy objects inside build() methods that re-run on every state change',
      'Omitting const constructors on static widgets (const allows Flutter to reuse widget instances without re-allocating)'
    ],
    optimization: 'Reusing RenderObjects when widgets change configuration prevents expensive layout re-calculation passes.',
    codeSnippet: `// The 3 Trees in Harmony
// 1. Widget (Immutable Blueprint):
//    const Text('Hello Flutter')
//
// 2. Element (Lifecycle Manager):
//    ComponentElement manages state and holds pointer to RenderObject
//
// 3. RenderObject (Layout & Paint):
//    RenderParagraph measures text metrics, computes line wraps, and paints`,
    outputDescription: 'Demonstrates how Flutter maintains high frame rates by avoiding redundant layout recalculations.',
    related: ['flutter-own-canvas', 'flutter-skia-pipeline', 'fabric-shadow-tree'],
    quiz: {
      question: 'Which of the three Flutter trees is responsible for calculating bounding box sizes and painting pixels?',
      options: [
        'The Widget Tree',
        'The RenderObject Tree',
        'The Element Tree',
        'The StateTree'
      ],
      correctIndex: 1,
      explanation: 'Widgets are just immutable blueprints. It is the RenderObject Tree that actually measures constraints, computes layout coordinates, and issues paint commands to the GPU.'
    }
  },
  {
    id: 'flutter-skia-pipeline',
    title: 'Flutter Rendering: Skia vs Impeller & Shader Pre-Compilation',
    kicker: 'Flutter GPU / 03',
    group: 'Flutter: Own-Canvas & Impeller',
    difficulty: 'advanced',
    summary: 'Why Flutter replaced Skia with Impeller to eliminate first-frame shader compilation jank on mobile GPUs.',
    definition: 'Historically, Flutter used the Skia 2D graphics library, which compiled GPU shaders (GLSL) just-in-time when an animation first appeared, causing noticeable "shader compilation jank". Flutter’s modern Impeller engine solves this by pre-compiling all necessary Metal and Vulkan shaders Ahead-of-Time at build time, guaranteeing rock-solid 120 FPS animations.',
    analogy: 'Skia is like a chef who doesn’t turn on the stove until a customer orders a hot soup, delaying the meal by 5 minutes. Impeller is a kitchen where the stove is pre-heated and broth is pre-simmered, serving the soup in 10 seconds flat.',
    steps: [
      'Build step: Impeller offline shader compiler (impellerc) compiles GLSL into platform SPIR-V/Metal byte code',
      'Shaders are bundled directly into the app binary',
      'App startup: Shaders are loaded into GPU memory with zero runtime compilation delay',
      'Runtime: Complex clipping, rounded rectangles, and blurs execute instantaneously',
      'Output maintains rock-solid 60/120 FPS on iOS (Metal) and Android (Vulkan)'
    ],
    mistakes: [
      'Overusing saveLayer() or nested clip paths which forces the GPU to create offscreen render passes',
      'Assuming shader compilation jank on Android was caused by Dart code (it was a GPU driver shader compile issue)'
    ],
    optimization: 'Impeller completely eliminates the need for manual shader warm-up runs or sksl bundle recording profiles.',
    codeSnippet: `// Impeller Architecture: Ahead-of-Time Shader Compilation
// Old Skia:
// [First Animation Frame] -> [GPU Driver GLSL Compile (30-80ms)] -> [JANK!]
//
// New Impeller:
// [Build Time: impellerc] -> [Pre-compiled MSL / Vulkan Shaders]
// [Runtime Frame 1]       -> [Immediate GPU Execution (0ms compilation delay)]`,
    outputDescription: 'Comparison of JIT shader compilation in Skia vs Ahead-of-Time pre-compilation in Impeller.',
    related: ['flutter-own-canvas', 'flutter-three-trees', 'fabric-shadow-tree'],
    quiz: {
      question: 'What caused the notorious "first-frame animation jank" in older Flutter apps, and how did Impeller fix it?',
      options: [
        'Slow Wi-Fi; Impeller added a faster network library',
        'Skia compiled GPU shaders Just-In-Time during the first frame; Impeller pre-compiles all shaders Ahead-of-Time at build time',
        'Dart garbage collection pauses; Impeller removed Dart',
        'Android screens lacked touch digitizers; Impeller added touch drivers'
      ],
      correctIndex: 1,
      explanation: 'When Skia encountered a new visual effect for the first time, the mobile GPU driver had to compile the shader on the fly, which took 30–80ms and dropped frames. Impeller pre-compiles all shaders at app build time.'
    }
  },
  {
    id: 'flutter-platform-channels',
    title: 'Flutter Platform Channels & Dart FFI (Foreign Function Interface)',
    kicker: 'Flutter GPU / 04',
    group: 'Flutter: Own-Canvas & Impeller',
    difficulty: 'intermediate',
    summary: 'How Flutter communicates with native hardware: asynchronous MethodChannels vs synchronous zero-overhead Dart FFI.',
    definition: 'When a Flutter app needs native hardware access (Bluetooth, Camera, GPS, Apple Health), it uses Platform Channels or Dart FFI. MethodChannels send encoded binary messages asynchronously between Dart and Swift/Kotlin. For high-performance C/C++ libraries, Dart FFI allows direct synchronous memory pointers with zero message passing overhead.',
    analogy: 'MethodChannels are like sending a courier across town with a package (reliable, but takes a few milliseconds). Dart FFI is reaching directly into the desk drawer next to you to grab a file instantly in 0 milliseconds.',
    steps: [
      'Dart initializes MethodChannel("com.example.sensor")',
      'Dart calls channel.invokeMethod("getBatteryLevel")',
      'Flutter engine serializes arguments into StandardMessageCodec binary bytes',
      'Native iOS/Android host receives binary message, calls platform battery API',
      'Native host replies with binary result, resolving the Dart Future asynchronously'
    ],
    mistakes: [
      'Sending high-frequency 60Hz camera frame buffers across MethodChannels (creates serialization queue bottleneck)',
      'Forgetting to register method channel handlers on the platform main UI thread'
    ],
    optimization: 'Using Dart FFI for native C/C++ libraries bypasses platform channels entirely, enabling real-time audio synthesis and machine learning inference.',
    codeSnippet: `// Dart Platform Channel Invocation
const platform = MethodChannel('com.example.battery');

Future<int> getBatteryLevel() async {
  try {
    // Asynchronous binary IPC to native host
    final int result = await platform.invokeMethod('getBatteryLevel');
    return result;
  } on PlatformException catch (e) {
    return -1;
  }
}`,
    outputDescription: 'Asynchronous binary message exchange between Dart VM and Native iOS/Android platforms.',
    related: ['flutter-own-canvas', 'turbomodules-codegen', 'kmp-shared-architecture'],
    quiz: {
      question: 'When should a developer use Dart FFI (Foreign Function Interface) instead of a standard MethodChannel in Flutter?',
      options: [
        'When connecting directly to high-performance C/C++ native libraries with zero serialization overhead',
        'When writing basic text on a button',
        'When changing background colors in CSS',
        'When sending an email'
      ],
      correctIndex: 0,
      explanation: 'MethodChannels incur binary serialization overhead. For intensive tasks like image processing, database engines (SQLite), or C++ math libraries, Dart FFI allows direct memory calls without message encoding.'
    }
  },

  // ==========================================
  // GROUP 4: KMP & Architecture Strategy
  // ==========================================
  {
    id: 'kmp-shared-architecture',
    title: 'Kotlin Multiplatform (KMP) & Native UI Binding',
    kicker: 'KMP Architecture / 01',
    group: 'KMP & Architecture Strategy',
    difficulty: 'intermediate',
    summary: 'Sharing 100% pure business logic in Kotlin while rendering 100% native SwiftUI and Jetpack Compose UIs.',
    definition: 'Kotlin Multiplatform (KMP) takes an inverted approach to cross-platform: instead of wrapping or emulating UI, KMP compiles shared business logic (networking, state machines, SQL database caching) into Kotlin/JVM for Android and Objective-C/Swift Frameworks for iOS (via Kotlin/Native LLVM). The UI is written in native Jetpack Compose and SwiftUI.',
    analogy: 'Sharing the exact same vehicle engine, transmission, and fuel injection system across two sports cars, while letting iOS install a bespoke Italian leather interior and Android install a high-tech carbon fiber cockpit.',
    steps: [
      'commonMain: Write shared networking (Ktor), serialization (Kotlinx), and database (SQLDelight)',
      'KMP compiler produces .aar library for Android and .framework for iOS',
      'iOS Developer imports shared framework directly into Xcode: import SharedKit',
      'SwiftUI views observe shared StateFlow / Coroutines via Native Swift bindings',
      'Achieves 100% platform-native UI performance with zero bridge or canvas overhead'
    ],
    mistakes: [
      'Coupling platform-specific UI lifecycles directly into commonMain code without expect/actual declarations',
      'Ignoring Swift-Kotlin memory management differences in older Kotlin/Native memory managers'
    ],
    optimization: 'Kotlin/Native LLVM compilation produces zero-runtime-overhead binary binaries that link directly with iOS UIKit and SwiftUI.',
    codeSnippet: `// commonMain/Repository.kt (Shared Kotlin Logic)
class RocketRepository(private val api: SpaceXApi) {
    suspend fun fetchLaunches(): List<Launch> {
        return api.getLaunches().filter { it.launchSuccess == true }
    }
}

// iOS (SwiftUI View)
struct LaunchListView: View {
    @ObservedObject var viewModel: ObservableLaunchViewModel
    var body: some View {
        List(viewModel.launches, id: \\.id) { launch in
            Text(launch.missionName) // 100% Pure SwiftUI!
        }
    }
}`,
    outputDescription: 'Combines cross-platform code reuse with 100% native platform fidelity.',
    related: ['kmp-llvm-compilation', 'mobile-architecture-decision-matrix', 'legacy-bridge-vs-jsi'],
    quiz: {
      question: 'What is the core design philosophy of Kotlin Multiplatform (KMP)?',
      options: [
        'Share non-UI business logic, networking, and state in Kotlin, while rendering 100% native SwiftUI on iOS and Jetpack Compose on Android',
        'Re-compile web browsers to run on smartwatch screens',
        'Replace Apple Xcode completely with a custom operating system',
        'Prohibit developers from using Swift or Kotlin'
      ],
      correctIndex: 0,
      explanation: 'KMP avoids cross-platform UI emulation by letting you write shared data, networking, and business logic once in Kotlin, while building the UI using the platform’s official native UI frameworks (SwiftUI and Jetpack Compose).'
    }
  },
  {
    id: 'kmp-llvm-compilation',
    title: 'Kotlin/Native & The LLVM Compilation Pipeline',
    kicker: 'KMP Architecture / 02',
    group: 'KMP & Architecture Strategy',
    difficulty: 'advanced',
    summary: 'How Kotlin/Native compiles Kotlin code directly into platform-specific machine code without requiring a Java Virtual Machine.',
    definition: 'On Android, Kotlin compiles to JVM bytecode executed by the Android Runtime (ART). On iOS, where JVMs cannot run, Kotlin/Native uses the LLVM compiler backend to compile Kotlin source code directly into native ARM64 machine code packaged into a standard Apple Framework (.xcframework) with Objective-C compatible headers.',
    analogy: 'A master bilingual author who prints their book in English for one country and simultaneously produces an authentic, certified Spanish edition that reads like it was written by a native Spanish speaker.',
    steps: [
      'Kotlin frontend compiler parses Kotlin source code into an Intermediate Representation (IR)',
      'Kotlin/Native backend transforms IR into LLVM bitcode',
      'LLVM optimization passes perform dead code elimination, inlining, and loop vectorization',
      'LLVM emits native ARM64 machine code binaries for iOS physical devices and x86_64 for simulators',
      'Xcode links the resulting .xcframework directly into the iOS build pipeline'
    ],
    mistakes: [
      'Expecting Java standard library APIs (like java.util.Date) to exist in Kotlin/Native (must use multiplatform kotlinx.datetime)',
      'Bloating binary sizes by failing to enable Dead Code Elimination (DCE) on production release builds'
    ],
    optimization: 'Because Kotlin/Native produces real binary frameworks, iOS apps experience 0ms interpreter startup delay.',
    codeSnippet: `// build.gradle.kts (Kotlin Multiplatform Configuration)
kotlin {
    androidTarget()
    
    // Compiles to native iOS ARM64 binaries via LLVM
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach {
        it.binaries.framework {
            baseName = "SharedKit"
        }
    }
}`,
    outputDescription: 'Configures LLVM target outputs for Apple Silicon and physical mobile hardware.',
    related: ['kmp-shared-architecture', 'mobile-architecture-decision-matrix', 'hermes-bytecode-engine'],
    quiz: {
      question: 'How does Kotlin code run on iOS devices in a Kotlin Multiplatform project?',
      options: [
        'By embedding a Java Virtual Machine (JVM) inside the iOS app',
        'Kotlin/Native compiles the code using LLVM directly into native ARM64 machine code packaged as an Apple Framework',
        'By opening a hidden web page',
        'By converting Kotlin into JavaScript at runtime'
      ],
      correctIndex: 1,
      explanation: 'iOS does not allow JVMs. Kotlin/Native uses the industry-standard LLVM compiler infrastructure to produce native ARM64 machine code that links directly with Apple Xcode projects.'
    }
  },
  {
    id: 'mobile-architecture-decision-matrix',
    title: 'The Senior Mobile Architect’s Decision Framework',
    kicker: 'Strategy / 01',
    group: 'KMP & Architecture Strategy',
    difficulty: 'expert',
    summary: 'A structured evaluation framework for choosing between Pure Native, React Native JSI, Flutter, and KMP based on real engineering constraints.',
    definition: 'No single cross-platform framework is universally superior. Engineering leadership must evaluate cross-platform choices against technical parameters: team skillset, requirement for platform-specific design fidelity, performance demands (120 FPS canvas vs document UI), code sharing percentage, third-party SDK availability, and long-term maintenance overhead.',
    analogy: 'Choosing the right vehicle for a journey: you do not use a semi-truck for a drag race, nor a sports car for moving furniture. Pick the tool tailored to your payload, terrain, and driver expertise.',
    steps: [
      'Assess UI Requirements: Do you need custom bespoke canvas visuals (Flutter), 100% native platform look (RN JSI / KMP), or complex native widgets?',
      'Assess Team Skillset: React/Web engineers &rarr; React Native. Mobile engineers &rarr; KMP or Flutter.',
      'Assess Hardware/SDK Integration: Heavy reliance on BLE, ARKit, or custom audio DSP leans towards KMP or Pure Native.',
      'Evaluate Code Sharing Scope: Sharing UI + Logic (Flutter / RN) vs Sharing Logic Only (KMP).',
      'Make architectural decision with explicit recorded trade-offs in an Architecture Decision Record (ADR).'
    ],
    mistakes: [
      'Choosing a framework solely based on social media hype rather than the team’s existing proficiency',
      'Assuming cross-platform means you will never need someone who understands native iOS or Android build tools',
      'Rewriting an existing stable native app in cross-platform without an incremental adoption strategy'
    ],
    optimization: 'KMP allows incremental adoption: migrate a single networking repository without rewriting any existing native UI.',
    codeSnippet: `// Mobile Framework Selection Rule of Thumb:
//
// 1. Need 100% identical pixel visual design on both platforms?
//    ==> Choose FLUTTER (Own Canvas + Impeller)
//
// 2. Large existing web React team, need native platform look?
//    ==> Choose REACT NATIVE (JSI + Fabric)
//
// 3. Existing native iOS/Android teams, want to share logic only?
//    ==> Choose KOTLIN MULTIPLATFORM (KMP + Native UI)
//
// 4. Building complex ARKit/Metal/Direct ML engine?
//    ==> Choose PURE NATIVE (Swift + Kotlin)`,
    outputDescription: 'Practical architectural heuristic for engineering leads and mobile architects.',
    related: ['what-is-cross-platform', 'kmp-shared-architecture', 'legacy-bridge-vs-jsi'],
    quiz: {
      question: 'Which cross-platform architecture is best suited for an engineering team with existing native iOS and Android apps that wants to share networking and database logic without rewriting their native SwiftUI and Compose UIs?',
      options: [
        'Capacitor / Cordova WebView',
        'Kotlin Multiplatform (KMP)',
        'Flutter with Skia',
        'Re-writing everything in Flash'
      ],
      correctIndex: 1,
      explanation: 'KMP allows incremental adoption where existing native teams can share common business logic (networking, caching, models) while leaving 100% of the native SwiftUI and Jetpack Compose UI intact.'
    }
  }
];

export const crossPlatformTopicGroups: CrossPlatformTopicGroup[] = [
  {
    id: 'foundations-pipeline',
    name: 'Foundations & Mobile OS Pipeline',
    description: 'Native vs Hybrid vs Cross-Platform paradigms, the 16.6ms UI frame budget, and why WebViews struggle with gestures.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'Foundations & Mobile OS Pipeline')
  },
  {
    id: 'bridge-jsi',
    name: 'React Native: Bridge to JSI',
    description: 'JSON serialization bottlenecks, C++ HostObjects, Hermes AOT bytecode, and Fabric immutable shadow trees.',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'React Native: Bridge to JSI')
  },
  {
    id: 'flutter-impeller',
    name: 'Flutter: Own-Canvas & Impeller',
    description: 'Bypassing OEM widgets, the 3-Tree architecture, and Impeller pre-compiled GPU shaders eliminating jank.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'Flutter: Own-Canvas & Impeller')
  },
  {
    id: 'kmp-strategy',
    name: 'KMP & Architecture Strategy',
    description: 'Shared Kotlin business logic, LLVM native compilation, and the Senior Architect decision framework.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'KMP & Architecture Strategy')
  }
];

export const getCrossPlatformTopic = (id: string) => crossPlatformTopics.find(t => t.id === id);
