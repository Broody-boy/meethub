"use client"

import { useCallback, useEffect, useState } from "react"

interface UseMediaStreamArgs {
  selectedCameraId?: string
  selectedMicrophoneId?: string
  cameraPermissionState: PermissionState | "unsupported"
  microphonePermissionState: PermissionState | "unsupported"
  requestCameraPermission: () => Promise<boolean>
  requestMicPermission: () => Promise<boolean>
}

const stopTracks = (stream: MediaStream | null) => {
  if (!stream) return
  stream.getTracks().forEach((track) => track.stop())
}

export const useMediaStream = ({
  selectedCameraId,
  selectedMicrophoneId,
  cameraPermissionState,
  microphonePermissionState,
  requestCameraPermission,
  requestMicPermission,
}: UseMediaStreamArgs) => {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  const turnCameraOff = useCallback(() => {
    setVideoStream((current) => {
      stopTracks(current)
      return null
    })
    setIsCameraOn(false)
  }, [])

  const turnMicOff = useCallback(() => {
    setAudioStream((current) => {
      stopTracks(current)
      return null
    })
    setIsMicOn(false)
  }, [])

  const turnCameraOnWithDevice = useCallback(async (cameraDeviceId?: string) => {
    const hasPermission =
      cameraPermissionState === "granted" ||
      cameraPermissionState === "unsupported" ||
      (await requestCameraPermission())

    if (!hasPermission) return false

    try {
      const nextVideoStream = await navigator.mediaDevices.getUserMedia({
        video: cameraDeviceId ? { deviceId: { exact: cameraDeviceId } } : true,
        audio: false,
      })

      setVideoStream((current) => {
        stopTracks(current)
        return nextVideoStream
      })
      setIsCameraOn(true)
      return true
    } catch {
      try {
        const fallbackVideoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        setVideoStream((current) => {
          stopTracks(current)
          return fallbackVideoStream
        })
        setIsCameraOn(true)
        return true
      } catch {
        turnCameraOff()
        return false
      }
    }
  }, [cameraPermissionState, requestCameraPermission, turnCameraOff])

  const turnCameraOn = useCallback(async () => {
    return turnCameraOnWithDevice(selectedCameraId)
  }, [selectedCameraId, turnCameraOnWithDevice])

  const turnMicOnWithDevice = useCallback(async (microphoneDeviceId?: string) => {
    const hasPermission =
      microphonePermissionState === "granted" ||
      microphonePermissionState === "unsupported" ||
      (await requestMicPermission())

    if (!hasPermission) return false

    try {
      const nextAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: microphoneDeviceId ? { deviceId: { exact: microphoneDeviceId } } : true,
        video: false,
      })

      setAudioStream((current) => {
        stopTracks(current)
        return nextAudioStream
      })
      setIsMicOn(true)
      return true
    } catch {
      try {
        const fallbackAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        setAudioStream((current) => {
          stopTracks(current)
          return fallbackAudioStream
        })
        setIsMicOn(true)
        return true
      } catch {
        turnMicOff()
        return false
      }
    }
  }, [microphonePermissionState, requestMicPermission, turnMicOff])

  const turnMicOn = useCallback(async () => {
    return turnMicOnWithDevice(selectedMicrophoneId)
  }, [selectedMicrophoneId, turnMicOnWithDevice])

  const toggleCamera = useCallback(async () => {
    if (isCameraOn) {
      turnCameraOff()
      return
    }
    await turnCameraOn()
  }, [isCameraOn, turnCameraOff, turnCameraOn])

  const toggleMic = useCallback(async () => {
    if (isMicOn) {
      turnMicOff()
      return
    }
    await turnMicOn()
  }, [isMicOn, turnMicOff, turnMicOn])

  const cleanupAll = useCallback(() => {
    turnCameraOff()
    turnMicOff()
  }, [turnCameraOff, turnMicOff])

  const handleCameraDeviceChange = useCallback(async (cameraDeviceId?: string) => {
    if (!isCameraOn) return
    if (!cameraDeviceId) {
      turnCameraOff()
      return
    }
    await turnCameraOnWithDevice(cameraDeviceId)
  }, [isCameraOn, turnCameraOff, turnCameraOnWithDevice])

  const handleMicDeviceChange = useCallback(async (microphoneDeviceId?: string) => {
    if (!isMicOn) return
    if (!microphoneDeviceId) {
      turnMicOff()
      return
    }
    await turnMicOnWithDevice(microphoneDeviceId)
  }, [isMicOn, turnMicOff, turnMicOnWithDevice])

  useEffect(() => () => cleanupAll(), [cleanupAll])

  return {
    isCameraOn,
    isMicOn,
    videoStream,
    audioStream,
    toggleCamera,
    toggleMic,
    handleCameraDeviceChange,
    handleMicDeviceChange,
    cleanupAll,
  }
}
