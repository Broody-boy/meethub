import { Button } from "@/components/ui/button"
import { Video, VideoOff } from "lucide-react"

interface CameraPreviewButtonProps {
    isEnabled: boolean
    onToggle: () => void | Promise<void>
    disabled?: boolean
}

export const CameraPreviewButton = ({ isEnabled, onToggle, disabled }: CameraPreviewButtonProps) => {
    
    if (isEnabled) {
        return (  
            <Button className="h-10 w-10" onClick={onToggle} disabled={disabled}>
                <Video className="size-5" />
            </Button>
        )
    } else {
        return (
            <Button className="h-10 w-10 bg-device-preview-button-unselected-background" onClick={onToggle} disabled={disabled}>
                <VideoOff className="size-5 text-device-preview-button-unselected-icon strokeWidth={12.5}" strokeWidth={2.3}/>
            </Button>
        )
    }
}
