
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { calculateRideCost, type CalculateRideCostOutput } from "@/ai/flows/calculate-ride-cost";
import { useState } from "react";
import { Loader2, TrendingUp, DollarSign, ListChecks } from "lucide-react";

const costCalculatorSchema = z.object({
  distanceMiles: z.coerce.number().min(1, "Distance must be at least 1 mile.").max(1000, "Distance cannot exceed 1000 miles."),
});

type CostCalculatorFormValues = z.infer<typeof costCalculatorSchema>;

export default function CostCalculatorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalculateRideCostOutput | null>(null);

  const form = useForm<CostCalculatorFormValues>({
    resolver: zodResolver(costCalculatorSchema),
    defaultValues: {
      distanceMiles: 10, // Default to 10 miles
    },
  });

  async function onSubmit(data: CostCalculatorFormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await calculateRideCost({ distanceMiles: data.distanceMiles });
      setResult(output);
      toast({
        title: "Cost Calculated!",
        description: `Estimated fair cost: ₹${output.fairCost.toFixed(2)}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error calculating cost:", error);
      toast({
        title: "Error",
        description: "Failed to calculate ride cost. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl rounded-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-8 w-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Ride Cost Estimator</CardTitle>
        </div>
        <CardDescription className="font-body text-base">
          Enter the ride distance to get a fair cost estimation based on current factors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="distanceMiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/>Distance (in miles)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 25" {...field} className="font-body text-base"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg" className="w-full font-headline text-lg bg-primary hover:bg-primary/90">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <DollarSign className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Calculating..." : "Calculate Fair Cost"}
            </Button>
          </form>
        </Form>

        {result && (
          <Card className="mt-6 bg-muted/30 rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
                <ListChecks className="h-6 w-6"/> Estimated Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-body">
              <p className="text-2xl font-semibold">
                Fair Cost: <span className="text-accent">₹{result.fairCost.toFixed(2)}</span>
              </p>
              <div>
                <h4 className="font-semibold text-muted-foreground mb-1">Calculation Details:</h4>
                <p className="text-sm whitespace-pre-wrap bg-background p-3 rounded-md border">{result.breakdown}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

