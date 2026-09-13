import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { CalendarV2 } from "@/components/ui/calendar-v2"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  fromDate?: Date
  toDate?: Date
  className?: string
  disabled?: boolean
  id?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  fromDate,
  toDate,
  className,
  disabled = false,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const disabledDays = React.useMemo(() => {
    const rules: ({ before: Date } | { after: Date })[] = []
    if (fromDate) rules.push({ before: fromDate })
    if (toDate) rules.push({ after: toDate })
    return rules
  }, [fromDate, toDate])

  const currentYear = new Date().getFullYear()
  const startMonth = fromDate
    ? new Date(fromDate.getFullYear() - 10, 0, 1)
    : new Date(currentYear - 10, 0, 1)
  const endMonth = toDate
    ? new Date(toDate.getFullYear() + 15, 11, 31)
    : new Date(currentYear + 15, 11, 31)
  const defaultMonth = value ?? fromDate ?? new Date(currentYear, new Date().getMonth(), 1)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-11 w-full justify-start text-left font-normal",
              value && "pr-8",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            {value ? format(value, "dd/MM/yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        {value && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            onClick={() => onChange?.(undefined)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <PopoverContent className="w-auto p-0" align="start">
        <CalendarV2
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
          selectableStart={fromDate}
          selectableEnd={toDate}
          disabled={disabledDays.length > 0 ? disabledDays : undefined}
          defaultMonth={defaultMonth}
          showOutsideDays={false}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
