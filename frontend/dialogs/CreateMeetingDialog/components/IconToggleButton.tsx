import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface IconToggleButtonProps {
  isOn: boolean
  onToggle: () => void
  onIcon: LucideIcon
  offIcon: LucideIcon
}

export const IconToggleButton = ({
  isOn,
  onToggle,
  onIcon: OnIcon,
  offIcon: OffIcon,
}: IconToggleButtonProps) => {
  if (isOn) {
    return (
      <Button className="h-10 w-10" onClick={onToggle}>
        <OnIcon className="size-5" />
      </Button>
    )
  }

  return (
    <Button className="h-10 w-10 bg-device-preview-button-unselected-background" onClick={onToggle}>
      <OffIcon
        className="size-5 text-device-preview-button-unselected-icon strokeWidth={12.5}"
        strokeWidth={2.3}
      />
    </Button>
  )
}