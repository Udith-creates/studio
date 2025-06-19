"use client";

import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppShell from './app-shell';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppShell>
        {children}
      </AppShell>
    </SidebarProvider>
  );
}
