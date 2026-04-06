"use client"

import { FormSwitch } from "@/components/form"

interface ToggleItem {
  label: string
  text: string
  value: string
}

interface OptionsToggleCardProps {
  items: ToggleItem[]
  options: string[]
  setOptions: React.Dispatch<React.SetStateAction<string[]>>
}

export function OptionsToggleCard({ items, options, setOptions }: OptionsToggleCardProps) {
  const toggle = (value: string) => {
    setOptions((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    )
  }

  return (
    <div className="bg-textbox-background rounded-md p-5 space-y-5">
      {items.map((item) => (
        <div key={item.value} className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.text}</p>
          </div>
          <FormSwitch
            checked={options.includes(item.value)}
            onCheckedChange={() => toggle(item.value)}
          />
        </div>
      ))}
    </div>
  )
}
