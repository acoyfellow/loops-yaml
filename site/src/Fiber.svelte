<script lang="ts">
  // A single whispy glowing fiber that loops and waves across the hero, full
  // bleed. Pure SVG: a soft-blurred stroked path whose shape drifts between
  // several wave states via SMIL, so it changes shape over a long cycle and
  // loops seamlessly. Thin, faint, alive.
  let uid = `f${Math.random().toString(36).slice(2, 7)}`;

  // Five wave states with real long-term variance (amplitude + phase shift),
  // then back to the first → seamless loop.
  const w = [
    'M -60 130 C 220 60, 360 200, 620 120 S 980 70, 1240 150 S 1620 90, 1880 140',
    'M -60 150 C 260 210, 380 60, 660 165 S 1020 205, 1280 100 S 1600 160, 1880 105',
    'M -60 100 C 200 140, 420 190, 600 95 S 1040 50, 1280 175 S 1660 120, 1880 135',
    'M -60 160 C 240 90, 400 210, 640 130 S 980 180, 1240 90 S 1640 175, 1880 120',
    'M -60 120 C 220 170, 360 80, 620 150 S 1000 100, 1260 160 S 1620 110, 1880 130',
  ];
  const dvals = `${w[0]};${w[1]};${w[2]};${w[3]};${w[4]};${w[0]}`;
  const DUR = '42s';
</script>

<svg class="fiber" viewBox="0 0 1800 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <filter id={`glow-${uid}`} x="-20%" y="-80%" width="140%" height="260%">
      <feGaussianBlur stdDeviation="2.6" result="soft" />
      <feMerge>
        <feMergeNode in="soft" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f6821f" stop-opacity="0" />
      <stop offset="38%" stop-color="#f6821f" stop-opacity="0.9" />
      <stop offset="64%" stop-color="#8ea6c4" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#8ea6c4" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- faint under-glow -->
  <path fill="none" stroke={`url(#grad-${uid})`} stroke-width="3" stroke-linecap="round"
    filter={`url(#glow-${uid})`} opacity="0.15" d={w[0]}>
    <animate attributeName="d" dur={DUR} repeatCount="indefinite"
      values={dvals} calcMode="spline"
      keyTimes="0;0.2;0.4;0.6;0.8;1"
      keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" />
  </path>

  <!-- thin inner thread -->
  <path fill="none" stroke={`url(#grad-${uid})`} stroke-width="0.8" stroke-linecap="round"
    opacity="0.5" d={w[0]}>
    <animate attributeName="d" dur={DUR} repeatCount="indefinite"
      values={dvals} calcMode="spline"
      keyTimes="0;0.2;0.4;0.6;0.8;1"
      keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" />
  </path>
</svg>

<style>
  .fiber {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .fiber :global(animate) { display: none; }
  }
</style>
