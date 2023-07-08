export interface AccessTokenOrError {
   accessToken?: string
   error?: string
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
