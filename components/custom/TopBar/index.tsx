"use client"

import { APP_NAME } from "@/constants";
import { signOut } from "next-auth/react";


export function TopBar() {
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

      <div className="w-8 h-8 rounded-full bg-gray-200" onClick={() => signOut()}/>
    </div>
  );
}