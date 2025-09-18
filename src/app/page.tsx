'use client';

import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Stats } from '@/components/landing/Stats';
import { Features } from '@/components/landing/Features';
import { UserRole } from '@/lib/types';
import { EnvDebugger } from '@/components/debug/EnvDebugger';


export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <EnvDebugger />
    </div>
  );
}
