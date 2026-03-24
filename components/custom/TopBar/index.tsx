"use client";

import { APP_NAME } from "@/constants";
import { signOut, useSession } from "next-auth/react";
import useProfileFetch from "@/hooks/useProfileFetch";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { data: session } = useSession();
  const { data: profileData, isLoading: isProfileDataLoading, isNotFound: isProfileDataNotFound } = useProfileFetch({
    email: session?.user?.email!,
  });

  const pillClasses =
  "flex items-center gap-3 px-4 h-12 rounded-full bg-muted";

return (
  <div className="flex items-center justify-between px-8 py-4 border-b bg-background">
    
    {/* Left Section */}
    <div className="flex items-center gap-10">
      <div className="text-xl font-semibold text-primary">
        {APP_NAME}
      </div>

      <div className="flex gap-4 text-base text-muted-foreground ml-4">
        <span className="text-primary font-medium cursor-pointer relative">
          Meetings
          <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-primary rounded-full" />
        </span>
        <span className="cursor-pointer hover:text-primary transition">
          Recordings
        </span>
        <span className="cursor-pointer hover:text-primary transition">
          Settings
        </span>
      </div>
    </div>

    {/* Right Section */}
    {isProfileDataLoading ? (
      <div className={`${pillClasses} animate-pulse`}>
        <div className="h-4 w-24 rounded-full bg-muted-foreground/20" />
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
      </div>
    ) :
        isProfileDataNotFound 
        ? ( <div className="h-12"/>) : (
          <Button
        variant="ghost"
        className={`${pillClasses} hover:bg-muted/80`}
        onClick={() => signOut()}
      >
        {profileData && (
          <span className="text-base text-foreground whitespace-nowrap">
            {profileData.firstName} {profileData.lastName}
          </span>
        )}

        <Avatar className="w-8 h-8">
          <AvatarImage
            src={profileData?.profileUrl || "/default-avatar.png"}
            alt={profileData?.firstName}
          />
          <AvatarFallback>
            {profileData?.firstName?.[0]}{profileData?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        </Button>
        )
    }
  </div>
);
}