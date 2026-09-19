import type { SVGProps } from 'react';

/* 全站图标：手绘 2px 描边 SVG，单色（继承 currentColor = 巧克力棕）。
   禁止 emoji / 图标字体 / 第三方图标库。 */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export function CoinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6v8.8M9.6 9.6h4a1.9 1.9 0 0 1 0 3.8h-3.6a1.9 1.9 0 0 0 0 3.8h4" />
    </svg>
  );
}

export function KnobIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 3.8v3.4M12 16.8v3.4M3.8 12h3.4M16.8 12h3.4" />
      <path d="M12 12 8.4 8.4" />
    </svg>
  );
}

export function CapsuleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.6c4.6 0 8.4 3.4 8.4 7.6 0 1.4-4.3 2.3-8.4 2.3s-8.4-.9-8.4-2.3c0-4.2 3.8-7.6 8.4-7.6Z" />
      <path d="M3.7 11.6c0 4.1 3.7 8.4 8.3 8.4s8.3-4.3 8.3-8.4" />
    </svg>
  );
}

export function ExternalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4.6h5.4V10" />
      <path d="M19.4 4.6 11.6 12.4" />
      <path d="M18 14.4v3.6a1.6 1.6 0 0 1-1.6 1.6H6a1.6 1.6 0 0 1-1.6-1.6V9.6A1.6 1.6 0 0 1 6 8h3.4" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.6" width="18" height="12.8" rx="1.6" />
      <path d="m3.8 6.8 8.2 6 8.2-6" />
    </svg>
  );
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.6v10.2M8 10.2l4 3.8 4-3.8" />
      <path d="M4 16.4v2a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18.4v-2" />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.6" width="18" height="14.8" rx="1.6" />
      <path d="M10.4 9.2 14.8 12l-4.4 2.8V9.2Z" />
    </svg>
  );
}

export function TicketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.4 8.4h17.2v2.2a1.7 1.7 0 0 0 0 3.4v2.2H3.4v-2.2a1.7 1.7 0 0 0 0-3.4V8.4Z" />
      <path d="M12 8.4v1.8M12 14.4v1.8" />
    </svg>
  );
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3.8 2.5 5.3 5.7.8-4.2 4 1 5.9-5-2.8-5 2.8 1-5.9-4.2-4 5.7-.8L12 3.8Z" />
    </svg>
  );
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4.6 12h14M13.4 6.8 18.6 12l-5.2 5.2" />
    </svg>
  );
}

export function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9.2 5.6 16 12l-6.8 6.4" />
    </svg>
  );
}

export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="8" cy="8" r="3.6" />
      <circle cx="16" cy="16" r="3.6" />
      <path d="M11.6 8h4.8v4.8M12.4 16H7.6v-4.8" />
    </svg>
  );
}
