"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { MeetingAttendeesPermissions, MeetingOptions } from "@/enums"
import { TextFieldFormInput } from "@/components/form"
import { OptionsToggleCard, DeviceSelectionDropDown, MicPreviewButton, CameraPreviewButton } from "./components"
import { useMediaDevices, useMediaStream } from "./hooks"

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

  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    devices,
    selectedMicrophoneId,
    selectedCameraId,
    selectedSpeakerId,
    setSelectedMicrophoneId,
    setSelectedCameraId,
    setSelectedSpeakerId,
    loadingPermissions,
    cameraPermissionState,
    microphonePermissionState,
    refreshDevices,
    requestCameraPermission,
    requestMicPermission,
    isSpeakerSelectionSupported,
  } = useMediaDevices()

  const {
    isCameraOn,
    isMicOn,
    videoStream,
    toggleCamera,
    toggleMic,
    handleCameraDeviceChange,
    handleMicDeviceChange,
    cleanupAll,
  } = useMediaStream({
    selectedCameraId,
    selectedMicrophoneId,
    cameraPermissionState,
    microphonePermissionState,
    requestCameraPermission,
    requestMicPermission,
  })

  useEffect(() => {
    if (!open) {
      cleanupAll()
      return
    }

    const asyncFn = async () => {
      await Promise.allSettled([requestCameraPermission(), requestMicPermission()])
      await refreshDevices()
      cleanupAll()
    }

    void asyncFn()
  }, [open, cleanupAll, refreshDevices, requestCameraPermission, requestMicPermission])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream
    }
  }, [videoStream])

  useEffect(() => {
    if (!selectedCameraId) {
      void handleCameraDeviceChange(undefined)
    }
  }, [handleCameraDeviceChange, selectedCameraId])

  useEffect(() => {
    if (!selectedMicrophoneId) {
      void handleMicDeviceChange(undefined)
    }
  }, [handleMicDeviceChange, selectedMicrophoneId])

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
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <p className="text-muted-foreground text-sm">Camera is off</p>
              )}

              <div className="absolute bottom-4 flex gap-3 bg-white rounded-lg px-4 py-2 shadow opacity-80">
                <MicPreviewButton
                  isEnabled={isMicOn}
                  onToggle={toggleMic}
                  disabled={!devices.microphones.length}
                />
                <CameraPreviewButton
                  isEnabled={isCameraOn}
                  onToggle={toggleCamera}
                  disabled={!devices.cameras.length}
                />
              </div>
            </div>

            {/* Device Selectors */}
            <div className="space-y-3">
              <DeviceSelectionDropDown
                label="Microphone"
                list={devices.microphones}
                valueDeviceId={selectedMicrophoneId}
                onChange={(deviceId) => {
                  setSelectedMicrophoneId(deviceId)
                  void handleMicDeviceChange(deviceId)
                }}
                loadingPermissions={loadingPermissions}
                permissionState={microphonePermissionState}
                noDevicesText="No microphone available"
              />
              <DeviceSelectionDropDown
                label="Camera"
                list={devices.cameras}
                valueDeviceId={selectedCameraId}
                onChange={(deviceId) => {
                  setSelectedCameraId(deviceId)
                  void handleCameraDeviceChange(deviceId)
                }}
                loadingPermissions={loadingPermissions}
                permissionState={cameraPermissionState}
                noDevicesText="No camera available"
              />
              <DeviceSelectionDropDown
                label="Speaker"
                list={devices.speakers}
                valueDeviceId={selectedSpeakerId}
                onChange={setSelectedSpeakerId}
                loadingPermissions={loadingPermissions}
                permissionState={microphonePermissionState}
                disabled={!isSpeakerSelectionSupported}
                unsupportedText="Speaker selection not supported"
                noDevicesText="No speaker available"
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
