<script lang="ts">
  // Rothko-style deckled color field, pure SVG so it stays crisp and fully
  // responsive at any size. The torn paper edge is a turbulence-displaced
  // rounded rect; a faint grain overlay gives it matte paper texture.
  export let fill = '#c9d3e0';
  export let seed = 7;
  export let height = 100; // viewBox is 100 wide × `height` tall
  let uid = `cf${Math.random().toString(36).slice(2, 8)}`;
</script>

<svg
  class="field"
  viewBox={`0 0 100 ${height}`}
  preserveAspectRatio="none"
  role="presentation"
  aria-hidden="true"
>
  <defs>
    <filter id={`tear-${uid}`} x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves="2" seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id={`grain-${uid}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed + 3} result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
      <feComposite operator="in" in2="SourceGraphic" />
    </filter>
  </defs>

  <rect
    x="3"
    y="3"
    width="94"
    height={height - 6}
    rx="2"
    {fill}
    filter={`url(#tear-${uid})`}
  />
  <rect
    x="3"
    y="3"
    width="94"
    height={height - 6}
    rx="2"
    fill="#fff"
    filter={`url(#grain-${uid})`}
  />
</svg>

<style>
  .field {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
