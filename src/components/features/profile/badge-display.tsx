
"use client";

import type { Badge as BadgeType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { CheckCircle, Info, Star } from "lucide-react";

interface BadgeDisplayProps {
  badge: BadgeType;
}

export default function BadgeDisplay({ badge }: BadgeDisplayProps) {
  return (
    <Card className={`shadow-md rounded-lg overflow-hidden flex flex-col h-full ${badge.earned ? 'border-accent border-2' : 'border-border'}`}>
      <CardHeader className="p-4 flex flex-col items-center text-center bg-muted/20">
        <div className={`relative w-20 h-20 mb-3 rounded-full flex items-center justify-center ${badge.earned ? 'bg-accent/20' : 'bg-secondary'}`}>
          <Image 
            src={badge.iconUrl || `https://placehold.co/80x80.png`}
            alt={`${badge.name} badge icon`}
            width={badge.earned ? 60 : 50} 
            height={badge.earned ? 60 : 50}
            className={`rounded-full ${badge.earned ? '' : 'opacity-60 grayscale'}`}
            data-ai-hint={badge.dataAiHint || (badge.earned ? "achievement award" : "badge icon")}
          />
          {badge.earned && (
            <CheckCircle className="absolute -bottom-1 -right-1 h-7 w-7 text-green-500 bg-card rounded-full p-0.5" />
          )}
        </div>
        <CardTitle className={`font-headline text-lg ${badge.earned ? 'text-accent-foreground' : 'text-foreground'}`}>{badge.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-center flex-grow flex flex-col justify-between">
        <CardDescription className="font-body text-sm mb-3 h-12 overflow-hidden text-ellipsis">
          {badge.description}
        </CardDescription>
        <div className="mt-auto">
          {badge.progress !== undefined && !badge.earned && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                <span className="font-body">Progress:</span>
                <span className="font-body font-semibold">{badge.progress}%</span>
              </div>
              <Progress value={badge.progress} className="h-2 [&>div]:bg-primary" aria-label={`${badge.name} progress: ${badge.progress}%`} />
              {badge.milestone && <p className="text-xs text-muted-foreground mt-1 font-body">Complete: {badge.milestone}</p>}
            </div>
          )}
          {badge.earned && (
            <div className="flex items-center justify-center text-green-600 font-semibold font-body mt-2">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-400" />
              Earned!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
