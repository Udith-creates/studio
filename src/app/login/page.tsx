
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);

    // Replace with actual authentication logic
    if (email === "test@example.com" && password === "password") {
      toast({
        title: "Login Successful!",
        description: "Welcome back to BroRide!",
        variant: "default",
      });
      router.push("/"); // Redirect to homepage or dashboard
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      setPassword(""); // Clear password field on failure
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md shadow-xl rounded-lg">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Login to BroRide</CardTitle>
          <CardDescription className="font-body text-base">
            Access your account to manage your rides.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-headline text-lg flex items-center gap-2"><Mail className="h-5 w-5 text-primary" />Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-body text-base"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-headline text-lg flex items-center gap-2"><Lock className="h-5 w-5 text-primary" />Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-body text-base"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full font-headline text-lg bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </>
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm font-body">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
