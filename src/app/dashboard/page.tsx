"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GreenImpactData } from "@/types";
import { Leaf, Droplets, Coins, Route as RouteIcon, TrendingUp, Trees, BarChart2 } from "lucide-react";

// Mock data
const mockImpactData: GreenImpactData = {
  totalFuelSavedLiters: 1250.75,
  totalMoneySaved: 1876.12, // Assuming currency is USD or similar
  totalDistanceSharedKm: 15634.5,
  totalCO2SavedKg: 2890.3,
  co2EquivalentTrees: 133, // Approx. 21.77 kg CO2 per tree per year
};

const mockMonthlyCO2Savings = [
  { month: "Jan", co2SavedKg: 200 },
  { month: "Feb", co2SavedKg: 250 },
  { month: "Mar", co2SavedKg: 220 },
  { month: "Apr", co2SavedKg: 300 },
  { month: "May", co2SavedKg: 350 },
  { month: "Jun", co2SavedKg: 400 },
];

export default function GreenImpactDashboardPage() {
  const [impactData, setImpactData] = useState<GreenImpactData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]); // Using any for recharts flexibility

  useEffect(() => {
    // Simulate fetching data
    setImpactData(mockImpactData);
    setChartData(mockMonthlyCO2Savings);
  }, []);

  if (!impactData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Leaf className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-xl font-body text-muted-foreground">Loading Green Impact data...</p>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, unit, description, colorClass = "text-primary" }: { title: string, value: string | number, icon: React.ElementType, unit?: string, description: string, colorClass?: string }) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold font-headline ${colorClass}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="text-xl font-medium"> {unit}</span>}
        </div>
        <p className="text-xs text-muted-foreground font-body">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="h-10 w-10 text-green-500" />
        <h1 className="text-4xl font-headline font-semibold">Our Green Impact</h1>
      </div>
      <p className="font-body text-lg text-muted-foreground mb-8">
        Together, the BroRide community is making a significant positive impact on the environment and our wallets. Here's how:
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard 
          title="CO₂ Emissions Saved" 
          value={impactData.totalCO2SavedKg} 
          unit="kg" 
          icon={TrendingUp} 
          description="Kilograms of CO₂ emissions avoided by sharing rides."
          colorClass="text-green-600"
        />
        <StatCard 
          title="Equivalent Trees Planted" 
          value={impactData.co2EquivalentTrees} 
          icon={Trees} 
          description="Carbon sequestration equivalent to this many trees growing for a year."
          colorClass="text-green-500"
        />
        <StatCard 
          title="Fuel Saved" 
          value={impactData.totalFuelSavedLiters} 
          unit="Liters" 
          icon={Droplets} 
          description="Total amount of fuel conserved by carpooling."
          colorClass="text-blue-500"
        />
        <StatCard 
          title="Money Saved on Fuel" 
          value={`$${impactData.totalMoneySaved.toFixed(2)}`} 
          icon={Coins} 
          description="Estimated total savings on fuel costs for our users."
          colorClass="text-yellow-500"
        />
        <StatCard 
          title="Distance Shared" 
          value={impactData.totalDistanceSharedKm} 
          unit="km" 
          icon={RouteIcon} 
          description="Total kilometers covered by shared rides."
          colorClass="text-purple-500"
        />
      </div>

      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Monthly CO₂ Savings Trend</CardTitle>
          </div>
          <CardDescription className="font-body">
            Track our collective progress in reducing carbon emissions over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--foreground))" tick={{ fontFamily: 'PT Sans', fontSize: 12 }} />
              <YAxis stroke="hsl(var(--foreground))" tick={{ fontFamily: 'PT Sans', fontSize: 12 }} unit="kg" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'PT Sans',
                }}
                labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--primary))', fontFamily: 'Poppins' }}
              />
              <Legend wrapperStyle={{ fontFamily: 'PT Sans', fontSize: 14 }} />
              <Bar dataKey="co2SavedKg" name="CO₂ Saved (kg)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
