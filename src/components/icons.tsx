import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 3h20v18H2z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M9 3v18h6V3" fill="hsl(var(--background))" stroke="none" />
    </svg>
  ),
};
