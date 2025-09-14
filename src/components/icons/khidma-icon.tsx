
import * as React from "react"
import { cn } from "@/lib/utils"

const KhidmaIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-handshake", className)}
    {...props}
  >
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-2.5-2.5" />
    <path d="M10 14 7.5 16.5a1 1 0 1 1-3-3L7 11" />
    <path d="M18 11s-1-2-3-2-3 2-3 2" />
    <path d="M14 11s-1-2-3-2-3 2-3 2" />
    <path d="M2 22v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
  </svg>
));
KhidmaIcon.displayName = "KhidmaIcon";

export default KhidmaIcon;
