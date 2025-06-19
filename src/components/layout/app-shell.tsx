"use client";

import type { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import Header from './header';
import Link from 'next/link';
import { BikeIcon } from '../icons/bike-icon';
import { UserIcon } from '../icons/user-icon';
import { Home, Search, Heart, LayoutDashboard, UserCircle, Route, DollarSign, ListChecks } from 'lucide-react';

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/post-route", label: "Post a Route", icon: Route },
  { href: "/search-routes", label: "Find a Ride", icon: Search },
  { href: "/my-rides", label: "My Rides", icon: ListChecks },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard", label: "Green Impact", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/calculate-cost", label: "Cost Calculator", icon: DollarSign },
  // { href: "/payments", label: "Payments Demo", icon: CreditCard }, // Placeholder
];

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center flex gap-2">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <BikeIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold">BroRide</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton className="font-medium" tooltip={item.label}>
                    <item.icon className="h-5 w-5" />
                    <span className='font-headline'>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
