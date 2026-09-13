import { useRef, useCallback, useMemo, type ChangeEvent, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "cn"

interface NumericInputProps {
  value: string
  onChange: (rawValue: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  min?: number
  max?: number
  decimals?: number | null
}

function stripFormatting(str: string): string {
  return str.replace(/[^0-9.-]/g, "")
}

function formatDisplay(raw: string, decimals: number | null): string {
  if (!raw) return ""

  const negative = raw.startsWith("-")
  const unsigned = negative ? raw.slice(1) : raw

  const [intPart, decPart] = unsigned.split(".")

  const formattedInt = intPart ? Number(intPart).toLocaleString("en-US") : ""

  let result = formattedInt

  if (decPart !== undefined) {
    const trimmed =
      decimals !== null && decimals !== undefined ? decPart.slice(0, decimals) : decPart
    result = `${formattedInt}.${trimmed}`
  } else if (unsigned.endsWith(".") && decimals !== 0) {
    result = `${formattedInt}.`
  }

  return negative ? `-${result}` : result
}

function toRawCursor(formatted: string, formattedCursor: number): number {
  let raw = 0
  for (let i = 0; i < formattedCursor; i++) {
    if (formatted[i] !== ",") raw++
  }
  return raw
}

function toFormattedCursor(formatted: string, rawCursor: number): number {
  let raw = 0
  for (let i = 0; i < formatted.length; i++) {
    if (raw === rawCursor) return i
    if (formatted[i] !== ",") raw++
  }
  return formatted.length
}

export function NumericInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  id,
  min,
  max,
  decimals = 2,
}: NumericInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const displayValue = formatDisplay(value, decimals)

  const decimalRegex = useMemo(() => {
    if (decimals === null) return /^-?\d*\.?\d*$/
    if (decimals === 0) return /^-?\d*$/
    return new RegExp(`^-?\\d*\\.?\\d{0,${decimals}}$`)
  }, [decimals])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const raw = stripFormatting(input.value)

      if (raw !== "" && !decimalRegex.test(raw)) {
        return
      }

      onChange(raw)
    },
    [onChange, decimalRegex]
  )

  const handleBlur = useCallback(() => {
    if (value === "") return
    const num = Number(value)
    if (isNaN(num)) {
      onChange("")
      return
    }
    if (max != null && num > max) {
      onChange(String(max))
      return
    }
    if (min != null && num < min) {
      onChange(String(min))
      return
    }
  }, [value, min, max, onChange])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const input = inputRef.current
      if (!input) return
      const pos = input.selectionStart ?? 0

      if (e.key === "Backspace" && displayValue[pos - 1] === ",") {
        e.preventDefault()
        const newRaw = stripFormatting(displayValue.slice(0, pos - 2) + displayValue.slice(pos))
        onChange(newRaw)
        requestAnimationFrame(() => {
          if (!inputRef.current) return
          const newFormatted = formatDisplay(newRaw, decimals)
          const rawTarget = toRawCursor(displayValue, pos - 2)
          const newCursor = toFormattedCursor(newFormatted, rawTarget)
          inputRef.current.setSelectionRange(newCursor, newCursor)
        })
      }

      if (e.key === "Delete" && displayValue[pos] === ",") {
        e.preventDefault()
        const newRaw = stripFormatting(displayValue.slice(0, pos) + displayValue.slice(pos + 2))
        onChange(newRaw)
      }
    },
    [displayValue, decimals, onChange]
  )

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      id={id}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(className)}
    />
  )
}
