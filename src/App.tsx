import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Finance Tracker</CardTitle>
          <CardDescription>Group contributions & finance tracking scaffold</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Frontend scaffold is ready. Backend API will be wired up next.
          </p>
          <Button>Get started</Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
