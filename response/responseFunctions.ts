export const FAVICON_SVG_STRING: string =
   `<svg xmlns="http://www.w3.org/2000/svg" height="300" width="400">
      <!-- Slime body -->
      <path id="body" d="m160.84491,261.58729c-52.36082,-13.84517 -89.89133,-57.83793 -81.36215,-95.37172c5.37824,-23.6679 118.84559,-167.34858 128.75489,-163.03897c3.23426,1.40659 32.01514,34.90459 63.95752,74.44c51.16832,63.33156 58.07701,75.14094 58.07701,99.27408c0,48.91687 -55.63366,88.98534 -122.43339,88.17899c-19.4931,-0.23534 -40.64036,-1.8024 -46.99387,-3.48238l0,-0.00001zm52.45963,-24.60339" fill="blue"/>
    
      <!-- Define Eyes -->
      <g class="eyes" stroke="black" stroke-width="3" fill="black">
        <circle id="pointA" cx="170" cy="100" r="10" />
        <circle id="pointB" cx="240" cy="100" r="10" />
      </g>
      <!-- Define Mouth -->
      <path d="M 130 180 q 100 100 150 0" stroke="transparent" stroke-width="5" fill="black" />
    
      Sorry, your browser does not support inline SVG.
    </svg>`

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
 * Returns a default favicon image
 * @returns {Response} A new response containing the default favicon
 */
export function returnDefaultFavicon(): Response {
   return new Response(FAVICON_SVG_STRING, {
      headers: {
         'Content-Type': 'image/svg+xml',
         'Content-Length': String(FAVICON_SVG_STRING.length),
      },
   })
}
