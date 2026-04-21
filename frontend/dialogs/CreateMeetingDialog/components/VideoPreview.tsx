import { Mic, MicOff, TriangleAlert } from "lucide-react"
import { Video, VideoOff } from "lucide-react"
import { useState } from "react"
import { IconToggleButton } from "./IconToggleButton"

export interface VideoPreviewProps {
  permissions: {
    camera: string,
    mic: string
  }
  stream: MediaStream
}

export const VideoPreview = ({permissions}: VideoPreviewProps) => {

  const [isCameraPreviewOn, setIsCameraPreviewOn] = useState<boolean>(true)
  const [isMicPreviewOn, setIsMicPreviewOn] = useState<boolean>(true)

  // Loading Case
  const isLoading = permissions.camera === "pending" || permissions.mic === "pending"

  if (isLoading) {
    return (
      <div className="rounded-xl bg-black/80 h-[250px] flex items-center justify-center relative">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Error Case
  const isCameraError = permissions.camera === "error"
  const isMicError = permissions.mic === "error"

  if (isCameraError || isMicError) {
    return (
      <div className="rounded-xl bg-black/80 h-[250px] flex items-center justify-center relative">
        <div className="flex gap-2">
          <TriangleAlert className="text-yellow-500 size-5" />
          <p className="text-muted-foreground text-sm">Some error occured while capturing the stream</p>
        </div>
      </div>
    )
  }

  // Permissions not sufficient case
  let permissionPromptMsg = ""
  let isSufficientPermissions = false

  const isCameraPermissionDenied = permissions.camera === "denied"
  const isMicPermissionDenied = permissions.mic === "denied"

  if (isCameraPermissionDenied && isMicPermissionDenied) {
    permissionPromptMsg = "Kindly provide permission for Camera and Mic"
  } else if (isCameraPermissionDenied && !isMicPermissionDenied) {
    permissionPromptMsg = "Kindly provide permission for Camera"
  }  else if (!isCameraPermissionDenied && isMicPermissionDenied) {
    permissionPromptMsg = "Kindly provide permission for Mic"
  } else {
    isSufficientPermissions = true
  }

  if (!isSufficientPermissions) {
    return (
      <div className="rounded-xl bg-black/80 h-[250px] flex items-center justify-center relative">
        <div className="flex gap-2">
          <TriangleAlert className="text-yellow-500 size-5" />
          <p className="text-muted-foreground text-sm">{permissionPromptMsg}</p>
        </div>
      </div>
    )
  }

  // Actual Code
  return (
    <div className="rounded-xl bg-black/80 h-[250px] flex items-center justify-center relative">

    {!isCameraPreviewOn && (
      <p className="text-muted-foreground text-sm">Camera is off</p>
    )}

    <div className="absolute bottom-4 flex gap-3 bg-white rounded-lg px-4 py-2 shadow opacity-80">
      <IconToggleButton
        isOn={isMicPreviewOn}
        onToggle={() => setIsMicPreviewOn((prev) => !prev)}
        onIcon={Mic}
        offIcon={MicOff}
      />

      <IconToggleButton
        isOn={isCameraPreviewOn}
        onToggle={() => setIsCameraPreviewOn((prev) => !prev)}
        onIcon={Video}
        offIcon={VideoOff}
      />

    </div>
  </div>
  )
}