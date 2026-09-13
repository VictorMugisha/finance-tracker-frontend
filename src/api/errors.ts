export class ApiError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
  }
}

export interface ErrorToastPayload {
  statusCode: number
  message: string
}

export function toErrorToastPayload(error: unknown): ErrorToastPayload {
  if (error instanceof ApiError) {
    return { statusCode: error.statusCode, message: error.message }
  }
  if (error instanceof Error) {
    return { statusCode: 0, message: error.message }
  }
  if (typeof error === "object" && error !== null) {
    const record = error as { statusCode?: unknown; message?: unknown }
    const statusCode = typeof record.statusCode === "number" ? record.statusCode : 0
    const message = typeof record.message === "string" ? record.message : "Something went wrong"
    return { statusCode, message }
  }
  return { statusCode: 0, message: "Something went wrong" }
}

export function formatToastMessage(statusCode: number, message: string): string {
  return statusCode > 0 ? `[${statusCode}] ${message}` : message
}

export function formatErrorToast(error: unknown): string {
  const payload = toErrorToastPayload(error)
  return formatToastMessage(payload.statusCode, payload.message)
}
