"use client";

import Link from 'next/link';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { BikeIcon } from '../icons/bike-icon';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function Header() {
  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger />}
        {!isMobile && (
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <BikeIcon className="h-7 w-7" />
            <span className="text-xl font-headline font-semibold">BroRide</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for user avatar or login button */}
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </div>
    </header>
  );
}
