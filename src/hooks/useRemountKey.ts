import { useCallback, useState } from "react"

export function useRemountKey() {
  const [key, setKey] = useState(0)
  const remount = useCallback(() => setKey((k) => k + 1), [])
  return { key, remount }
}
