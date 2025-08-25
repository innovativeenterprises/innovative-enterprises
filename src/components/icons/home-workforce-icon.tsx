
import * as React from "react"
import { cn } from "@/lib/utils"

// This is a custom icon component
const HomeWorkforceIcon = React.forwardRef<
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
    className={cn("lucide lucide-home-plus", className)}
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
    <path d="M12 9v6"></path>
    <path d="M9 12h6"></path>
  </svg>
));
HomeWorkforceIcon.displayName = "HomeWorkforceIcon";

export default HomeWorkforceIcon;
