"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  warning?: string;
}

export function DashboardStatsCard({
  title,
  value,
  description,
  icon,
  className,
  warning,
}: DashboardStatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="text-muted-foreground opacity-60">{icon}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
          {warning && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              {warning}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

