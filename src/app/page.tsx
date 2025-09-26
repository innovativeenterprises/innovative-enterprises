
'use server';

import HomeClient from "./home-client";

export default async function HomePage() {
  // The client component now fetches all its own data via hooks.
  return (
    <HomeClient />
  );
}
