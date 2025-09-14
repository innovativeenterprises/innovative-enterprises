
import * as React from "react"
import { cn } from "@/lib/utils"

const AppiIcon = React.forwardRef<
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
    className={cn("lucide lucide-gauge-circle", className)}
    {...props}
  >
    <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0" />
    <path d="m14 14-2-2-2 2" />
    <path d="M12 6V2" />
  </svg>
));
AppiIcon.displayName = "AppiIcon";

export default AppiIcon;
