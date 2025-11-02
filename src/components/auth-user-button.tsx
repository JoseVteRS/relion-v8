"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AuthUserButton() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const userInitial = useMemo(() => {
    if (!session?.user?.name) return "U";
    return session.user.name.charAt(0).toUpperCase();
  }, [session?.user?.name]);

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!session) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-10 w-10">
            {session.user.image && (
              <AvatarImage 
                src={session.user.image} 
                alt={session.user.name || "User avatar"}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-base">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 p-2" 
        align="end" 
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-12 w-12">
              {session.user.image && (
                <AvatarImage 
                  src={session.user.image} 
                  alt={session.user.name || "User avatar"}
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-lg">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          className="cursor-pointer py-2.5 px-3"
          onClick={() => router.push("/dashboard")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Mi cuenta</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem 
          className="cursor-pointer py-2.5 px-3"
          onClick={() => router.push("/dashboard/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className="cursor-pointer py-2.5 px-3 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

