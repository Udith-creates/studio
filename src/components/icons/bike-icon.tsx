import type { SVGProps } from 'react';

export function BikeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 17.5h-5.5L8 14h3l-1-2h2.5l2 4.5V17.5Z" />
      <path d="m 8 14 C 8 11, 10 9, 12 9 s 4 2 4 5" />
      <path d="M12 9v3" />
    </svg>
  );
}
