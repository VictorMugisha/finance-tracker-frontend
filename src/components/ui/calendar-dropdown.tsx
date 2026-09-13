import { cn } from "cn"

export interface CalendarDropdownOption {
  value: number
  label: string
  disabled?: boolean
}

interface CalendarDropdownProps {
  value?: number
  options: CalendarDropdownOption[]
  disabled?: boolean
  ariaLabel?: string
  triggerClassName?: string
  onSelect: (value: number) => void
}

export function CalendarDropdown({
  value,
  options,
  disabled,
  ariaLabel,
  triggerClassName,
  onSelect,
}: CalendarDropdownProps) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      disabled={disabled}
      onChange={(event) => onSelect(Number(event.target.value))}
      className={cn(
        "h-7 cursor-pointer appearance-none rounded-md border border-input bg-transparent px-2 text-sm font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        triggerClassName
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
