<script lang="ts">
  // A thin torn-paper edge used as a divider / band cap between sections.
  export let fill = '#16263c';
  export let seed = 3;
  export let flip = false;
  let uid = `e${Math.random().toString(36).slice(2, 8)}`;
</script>

<svg
  class="edge"
  class:flip
  viewBox="0 0 100 12"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <defs>
    <filter id={`re-${uid}`} x="-2%" y="-30%" width="104%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02 0.18" numOctaves="2" seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
  <rect x="-2" y="-4" width="104" height="12" {fill} filter={`url(#re-${uid})`} />
</svg>

<style>
  .edge { display: block; width: 100%; height: 14px; }
  .flip { transform: scaleY(-1); }
</style>
