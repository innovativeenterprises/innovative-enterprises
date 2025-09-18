
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Education Technology | Innovative Enterprises",
    template: "%s | Education Technology",
  },
  description: "A suite of AI-driven platforms to enhance learning, streamline administration, and improve student outcomes.",
};


export default function EducationTechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
