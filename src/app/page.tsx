
import EcosystemExplorerPage from "./ecosystem-explorer/page";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Innovative Enterprises | AI-Powered Business Ecosystem",
  description: "Explore a comprehensive ecosystem of AI agents, SaaS platforms, and digital services designed to automate and accelerate business growth in Oman and the GCC.",
};

// The root page now simply renders the new, exciting ecosystem explorer.
export default function Home() {
  return <EcosystemExplorerPage />;
}
