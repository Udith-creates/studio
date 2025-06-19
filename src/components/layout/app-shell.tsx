
// src/components/layout/app-shell.tsx
"use client";

import type { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import Header from './header';
import Link from 'next/link';
import { Home, Search, Heart, LayoutDashboard, UserCircle, Route, DollarSign, ListChecks, CreditCard, LogIn } from 'lucide-react';
import { BikeIcon } from '@/components/icons/bike-icon';

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/post-route", label: "Post a Route", icon: Route },
  { href: "/search-routes", label: "Find a Ride", icon: Search },
  { href: "/my-rides", label: "My Rides", icon: ListChecks },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/dashboard", label: "Green Impact", icon: LayoutDashboard },
  { href: "/calculate-cost", label: "Cost Calculator", icon: DollarSign },
  { href: "/payments", label: "Payments Demo", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/login", label: "Login", icon: LogIn },
];

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="p-4 items-center flex">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90">
            <BikeIcon className="h-8 w-8" />
            <span className="font-headline text-xl font-semibold">BroRide</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
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
        <div className="flex-1 p-4 md:p-6 lg:p-8 bg-background overflow-x-hidden">
          {children}
        </div>
      </SidebarInset>
    </div>
  );
}
