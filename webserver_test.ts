import { assertEquals, Webserver } from './mod.ts'

Deno.test('Calling startServer from Webserver with CORS enabled should return expected result', async () => {
   const webserver = new Webserver({
      serveInit: {
         port: 7035,
      },
      enableCORS: true,
   })
   webserver.startWebserver()

   // Test root route
   let response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   let responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test root route without /
   response = await fetch('http://localhost:7035')
   assertEquals(response.status, 200)
   responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test CORS reflection
   response = await fetch('http://localhost:7035/', {
      method: 'Options',
      headers: { 'origin': 'testOrigin' },
   })
   assertEquals(response.status, 200)
   assertEquals(
      response.headers.get('Access-Control-Allow-Origin'),
      'testOrigin',
   )
   await response.body?.cancel()

   // Test unavailable route
   response = await fetch('http://localhost:7035/unknown')
   assertEquals(response.status, 404)
   responseJson = await response.text()
   assertEquals(responseJson.message, undefined)
   webserver.closeWebserver()
})

Deno.test('Calling startServer from Webserver with CORS disabled should return expected result', async () => {
   const abortController = new AbortController()
   const webserver = new Webserver({
      serveInit: {
         port: 7035,
         signal: abortController.signal,
      },
   })
   webserver.startWebserver()

   // Test root route
   let response = await fetch('http://localhost:7035/')
   assertEquals(response.status, 200)
   let responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test root route without /
   response = await fetch('http://localhost:7035')
   assertEquals(response.status, 200)
   responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test CORS reflection
   response = await fetch('http://localhost:7035/', {
      method: 'Options',
      headers: { 'origin': 'testOrigin' },
   })
   assertEquals(response.status, 200)
   assertEquals(
      response.headers.get('Access-Control-Allow-Origin'),
      null,
   )
   await response.body?.cancel()

   // Test unavailable route
   response = await fetch('http://localhost:7035/unknown')
   assertEquals(response.status, 404)
   responseJson = await response.text()
   assertEquals(responseJson.message, undefined)
   // Does not do anything as serveInit.signal was provided and Webserver does not handle external abort signals
   webserver.closeWebserver()
   abortController.abort()
})

Deno.test('Calling startServer from Webserver without options should return expected result', async () => {
   const webserver = new Webserver()
   webserver.startWebserver()

   // Test root route
   let response = await fetch('http://localhost:8000/')
   assertEquals(response.status, 200)
   let responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test root route without /
   response = await fetch('http://localhost:8000')
   assertEquals(response.status, 200)
   responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test CORS reflection
   response = await fetch('http://localhost:8000/', {
      method: 'Options',
      headers: { 'origin': 'testOrigin' },
   })
   assertEquals(response.status, 200)
   assertEquals(
      response.headers.get('Access-Control-Allow-Origin'),
      null,
   )
   await response.body?.cancel()

   // Test unavailable route
   response = await fetch('http://localhost:8000/unknown')
   assertEquals(response.status, 404)
   responseJson = await response.text()
   assertEquals(responseJson.message, undefined)
   webserver.closeWebserver()
})

Deno.test('Calling startServer from Webserver without serveInit should return expected result', async () => {
   const webserver = new Webserver({ enableCORS: false })
   webserver.startWebserver()

   // Test root route
   let response = await fetch('http://localhost:8000/')
   assertEquals(response.status, 200)
   let responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test root route without /
   response = await fetch('http://localhost:8000')
   assertEquals(response.status, 200)
   responseJson = await response.json()
   assertEquals(responseJson.message, 'Welcome!')

   // Test CORS reflection
   response = await fetch('http://localhost:8000/', {
      method: 'Options',
      headers: { 'origin': 'testOrigin' },
   })
   assertEquals(response.status, 200)
   assertEquals(
      response.headers.get('Access-Control-Allow-Origin'),
      null,
   )
   await response.body?.cancel()

   // Test unavailable route
   response = await fetch('http://localhost:8000/unknown')
   assertEquals(response.status, 404)
   responseJson = await response.text()
   assertEquals(responseJson.message, undefined)
   webserver.closeWebserver()
})
