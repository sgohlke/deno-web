import { assertEquals } from './deps.ts'
import { startServer } from './index.ts'

const jsonContentTypeHeader = {
   'content-type': 'application/json; charset=UTF-8',
}

Deno.test('Calling startServer should return expected result', async () => {
   const abortController = new AbortController()
   startServer(() =>
      new Response(JSON.stringify({ message: 'test' }), {
         headers: jsonContentTypeHeader,
      }), { port: 7035, signal: abortController.signal })

   const response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   const responseJson = await response.json()
   assertEquals(responseJson.message, 'test')
   abortController.abort()
})
