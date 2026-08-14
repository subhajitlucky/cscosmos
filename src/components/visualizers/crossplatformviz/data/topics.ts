export interface CrossPlatformTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Bridge vs JSI Core' | 'Fabric & Shadow Trees' | 'TurboModules & Codegen' | 'Flutter Skia & Impeller' | 'KMP & Native Compilers';
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
}

export interface CrossPlatformTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: CrossPlatformTopic[];
}

export const crossPlatformTopics: CrossPlatformTopic[] = [
  // 1. Bridge vs JSI Core
  {
    id: 'legacy-bridge-vs-jsi',
    title: 'The Legacy Asynchronous Bridge vs JavaScript Interface (JSI)',
    kicker: 'Architecture / 01',
    group: 'Bridge vs JSI Core',
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
          return jsi::Value(a * b); // Direct synchronous C++ return
        }
      );
    }
    return jsi::Value::undefined();
  }
};`,
    outputDescription: 'Executes native C++ calculation directly in the JavaScript call stack with zero bridge serialization overhead.',
    related: ['fabric-shadow-tree', 'turbomodules-codegen', 'flutter-skia-pipeline']
  },
  {
    id: 'hermes-bytecode-engine',
    title: 'Hermes Engine & Ahead-of-Time (AOT) Bytecode',
    kicker: 'Architecture / 02',
    group: 'Bridge vs JSI Core',
    difficulty: 'advanced',
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
    enableHermes: true,  // Compiles JS to HBC bytecode at build time
]

// Startup performance: TTI drops from 1,200ms to 240ms`,
    outputDescription: 'Reduces startup time by 80% and eliminates runtime parser memory spikes.',
    related: ['legacy-bridge-vs-jsi', 'fabric-shadow-tree', 'kmp-shared-architecture']
  },

  // 2. Fabric & Shadow Trees
  {
    id: 'fabric-shadow-tree',
    title: 'Fabric Renderer & Immutable C++ Shadow Trees',
    kicker: 'Rendering / 01',
    group: 'Fabric & Shadow Trees',
    difficulty: 'advanced',
    summary: 'How Fabric achieves thread-safe concurrent rendering using immutable C++ shadow nodes and Yoga layout.',
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
    // Yoga calculates text bounding box directly in C++
    Size size = measureText(props_.text, layoutContext.maxWidth);
    layoutMetrics_.frame.size = size;
  }
};`,
    outputDescription: 'Computes multi-threaded flexbox layout in C++ with 0 context switching.',
    related: ['legacy-bridge-vs-jsi', 'turbomodules-codegen', 'flutter-skia-pipeline']
  },

  // 3. TurboModules & Codegen
  {
    id: 'turbomodules-codegen',
    title: 'TurboModules & Automated C++ Codegen',
    kicker: 'Native Modules / 01',
    group: 'TurboModules & Codegen',
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
    related: ['legacy-bridge-vs-jsi', 'fabric-shadow-tree', 'kmp-shared-architecture']
  },

  // 4. Flutter Skia & Impeller
  {
    id: 'flutter-skia-pipeline',
    title: 'Flutter Rendering: Skia, Impeller & Own-Canvas Architecture',
    kicker: 'Flutter GPU / 01',
    group: 'Flutter Skia & Impeller',
    difficulty: 'advanced',
    summary: 'Why Flutter bypasses OEM native widgets entirely to paint directly to GPU surfaces with pre-compiled shaders.',
    definition: 'Unlike React Native which translates JSX into real platform widgets (UIViews / Android Views), Flutter bypasses native widgets entirely. Flutter compiles Dart code AOT to native ARM machine code, builds a RenderObject tree, and draws every single pixel directly to a GPU surface (Metal on iOS, Vulkan on Android) using Impeller / Skia.',
    analogy: 'React Native is a contractor hiring local local bricklayers (OEM widgets) in each country to build a house according to local customs. Flutter is bringing a complete 3D concrete printer that builds the exact identical house anywhere in the world down to the exact millimeter.',
    steps: [
      'Widget Tree: Declarative configuration of UI elements',
      'Element Tree: Manages lifecycle and instantiation of widgets',
      'RenderObject Tree: Handles sizing, layout constraints, and paint instructions',
      'Compositing: SceneBuilder groups render layers into a GPU display list',
      'Impeller Engine: Executes pre-compiled Metal/Vulkan shaders to rasterize pixels directly to screen buffer at 120 FPS'
    ],
    mistakes: [
      'Over-using saveLayer() or nested clip paths causing GPU offscreen render passes',
      'Rebuilding large widget subtrees on every state change without const constructors'
    ],
    optimization: 'Impeller pre-compiles all GPU shaders Ahead-of-Time at app build time, completely eliminating the "shader compilation jank" that historically plagued first-frame animations.',
    codeSnippet: `// Flutter Custom RenderObject / Impeller Canvas
class RadarPaint extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF0EA5E9)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    // Direct GPU drawing instruction (Rasterized via Impeller)
    canvas.drawCircle(Offset(size.width / 2, size.height / 2), size.width * 0.4, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}`,
    outputDescription: 'Draws direct vector graphics on GPU surface with zero OEM widget translation.',
    related: ['legacy-bridge-vs-jsi', 'fabric-shadow-tree', 'kmp-shared-architecture']
  },

  // 5. KMP & Native Compilers
  {
    id: 'kmp-shared-architecture',
    title: 'Kotlin Multiplatform (KMP) & Native UI Binding',
    kicker: 'KMP Architecture / 01',
    group: 'KMP & Native Compilers',
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
            Text(launch.missionName) // 100% Pure SwiftUI
        }
    }
}`,
    outputDescription: 'Combines cross-platform code reuse with 100% native platform fidelity.',
    related: ['flutter-skia-pipeline', 'legacy-bridge-vs-jsi', 'turbomodules-codegen']
  }
];

export const crossPlatformTopicGroups: CrossPlatformTopicGroup[] = [
  {
    id: 'bridge-jsi',
    name: 'Bridge vs JSI Core',
    description: 'JSON serialization bottlenecks, C++ HostObjects, and Hermes AOT bytecode compilation.',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'Bridge vs JSI Core')
  },
  {
    id: 'fabric-rendering',
    name: 'Fabric & Shadow Trees',
    description: 'Immutable C++ shadow nodes, Yoga multithreaded layout, and atomic UI commits.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'Fabric & Shadow Trees')
  },
  {
    id: 'turbomodules',
    name: 'TurboModules & Codegen',
    description: 'Strongly-typed C++ interfaces, lazy on-demand module loading, and automated build codegen.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'TurboModules & Codegen')
  },
  {
    id: 'flutter-impeller',
    name: 'Flutter Skia & Impeller',
    description: 'Bypassing OEM widgets, AOT Dart compilation, and Impeller pre-compiled GPU shaders.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'Flutter Skia & Impeller')
  },
  {
    id: 'kmp-architecture',
    name: 'KMP & Native Compilers',
    description: 'Shared Kotlin business logic, Kotlin/Native LLVM binaries, and native SwiftUI/Compose UI.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: crossPlatformTopics.filter(t => t.group === 'KMP & Native Compilers')
  }
];

export const getCrossPlatformTopic = (id: string) => crossPlatformTopics.find(t => t.id === id);
