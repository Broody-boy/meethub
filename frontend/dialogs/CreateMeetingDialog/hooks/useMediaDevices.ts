"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Device } from "@/types"

type MediaPermissionState = PermissionState | "unsupported"

interface DeviceGroups {
  microphones: Device[]
  cameras: Device[]
  speakers: Device[]
}

const PERMISSION_CAMERA = "camera" as PermissionName
const PERMISSION_MICROPHONE = "microphone" as PermissionName

const hasPermissionApi = () => typeof navigator !== "undefined" && "permissions" in navigator

const toNamedDevices = (devices: MediaDeviceInfo[], kind: MediaDeviceKind) => {
  const filtered = devices.filter((d) => d.kind === kind)
  return filtered.map((device, index) => {
    const fallbackPrefix =
      kind === "videoinput"
        ? "Camera"
        : kind === "audioinput"
          ? "Microphone"
          : "Speaker"

    return {
      deviceId: device.deviceId,
      name: device.label?.trim() || `${fallbackPrefix} ${index + 1}`,
    }
  })
}

const stopTracks = (stream: MediaStream | null) => {
  if (!stream) return
  stream.getTracks().forEach((track) => track.stop())
}

export const useMediaDevices = () => {
  const [loadingPermissions, setLoadingPermissions] = useState(true)
  const [cameraPermissionState, setCameraPermissionState] = useState<MediaPermissionState>("prompt")
  const [microphonePermissionState, setMicrophonePermissionState] = useState<MediaPermissionState>("prompt")
  const [devices, setDevices] = useState<DeviceGroups>({
    microphones: [],
    cameras: [],
    speakers: [],
  })

  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>()
  const [selectedCameraId, setSelectedCameraId] = useState<string>()
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>()

  const cameraPermissionRef = useRef<PermissionStatus | null>(null)
  const microphonePermissionRef = useRef<PermissionStatus | null>(null)

  const isSpeakerSelectionSupported = useMemo(() => {
    if (typeof window === "undefined") return false
    return "setSinkId" in HTMLMediaElement.prototype
  }, [])

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return

    const listed = await navigator.mediaDevices.enumerateDevices()

    const nextDevices = {
      microphones: toNamedDevices(listed, "audioinput"),
      cameras: toNamedDevices(listed, "videoinput"),
      speakers: toNamedDevices(listed, "audiooutput"),
    }

    setDevices(nextDevices)

    setSelectedMicrophoneId((current) => {
      if (current && nextDevices.microphones.some((m) => m.deviceId === current)) return current
      return nextDevices.microphones[0]?.deviceId
    })
    setSelectedCameraId((current) => {
      if (current && nextDevices.cameras.some((c) => c.deviceId === current)) return current
      return nextDevices.cameras[0]?.deviceId
    })
    setSelectedSpeakerId((current) => {
      if (current && nextDevices.speakers.some((s) => s.deviceId === current)) return current
      return nextDevices.speakers[0]?.deviceId
    })
  }, [])

  const syncPermissionStates = useCallback(async () => {
    if (!hasPermissionApi()) {
      setCameraPermissionState("unsupported")
      setMicrophonePermissionState("unsupported")
      return
    }

    try {
      const cameraPermission = await navigator.permissions.query({ name: PERMISSION_CAMERA })
      const microphonePermission = await navigator.permissions.query({ name: PERMISSION_MICROPHONE })

      cameraPermissionRef.current = cameraPermission
      microphonePermissionRef.current = microphonePermission

      setCameraPermissionState(cameraPermission.state)
      setMicrophonePermissionState(microphonePermission.state)
    } catch {
      setCameraPermissionState("unsupported")
      setMicrophonePermissionState("unsupported")
    }
  }, [])

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      stopTracks(stream)
      setCameraPermissionState("granted")
      await refreshDevices()
      return true
    } catch {
      await syncPermissionStates()
      return false
    }
  }, [refreshDevices, syncPermissionStates])

  const requestMicPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      stopTracks(stream)
      setMicrophonePermissionState("granted")
      await refreshDevices()
      return true
    } catch {
      await syncPermissionStates()
      return false
    }
  }, [refreshDevices, syncPermissionStates])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        await Promise.all([refreshDevices(), syncPermissionStates()])
      } finally {
        if (mounted) setLoadingPermissions(false)
      }
    }

    void init()

    const mediaDevices = navigator.mediaDevices
    const onDeviceChange = () => {
      void refreshDevices()
    }

    mediaDevices?.addEventListener?.("devicechange", onDeviceChange)

    return () => {
      mounted = false
      mediaDevices?.removeEventListener?.("devicechange", onDeviceChange)
    }
  }, [refreshDevices, syncPermissionStates])

  useEffect(() => {
    const cameraPermission = cameraPermissionRef.current
    const microphonePermission = microphonePermissionRef.current

    if (cameraPermission) {
      cameraPermission.onchange = () => {
        setCameraPermissionState(cameraPermission.state)
        void refreshDevices()
      }
    }

    if (microphonePermission) {
      microphonePermission.onchange = () => {
        setMicrophonePermissionState(microphonePermission.state)
        void refreshDevices()
      }
    }

    return () => {
      if (cameraPermission) cameraPermission.onchange = null
      if (microphonePermission) microphonePermission.onchange = null
    }
  }, [refreshDevices, cameraPermissionState, microphonePermissionState])

  return {
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
  }
}
