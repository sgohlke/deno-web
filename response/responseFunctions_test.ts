import { assertEquals } from '../deps.ts'
import { JSON_CONTENT_TYPE_HEADER } from './ResponseHeaders.ts'
import {
   FAVICON_SVG_STRING,
   logAndReturnErrorResponse,
   returnDataResponse,
   returnDefaultFavicon,
} from './responseFunctions.ts'

const defaultResponseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)

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

Deno.test('Calling startServer should return expected result', async () => {
   const abortController = new AbortController()
   const server = Deno.serve(
      { port: 7035, signal: abortController.signal },
      () =>
         new Response(JSON.stringify({ message: 'test' }), {
            headers: JSON_CONTENT_TYPE_HEADER,
         }),
   )

   const response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   const responseJson = await response.json()
   assertEquals(responseJson.message, 'test')
   abortController.abort()
   await server.finished
})

Deno.test('Calling returnDefaultFavicon should return expected result', async () => {
   const response = returnDefaultFavicon()
   assertEquals(response.status, 200)
   assertEquals(response.headers.get('content-type'), 'image/svg+xml')
   const responseJson = await response.text()
   assertEquals(responseJson, FAVICON_SVG_STRING)
})
