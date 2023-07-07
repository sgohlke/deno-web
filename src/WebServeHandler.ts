/**
 * Compatibility ServeHandler type to fit both "Deno.serve"
 * as well as http/server "serve" function in standard library.
 * As remoteAddr types to not match unknown is used here
 */
export type WebServeHandler = (
   request: Request,
   info: { remoteAddr: unknown },
) => Response | Promise<Response>
