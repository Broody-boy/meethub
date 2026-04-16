import { Button } from "@/components/ui/button"
import { Video, VideoOff } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface CameraPreviewButtonProps {
    isCameraPreviewEnabled: boolean,
    setIsCameraPreviewEnabled: Dispatch<SetStateAction<boolean>>
}

export const CameraPreviewButton = ({isCameraPreviewEnabled, setIsCameraPreviewEnabled} : CameraPreviewButtonProps) => {
    
    if (isCameraPreviewEnabled) {
        return (  
            <Button className="h-10 w-10" onClick={() => {setIsCameraPreviewEnabled(prev => !prev)}}>
                <Video className="size-5" />
            </Button>
        )
    } else {
        return (
            <Button className="h-10 w-10 bg-device-preview-button-unselected-background" onClick={() => {setIsCameraPreviewEnabled(prev => !prev)}}>
                <VideoOff className="size-5 text-device-preview-button-unselected-icon strokeWidth={12.5}" strokeWidth={2.3}/>
            </Button>
        )
    }
}