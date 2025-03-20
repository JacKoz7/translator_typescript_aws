"use client";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks";
import { LoginForm } from "./LoginForm";

export function UserNav() {
  const { busy, user, logout } = useUser();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {!user && <AvatarImage src="/avatar.jpg" alt="avatar" />}
            {user && (
              <p className="font-semibold bg-custom-teal flex h-8 w-8 items-center justify-center text-midnight">
                {user.signInDetails?.loginId?.slice(0, 2).toUpperCase()}
              </p>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-custom-teal"
        align="end"
        forceMount
      >
        {user && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.signInDetails?.loginId}
                </p>
                <p className="text-gray-500 text-xs leading-none text-muted-foreground">
                  {user.username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              {busy ? "logging out..." : "logout"}
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        {!user && (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-base font-bold leading-none">Login</p>
              </div>
            </DropdownMenuLabel>
            <div className="pt-2 px-2">
              <LoginForm />
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/register");
              }}
            >
              Register
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Navbar = () => {
  const router = useRouter();
  return (
    <div className="border-b bg-gradient-to-r from-midnight via-custom-teal to-midnight">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex-grow flex justify-center">
          <h1
            className="font-semibold-serif text-2xl hover:underline text-midnight hover:text-custom-cream transition-all duration-300 ease-in-out hover:scale-105 drop-shadow-lg"
            onClick={() => {
              router.push("/");
            }}
          >
            EasySpeak
          </h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
};
