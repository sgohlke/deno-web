import { Handler, serve, ServeInit } from './deps.ts'

export function startServer(handler: Handler, options?: ServeInit): void {
   serve(handler, options)
}
