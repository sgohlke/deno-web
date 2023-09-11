import { assertEquals } from '../deps.ts'
import { JSON_CONTENT_TYPE_HEADER } from './ResponseHeaders.ts'
import {
   logAndReturnErrorResponse,
   returnDataResponse,
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