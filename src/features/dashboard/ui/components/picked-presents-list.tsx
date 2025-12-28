"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/features/presents/utils/format";
import { ExternalLink } from "lucide-react";

type PickData = {
  id: string;
  presentId: string;
  action: "picked" | "reserved" | "purchased";
  createdAt: string;
  updatedAt: string;
  present: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    link: string | null;
    status: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    list: {
      id: string;
      name: string;
      dateEvent: string | null;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
    } | null;
  };
};

interface PickedPresentsListProps {
  picks: PickData[];
}

export function PickedPresentsList({ picks }: PickedPresentsListProps) {
  if (picks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Regalos pillados
          </CardTitle>
          <CardDescription>
            No tienes regalos pillados todavía
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Regalos pillados
            </CardTitle>
            <CardDescription>
              Últimos {picks.length} regalo{picks.length !== 1 ? "s" : ""} que has pillado
            </CardDescription>
          </div>
          <Link href="/dashboard/picks">
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Regalo</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Precio</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Lista</th>
                <th className="text-right py-2 px-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((pick) => (
                <tr key={pick.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-medium">{pick.present.name}</div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {pick.present.price > 0 ? (
                      <span className="font-medium">{formatPrice(pick.present.price)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {pick.present.list ? (
                      <Link
                        href={`/lists/${pick.present.list.id}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {pick.present.list.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      {pick.present.list && (
                        <Link href={`/lists/${pick.present.list.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            Ver lista
                          </Button>
                        </Link>
                      )}
                      {pick.present.link && (
                        <a
                          href={pick.present.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

