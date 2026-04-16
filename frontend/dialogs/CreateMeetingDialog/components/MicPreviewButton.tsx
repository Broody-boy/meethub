import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface MicPreviewButtonProps {
    isMicPreviewEnabled: boolean,
    setIsMicPreviewEnabled: Dispatch<SetStateAction<boolean>>
}

export const MicPreviewButton = ({isMicPreviewEnabled, setIsMicPreviewEnabled} : MicPreviewButtonProps) => {
    
    if (isMicPreviewEnabled) {
        return (  
            <Button className="h-10 w-10" onClick={() => {setIsMicPreviewEnabled(prev => !prev)}}>
                <Mic className="size-5" />
            </Button>
        )
    } else {
        return (
            <Button className="h-10 w-10 bg-device-preview-button-unselected-background" onClick={() => {setIsMicPreviewEnabled(prev => !prev)}}>
                <MicOff className="size-5 text-device-preview-button-unselected-icon strokeWidth={12.5}" strokeWidth={2.3}/>
            </Button>
        )
    }
}