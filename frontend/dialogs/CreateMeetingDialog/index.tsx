"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { MeetingAttendeesPermissions, MeetingOptions } from "@/enums"
import { TextFieldFormInput } from "@/components/form"
import { OptionsToggleCard, DeviceSelectionDropDown } from "./components"
import { useDevices } from "./hooks"

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

  const [loadingPermissions, setLoadingPermissions] = useState(true)
  const [cameraPermissionState, setCameraPermissionState] = useState("prompt")
  const [microphonePermissionState, setMicrophonePermissionState] = useState("prompt")

  // Stream state
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  const { checkPermissions, listenPermissionChanges, listMicrophones, listCameras, listSpeakers, getUserMedia } = useDevices()

  const setCameraData = async () => {
    const cameras = await listCameras()
    setCameraList(cameras)
    if (cameras.length && !camera) setCamera(cameras[0])
  }

  const setMicAndSpeakerData = async () => {
    const mics = await listMicrophones()
    setMicList(mics)
    if (mics.length && !mic) setMic(mics[0])

    const speakers = await listSpeakers()
    setSpeakerList(speakers)
    if (speakers.length && !speaker) setSpeaker(speakers[0])
  }

  /** Start (or restart) the media stream */
  const startStream = useCallback(async () => {
    // Stop any existing stream first
    setStream((prev) => {
      if (prev) prev.getTracks().forEach((t) => t.stop())
      return null
    })
    setMediaError(null)

    try {
      const newStream = await getUserMedia({ video: true, audio: true })
      setStream(newStream)

      // Sync initial track states
      newStream.getVideoTracks().forEach((t) => { t.enabled = videoEnabled })
      newStream.getAudioTracks().forEach((t) => { t.enabled = audioEnabled })
    } catch (err: unknown) {
      setMediaError(err instanceof Error ? err.message : "Could not access media devices.")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /** Attach stream to video element whenever stream changes */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  /** Toggle video track */
  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const next = !prev
      stream?.getVideoTracks().forEach((t) => { t.enabled = next })
      return next
    })
  }

  /** Toggle audio track */
  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const next = !prev
      stream?.getAudioTracks().forEach((t) => { t.enabled = next })
      return next
    })
  }

  useEffect(() => {
    if (!open) {
      // Clean up stream when dialog closes
      setStream((prev) => {
        if (prev) prev.getTracks().forEach((t) => t.stop())
        return null
      })
      return
    }

    const asyncFn = async () => {
      try {
        await new Promise((res) => { setTimeout(res, 1000) })
        const perms = await checkPermissions()
        setLoadingPermissions(false)

        if (perms) {
          setCameraPermissionState(perms.camera.state)
          setMicrophonePermissionState(perms.microphone.state)

          if (perms.camera.state === "granted") setCameraData()
          if (perms.microphone.state === "granted") setMicAndSpeakerData()

          // Start stream if both are already granted
          if (perms.camera.state === "granted" && perms.microphone.state === "granted") {
            startStream()
          }

          listenPermissionChanges(perms.camera, async (state) => {
            setCameraPermissionState(state)
            if (state === "granted") setCameraData()
          })

          listenPermissionChanges(perms.microphone, async (state) => {
            setMicrophonePermissionState(state)
            if (state === "granted") setMicAndSpeakerData()
          })
        }
      } catch (error) {
        console.error("error", error)
      }
    }

    asyncFn()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const cameraOff = !videoEnabled || !stream

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
            <div className="rounded-xl bg-black/80 h-[250px] flex items-center justify-center relative overflow-hidden">
              {/* Live video */}
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-200 ${cameraOff ? "opacity-0" : "opacity-100"}`}
              />

              {/* Overlay when camera is off */}
              {cameraOff && (
                <p className="text-muted-foreground text-sm z-10">
                  {mediaError ?? "Camera is off"}
                </p>
              )}

              {/* Error banner */}
              {mediaError && !cameraOff && (
                <p className="absolute top-2 left-2 right-2 text-xs text-red-400 bg-black/60 rounded px-2 py-1 z-10">
                  {mediaError}
                </p>
              )}

              {/* Controls */}
              <div className="absolute bottom-4 flex gap-3 bg-white rounded-lg px-4 py-2 shadow opacity-80 z-10">
                <Button
                  size="icon"
                  variant={audioEnabled ? "default" : "destructive"}
                  onClick={toggleAudio}
                  title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="icon"
                  variant={videoEnabled ? "default" : "destructive"}
                  onClick={toggleVideo}
                  title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* No stream yet — prompt to request access */}
            {!stream && !loadingPermissions && !mediaError && (
              <Button variant="outline" className="w-full" onClick={startStream}>
                Allow Camera &amp; Microphone
              </Button>
            )}

            {/* Retry on error */}
            {mediaError && (
              <Button variant="outline" className="w-full" onClick={startStream}>
                Retry
              </Button>
            )}

            {/* Device Selectors */}
            <div className="space-y-3">
              <DeviceSelectionDropDown
                label="Microphone"
                list={micList}
                value={mic}
                setValue={setMic}
                loadingPermissions={loadingPermissions}
                permissionState={microphonePermissionState}
              />
              <DeviceSelectionDropDown
                label="Camera"
                list={cameraList}
                value={camera}
                setValue={setCamera}
                loadingPermissions={loadingPermissions}
                permissionState={cameraPermissionState}
              />
              <DeviceSelectionDropDown
                label="Speaker"
                list={speakerList}
                value={speaker}
                setValue={setSpeaker}
                loadingPermissions={loadingPermissions}
                permissionState={microphonePermissionState}
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
