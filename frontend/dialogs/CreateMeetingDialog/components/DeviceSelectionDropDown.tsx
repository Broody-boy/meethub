'use client'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Device } from '@/types'

import { ChevronDown  } from "lucide-react"

interface FormDropDownProps {
  list: Device[]
  valueDeviceId?: string
  onChange: (deviceId: string) => void
  label?: string
  loadingPermissions: boolean
  permissionState: string
  disabled?: boolean
  unsupportedText?: string
  noDevicesText?: string
}

export const DeviceSelectionDropDown = ({
  list,
  valueDeviceId,
  onChange,
  label,
  loadingPermissions,
  permissionState,
  disabled,
  unsupportedText,
  noDevicesText,
}: FormDropDownProps) => {
  
  let text

  if (loadingPermissions)
    text = 'Checking Permissions...';
  else if (disabled && unsupportedText)
    text = unsupportedText
  else if (permissionState === 'denied' || permissionState === 'prompt')
    text = 'Permission Required'
  else if (!list.length)
    text = noDevicesText ?? 'No devices found'
  else
    text = list.find((item) => item.deviceId === valueDeviceId)?.name ?? label
  
  return (
    <div className='space-y-1'>
      {label && <p className='text-xs text-muted-foreground uppercase'>{label}</p>}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled}
          className='flex w-full items-center justify-between rounded-md border border-input bg-white px-3 py-4 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <span>{text}</span>
          <ChevronDown className='text-muted-foreground'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full min-w-[var(--radix-dropdown-menu-trigger-width)]'>
        {!list.length ? (
          <DropdownMenuLabel className='py-3 px-2 text-muted-foreground'>
            {noDevicesText ?? 'No devices found'}
          </DropdownMenuLabel>
        ) : null}
        {list.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.deviceId}
            checked={valueDeviceId === item.deviceId}
            onCheckedChange={(checked: boolean) => {
              if (checked) onChange(item.deviceId)
            }}
            className='py-3 px-2'
          >
            {item?.name ?? label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
