export const platformFeatures = [
  {
    title: 'Skeletal Canvas HUD',
    description:
      'Real-time joint-angle telemetry overlaid on your MP4 via a synced HTML5 canvas — frame-accurate to the millisecond.',
    metric: '60 FPS',
  },
  {
    title: 'DTW Similarity Engine',
    description:
      'Dynamic Time Warping scores your movement against elite reference footage, quantifying form deviation instantly.',
    metric: '±0.01',
  },
  {
    title: 'Secure Video Pipeline',
    description:
      'JWT-authenticated upload, processing, and retrieval. Your biomechanics data stays locked behind enterprise-grade access.',
    metric: '256-bit',
  },
];

export const sciencePillars = [
  {
    title: 'Joint Kinematics',
    body: 'Track knee, hip, shoulder, and ankle angles across every frame. Coaches isolate the exact moment form breaks down — frame 42, not frame 40.',
  },
  {
    title: 'Dynamic Time Warping',
    body: 'DTW aligns temporal sequences even when speed differs. A slower athlete is fairly compared to an Olympic reference without forced synchronization.',
  },
  {
    title: 'Pose Estimation',
    body: 'COCO-format keypoints power the skeletal overlay — 17 landmarks per frame with confidence scoring for clinical-grade reliability.',
  },
];

export const aboutBlocks = [
  {
    heading: 'Mission',
    text: 'Apex Kinematics delivers military-grade biomechanics intelligence to elite coaches and data-driven athletes. We transform raw video into actionable kinematic insight.',
  },
  {
    heading: 'Who It\'s For',
    text: 'Olympic coaches who need frame-precise joint angles. Competitive athletes who demand instant DTW feedback. Sports science teams who refuse cluttered, generic tooling.',
  },
  {
    heading: 'The Stack',
    text: 'Next.js 14 cinematic UI · FastAPI Python vision pipeline · Zustand session state · HTML5 Canvas telemetry HUD. Zero 3D gimmicks — pure performance data.',
  },
];

export const historyTimeline = [
  {
    era: 'Phase 01',
    title: 'Vision Pipeline',
    detail: 'Python backend ingests MP4, extracts pose keypoints, computes joint angles per frame.',
  },
  {
    era: 'Phase 02',
    title: 'DTW Scoring',
    detail: 'Reference vs. user sequences aligned via Dynamic Time Warping for similarity scoring.',
  },
  {
    era: 'Phase 03',
    title: 'Canvas HUD',
    detail: 'SkeletalPlayer syncs canvas overlay to video currentTime — glowing cyan telemetry in real time.',
  },
  {
    era: 'Live Now',
    title: 'Your Session History',
    detail: 'Log in to access your processed videos, upload new footage, and review analysis archives in the dashboard.',
    cta: true,
  },
];

export const fitnessInsights = [
  { label: 'Knee Flexion', range: '140°–165°', context: 'Optimal sprint mechanics' },
  { label: 'Hip Extension', range: '10°–25°', context: 'Power transfer phase' },
  { label: 'Ankle Dorsiflexion', range: '5°–15°', context: 'Ground contact efficiency' },
  { label: 'DTW Target', range: '> 0.85', context: 'Elite form similarity threshold' },
];
