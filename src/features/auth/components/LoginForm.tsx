import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import PasswordInput from "@/components/shared/PasswordInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginFlow } from "../hooks/useLoginFlow"

export default function LoginForm() {
  const {
    step,
    phone,
    setPhone,
    account,
    isSubmitting,
    submitPhone,
    submitPassword,
    goBackToPhone,
  } = useLoginFlow()
  const [password, setPassword] = useState("")

  const handlePhoneSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitPhone()
  }

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submitPassword(password)
  }

  if (step === "phone") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your phone number to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || phone.trim() === ""}
              className="h-11 w-full"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Enter your password</CardTitle>
        <CardDescription>{account?.name ? `Signing in as ${account.name}` : phone}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <button
            type="button"
            onClick={goBackToPhone}
            className="flex items-center gap-1 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {phone}
          </button>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting || password === ""} className="h-11 w-full">
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
