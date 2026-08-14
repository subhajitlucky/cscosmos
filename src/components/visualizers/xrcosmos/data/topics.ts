export interface XrTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Spatial Fundamentals' | 'WebXR Device API' | 'Stereoscopic Rendering' | 'Input & Hand Tracking' | 'Volumetric UI & Audio';
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

export interface XrTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: XrTopic[];
}

export const xrTopics: XrTopic[] = [
  // 1. Spatial Fundamentals
  {
    id: 'spatial-coordinates-6dof',
    title: '3-DoF vs 6-DoF & Spatial Coordinates',
    kicker: 'Fundamentals / 01',
    group: 'Spatial Fundamentals',
    difficulty: 'starter',
    summary: 'The difference between rotational orientation (3-DoF) and full translational room-scale tracking (6-DoF).',
    definition: 'Spatial computing coordinates objects in a 3D right-handed Cartesian coordinate system (+X right, +Y up, +Z towards viewer). 3-Degrees-of-Freedom (3-DoF) tracks only orientation (Pitch, Yaw, Roll). 6-Degrees-of-Freedom (6-DoF) adds translational positional movement (Surge, Sway, Heave) allowing physical room-scale walking.',
    analogy: '3-DoF is like sitting in a swivel chair in the dark: you can turn your head in any direction, but you cannot walk across the room. 6-DoF is walking freely around an art museum with full physical freedom.',
    steps: [
      'IMU sensors (accelerometer & gyroscope) track rotational angular velocity',
      'Optical Inside-Out cameras detect visual SLAM feature points in the physical room',
      'Sensor fusion merges IMU high-frequency data with SLAM low-drift camera poses',
      'Outputs continuous 6-DoF pose matrix [X, Y, Z, Qx, Qy, Qz, Qw] at 90Hz-120Hz',
      'Synchronizes virtual camera viewport position with user physical eye coordinates'
    ],
    mistakes: [
      'Using Euler angles (pitch/yaw/roll) for 3D rotations which suffer from Gimbal Lock (always use Quaternions)',
      'Designing UI assuming the user will remain stationary at origin [0,0,0] in a 6-DoF environment',
      'Ignoring motion-to-photon latency (latency >20ms triggers vestibulo-ocular disorientation/motion sickness)'
    ],
    optimization: 'Pose reprojection (Asynchronous SpaceWarp / TimeWarp) warps the previously rendered frame using the latest IMU pose, guaranteeing smooth 90 FPS even during heavy frame drops.',
    codeSnippet: `// Three.js / WebXR 6-DoF Controller Tracking
const controller = renderer.xr.getController(0);
controller.addEventListener('selectstart', () => {
  // Grab position & orientation quaternion
  const position = controller.position; // Vector3 { x, y, z }
  const quaternion = controller.quaternion; // Quaternion { x, y, z, w }
  console.log(\`6-DoF Controller Pose: X=\${position.x.toFixed(2)} Y=\${position.y.toFixed(2)} Z=\${position.z.toFixed(2)}\`);
});`,
    outputDescription: 'Captures physical controller coordinates with sub-millimeter tracking accuracy.',
    related: ['webxr-session-lifecycle', 'quaternions-rotations', 'stereoscopic-rendering']
  },
  {
    id: 'quaternions-rotations',
    title: 'Quaternions & 3D Spatial Transforms',
    kicker: 'Fundamentals / 02',
    group: 'Spatial Fundamentals',
    difficulty: 'advanced',
    summary: 'Eliminate Gimbal Lock and achieve smooth spherical linear interpolation (SLERP) using 4D hypercomplex quaternions.',
    definition: 'A Quaternion is a 4-dimensional hypercomplex number (w + xi + yj + zk) representing 3D spatial rotation as an axis vector and rotation angle. Unlike 3-angle Euler representations, quaternions never suffer from Gimbal Lock (axis collapse) and support smooth, constant-speed spherical linear interpolation (SLERP).',
    analogy: 'Rotating a globe by skewering it with a single central needle at an exact 3D angle and spinning it once, rather than trying to balance three separate spinning rings that might accidentally align and lock up.',
    steps: [
      'Define arbitrary 3D rotation axis unit vector [Vx, Vy, Vz]',
      'Compute half-angle theta = angle / 2',
      'Form quaternion: Q = [cos(theta), Vx*sin(theta), Vy*sin(theta), Vz*sin(theta)]',
      'Multiply quaternions to combine consecutive rotations without matrix drift',
      'Interpolate between two orientations using SLERP: Q_interp = slerp(Q_start, Q_end, alpha)'
    ],
    mistakes: [
      'Normalizing quaternions incorrectly causing scaling distortions in 3D geometry',
      'Directly linear interpolating (LERP) orientation instead of Spherical Linear Interpolation (SLERP)'
    ],
    optimization: 'SLERP provides constant-velocity angular motion, preventing jarring visual acceleration artifacts in head and hand tracking.',
    codeSnippet: `// Smooth Quaternion SLERP in Three.js
const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
function animate() {
  // Interpolate smoothly towards target orientation
  currentObject.quaternion.slerp(targetQuaternion, 0.05);
}`,
    outputDescription: 'Rotates 3D UI panel 90 degrees with zero Gimbal Lock and smooth 60 FPS damping.',
    related: ['spatial-coordinates-6dof', 'webxr-session-lifecycle', 'volumetric-billboarding']
  },

  // 2. WebXR Device API
  {
    id: 'webxr-session-lifecycle',
    title: 'WebXR Device API & Session Lifecycle',
    kicker: 'WebXR API / 01',
    group: 'WebXR Device API',
    difficulty: 'intermediate',
    summary: 'Requesting immersive-vr or immersive-ar sessions, reference spaces, and the XR animation loop.',
    definition: 'The WebXR Device API is the open standard interface connecting browsers directly to XR headsets (Apple Vision Pro, Meta Quest, HTC Vive). An application queries navigator.xr.isSessionSupported(), requests an XRSession (immersive-vr / immersive-ar), establishes an XRReferenceSpace, and executes an XRFrame render loop at native display refresh rates.',
    analogy: 'Opening a dedicated high-bandwidth fiber optic pipeline directly between your browser engine and the headset dual micro-OLED displays and tracking sensor array.',
    steps: [
      'Query capability: navigator.xr.isSessionSupported("immersive-vr")',
      'Request session: const session = await navigator.xr.requestSession("immersive-vr")',
      'Obtain reference space: const refSpace = await session.requestReferenceSpace("local-floor")',
      'Bind WebGL framebuffer to XRWebGLLayer',
      'Execute render loop via session.requestAnimationFrame(onXRFrame)'
    ],
    mistakes: [
      'Using window.requestAnimationFrame instead of session.requestAnimationFrame (causes frame stutter and timing desync)',
      'Failing to handle session "end" event when the user removes their headset',
      'Requesting an unsupported reference space (e.g. requesting "unbounded" on standard mobile AR)'
    ],
    optimization: 'Using local-floor reference space places origin [0,0,0] directly on the physical floor, ensuring virtual tables and objects match real-world gravity heights perfectly.',
    codeSnippet: `// Native WebXR Session Lifecycle
async function startXRSession() {
  if (navigator.xr && await navigator.xr.isSessionSupported('immersive-vr')) {
    const session = await navigator.xr.requestSession('immersive-vr');
    const gl = canvas.getContext('webgl2', { xrCompatible: true });
    await gl.makeXRCompatible();
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });
    const refSpace = await session.requestReferenceSpace('local-floor');
    
    function onXRFrame(time, frame) {
      session.requestAnimationFrame(onXRFrame);
      const pose = frame.getViewerPose(refSpace);
      if (pose) {
        for (const view of pose.views) {
          // Render Left Eye and Right Eye
        }
      }
    }
    session.requestAnimationFrame(onXRFrame);
  }
}`,
    outputDescription: 'Establishes full stereoscopic hardware rendering channel at 90 FPS.',
    related: ['stereoscopic-rendering', 'spatial-coordinates-6dof', 'hand-tracking-gestures']
  },

  // 3. Stereoscopic Rendering
  {
    id: 'stereoscopic-rendering',
    title: 'Stereoscopic Dual-Eye Rendering & Foveation',
    kicker: 'Rendering / 01',
    group: 'Stereoscopic Rendering',
    difficulty: 'advanced',
    summary: 'Dual viewport projection matrices, inter-pupillary distance (IPD), and fixed foveated rendering.',
    definition: 'Human depth perception relies on stereopsis: each eye sees a slightly offset view due to Inter-Pupillary Distance (IPD ~63mm). In WebXR, the GPU renders two separate viewports per frame (Left Eye, Right Eye) with distinct projection matrices. Fixed Foveated Rendering (FFR) reduces fragment shader resolution in peripheral vision to save 30-50% GPU fillrate.',
    analogy: 'Holding two cameras 63mm apart to film a movie: combining both video streams in brain optical cortex creates true physical 3D depth perception.',
    steps: [
      'WebXR driver queries user hardware IPD and lens distortion profile',
      'For each frame: XRViewerPose provides two XRView objects (Left Eye, Right Eye)',
      'GPU binds Left Viewport: applies Left Eye View & Projection Matrix',
      'GPU binds Right Viewport: applies Right Eye View & Projection Matrix (offset by IPD)',
      'Displays send left/right views to respective eye displays simultaneously'
    ],
    mistakes: [
      'Rendering full-screen post-processing effects twice without sharing uniform compute buffers',
      'Ignoring stereoscopic convergence: placing UI elements closer than 0.5m causes severe eye strain (vergence-accommodation conflict)'
    ],
    optimization: 'Multi-View WebGL extension (OVR_multiview2) renders both eye viewports in a single draw call, cutting CPU geometry draw call overhead in half.',
    codeSnippet: `// Dual-Eye Render Loop
for (const view of pose.views) {
  const viewport = baseLayer.getViewport(view);
  gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
  
  // view.projectionMatrix: 4x4 matrix tailored to eye FOV
  // view.transform.inverse.matrix: 4x4 eye position matrix
  renderScene(view.projectionMatrix, view.transform.inverse.matrix);
}`,
    outputDescription: 'Renders stereoscopic 3D scene with sub-millimeter eye parallax.',
    related: ['webxr-session-lifecycle', 'spatial-coordinates-6dof', 'volumetric-billboarding']
  },

  // 4. Input & Hands
  {
    id: 'hand-tracking-gestures',
    title: 'Spatial Hand Tracking & Joint Skeletons',
    kicker: 'Interaction / 01',
    group: 'Input & Hand Tracking',
    difficulty: 'intermediate',
    summary: '25-joint hand skeleton tracking, index finger raycasting, and direct pinch gesture detection.',
    definition: 'Modern XR headsets replace physical plastic controllers with direct optical hand tracking. The WebXR Hand Input Module exposes 25 anatomical joint poses per hand (wrist, palm, thumb, index, middle, ring, pinky tips and knuckles) allowing precise natural pinch and grab interactions.',
    analogy: 'Upgrading from operating a robot crane with joysticks to reaching out and picking up objects directly with your bare fingers.',
    steps: [
      'Camera neural networks track 3D landmarks of human hands in real-time',
      'WebXR exposes inputSource.hand containing 25 XRJointSpace nodes',
      'App queries frame.getJointPose(hand.get("index-finger-tip"), refSpace)',
      'Computes Euclidean distance between index tip and thumb tip: distance < 20mm triggers Pinch',
      'Fires spatial raycast from eye through pinch midpoint into 3D UI panels'
    ],
    mistakes: [
      'Assuming hand tracking is always available (always provide fallback for standard XR controllers)',
      'Triggering false pinch events when hands occlude each other in front of camera sensors'
    ],
    optimization: 'Applying a 1-Euro smoothing filter to joint coordinates eliminates high-frequency sensor jitter while preserving instantaneous gesture response.',
    codeSnippet: `// Detecting Index-Thumb Pinch Gesture
function checkPinch(frame, hand, refSpace) {
  const thumbTip = frame.getJointPose(hand.get('thumb-tip'), refSpace);
  const indexTip = frame.getJointPose(hand.get('index-finger-tip'), refSpace);
  
  if (thumbTip && indexTip) {
    const dx = thumbTip.transform.position.x - indexTip.transform.position.x;
    const dy = thumbTip.transform.position.y - indexTip.transform.position.y;
    const dz = thumbTip.transform.position.z - indexTip.transform.position.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    if (distance < 0.02) { // Less than 20mm = Pinch Active!
      return true;
    }
  }
  return false;
}`,
    outputDescription: 'Recognizes direct biological hand pinch in sub-10ms latency.',
    related: ['webxr-session-lifecycle', 'volumetric-billboarding', 'spatial-audio-binaural']
  },

  // 5. Volumetric UI & Audio
  {
    id: 'volumetric-billboarding',
    title: 'World-Locked UI, Billboarding & Ergonomics',
    kicker: 'Spatial UX / 01',
    group: 'Volumetric UI & Audio',
    difficulty: 'advanced',
    summary: 'Designing 3D UI panels: World-locked vs Head-locked, Billboarding rotation, and comfortable viewing zones.',
    definition: 'In 3D space, traditional 2D flat screens are replaced by volumetric UI panels. World-Locked UI fixes panels at exact physical room coordinates. Head-Locked UI follows user head movements (use with caution to avoid motion sickness). Billboarding continuously rotates 3D panels to face the user camera normal directly.',
    analogy: 'World-locked UI is like a picture frame hanging on your living room wall. Billboarding is like a smart digital assistant tablet on a swivel stand that automatically turns to look directly at your face as you walk across the kitchen.',
    steps: [
      'Position UI canvas in 3D world space (e.g. Z = -1.5m at eye height Y = 1.3m)',
      'Calculate direction vector from UI panel position to viewer camera position',
      'Apply Billboarding matrix transform: panel.lookAt(camera.position)',
      'Constrain ergonomic viewing cone (optimal zone: 1.2m - 2.0m distance, 30° vertical FOV)',
      'Apply curved cylindrical curvature to prevent peripheral perspective skew'
    ],
    mistakes: [
      'Head-locking heavy UI elements directly to the user screen center (feels claustrophobic and induces nausea)',
      'Placing interactive buttons outside comfortable physical arm reach or eye raycast range'
    ],
    optimization: 'Curving wide UI panels along a 2-meter radius cylinder matches human ocular focus distance across all panel columns.',
    codeSnippet: `// Billboarding: UI Panel Looks at User
function updateUIPanel(panelMesh, camera) {
  // Constrain Y-axis billboarding (keeps panel upright)
  const target = new THREE.Vector3(camera.position.x, panelMesh.position.y, camera.position.z);
  panelMesh.lookAt(target);
}`,
    outputDescription: 'Maintains optimal 100% legibility regardless of user viewing angle.',
    related: ['spatial-audio-binaural', 'hand-tracking-gestures', 'quaternions-rotations']
  },
  {
    id: 'spatial-audio-binaural',
    title: '3D Spatial Audio & Head-Related Transfer Functions (HRTF)',
    kicker: 'Spatial UX / 02',
    group: 'Volumetric UI & Audio',
    difficulty: 'expert',
    summary: 'Positioning sound in 3D space using Web Audio PannerNode, HRTF filters, and distance attenuation.',
    definition: 'Spatial Audio simulates how human ears perceive acoustic directionality, distance, and room reflections. Using Head-Related Transfer Functions (HRTF) via Web Audio PannerNode, sound waves undergo frequency filtering and interaural time delays (ITD) corresponding to physical 3D sound source coordinates.',
    analogy: 'Closing your eyes in a forest and knowing exactly that a bird is chirping 45 degrees to your left and 10 meters away, simply from how the sound waves bounce off the ridges of your ears.',
    steps: [
      'Create Web Audio Context and AudioListener tied to XR headset camera pose',
      'Instantiate PannerNode with panningModel = "HRTF"',
      'Set sound source 3D position: panner.positionX.value = x, positionY.value = y, positionZ.value = z',
      'Configure distance attenuation: distanceModel = "inverse", rolloffFactor = 1',
      'Connect sound source -> PannerNode -> AudioContext.destination'
    ],
    mistakes: [
      'Using "equalpower" panning instead of "HRTF" (loses realistic elevation and front/back acoustic filtering)',
      'Forgetting to update AudioListener position and forward orientation quaternion on every XRFrame'
    ],
    optimization: 'HRTF binaural spatialization boosts user immersion and spatial awareness by over 300% without consuming additional GPU render fillrate.',
    codeSnippet: `// Web Audio HRTF 3D Spatial Sound
const audioCtx = new AudioContext();
const listener = audioCtx.listener;
const panner = audioCtx.createPanner();
panner.panningModel = 'HRTF';
panner.distanceModel = 'inverse';
panner.refDistance = 1;
panner.maxDistance = 10000;
panner.rolloffFactor = 1;

// Set 3D sound source position: 2m to the right, 1m up, 3m forward
panner.positionX.setValueAtTime(2.0, audioCtx.currentTime);
panner.positionY.setValueAtTime(1.0, audioCtx.currentTime);
panner.positionZ.setValueAtTime(-3.0, audioCtx.currentTime);`,
    outputDescription: 'Produces photorealistic 3D spatial acoustic field with ear-accurate sound localization.',
    related: ['volumetric-billboarding', 'spatial-coordinates-6dof', 'webxr-session-lifecycle']
  }
];

export const xrTopicGroups: XrTopicGroup[] = [
  {
    id: 'fundamentals',
    name: 'Spatial Fundamentals & 6-DoF',
    description: 'Cartesian coordinate systems, 3-DoF vs 6-DoF, and hypercomplex quaternion transforms.',
    badgeColor: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
    topics: xrTopics.filter(t => t.group === 'Spatial Fundamentals')
  },
  {
    id: 'webxr-api',
    name: 'WebXR Device API',
    description: 'XRSession lifecycle, reference space coordinates, and high-frequency render loops.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: xrTopics.filter(t => t.group === 'WebXR Device API')
  },
  {
    id: 'stereoscopic',
    name: 'Stereoscopic Dual-Eye Rendering',
    description: 'Inter-pupillary distance, dual-view projection matrices, and fixed foveated rendering.',
    badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
    topics: xrTopics.filter(t => t.group === 'Stereoscopic Rendering')
  },
  {
    id: 'hands',
    name: 'Input & Spatial Hand Tracking',
    description: '25-joint anatomical hand skeletons, pinch gesture recognition, and spatial raycasting.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: xrTopics.filter(t => t.group === 'Input & Hand Tracking')
  },
  {
    id: 'volumetric-ux',
    name: 'Volumetric UI & Spatial Audio',
    description: 'World-locked panels, cylindrical billboarding ergonomics, and HRTF binaural sound.',
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    topics: xrTopics.filter(t => t.group === 'Volumetric UI & Audio')
  }
];

export const getXrTopic = (id: string) => xrTopics.find(t => t.id === id);
