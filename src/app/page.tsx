
import HomePageClient from "./home-page-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
  description: "An AI-powered business services platform for the Omani market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.",
};


export default function HomePage() {
  // Data is now fetched on the client-side by the components themselves via global state hooks.
  // This simplifies the server component significantly.
  return <HomePageClient />;
}
