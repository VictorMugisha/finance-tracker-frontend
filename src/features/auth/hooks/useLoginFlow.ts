import { useState } from "react"
import toast from "react-hot-toast"
import { formatErrorToast, formatToastMessage } from "@/api/errors"
import type { CheckPhoneResponse } from "../types/auth"
import { useAuth } from "./useAuth"

export function useLoginFlow() {
  const { checkPhone, login } = useAuth()
  const [step, setStep] = useState<"phone" | "password">("phone")
  const [phone, setPhone] = useState("")
  const [account, setAccount] = useState<CheckPhoneResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitPhone = async () => {
    setIsSubmitting(true)
    try {
      const { data } = await checkPhone(phone)
      if (!data.exists) {
        toast.error("No account found with that phone number")
        return
      }
      if (!data.isActive) {
        toast.error("This account is inactive")
        return
      }
      setAccount(data)
      setStep("password")
    } catch (err) {
      toast.error(formatErrorToast(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitPassword = async (password: string) => {
    setIsSubmitting(true)
    try {
      const envelope = await login({ phone, password })
      toast.success(formatToastMessage(envelope.statusCode, envelope.message))
    } catch (err) {
      toast.error(formatErrorToast(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBackToPhone = () => {
    setStep("phone")
    setAccount(null)
  }

  return {
    step,
    phone,
    setPhone,
    account,
    isSubmitting,
    submitPhone,
    submitPassword,
    goBackToPhone,
  }
}
