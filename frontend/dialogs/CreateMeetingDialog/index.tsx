"use client"

import { useState, useEffect } from "react"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Mic, Video } from "lucide-react"
import { MeetingAttendeesPermissions, MeetingOptions } from "@/enums"
import { TextFieldFormInput } from "@/components/form"
import { OptionsToggleCard, DeviceSelectionDropDown } from "./components"

export function CreateMeetingDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
}) {
  const [meetingName, setMeetingName] = useState("")
  const [meetingOptions, setMeetingOptions] = useState<string[]>([""])
  const [permissions, setPermissions] = useState<string[]>([
    MeetingAttendeesPermissions.MIC_UNMUTE,
    MeetingAttendeesPermissions.VIDEO_START,
  ])

  // Device lists
  const [micList, setMicList] = useState<string[]>([])
  const [cameraList, setCameraList] = useState<string[]>([])
  const [speakerList, setSpeakerList] = useState<string[]>([])

  // Selected devices
  const [mic, setMic] = useState("")
  const [camera, setCamera] = useState("")
  const [speaker, setSpeaker] = useState("")

  useEffect(() => {
    if (!open) return
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) => {
        const mics = devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => d.label || `Microphone ${d.deviceId.slice(0, 6)}`)
        const cameras = devices
          .filter((d) => d.kind === "videoinput")
          .map((d) => d.label || `Camera ${d.deviceId.slice(0, 6)}`)
        const speakers = devices
          .filter((d) => d.kind === "audiooutput")
          .map((d) => d.label || `Speaker ${d.deviceId.slice(0, 6)}`)

        setMicList(mics)
        setCameraList(cameras)
        setSpeakerList(speakers)
        if (mics.length) setMic(mics[0])
        if (cameras.length) setCamera(cameras[0])
        if (speakers.length) setSpeaker(speakers[0])
      })
      .catch(() => {
        // permissions denied — leave lists empty
      })
  }, [open])

  const handleStartMeeting = async () => {
    try {
      const payload = {
        meetingName,
        attendeesPermissions: permissions,
        meetingOptions: {
          isWaitingRoomEnabled: meetingOptions.includes(MeetingOptions.WAITING_ROOM),
        },
      }
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/meet`, payload)
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

            <TextFieldFormInput
              label="Meeting Name"
              placeholder="Enter Meeting Name"
              required={true}
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />

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
          <div className="p-6 space-y-6 mt-20">

            {/* Video Preview */}
            <div className="rounded-xl bg-black/80 h-[250px] flex items-center justify-center relative">
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
              <DeviceSelectionDropDown
                label="Microphone"
                list={micList}
                value={mic}
                setValue={setMic}
              />
              <DeviceSelectionDropDown
                label="Camera"
                list={cameraList}
                value={camera}
                setValue={setCamera}
              />
              <DeviceSelectionDropDown
                label="Speaker"
                list={speakerList}
                value={speaker}
                setValue={setSpeaker}
              />
            </div>

            {/* Actions */}
            <DialogFooter className="flex justify-between pt-4 bg-white border-0">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="p-5">
                Cancel
              </Button>
              <Button onClick={handleStartMeeting} className="p-5">
                Start Meeting
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}