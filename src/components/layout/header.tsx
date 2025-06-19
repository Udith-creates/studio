
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
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
            <Image src="/logo.png" alt="BroRide Logo" width={120} height={30} className="object-contain" />
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
      </div>
    </header>
  );
}
