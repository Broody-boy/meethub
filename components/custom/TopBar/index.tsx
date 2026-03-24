"use client"

import { APP_NAME } from "@/constants";
import { signOut, useSession } from "next-auth/react";
import useProfileFetch from "@/hooks/useProfileFetch";


export function TopBar() {
  const { data: session } = useSession();
  const { data: profile, isLoading } = useProfileFetch({email: session?.user?.email!});

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white border-b">
      <div className="text-xl font-semibold text-[#1a73e8]">
        {APP_NAME}
      </div>

      <div className="flex gap-6 text-sm text-gray-600">
        <span className="text-[#1a73e8] font-medium">Meetings</span>
        <span>Recordings</span>
        <span>Settings</span>
      </div>

      <div className="flex items-center gap-3 cursor-pointer" onClick={() => signOut()}>
        {!isLoading && profile && (
          <span className="text-sm text-gray-700">{profile.name} {profile.surName}</span>
        )}
        {profile?.profileUrl ? (
          <img
            src={profile.profileUrl}
            alt={profile.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        )}
      </div>
    </div>
  );
}