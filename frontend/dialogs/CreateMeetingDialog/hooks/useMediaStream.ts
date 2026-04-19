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

  const turnCameraOn = useCallback(async () => {
    const hasPermission =
      cameraPermissionState === "granted" ||
      cameraPermissionState === "unsupported" ||
      (await requestCameraPermission())

    if (!hasPermission) return false

    try {
      const nextVideoStream = await navigator.mediaDevices.getUserMedia({
        video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : true,
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
  }, [cameraPermissionState, requestCameraPermission, selectedCameraId, turnCameraOff])

  const turnMicOn = useCallback(async () => {
    const hasPermission =
      microphonePermissionState === "granted" ||
      microphonePermissionState === "unsupported" ||
      (await requestMicPermission())

    if (!hasPermission) return false

    try {
      const nextAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : true,
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
  }, [microphonePermissionState, requestMicPermission, selectedMicrophoneId, turnMicOff])

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

  useEffect(() => {
    if (!selectedCameraId && isCameraOn) {
      turnCameraOff()
      return
    }
    if (selectedCameraId && isCameraOn) {
      void turnCameraOn()
    }
  }, [isCameraOn, selectedCameraId, turnCameraOn, turnCameraOff])

  useEffect(() => {
    if (!selectedMicrophoneId && isMicOn) {
      turnMicOff()
      return
    }
    if (selectedMicrophoneId && isMicOn) {
      void turnMicOn()
    }
  }, [isMicOn, selectedMicrophoneId, turnMicOn, turnMicOff])

  useEffect(() => () => cleanupAll(), [cleanupAll])

  return {
    isCameraOn,
    isMicOn,
    videoStream,
    audioStream,
    toggleCamera,
    toggleMic,
    cleanupAll,
  }
}
