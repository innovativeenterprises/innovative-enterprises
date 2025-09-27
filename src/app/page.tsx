

'use server';

import HomeClient from './home-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "INNOVATIVE ENTERPRISES - AI-Powered Business Platform",
  description: "An AI-powered business services platform for the Omani market that automates key operations, connects a network of service providers, and provides a suite of intelligent tools to enhance business productivity and digital transformation.",
};


export default async function HomePage() {
  return <HomeClient />;
}
