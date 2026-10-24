import type { SVGProps } from 'react';

/*
 * A small custom icon set, drawn on a 20px grid with 1.5px strokes.
 * Icons are decorative by default (aria-hidden); give the parent control
 * an accessible name instead.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props} className={['arrow-icon', props.className].filter(Boolean).join(' ')}>
      <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" />
    </Svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Svg {...props} className={['arrow-icon', props.className].filter(Boolean).join(' ')}>
      <path d="M6 14 14 6M7.5 6H14v6.5" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 4.5v11l9-5.5-9-5.5Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4.5 4.5 11 11M15.5 4.5l-11 11" />
    </Svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 7.5 5 5 5-5" />
    </Svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12.5 5 7.5 10l5 5" />
    </Svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m7.5 5 5 5-5 5" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10 4v12M4 10h12" />
    </Svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10h12" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7h14M3 13h14" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props} strokeLinejoin="round" strokeLinecap="round">
      <path d="M5.2 3.5h2.6l1.3 3.3-1.7 1.1a8.4 8.4 0 0 0 4.7 4.7l1.1-1.7 3.3 1.3v2.6a1.6 1.6 0 0 1-1.7 1.6A12.6 12.6 0 0 1 3.6 5.2a1.6 1.6 0 0 1 1.6-1.7Z" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props} strokeLinejoin="round">
      <path d="M3 5h14v10H3z" />
      <path d="m3.5 5.5 6.5 5 6.5-5" />
    </Svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props} strokeLinejoin="round" strokeLinecap="round">
      <path d="M10 2.8a7.2 7.2 0 0 0-6.2 10.9L2.8 17.2l3.6-1a7.2 7.2 0 1 0 3.6-13.4Z" />
      <path d="M7.4 6.9c.2-.4.4-.4.6-.4h.4c.2 0 .3 0 .4.3l.6 1.4c0 .2 0 .3-.1.4l-.4.5c-.1.1-.2.3 0 .5.4.7 1.3 1.6 2.1 2 .2.1.4.1.5 0l.5-.6c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.3 0 .4-.1 1-.5 1.3-.4.3-1 .6-1.8.4-.9-.2-2.4-.8-3.6-2.1-1.1-1.1-1.7-2.4-1.8-3 0-.6.2-1.1.6-1.5Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8.5 4.5h-4v11h11v-4M11 4.5h4.5V9M15.2 4.8 9 11" />
    </Svg>
  );
}
