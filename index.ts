export const JSON_CONTENT_TYPE_HEADER = {
   'content-type': 'application/json; charset=UTF-8',
}

export interface AccessTokenOrError {
   accessToken?: string
   error?: string
}

/**
 * Creates and starts a webserver, but does not return the created Server object.
 * If you want to work with the created server, use {@link createAndStartServer} instead.
 * @param {Deno.ServeHandler} handler - The handler for HTTP requests
 * @param {Deno.ServeOptions | Deno.ServeTlsOptions} options - Additional server options
 */
export function startServer(handler: Deno.ServeHandler, options: Deno.ServeOptions | Deno.ServeTlsOptions): void {
   createAndStartServer(handler, options)
}

/**
 * Creates and starts a webserver, and returns the created Server object.
 * If you do not want to work with the returned server, consider calling {@link startServer} instead.
 * @param {Deno.ServeHandler} handler - The handler for HTTP requests
 * @param {Deno.ServeOptions | Deno.ServeTlsOptions} options - Additional server options
 * @returns {Deno.Server} The created Deno.Server object
 */
export function createAndStartServer(handler: Deno.ServeHandler, options: Deno.ServeOptions | Deno.ServeTlsOptions,
   ): Deno.Server {
   return Deno.serve(options, handler)
}

/**
 * Creates a data response and returns it.
 * @param {unknown} data - The response data, will be stringified
 * @param {Headers} responseHeaders - The response headers
 * @returns {Response} A new response
 */
export function returnDataResponse(
   data: unknown,
   responseHeaders: Headers,
): Response {
   return new Response(JSON.stringify(data), { headers: responseHeaders })
}

/**
 * Creates an error response, logs and and returns it.
 * @param {Headers} responseHeaders - The response headers
 * @param {string} errorMessage - The error message, will be wrapped to an error field
 * @param {number} errorStatusCode - The http status code, default is 400
 * @returns {Response} A new response
 */
export function logAndReturnErrorResponse(
   errorMessage: string,
   responseHeaders: Headers,
   errorStatusCode = 400,
): Response {
   console.error(errorMessage)
   return new Response(JSON.stringify({ error: errorMessage }), {
      headers: responseHeaders,
      status: errorStatusCode,
   })
}

/**
 * Tries to extract a JWT access token from the Authorization header.
 * If possible return the access token, else returns an error.
 * @param {Headers} requestHeaders - The request headers
 * @returns {Response} An access token or error
 */
export function extractAccessTokenFromAuthHeader(
   requestHeaders: Headers,
): AccessTokenOrError {
   const authHeader = requestHeaders.get('Authorization')
   if (authHeader === null) {
      return { error: 'No Authorization header' }
   } else {
      const lowerCaseAuthHeader = authHeader.toLocaleLowerCase()

      if (!lowerCaseAuthHeader.includes('bearer')) {
         return { error: `Invalid Authorization header: ${authHeader}` }
      } else {
         return {
            accessToken: lowerCaseAuthHeader.substring(
               lowerCaseAuthHeader.lastIndexOf('bearer ') + 7,
            ),
         }
      }
   }
}
