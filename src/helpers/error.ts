export type ErrorMsg = {
  error?: unknown
  msg?: string
}
export function createErrorFactory<T>(Self: new (payload: ErrorMsg) => T) {
  return (msg?: string) => (error?: unknown) => new Self({ error, msg })
}
