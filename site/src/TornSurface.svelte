<script lang="ts">
  // A full-bleed torn-paper band. The deckled top and bottom edges ARE the
  // transition into the dark page — no separators. Content sits on the painted
  // color field with matte grain. Edges are organic, low-frequency tears.
  export let fill = '#ece7df';
  export let ink = '#0b1626';
  export let seed = 7;
  export let pad = '3rem 0';
  let uid = `t${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class="band" style={`--ink:${ink}; --pad:${pad};`}>
  <svg class="paint" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter id={`tear-${uid}`} x="-4%" y="-12%" width="108%" height="124%">
        <!-- low x-freq, higher y-freq → long ragged horizontal deckle on top/bottom -->
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.025" numOctaves="3" seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id={`grain-${uid}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed + 5} result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
    </defs>
    <!-- overscan top/bottom so only the torn horizontal edges show -->
    <rect x="-4" y="6" width="108" height="88" {fill} filter={`url(#tear-${uid})`} />
    <rect x="-4" y="6" width="108" height="88" fill="#fff" filter={`url(#grain-${uid})`} />
  </svg>
  <div class="inner"><slot /></div>
</div>

<style>
  .band { position: relative; isolation: isolate; }
  .paint { position: absolute; inset: -2px 0; width: 100%; height: calc(100% + 4px); z-index: -1; }
  .inner { padding: var(--pad); color: var(--ink); }
</style>
