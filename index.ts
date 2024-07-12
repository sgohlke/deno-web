// We reexport functions from auth-helper for compatibility. Will be removed in next major release
export {
   arrayBufferToHexString,
   createPasswordHash,
   generateAccessTokenHash,
   verifyPassword,
} from 'jsr:@sgohlke/auth-helper@1.0.1'

export type {
   AccessTokenOrError,
} from './request/extractAccessTokenFromAuthHeader.ts'

export {
   extractAccessTokenFromAuthHeader,
} from './request/extractAccessTokenFromAuthHeader.ts'

export { JSON_CONTENT_TYPE_HEADER } from './response/ResponseHeaders.ts'

export {
   FAVICON_SVG_STRING,
   logAndReturnErrorResponse,
   returnDataResponse,
   returnDefaultFavicon,
} from './response/responseFunctions.ts'
