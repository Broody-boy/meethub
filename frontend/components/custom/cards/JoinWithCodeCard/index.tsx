"use client"

import { TextFieldFormInput } from "@/components/form";
import { Link } from "lucide-react";
import { useState } from "react";

export function JoinWithCodeCard() {

  const [meetingCodeOrLink, setMeetingCodeOrLink] = useState("");

  return (
    <div className="bg-white rounded-2xl p-9 w-full border shadow-sm flex flex-col h-full">
      
      {/* Top Content */}
      <div>
        <div className="flex items-center gap-3 mt-3 ">
          <div className="text-app-primary">
            <Link className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-semibold text-app-primary">
            Join with code or link
          </h3>
        </div>

        <p className="text-lg text-gray-600 mt-15">
          Paste a meeting link or enter a code to join an existing session.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-10 flex items-start gap-3">
        <TextFieldFormInput
          placeholder="Meeting code or link"
          value={meetingCodeOrLink}
          onChange={(e) => setMeetingCodeOrLink(e.target.value)}
          description={`eg. ab8-cd3-ef2 or ${(new URL(window.location.href).origin)}/ab8-cd3-ef2`}
          className="bg-dashboard-background"
        />

        <button className="bg-app-primary text-white px-6 py-3 rounded-xl text-sm font-medium shadow-md hover:bg-[#1669c1] transition">
          Join
        </button>
      </div>
    </div>
  );
}