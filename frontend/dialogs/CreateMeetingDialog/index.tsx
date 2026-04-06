"use client"

import { useState } from "react"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { Mic, Video } from "lucide-react"
import { MeetingAttendeesPermissions, MeetingOptions } from "@/enums"
import { TextFieldFormInput } from "@/components/form"
import { OptionsToggleCard } from "./components"

export function CreateMeetingDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const [meetingName, setMeetingName] = useState("")
  const [meetingOptions, setMeetingOptions] = useState<string[]>([""])

  // ✅ ARRAY instead of object
  const [permissions, setPermissions] = useState<string[]>([
    MeetingAttendeesPermissions.MIC_UNMUTE,
    MeetingAttendeesPermissions.VIDEO_START
  ])

  // ✅ API CALL
  const handleStartMeeting = async () => {
    try {
      const payload = {
        meetingName,
        attendeesPermissions: permissions,
        meetingOptions: {
          isWaitingRoomEnabled: meetingOptions.includes(MeetingOptions.WAITING_ROOM),
        },
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/meet`,
        payload
      )

      onOpenChange(false)
    } catch (err) {
      console.error("Failed to create meeting", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl min-w-6xl p-0 overflow-hidden">
        <div className="grid grid-cols-2">
          
          {/* LEFT PANEL */}
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Create New Meeting
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Configure the meeting before going live.
              </p>
            </DialogHeader>

            {/* Meeting Name */}
            <TextFieldFormInput 
              label="Meeting Name"
              placeholder="Enter Meeting Name"
              required={true}
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />

            {/* Meeting options */}
            <div>
              <p className="text-sm font-medium text-foreground mx-1 mb-2">Meeting Options</p>
              <OptionsToggleCard
                items={[
                  {
                    label: "Waiting Room",
                    text: "Host must approve incoming attendees",
                    value: MeetingOptions.WAITING_ROOM
                  }
                ]}
                options={meetingOptions}
                setOptions={setMeetingOptions}
              />
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground mx-1 mb-2">Attendees Permissions</p>
              <OptionsToggleCard
                items={[
                  {
                    label: "Unmute",
                    text: "Attendees can unmute their microphone",
                    value: MeetingAttendeesPermissions.MIC_UNMUTE
                  },
                  {
                    label: "Video",
                    text: "Attendees can open their video",
                    value: MeetingAttendeesPermissions.VIDEO_START
                  },
                  {
                    label: "Share screen",
                    text: "Attendees can share their screen",
                    value: MeetingAttendeesPermissions.SCREEN_SHARE
                  },
                  {
                    label: "Chat",
                    text: "Attendees can send and receive messages",
                    value: MeetingAttendeesPermissions.CHAT_MESSAGE_SEND_RECEIVE
                  },
                ]}
                options={permissions}
                setOptions={setPermissions}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 space-y-6">
            
            {/* Video Preview */}
            <div className="rounded-xl bg-black/80 h-[220px] flex items-center justify-center relative">
              <p className="text-muted-foreground text-sm">Camera is off</p>

              <div className="absolute bottom-4 flex gap-3 bg-white rounded-lg px-4 py-2 shadow opacity-80">
                <Button size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button size="icon">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Device Selectors */}
            <div className="space-y-3">
              {[
                { label: "Microphone", value: "Built-in MacBook Pro Microphone" },
                { label: "Camera", value: "FaceTime HD Camera" },
                { label: "Speakers", value: "MacBook Pro Speakers" },
              ].map((item) => (
                <Card
                  key={item.label}
                  className="flex justify-between items-center p-4"
                >
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                  <span className="text-muted-foreground">⌄</span>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <DialogFooter className="flex justify-between pt-4 bg-white">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartMeeting}>
                Start Meeting
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}