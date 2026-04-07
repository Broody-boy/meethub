'use client'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ChevronDown  } from "lucide-react"

interface FormDropDownProps {
  list: string[]
  value: string
  setValue: (val: string) => void
  label?: string
  loadingPermissions: boolean
  permissionState: string
}

export const DeviceSelectionDropDown = ({ list, value, setValue, label, loadingPermissions, permissionState }: FormDropDownProps) => {
  
  let text = value

  if (loadingPermissions)
    text = 'Checking Permissions...';
  else if (permissionState === 'denied' || permissionState === 'prompt')
    text = 'Permission Required'
  
  return (
    <div className='space-y-1'>
      {label && <p className='text-xs text-muted-foreground uppercase'>{label}</p>}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex w-full items-center justify-between rounded-md border border-input bg-white px-3 py-4 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
          <span>{text}</span>
          <ChevronDown className='text-muted-foreground'/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full min-w-[var(--radix-dropdown-menu-trigger-width)]'>
        {list.map((item) => (
          <DropdownMenuCheckboxItem
            key={item}
            checked={value === item}
            onCheckedChange={(checked: boolean) => {
              if (checked) setValue(item)
            }}
            className='py-3 px-2'
          >
            {item}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}
