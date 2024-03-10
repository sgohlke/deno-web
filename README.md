# deno-web

Webserver helper functions in Deno.

## Structure

Code is organized into small parts in subfolders. You can either reference these functions, constants or types directly or import them all using **mod.ts** file

- **crypto**: Helper functions for crypto/password related tasks
- **cryptoFunctions.ts**
  - **arrayBufferToHexString**: Converts given ArrayBuffer to a HEX string.
  - **async createPasswordHash**: Creates a SHA-256 hash for given
    password/string.
  - **generateAccessTokenHash**: Creates an access token hash (hex string) from
    a Random 24 elements UInt8 Array.
  - **async verifyPassword**: Verifies that a given cleartext password and a
    hashed password match.
- **request/extractAccessTokenFromAuthHeader.ts**: Tries to extract a JWT access
  token from the Authorization header.
- **response**: Helper functions for creating responses.
  - **responseFunctions.ts**
    - **returnDataResponse**: Creates a data response and returns it.
    - **returnDefaultFavicon**: Creates a response containing a default favicon
      and returns it.
    - **logAndReturnErrorResponse**: Creates an error response, logs and and
      returns it.
  - **ResponseHeaders.ts**: Contains **JSON_CONTENT_TYPE_HEADER** as constant

By importing only the wanted functions the code is kept at a small size and
unnecessary imports are avoided if possible.

## Usage and Versioning

The module uses semantic versioning and Github tags to create a new version. It
can be imported into a Deno project by adding the tag before the filename.

Example:

```typescript
import {
   returnDataResponse,
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.2.0/server/responseFunctions.ts'
```

Example using JSR:

```typescript
import { returnDataResponse } from "jsr:@sgohlke/deno-web";
```

## Code example

The following code example shows how this module can be used.

```typescript
import { extractAccessTokenFromAuthHeader } from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.2.0/request/extractAccessTokenFromAuthHeader.ts'
import {
   logAndReturnErrorResponse,
   returnDataResponse,
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.2.0/response/responseFunctions.ts'
import { JSON_CONTENT_TYPE_HEADER } from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.2.0/response/ResponseHeaders.ts'
import { startServer } from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.2.0/server/serverFunctions.ts'

const defaultResponseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)

Deno.serve({ port: 7035 }, (request) => {
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
})
```

## Stopping the webserver

If you run your application on **Deno Deploy** it is not necessary to provide a
way to stop the webserver. If you need this functionality (e.g. when running
your app elsewhere or for tests to shut down properly) you can provide an
**AbortController** and **AbortSignal** to stop/close the server. See the
following example.

```typescript
import { assertEquals } from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.0.0/deps.ts'
import { JSON_CONTENT_TYPE_HEADER } from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.0.0/response/ResponseHeaders.ts'
import { startServer } from 'https://raw.githubusercontent.com/sgohlke/deno-web/8.0.0/server/serverFunctions.ts'

const defaultResponseHeaders = new Headers(JSON_CONTENT_TYPE_HEADER)

Deno.test('Calling startServer should return expected result', async () => {
   const abortController = new AbortController()
   Deno.serve(
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
})
```

## Version 8 changes

serverFunctions have been removed. Use `Deno.serve` instead.
