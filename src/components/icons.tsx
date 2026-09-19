/* 手绘线性图标：全站单一风格 —— 1.6px 描边、方头、无填充、无阴影。装饰层一律 aria-hidden。 */
type IconProps = { size?: number; className?: string };

function Svg({ size = 24, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      {children}
    </svg>
  );
}

export const PowerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v8" />
    <path d="M6.6 6.2a8 8 0 1 0 10.8 0" />
  </Svg>
);

export const AntennaIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.5 12 3l8 7.5" />
    <path d="M12 3v10" />
    <path d="M6 21h12l-1.5-6.5h-9L6 21Z" />
  </Svg>
);

export const TvIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="6.5" width="19" height="13" />
    <path d="M8 3l4 3.5L16 3" />
    <path d="M16 10.5v5" />
  </Svg>
);

export const PhoneRingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 4.5h4l1.5 4-2 1.5c1 2.5 3 4.5 5.5 5.5l1.5-2 4 1.5v4c0 .8-.7 1.5-1.5 1.5C10 16.5 6.5 13 5 6.5 4.7 5.2 4.5 4.5 4.5 4.5Z" />
    <path d="M15 3.5c2.5.5 4.5 2.5 5 5" />
  </Svg>
);

export const EnvelopeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" />
    <path d="M2.5 6 12 13l9.5-7" />
  </Svg>
);

export const DownloadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v11" />
    <path d="M7 9.5 12 14.5l5-5" />
    <path d="M4 20h16" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h17" />
    <path d="M14 6l6 6-6 6" />
  </Svg>
);

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 4h7v7" />
    <path d="M20 4 10 14" />
    <path d="M18 11v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h7" />
  </Svg>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 15.5 12 8.5l7 7" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 8.5 12 15.5l7-7" />
  </Svg>
);

export const SealIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.5 15 5l4-.5 1 4 3 2.5-2 3.5.5 4-4 1-2.5 3-3.5-2-3.5 2-2.5-3-4-1 .5-4-2-3.5 3-2.5 1-4 4 .5Z" />
    <path d="M8.5 12l2.5 2.5 5-5.5" />
  </Svg>
);

export const TagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 3h8l10 10-8 8L3 11V3Z" />
    <path d="M7.5 7.5h.01" />
  </Svg>
);
