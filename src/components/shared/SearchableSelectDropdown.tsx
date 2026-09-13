import { useState, useMemo, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDebounce } from "@/hooks/useDebounce"
import { cn } from "cn"

export interface SearchableSelectOption {
  value: string
  label: string
  subtitleLines?: Array<{ key: string; value: string }>
  disabled?: boolean
}

interface SearchableSelectDropdownProps {
  options: SearchableSelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  triggerClassName?: string
  onSearch?: (query: string) => Promise<void>
  searching?: boolean
  searchMinLength?: number
  onCreateNew?: (name: string) => Promise<{ value: string; label: string }>
  createLabel?: string
  createPlaceholder?: string
  createLoading?: boolean
}

export function SearchableSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  triggerClassName,
  onSearch,
  searching = false,
  searchMinLength = 0,
  onCreateNew,
  createLabel = "Create new",
  createPlaceholder = "Enter name...",
  createLoading = false,
}: SearchableSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [createMode, setCreateMode] = useState(false)
  const [createName, setCreateName] = useState("")
  const wasOpenRef = useRef(false)
  const debouncedSearch = useDebounce(searchText, 300)
  const isServerMode = typeof onSearch === "function"
  const canCreate = typeof onCreateNew === "function"

  useEffect(() => {
    if (!isServerMode) return
    if (debouncedSearch.length < searchMinLength) return
    void onSearch(debouncedSearch)
  }, [debouncedSearch, isServerMode, onSearch, searchMinLength])

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current
    wasOpenRef.current = open
    if (!isServerMode || !justOpened || options.length > 0) return
    void onSearch("")
  }, [open, isServerMode, onSearch, options.length])

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? (value || placeholder),
    [options, value, placeholder]
  )
  const selectedOption = useMemo(() => options.find((o) => o.value === value), [options, value])
  const selectedTooltip = useMemo(() => {
    if (!selectedOption) return selectedLabel
    const lines = selectedOption.subtitleLines
    if (!lines?.length) return selectedLabel
    return selectedLabel + " \u00B7 " + lines.map((l) => `${l.key}: ${l.value}`).join(", ")
  }, [selectedLabel, selectedOption])

  const trimmedSearch = searchText.trim()
  const normalizedSearch = trimmedSearch.toLowerCase()
  const visibleOptions = useMemo(() => {
    if (isServerMode || normalizedSearch === "") return options
    return options.filter((option) => option.label.toLowerCase().includes(normalizedSearch))
  }, [isServerMode, normalizedSearch, options])

  const emptyText = searching
    ? "Searching..."
    : normalizedSearch !== ""
      ? `No results for \u201C${trimmedSearch}\u201D`
      : emptyMessage

  const handleCreate = async () => {
    if (!onCreateNew || !createName.trim()) return
    const result = await onCreateNew(createName.trim())
    onChange(result.value)
    setCreateMode(false)
    setCreateName("")
    setOpen(false)
    setSearchText("")
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setCreateMode(false)
      setCreateName("")
      setSearchText("")
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-11 w-full min-w-0 justify-between gap-2 overflow-hidden px-3 font-normal",
            !value && "text-muted-foreground",
            triggerClassName
          )}
          title={selectedTooltip}
        >
          <span className="min-w-0 flex-1 truncate text-left">{selectedLabel}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false}>
          {createMode ? (
            <div className="space-y-2 p-2">
              <div className="flex gap-2">
                <Input
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder={createPlaceholder}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate()
                    if (e.key === "Escape") setCreateMode(false)
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="h-8 shrink-0"
                  disabled={!createName.trim() || createLoading}
                  onClick={handleCreate}
                >
                  {createLoading ? "..." : "Create"}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-full text-xs"
                onClick={() => setCreateMode(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center border-b px-3">
                <CommandInput
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onValueChange={setSearchText}
                />
                {searching && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                )}
              </div>
              <CommandList>
                {visibleOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
                ) : (
                  <CommandGroup className="p-0">
                    {visibleOptions.map((option, index) => (
                      <CommandItem
                        key={index}
                        value={option.label}
                        disabled={option.disabled}
                        onSelect={() => {
                          if (option.disabled) return
                          onChange(option.value)
                          setOpen(false)
                          setSearchText("")
                        }}
                        className={cn(
                          "items-start rounded-none border-t border-border px-1",
                          index === 0 && "border-t-0",
                          option.disabled && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 mt-0.5 h-4 w-4 shrink-0",
                            option.value === value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <span>{option.label}</span>
                          {option.subtitleLines &&
                            option.subtitleLines.length > 0 &&
                            (() => {
                              const lines = option.subtitleLines
                              return (
                                <p className="text-xs text-muted-foreground">
                                  {lines.map((line, idx) => (
                                    <span key={idx}>
                                      <span className="font-semibold text-foreground">
                                        {line.key}
                                      </span>
                                      : {line.value}
                                      {idx < lines.length - 1 && ", "}
                                    </span>
                                  ))}
                                </p>
                              )
                            })()}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
              {canCreate && (
                <div className="border-t border-border p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-full justify-start gap-2 px-2 text-sm font-normal"
                    onClick={() => {
                      setCreateMode(true)
                      setCreateName(searchText)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{createLabel}</span>
                  </Button>
                </div>
              )}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
