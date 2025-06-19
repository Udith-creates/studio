
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SearchRoutesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Find Your Ride</CardTitle>
          </div>
          <CardDescription className="font-body text-base">
            Enter your destination and preferences to find matching routes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Search form will appear here once the page loads.</p>
        </CardContent>
      </Card>
      <p className="font-body text-muted-foreground">Search results will be displayed below.</p>
    </div>
  );
}
