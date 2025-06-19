"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CreditCard, DollarSign, Loader2, User, CheckCircle } from "lucide-react";

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format."),
  cvv: z.string().regex(/^\d{3,4}$/, "Must be 3 or 4 digits."),
  cardHolderName: z.string().min(2, "Name must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be positive."),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  rideId: string;
  amountToPay: number;
  riderName: string;
  onPaymentSuccess: (paymentDetails: PaymentFormValues) => void;
}

export default function PaymentForm({ rideId, amountToPay, riderName, onPaymentSuccess }: PaymentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolderName: "",
      amount: amountToPay,
    },
  });

  async function onSubmit(data: PaymentFormValues) {
    setIsLoading(true);
    console.log("Dummy payment processing for ride:", rideId, data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
    setPaymentDone(true);
    toast({
      title: "Payment Successful!",
      description: `You've paid $${data.amount.toFixed(2)} to ${riderName} for ride ${rideId}.`,
      variant: "default",
    });
    onPaymentSuccess(data);
    form.reset({ ...form.formState.defaultValues, amount: amountToPay }); // Reset form but keep amount
  }

  if (paymentDone) {
    return (
        <Card className="w-full max-w-md mx-auto shadow-xl rounded-lg">
            <CardHeader className="items-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl font-headline">Payment Complete!</CardTitle>
                <CardDescription className="font-body">Your ride cost has been successfully shared.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="font-body">Amount Paid: <span className="font-semibold text-accent">${amountToPay.toFixed(2)}</span></p>
                <p className="font-body">To Rider: <span className="font-semibold">{riderName}</span></p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => setPaymentDone(false)} className="w-full font-headline">Make Another Payment</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">Share Ride Cost</CardTitle>
        </div>
        <CardDescription className="font-body">
          Securely share the cost for your ride with {riderName}. Amount: <span className="font-semibold text-accent">${amountToPay.toFixed(2)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline flex items-center gap-1"><DollarSign className="h-4 w-4 text-primary"/> Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly className="font-body bg-muted/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline flex items-center gap-1"><User className="h-4 w-4 text-primary"/> Card Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="font-body" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline flex items-center gap-1"><CreditCard className="h-4 w-4 text-primary"/> Card Number</FormLabel>
                  <FormControl>
                    <Input placeholder="0000 0000 0000 0000" {...field} className="font-body"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Expiry (MM/YY)</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} className="font-body" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">CVV</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} className="font-body"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} size="lg" className="w-full font-headline text-lg bg-primary hover:bg-primary/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Processing..." : `Pay $${amountToPay.toFixed(2)}`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
