
import * as React from "react"
import { cn } from "@/lib/utils"

const VmallIcon = React.forwardRef<
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
    className={cn("lucide lucide-vr-headset", className)}
    {...props}
  >
    <path d="M3 12v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
    <path d="M3 12a9 9 0 0 1 18 0" />
    <path d="M12 12a4 4 0 1 0-8 0" />
    <path d="M12 12a4 4 0 1 1 8 0" />
  </svg>
));
VmallIcon.displayName = "VmallIcon";

export default VmallIcon;
