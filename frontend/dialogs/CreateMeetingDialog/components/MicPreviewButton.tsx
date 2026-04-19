import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface MicPreviewButtonProps {
    isEnabled: boolean
    onToggle: () => void | Promise<void>
    disabled?: boolean
}

export const MicPreviewButton = ({ isEnabled, onToggle, disabled }: MicPreviewButtonProps) => {
    
    if (isEnabled) {
        return (  
            <Button className="h-10 w-10" onClick={onToggle} disabled={disabled}>
                <Mic className="size-5" />
            </Button>
        )
    } else {
        return (
            <Button className="h-10 w-10 bg-device-preview-button-unselected-background" onClick={onToggle} disabled={disabled}>
                <MicOff className="size-5 text-device-preview-button-unselected-icon strokeWidth={12.5}" strokeWidth={2.3}/>
            </Button>
        )
    }
}
