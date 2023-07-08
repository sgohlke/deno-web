import { serve } from '../deps.ts'

/**
 * Compatibility ServeHandler type to fit both "Deno.serve"
 * as well as http/server "serve" function in standard library.
 * As remoteAddr types to not match unknown is used here
 */
export type WebServeHandler = (
   request: Request,
   info: { remoteAddr: unknown },
) => Response | Promise<Response>

/**
 * Creates and starts a webserver, but does not return the created Server object.
 * If you want to work with the created server, use {@link createAndStartServer} instead.
 * @param {WebServeHandler} handler - The handler for HTTP requests
 * @param {Deno.ServeOptions | Deno.ServeTlsOptions} options - Additional server options
 */
export function startServer(
   handler: WebServeHandler,
   options: Deno.ServeOptions | Deno.ServeTlsOptions,
): void {
   createAndStartServer(handler, options)
}

/**
 * Creates and starts a webserver, and returns the created Server object.
 * If you do not want to work with the returned server, consider calling {@link startServer} instead.
 * @param {WebServeHandler} handler - The handler for HTTP requests
 * @param {Deno.ServeOptions | Deno.ServeTlsOptions} options - Additional server options
 * @returns {Deno.Server} The created Deno.Server object
 */
export function createAndStartServer(
   handler: WebServeHandler,
   options: Deno.ServeOptions | Deno.ServeTlsOptions,
): Deno.Server | void {
   if (Deno && Deno.serve) {
      return Deno.serve(options, handler)
   } else {
      serve(handler, options)
      return undefined
   }
}
