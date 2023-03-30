import { Handler, serve, ServeInit } from './deps.ts'

export const JSON_CONTENT_TYPE_HEADER = {
   'content-type': 'application/json; charset=UTF-8',
}

export interface AccessTokenOrError {
   accessToken?: string
   error?: string
}

export function startServer(handler: Handler, options?: ServeInit): void {
   serve(handler, options)
}

export function returnDataResponse(
   data: unknown,
   responseHeaders: Headers,
): Response {
   return new Response(JSON.stringify(data), { headers: responseHeaders })
}

export function logAndReturnErrorResponse(
   responseHeaders: Headers,
   errorMessage: string,
   errorStatusCode = 400,
): Response {
   console.error(errorMessage)
   return new Response(JSON.stringify({ error: errorMessage }), {
      headers: responseHeaders,
      status: errorStatusCode,
   })
}

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
