import { JSON_CONTENT_TYPE_HEADER } from '../response/ResponseHeaders.ts'
import { returnDataResponse } from '../response/responseFunctions.ts'
import { startServer } from '../server/serverFunctions.ts'

export interface ServerOptions {
   denoServeOptions: Deno.ServeOptions | Deno.ServeTlsOptions
   enableCORS?: boolean
}

export class Webserver {
   serverOptions: ServerOptions
   abortController?: AbortController

   constructor(options?: ServerOptions) {
      this.serverOptions = options ??
         {
            denoServeOptions: {
               signal: (this.abortController = new AbortController()).signal,
            },
         }

      if (!this.serverOptions.denoServeOptions.signal) {
         this.serverOptions.denoServeOptions.signal =
            (this.abortController = new AbortController()).signal
      }
   }

   startWebserver(): void {
      startServer(this.handler, this.serverOptions.denoServeOptions)
   }

   closeWebserver(): void {
      if (this.abortController) {
         this.abortController.abort()
      }
   }

   handler: (request: Request) => Response = (request) => {
      const responseHeaders = new Headers()
      const origin = request.headers.get('origin')
      if (origin && this.serverOptions.enableCORS) {
         responseHeaders.set('Access-Control-Allow-Origin', origin)
      }

      const { pathname } = new URL(request.url)

      if (request.method === 'OPTIONS') {
         return new Response(undefined, { headers: responseHeaders })
      } //TODO: Replace with routing functionality
      else if (pathname === '/' || pathname === '') {
         responseHeaders.append(
            'content-type',
            JSON_CONTENT_TYPE_HEADER['content-type'],
         )
         return returnDataResponse({ message: 'Welcome!' }, responseHeaders)
      }
      return new Response(undefined, {
         headers: responseHeaders,
         status: 404,
      })
   }
}
