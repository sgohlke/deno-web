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
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/2.0.0/index.ts'
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
} from 'https://raw.githubusercontent.com/sgohlke/deno-web/2.0.0/index.ts'

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
