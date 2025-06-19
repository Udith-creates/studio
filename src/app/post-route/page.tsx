
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function PostRoutePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Post Your Daily Route</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-body text-base">
            This is a simplified Post Route page. If you see this, the basic routing is working.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
