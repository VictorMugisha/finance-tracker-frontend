import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMembersOptions } from "../hooks/useMembersOptions"

interface MemberSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export default function MemberSelect({ value, onValueChange }: MemberSelectProps) {
  const { members, isLoading } = useMembersOptions()

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Loading..." : "Select a member"} />
      </SelectTrigger>
      <SelectContent>
        {members.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
