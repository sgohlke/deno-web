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
