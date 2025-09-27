
'use server';

import HomeClient from './home-client';

export default async function HomePage() {
  // Data is preloaded here and passed to client components,
  // which will then be hydrated into the global store.
  return <HomeClient />;
}
