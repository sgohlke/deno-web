# deno-web

Webserver and related helper functions in Deno

## Usage and Versioning

The module uses semantic versioning and Github tags to create a new version. It
can be imported into a Deno project by adding the tag before the filename.

Example:

```typescript
import {
   extractAccessTokenFromAuthHeader,
   JSON_CONTENT_TYPE_HEADER,
   logAndReturnErrorResponse,
   returnDataResponse,
   startServer,
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/3.0.0/mod.ts'
```

## Code example

The following code example shows how this module can be used.

```typescript
import {
   extractAccessTokenFromAuthHeader,
   JSON_CONTENT_TYPE_HEADER,
   logAndReturnErrorResponse,
   returnDataResponse,
   startServer,
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/3.0.0/mod.ts'

const defaultResponseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)

startServer((request) => {
   const { pathname } = new URL(request.url)
   if (pathname.includes('message')) {
      return returnDataResponse({ message: 'Test' }, defaultResponseHeaders)
   } else if (pathname.includes('defaulterror')) {
      return logAndReturnErrorResponse('Error', defaultResponseHeaders)
   } else if (pathname.includes('seterror')) {
      return logAndReturnErrorResponse('Error', defaultResponseHeaders, 418)
   } else if (pathname.includes('login')) {
      const authHeaderOrError = extractAccessTokenFromAuthHeader(
         request.headers,
      )
      if (authHeaderOrError.error) {
         return logAndReturnErrorResponse(
            authHeaderOrError.error,
            defaultResponseHeaders,
         )
      } else {
         /**
          * Do something useful with the access token.
          * In this example we will just return it,
          * don't do this in production systems!!!
          */
         return returnDataResponse({
            message: `Hello user with token ${authHeaderOrError.accessToken}`,
         }, defaultResponseHeaders)
      }
   } else {
      return new Response(undefined, { status: 404 })
   }
}, { port: 7035 })
```

## Stopping the webserver

If you run your application on **Deno Deploy** it is not necessary to provide a way to stop the webserver. If you need this functionality (e.g. when running your app elsewhere or for tests to shut down properly) you can provide an **AbortController** and **AbortSignal** to stop/close the server. See the following example.

```typescript
import {
   JSON_CONTENT_TYPE_HEADER,
   startServer,
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/3.0.0/mod.ts'

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

```


## Version 3 changes

Version 3 of deno-web uses the builtin **Deno.serve** function in favour of the **serve** function from Deno std http module. It uses the matching handler and options provided in the global *Deno* object. The types/interfaces are similar, you might have to make small adjustments if necessary. The exports of http module related types and functions have been removed.

As **Deno.serve** function returns a **Deno.Server** object a new function **createAndStartServer** that returns the server object has been added in case you want to work with it.
