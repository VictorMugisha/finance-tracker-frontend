import { useMemo } from "react"
import {
  SearchableSelectDropdown,
  type SearchableSelectOption,
} from "@/components/shared/SearchableSelectDropdown"
import { useMembersOptions } from "../hooks/useMembersOptions"

interface MemberSelectProps {
  value: string
  onValueChange: (value: string) => void
}

const ROLE_LABELS: Record<string, string> = {
  LEADER: "Leader",
  ASSISTANT: "Assistant",
  ACCOUNTANT: "Accountant",
  MEMBER: "Member",
}

export default function MemberSelect({ value, onValueChange }: MemberSelectProps) {
  const { members, isLoading } = useMembersOptions()

  const options = useMemo<SearchableSelectOption[]>(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.name,
        subtitleLines: [
          ...(member.phone ? [{ key: "Phone", value: member.phone }] : []),
          ...(member.role ? [{ key: "Role", value: ROLE_LABELS[member.role] }] : []),
        ],
      })),
    [members]
  )

  return (
    <SearchableSelectDropdown
      options={options}
      value={value}
      onChange={onValueChange}
      placeholder={isLoading ? "Loading..." : "Select a member"}
      searchPlaceholder="Search members..."
      emptyMessage={isLoading ? "Loading..." : "No members found"}
    />
  )
}
