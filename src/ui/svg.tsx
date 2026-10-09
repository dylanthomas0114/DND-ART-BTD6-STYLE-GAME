/** Inline SVG icons (no external assets). */
const S = {
  stroke: '#1d1410',
  'stroke-width': 2.5,
  'stroke-linejoin': 'round',
  'stroke-linecap': 'round',
} as const;

export const IconHeart = () => (
  <svg viewBox="0 0 32 32">
    <path
      d="M16 28 4 16a7 7 0 0 1 12-9 7 7 0 0 1 12 9z"
      fill="#e0304a"
      {...{ stroke: S.stroke, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }}
    />
    <ellipse cx="11" cy="11" rx="3" ry="2" fill="#fff" opacity=".6" />
  </svg>
);

export const IconCoin = () => (
  <svg viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="12" fill="#ffd36b" stroke="#1d1410" stroke-width="2.5" />
    <circle cx="16" cy="16" r="8" fill="none" stroke="#b9822a" stroke-width="2" />
    <path d="M16 11v10" stroke="#b9822a" stroke-width="3" stroke-linecap="round" />
  </svg>
);

export const IconPlay = () => (
  <svg viewBox="0 0 32 32">
    <path d="M10 6v20l17-10z" fill="#fff" {...S} />
  </svg>
);

export const IconFast = ({ n = 2 }: { n?: number }) => (
  <svg viewBox="0 0 32 32">
    {n >= 3 ? (
      <>
        <path d="M2 8v16l9-8z" fill="#fff" {...S} />
        <path d="M11 8v16l9-8z" fill="#fff" {...S} />
        <path d="M20 8v16l9-8z" fill="#fff" {...S} />
      </>
    ) : (
      <>
        <path d="M4 7v18l12-9z" fill="#fff" {...S} />
        <path d="M16 7v18l12-9z" fill="#fff" {...S} />
      </>
    )}
  </svg>
);

export const IconPause = () => (
  <svg viewBox="0 0 32 32">
    <rect x="8" y="6" width="6" height="20" rx="1.5" fill="#fff" {...S} />
    <rect x="18" y="6" width="6" height="20" rx="1.5" fill="#fff" {...S} />
  </svg>
);

export const IconGear = () => (
  <svg viewBox="0 0 32 32">
    <g transform="translate(16 16)">
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          x="-3"
          y="-14"
          width="6"
          height="7"
          rx="1.5"
          transform={`rotate(${i * 45})`}
          fill="#e9d3a6"
          {...S}
        />
      ))}
      <circle r="9" fill="#e9d3a6" {...S} />
      <circle r="3.5" fill="#8a5a1a" {...S} />
    </g>
  </svg>
);

export const IconClose = () => (
  <svg viewBox="0 0 32 32">
    <path d="M8 8l16 16M24 8 8 24" stroke="#fff" stroke-width="5" stroke-linecap="round" />
    <path d="M8 8l16 16M24 8 8 24" stroke="#1d1410" stroke-width="1.5" stroke-linecap="round" />
  </svg>
);

export const IconHome = () => (
  <svg viewBox="0 0 32 32">
    <path d="M4 15 16 5l12 10v12H20v-8h-8v8H4z" fill="#fff" {...S} />
  </svg>
);

export const IconMedal = ({ color = '#ffd36b' }: { color?: string }) => (
  <svg viewBox="0 0 32 32" class="medal">
    <path d="M10 2h5l3 9h-6zM17 2h5l-2 9h-6z" fill="#c4362f" {...S} stroke-width={1.5} />
    <circle cx="16" cy="20" r="9" fill={color} {...S} stroke-width={2} />
    <path
      d="m16 15 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"
      fill="#fff"
      opacity=".8"
    />
  </svg>
);

export const IconLock = () => (
  <svg viewBox="0 0 32 32">
    <rect x="7" y="14" width="18" height="14" rx="3" fill="#bfa77d" {...S} />
    <path d="M11 14v-4a5 5 0 0 1 10 0v4" fill="none" {...S} />
  </svg>
);
