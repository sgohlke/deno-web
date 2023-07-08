import { assertEquals } from '../deps.ts'
import { JSON_CONTENT_TYPE_HEADER } from '../response/ResponseHeaders.ts'
import { startServer } from './serverFunctions.ts'

export const defaultResponseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)

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

Deno.test('Calling startServer when Deno.serve is unavailable should return expected result', async () => {
   const originalDenoServe = Deno.serve
   // deno-lint-ignore no-explicit-any
   Deno.serve = undefined as any

   const abortController = new AbortController()
   startServer(() =>
      new Response(JSON.stringify({ message: 'test' }), {
         headers: JSON_CONTENT_TYPE_HEADER,
      }), { port: 7035, signal: abortController.signal })

   const response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   const responseJson = await response.json()
   assertEquals(responseJson.message, 'test')
   Deno.serve = originalDenoServe
   abortController.abort()
})
