"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate, getISODateTime } from "@/features/presents/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UpcomingEvent = {
  id: string;
  listId: string;
  createdAt: string;
  list: {
    id: string;
    name: string;
    description: string | null;
    dateEvent: string | null;
    visibility: string;
    isForMe: boolean;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    _count: {
      presents: number;
    };
  };
};

interface UpcomingEventsSectionProps {
  upcomingEvents: UpcomingEvent[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function UpcomingEventsSection({
  upcomingEvents,
}: UpcomingEventsSectionProps) {
  if (upcomingEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximos eventos
          </CardTitle>
          <CardDescription>
            No hay eventos próximos en tus listas favoritas
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Próximos eventos
        </CardTitle>
        <CardDescription>
          {upcomingEvents.length} evento{upcomingEvents.length !== 1 ? "s" : ""} próximos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/lists/${event.listId}`}
              className="block"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={event.list.user.image || undefined}
                    alt={event.list.user.name}
                  />
                  <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                    {getInitials(event.list.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                    {event.list.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <time
                      dateTime={event.list.dateEvent ? getISODateTime(event.list.dateEvent) : undefined}
                      suppressHydrationWarning
                      className="text-xs text-neutral-500 dark:text-neutral-400"
                    >
                      {event.list.dateEvent ? formatDate(event.list.dateEvent) : "Sin fecha"}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

