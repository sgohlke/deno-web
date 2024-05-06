import { assertEquals } from '../dev_deps.ts'
import { extractAccessTokenFromAuthHeader } from './extractAccessTokenFromAuthHeader.ts'

Deno.test('Calling extractAccessTokenFromAuthHeader should return expected result', () => {
   // Test no auth header
   let tokenOrError = extractAccessTokenFromAuthHeader(
      new Headers({ dummyheader: 'doesnotmatter' }),
   )
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
