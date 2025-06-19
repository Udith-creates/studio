
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md text-center shadow-xl rounded-lg">
        <CardHeader>
          <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Sign Up</CardTitle>
          <CardDescription className="font-body text-base">
            This feature is coming soon!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body mb-6">
            We&apos;re working hard to bring you the signup functionality. Please check back later.
          </p>
          <Button asChild className="font-headline">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
