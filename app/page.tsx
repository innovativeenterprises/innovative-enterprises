

'use client';

import HomeClient from './home-client';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { useGlobalStore } from './lib/global-store';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const isClient = useGlobalStore(state => state.isClient);

  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Simulate loading time
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  if (loading) {
    return <SplashScreen />;
  }

  return <HomeClient />;
}
