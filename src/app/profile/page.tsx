
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User, Badge as BadgeType, PaymentRecord } from "@/types";
import BadgeDisplay from "@/components/features/profile/badge-display";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit3, UserCircle, CreditCard, Gift, LogOut, Save, XCircle, ShieldCheck } from "lucide-react";
import { getUserById, updateUser } from "@/lib/user-store"; // Import user store functions

// Mock data for badges and payment history (user specific data will be loaded)
const mockBadges: BadgeType[] = [
  { id: "b1", name: "First Ride Completed", description: "Awarded for completing your very first ride as a rider or buddy.", iconUrl: "https://placehold.co/80x80/1DA1F2/FFFFFF.png?text=1st&ai-hint=medal award", earned: true },
  { id: "b2", name: "Eco Warrior", description: "Awarded for sharing 100km of rides.", iconUrl: "https://placehold.co/80x80/7CFC00/000000.png?text=ECO&ai-hint=leaf tree", earned: true, progress: 100, milestone: "Share 100km" },
  { id: "b3", name: "Community Star", description: "Awarded for offering 10 rides.", iconUrl: "https://placehold.co/80x80/FFD700/000000.png?text=STAR&ai-hint=star trophy", earned: false, progress: 60, milestone: "Offer 10 rides" },
  { id: "b4", name: "Early Bird", description: "Complete 5 rides before 7 AM.", iconUrl: "https://placehold.co/80x80/FFA500/FFFFFF.png?text=BIRD&ai-hint=sun bird", earned: false, progress: 20, milestone: "5 rides before 7 AM" },
];

const mockPaymentHistoryBase: Omit<PaymentRecord, 'payer' | 'payee'>[] = [
  { id: "p1", rideId: "rideABC", amount: 450.50, date: new Date(2023, 10, 15), status: 'completed' },
  { id: "p2", rideId: "rideXYZ", amount: 250.00, date: new Date(2023, 10, 22), status: 'completed' },
  { id: "p3", rideId: "rideDEF", amount: 600.75, date: new Date(2023, 11, 1), status: 'pending' },
];


function ProfilePageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [badges, setBadges] = useState<BadgeType[]>(mockBadges); // Keep badges mock for now
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState("");
  const [editableAvatarUrl, setEditableAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      const fetchedUser = getUserById(userId);
      if (fetchedUser) {
        setUser(fetchedUser);
        setEditableName(fetchedUser.name);
        setEditableAvatarUrl(fetchedUser.avatarUrl || "");

        // Simulate fetching user-specific payment history
        const userSpecificPayments = mockPaymentHistoryBase.map((p, index) => ({
          ...p,
          id: `${p.id}-${userId}`,
          // Alternate payer/payee for demonstration
          payer: index % 2 === 0 ? fetchedUser : {id: `otherUser${index}`, name: `Other User ${index}`, email: `other${index}@example.com`, role: fetchedUser.role === 'rider' ? 'buddy' : 'rider'},
          payee: index % 2 !== 0 ? fetchedUser : {id: `otherUser${index}`, name: `Other User ${index}`, email: `other${index}@example.com`,role: fetchedUser.role === 'rider' ? 'buddy' : 'rider'},
        }));
        setPaymentHistory(userSpecificPayments);

      } else {
        toast({ title: "Error", description: "User profile not found.", variant: "destructive" });
      }
    } else {
      // Handle case where no userId is provided (e.g., redirect to login or show error)
      toast({ title: "Error", description: "No user specified.", variant: "destructive" });
    }
    setIsLoading(false);
  }, [searchParams, toast]);

  const handleEdit = () => {
    if (user) {
      setEditableName(user.name);
      setEditableAvatarUrl(user.avatarUrl || "https://placehold.co/100x100.png");
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setEditableName(user.name);
      setEditableAvatarUrl(user.avatarUrl || "https://placehold.co/100x100.png");
    }
    setIsEditing(false);
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      const updatedUser = updateUser(user.id, { name: editableName, avatarUrl: editableAvatarUrl });
      if (updatedUser) {
        setUser(updatedUser);
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved.",
          variant: "default",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Could not save your changes.",
          variant: "destructive",
        });
      }
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <UserCircle className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-xl font-body text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <UserCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-xl font-body text-destructive-foreground">Could not load user profile.</p>
        <p className="text-muted-foreground font-body">Please ensure you are logged in or the user ID is correct.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-xl rounded-lg">
        <CardHeader className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
              <AvatarImage src={isEditing ? editableAvatarUrl : user.avatarUrl || "https://placehold.co/100x100.png"} alt={user.name} data-ai-hint="profile picture person" />
              <AvatarFallback className="text-3xl font-headline">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-grow">
              {!isEditing ? (
                <>
                  <CardTitle className="text-4xl font-headline mb-1">{user.name}</CardTitle>
                  <CardDescription className="font-body text-lg text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    {user.role === 'rider' ? "Trusted Rider" : "Valued Buddy"} | Member since Oct 2023 (Simulated)
                  </CardDescription>
                  <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                      <Button variant="outline" size="sm" onClick={handleEdit} className="font-headline"><Edit3 className="mr-2 h-4 w-4"/>Edit Profile</Button>
                      <Button variant="ghost" size="sm" className="font-headline text-destructive hover:bg-destructive/10 hover:text-destructive"><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <Label htmlFor="profileName" className="font-headline text-sm text-muted-foreground">Name</Label>
                    <Input 
                      id="profileName" 
                      type="text" 
                      value={editableName} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditableName(e.target.value)} 
                      className="font-body text-lg" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileAvatarUrl" className="font-headline text-sm text-muted-foreground">Avatar URL</Label>
                    <Input 
                      id="profileAvatarUrl" 
                      type="url" 
                      value={editableAvatarUrl} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEditableAvatarUrl(e.target.value)} 
                      className="font-body text-base"
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                   <CardDescription className="font-body text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                     <ShieldCheck className="h-5 w-5 text-green-500" />
                    {user.role === 'rider' ? "Trusted Rider" : "Valued Buddy"} | Member since Oct 2023 (Simulated)
                  </CardDescription>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <Button type="submit" size="sm" className="font-headline bg-primary hover:bg-primary/90"><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
                    <Button variant="outline" size="sm" onClick={handleCancel} className="font-headline"><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>
                    <Button variant="ghost" size="sm" className="font-headline text-destructive hover:bg-destructive/10 hover:text-destructive"><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-2 mb-6 max-w-md mx-auto">
          <TabsTrigger value="badges" className="font-headline text-base"><Gift className="mr-2 h-5 w-5"/>My Badges</TabsTrigger>
          <TabsTrigger value="payment-history" className="font-headline text-base"><CreditCard className="mr-2 h-5 w-5"/>Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Achievements</CardTitle>
              <CardDescription className="font-body">Track your progress and celebrate your milestones!</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Earned Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {badges.filter(b => b.earned).map(badge => (
                  <BadgeDisplay key={badge.id} badge={badge} />
                ))}
                {badges.filter(b => b.earned).length === 0 && <p className="font-body col-span-full text-muted-foreground">No badges earned yet. Keep riding!</p>}
              </div>

              <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Badges in Progress</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.filter(b => !b.earned && b.progress !== undefined).map(badge => (
                  <BadgeDisplay key={badge.id} badge={badge} />
                ))}
                {badges.filter(b => !b.earned && b.progress !== undefined).length === 0 && <p className="font-body col-span-full text-muted-foreground">All available badges earned or no progress tracked.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Ride Payment Records</CardTitle>
              <CardDescription className="font-body">Keep track of your cost-sharing transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-headline">Date</TableHead>
                      <TableHead className="font-headline">Ride ID</TableHead>
                      <TableHead className="font-headline">Amount</TableHead>
                      <TableHead className="font-headline">Role</TableHead>
                      <TableHead className="font-headline">Counterparty</TableHead>
                      <TableHead className="font-headline text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map(payment => (
                      <TableRow key={payment.id} className="font-body">
                        <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                        <TableCell>{payment.rideId}</TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.payer.id === user.id ? 'Paid' : 'Received'}</TableCell>
                        <TableCell>{payment.payer.id === user.id ? payment.payee.name : payment.payer.name}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground font-body">No payment records found for this user.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8 px-4 text-center">Loading profile data...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
