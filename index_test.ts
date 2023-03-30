import { assertEquals } from './deps.ts'
import {
   extractAccessTokenFromAuthHeader,
   JSON_CONTENT_TYPE_HEADER,
   logAndReturnErrorResponse,
   returnDataResponse,
   startServer,
} from './index.ts'

const defaultResponseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)

Deno.test('Calling startServer should return expected result', async () => {
   const abortController = new AbortController()
   startServer(() =>
      new Response(JSON.stringify({ message: 'test' }), {
         headers: JSON_CONTENT_TYPE_HEADER,
      }), { port: 7035, signal: abortController.signal })

   const response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   const responseJson = await response.json()
   assertEquals(responseJson.message, 'test')
   abortController.abort()
})

Deno.test('Calling returnDataResponse should return expected result', async () => {
   const response = returnDataResponse(
      { message: 'test' },
      defaultResponseHeaders,
   )
   assertEquals(response.status, 200)
   const responseJson = await response.json()
   assertEquals(responseJson.message, 'test')
})

Deno.test('Calling logAndReturnErrorResponse should return expected result', async () => {
   // Test default status code, should be 400
   let response = logAndReturnErrorResponse('error', defaultResponseHeaders)
   assertEquals(response.status, 400)
   let responseJson = await response.json()
   assertEquals(responseJson.error, 'error')

   // Test set status code, should be 418
   response = logAndReturnErrorResponse('error', defaultResponseHeaders, 418)
   assertEquals(response.status, 418)
   responseJson = await response.json()
   assertEquals(responseJson.error, 'error')
})

Deno.test('Calling extractAccessTokenFromAuthHeader should return expected result', () => {
   // Test no auth header
   let tokenOrError = extractAccessTokenFromAuthHeader(defaultResponseHeaders)
   assertEquals(tokenOrError.error, 'No Authorization header')

   // Test invalid auth header
   tokenOrError = extractAccessTokenFromAuthHeader(
      new Headers({ authorization: 'broken' }),
   )
   assertEquals(tokenOrError.error, 'Invalid Authorization header: broken')

   // Test valid auth header with lowercase "bearer"
   tokenOrError = extractAccessTokenFromAuthHeader(
      new Headers({ authorization: 'bearer valid' }),
   )
   assertEquals(tokenOrError.accessToken, 'valid')

   // Test valid auth header with first letter uppercase bearer, i.e. "Bearer"
   tokenOrError = extractAccessTokenFromAuthHeader(
      new Headers({ authorization: 'Bearer valid' }),
   )
   assertEquals(tokenOrError.accessToken, 'valid')
})
